'use client';
import { ChatFooter, WrapperAnimation } from '@/components';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import React, { useMemo, useState } from 'react';
import DrawerChat from './DrawerChat';
import { contants } from '@/utils/contants';
import Validate from '@/utils/validate';
import { useAppSelector } from '@/hooks/reduxHooks';
import { ImageType, RootState } from '@/configs/types';
import firebaseService from '@/services/firebaseService';
import ChatBodyAdmin from '@/components/chats/ChatBodyAdmin';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { IUserFirebase } from '@/configs/interface';
import { convertFirestoreTimestampToString } from '@/utils/format';
import moment from 'moment';

export interface IMessagePageProps {
    params: {
        id: string;
        username: string;
    };
}

export default function MessagePage({ params }: IMessagePageProps) {
    const [open, setOpen] = useState(false);

    const [userSnapshot] = useCollectionData(firebaseService.querys.getUserByUsername(params.username));

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const handleSendMessage = async (value: string, images?: ImageType[]) => {
        if (!params.id || !user) return;

        if (Validate.isBlank(value) && (!images || images.length <= 0)) return;

        await firebaseService.handleSendMessage(value, params.id, user.username, { images: images });
    };

    const userMemo = useMemo(() => {
        if (!userSnapshot || userSnapshot.length <= 0) return null;

        return {
            ...userSnapshot[0],
            lassSeen: convertFirestoreTimestampToString(userSnapshot[0]?.lassSeen),
        } as IUserFirebase;
    }, [userSnapshot]);

    return (
        <div style={contants.styleMessageManagePage} className="w-full h-full flex flex-col items-center justify-between px-8">
            <div className="w-full flex justify-between items-center">
                <div className="py-5  flex items-center justify-start w-full gap-2">
                    <Avatar sx={{ width: '50px', height: '50px', border: '2px solid #ccc' }} src={userMemo?.avartar || contants.avartarDefault} />
                    <div className="">
                        <h4 className="font-medium">{userMemo?.username || 'user'}</h4>
                        <div className="flex items-center gap-2 text-sm">
                            {userMemo?.online && (
                                <>
                                    <p>online</p> <small className="h-2 w-2 rounded-full block bg-green-5FA503"></small>
                                </>
                            )}
                            {!userMemo?.online && <small className="italic">last seen: {moment(userMemo?.lassSeen).fromNow()}</small>}
                        </div>
                    </div>
                </div>
                <WrapperAnimation onClick={() => setOpen((prev) => !prev)} hover={{}} className="p-3 flex items-center justify-center cursor-pointer">
                    <FontAwesomeIcon icon={faBars} />
                </WrapperAnimation>

                <DrawerChat username={params.username} open={open} setOpen={setOpen} />
            </div>
            <ChatBodyAdmin avartar={userMemo?.avartar} conversationId={params.id} />
            <ChatFooter
                options={{
                    styleIcon: 'text-lg',
                }}
                params={params}
                handleSubmit={handleSendMessage}
                conversationId={params.id}
            />
        </div>
    );
}
