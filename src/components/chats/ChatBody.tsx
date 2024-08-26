'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { ChatItem } from '..';
import ChatAswer from './ChatAswer';
import { IMessage } from '@/configs/interface';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebaseService from '@/services/firebaseService';
import { Timestamp } from 'firebase/firestore';
import { convertFirestoreTimestampToString } from '@/utils/format';
import ChatOrderItem from './ChatOrderItem';
import ChatMapItem from './ChatMapItem';
import { delay } from '@/utils/funtionals';

export interface IChatBodyProps {
    conversationId: string;
    open?: boolean;
}

export default function ChatBody({ conversationId, open }: IChatBodyProps) {
    const { user } = useAppSelector((state: RootState) => state.userReducer);
    const refDiv = useRef<HTMLDivElement>(null);

    const queryMessages = firebaseService.querys.generateQueryGetMessages(conversationId);
    const [messageSnapshot] = useCollection(queryMessages);

    const handleScrollIntoView = () => {
        refDiv.current?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    const messagesData = useMemo(() => {
        if (!messageSnapshot) return [];

        handleScrollIntoView();

        return messageSnapshot.docs.map((item) => {
            return {
                ...item.data(),
                id: item.id,
                sendAt: convertFirestoreTimestampToString(item.data().sendAt as Timestamp),
            } as IMessage;
        });
    }, [messageSnapshot]);

    useEffect(() => {
        if (open) {
            handleScrollIntoView();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageSnapshot]);

    useEffect(() => {
        if (open) {
            handleScrollIntoView();
        }
    }, [open]);

    return (
        <>
            <div className="bg-[#F3F4F6] flex-1  w-full relative py-8 pb-0 px-5 flex flex-col gap-5 overflow-y-auto scroll hide-scroll scroll-smooth">
                {messagesData.map((item) => {
                    const me = user?.username === item.username;

                    if (item.type === 'message') {
                        return <ChatItem styles={{ maxImageOnRow: 3, ojectFit: 'contain' }} key={item.id} data={item} me={me} />;
                    }

                    if (item.type === 'map') {
                        return <ChatMapItem key={item.id} data={item} me={me} />;
                    }
                    return <ChatOrderItem key={item.id} data={item} me={me} />;
                })}
                <div ref={refDiv} className="h-0 flex-none"></div>
            </div>
        </>
    );
}
