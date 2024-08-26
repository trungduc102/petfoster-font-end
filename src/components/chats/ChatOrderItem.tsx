/* eslint-disable @next/next/no-img-element */
'use client';
import { IMessage } from '@/configs/interface';
import { RootState } from '@/configs/types';
import { links } from '@/datas/links';
import { useAppSelector } from '@/hooks/reduxHooks';
import { contants } from '@/utils/contants';
import { Avatar } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import style from './style.module.css';
import ImageViewer from 'react-simple-image-viewer';
import PopupMessage from './PopupMessage';
import { stringToUrl, toCurrency } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { detailOtherHistory } from '@/apis/user';
import { getOrdersDetailAdminWithFilter } from '@/apis/admin/orders';
import { MiniLoading } from '..';

export interface ChatOrderItemProps {
    data: IMessage;
    me?: boolean;
}

export default function ChatOrderItem({ data, me }: ChatOrderItemProps) {
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const rawOrder = useQuery({
        queryKey: ['histories/detail/messages', data.orderId],
        queryFn: () => {
            if (!user || !data.orderId) return;

            if (contants.roles.manageRoles.includes(user.role)) {
                return getOrdersDetailAdminWithFilter(+data.orderId);
            }
            return detailOtherHistory(data.orderId);
        },
    });

    if (rawOrder.error || rawOrder.data?.errors) {
        return;
    }

    const dataOrder = rawOrder.data && rawOrder.data?.data;

    return (
        <div
            className={classNames('w-full flex', {
                ['justify-end']: me,
            })}
        >
            <div className="flex items-start flex-col text-black-main text-sm max-w-[80%] gap-1">
                <div
                    className={classNames('flex items-center gap-2', {
                        [style['chat-item-message']]: true,
                    })}
                >
                    <div
                        className={classNames('bg-white shadow-sm w-full relative overflow-hidden', {
                            ['order-1']: me,
                            ['px-3 py-2 text-gray-primary italic rounded-xl text-1xl']: data.recall,
                            ['rounded-lg py-3']: !data.recall,
                        })}
                    >
                        {!data.recall && dataOrder && !rawOrder.isLoading && (
                            <>
                                <div className="flex items-center justify-between px-3 w-full font-medium text-sm">
                                    <Link
                                        target="_blank"
                                        className="hover:underline"
                                        href={
                                            user && contants.roles.manageRoles.includes(user.role)
                                                ? links.adminFuntionsLink.orders.index + `?orderId=${dataOrder.id}`
                                                : links.history.orderHistory + `/${dataOrder.id}`
                                        }
                                    >
                                        #{dataOrder?.id} {dataOrder?.state} {dataOrder?.placedDate}
                                    </Link>
                                    {/* <Link target="_blank" className="hover:underline" href={links.adminFuntionsLink.orders.index + `?orderId=${dataOrder.id}`}>
                                        #{dataOrder?.id} {dataOrder?.state} {dataOrder?.placedDate}
                                    </Link> */}
                                </div>
                                <div className="flex items-center gap-2 text-sm px-3 py-2 w-full">
                                    <img loading="lazy" className="w-[60px] h-[60px] object-contain" src={dataOrder?.products[0].image} alt={dataOrder?.products[0].image} />

                                    <div className="w-full  flex-1">
                                        <Link
                                            target="_blank"
                                            href={
                                                user && contants.roles.manageRoles.includes(user.role)
                                                    ? links.adminFuntionsLink.product.index + `/${dataOrder.products[0].id}`
                                                    : links.produt + `${dataOrder.products[0].id}/${stringToUrl(dataOrder.products[0].name)}`
                                            }
                                            className="line-clamp-1 hover:underline"
                                        >
                                            {dataOrder.products[0].name}
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <p className="text-red-primary">{toCurrency(dataOrder.products[0].price)}</p>
                                            <del className="text-xs">{toCurrency(dataOrder.products[0].price + (dataOrder.products[0].price * 8) / 100)}</del>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {data.recall && <p dangerouslySetInnerHTML={{ __html: 'message has been recalled' }}></p>}

                        {rawOrder.isLoading && (
                            <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
                                <MiniLoading />
                            </div>
                        )}
                    </div>

                    {me && !data.recall && <PopupMessage data={data} />}
                </div>

                <span
                    className={classNames('text-xs px-2 text-[#8D8D8D] italic w-full', {
                        [' text-right']: me,
                        'text-left': !me,
                    })}
                >
                    {moment(data.sendAt).fromNow()}
                </span>
            </div>
        </div>
    );
}
