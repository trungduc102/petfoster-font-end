'use client';
import React, { KeyboardEvent, useRef, useState } from 'react';
import WraperDialog from './WraperDialog';
import { IUserFirebase } from '@/configs/interface';
import { Avatar } from '@mui/material';
import { EmojiPicker, WrapperAnimation } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSmile, faXmark } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Validate from '@/utils/validate';
import { EmojiClickData } from 'emoji-picker-react';
import firebaseService from '@/services/firebaseService';
import { useRouter } from 'next/navigation';
import { links } from '@/datas/links';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';

export interface IConversationDialogProps {
    open: boolean;
    data: IUserFirebase | null;
    setOpen: (v: boolean) => void;
}

export default function ConversationDialog({ open, data, setOpen }: IConversationDialogProps) {
    const refInput = useRef<HTMLTextAreaElement>(null);
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    // router
    const router = useRouter();
    const handleClose = () => {
        setOpen(false);
    };

    const handleSendMessage = async () => {
        if (!refInput.current || Validate.isBlank(refInput.current?.value) || !data || !user) return;

        // get value from refinput
        const value = refInput.current.value;

        // send a request to create a new conversation with this username from data
        const conversation = await firebaseService.addConversation(data?.username);

        // check if non conversation then return
        if (!conversation) return;

        // send a request add a first message

        await firebaseService.handleSendMessage(value, conversation.id, user.username);

        router.push(links.message + `/${data.username}/${conversation.id}`);
        setOpen(false);
    };

    const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Enter') return;
        handleSendMessage();
    };

    const handleAddIcon = (emojiObject: EmojiClickData, event: MouseEvent) => {
        if (!refInput.current) return;

        refInput.current.value += emojiObject.emoji;
    };

    if (data == null) {
        handleClose();
        return;
    }

    return (
        <WraperDialog fullWidth={true} onClose={handleClose} open={open} setOpen={setOpen}>
            <div className="text-black-main py-3 px-4 min-h-[280px] flex flex-col justify-between gap-3">
                <div className="flex  items-center gap-2">
                    <Avatar src={data.avartar} />

                    <div className="flex flex-col">
                        <span>{data.username}</span>
                        {!data.online && <small className="italic">last seen: {moment(data.lassSeen).fromNow()}</small>}
                        {data.online && (
                            <div className="flex items-center gap-2">
                                <p>online</p> <small className="h-2 w-2 rounded-full block bg-green-5FA503"></small>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-between border border-gray-primary rounded p-2 min-h-[200px] text-black-main">
                    <textarea
                        spellCheck={false}
                        onKeyDown={handleEnter}
                        ref={refInput}
                        placeholder="Please send your first message..."
                        className="text-sm resize-none w-full h-full  outline-none"
                        cols={100}
                    />

                    <div className="flex items-center justify-end">
                        <EmojiPicker
                            onEmoji={handleAddIcon}
                            stylePicker={{
                                height: 200,
                            }}
                            icon={<FontAwesomeIcon className="text-gray-400" icon={faSmile} />}
                        />
                    </div>
                </div>

                <WrapperAnimation
                    onClick={handleSendMessage}
                    hover={{}}
                    className="bg-violet-primary rounded-lg px-4 py-1 text-white font-medium flex items-center gap-2 cursor-pointer text-1xl justify-center"
                >
                    <p>New conversation</p>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </WrapperAnimation>
            </div>
        </WraperDialog>
    );
}
