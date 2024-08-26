/* eslint-disable @next/next/no-img-element */
'use client';
import { IMessage } from '@/configs/interface';
import { Point, RootState } from '@/configs/types';
import { links } from '@/datas/links';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { contants } from '@/utils/contants';
import { Avatar } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import style from './style.module.css';
import PopupMessage from './PopupMessage';
import { addressToString } from '@/utils/format';
import { MapWraper, Markers, MiniLoading } from '..';
import { setDataMap } from '@/redux/slice/chatSlice';
import { delay } from '@/utils/funtionals';

export interface ChatMapItemProps {
    data: IMessage;
    me?: boolean;
    avartar?: string;
    options?: {
        size: 'md' | 'sm';
    };
}

export default function ChatMapItem({ data, me, options = { size: 'sm' }, avartar }: ChatMapItemProps) {
    const dispath = useAppDispatch();

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const [loading, setLoading] = useState(true);

    const handleShowMap = () => {
        if (data.recall || !data.location || !data.address) return;

        dispath(setDataMap({ location: data.location, address: data.address, avatar: avartar || null, username: data.username }));
    };

    useEffect(() => {
        (async () => {
            const random = Math.floor(Math.random() * 10) + 1;

            await delay(random * 100);

            setLoading(false);
        })();
    }, []);

    return (
        <div
            className={classNames('w-full flex', {
                ['justify-end']: me,
            })}
        >
            <div className="flex items-start flex-col text-black-main text-sm w-full max-w-[68%] gap-1">
                <div
                    className={classNames('flex items-center gap-2 w-full', {
                        [style['chat-item-message']]: true,
                    })}
                >
                    <div
                        className={classNames('bg-white shadow-sm w-full relative overflow-hidden flex-1', {
                            ['order-1']: me,
                            ['px-3 py-2 text-gray-primary italic rounded-xl text-1xl']: data.recall,
                            ['rounded-lg p-2']: !data.recall,
                        })}
                    >
                        {/* This is map */}
                        {!data.recall && data.location && data.address && (
                            <>
                                <div
                                    className={classNames('w-full  rounded-lg overflow-hidden', {
                                        'h-[120px]': options.size === 'sm',
                                        'h-[240px]': options.size === 'md',
                                    })}
                                >
                                    {!loading && user && (
                                        <MapWraper
                                            // onTilesLoaded={() => {
                                            //     setLoading(false);
                                            // }}
                                            disableDoubleClickZoom={true}
                                            zoomControl={false}
                                            disableDefaultUI={true}
                                            scaleControl={false}
                                            scrollwheel={false}
                                            zoom={16}
                                            center={data.location as Point}
                                        >
                                            <Markers
                                                option={{
                                                    size: 'xs',
                                                    showName: false,
                                                }}
                                                avartar={avartar}
                                                isShop={contants.roles.manageRoles.includes(user?.role) && data.username === contants.usernameAdmin}
                                                point={data.location as Point}
                                            />
                                        </MapWraper>
                                    )}
                                </div>
                                <div className="mt-2 text-black-main text-sm hover:underline cursor-pointer">
                                    <span onClick={handleShowMap} className="line-clamp-2">
                                        {typeof data.address === 'string' ? data.address : addressToString(data.address)}
                                    </span>
                                </div>
                            </>
                        )}
                        {data.recall && <p dangerouslySetInnerHTML={{ __html: 'message has been recalled' }}></p>}

                        {loading && (
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
