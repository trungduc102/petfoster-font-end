/* eslint-disable @next/next/no-img-element */
'use client';
import React, { ReactElement, use, useEffect, useMemo, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { MiniLoading, WrapperAnimation } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { otherHistory } from '@/apis/user';
import { delay } from '@/utils/funtionals';
import OrderPopupItem from './OrderPopupItem';
import firebaseService from '@/services/firebaseService';
import { IOtherHistory } from '@/configs/interface';

export interface IOrderPopupProps {
    children: ReactElement<any>;
    className?: string;
    conversationId?: string;
    username?: string;
}

export default function OrderPopup({ children, className, conversationId, username }: IOrderPopupProps) {
    const rawData = useQuery({
        queryKey: ['histories/otherHistory', (async () => await delay(1000))()],
        queryFn: () => otherHistory(),
    });

    const [open, setOpen] = useState(false);

    const data = useMemo(() => {
        if (!rawData.data || rawData.error || rawData.data.errors) {
            return null;
        }

        const rawOrder = rawData?.data?.data.data;

        if (rawOrder && rawOrder.length <= 0) {
            return null;
        }

        if (rawOrder && rawOrder.length > 1) {
            return rawOrder;
        }

        return null;
    }, [rawData]);

    // handle funtionals
    const handleClose = () => {
        setOpen(false);
    };

    const handleToggleOpen = () => {
        setOpen((prev) => !prev);
    };

    // send order
    const handleSendOrder = async (data: IOtherHistory) => {
        if (!conversationId || !username) return;
        const newMessage = await firebaseService.handleSendOrder(conversationId, username, { orderId: data.id + '' });

        const idNewMessage = newMessage.id;

        await firebaseService.setNewMessageConversation(conversationId, idNewMessage);

        setOpen(false);
    };

    return (
        <Tippy
            visible={open}
            interactive={true}
            placement="top-start"
            render={(attr) => {
                return (
                    <div className="flex flex-col bg-white rounded-md shadow-lg  pb-3 text-black-main w-[calc(94%-48px)] select-none" tabIndex={-1} {...attr}>
                        <div className="flex items-center justify-between px-3 py-2">
                            <span>Orders</span>
                            <WrapperAnimation onClick={handleClose} className="flex items-center justify-center cursor-pointer top-0 right-0" hover={{}}>
                                <FontAwesomeIcon icon={faXmark} />
                            </WrapperAnimation>
                        </div>
                        <div className=" max-h-[40vh] scroll flex flex-col">
                            {data &&
                                data.length &&
                                data.map((item) => {
                                    return <OrderPopupItem onSend={handleSendOrder} key={item.id} data={item} />;
                                })}
                        </div>

                        {rawData.isLoading && (
                            <div className="absolute inset-0 bg-[rgba(0,0,0,.4)] flex items-center justify-center">
                                <MiniLoading />
                            </div>
                        )}
                    </div>
                );
            }}
        >
            <WrapperAnimation onClick={handleToggleOpen} className={className} hover={{}}>
                {children}
            </WrapperAnimation>
        </Tippy>
    );
}
