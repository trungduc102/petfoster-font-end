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

export interface IChatItemProps {
    data: IMessage;
    avartar?: string;
    me?: boolean;
    styles?: {
        maxImageOnRow: number;
        ojectFit?: string;
    };
}

export default function ChatItem({ data, me, avartar, styles = { maxImageOnRow: 4 } }: IChatItemProps) {
    const { user } = useAppSelector((state: RootState) => state.userReducer);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    return (
        <div
            className={classNames('w-full flex', {
                ['justify-end']: me,
            })}
        >
            <div className="flex items-start text-black-main text-sm max-w-[80%] gap-3">
                {!me && (
                    <Avatar
                        sx={{
                            width: '34px',
                            height: '34px',
                            '& .MuiAvatar-img': {
                                objectFit: styles.ojectFit || 'cover',
                            },
                        }}
                        src={avartar && !me ? avartar : contants.avartarAdminDefault}
                    />
                )}
                {me && user?.username !== data.currentUser && (
                    <Link className="order-1" href={links.adminFuntionsLink.users.detail + user?.id}>
                        <Avatar
                            sx={{
                                width: '34px',
                                height: '34px',
                            }}
                            src={user?.avatar || contants.avartarDefault}
                        />
                    </Link>
                )}

                <div
                    className={classNames('flex flex-col gap-1', {
                        ['items-end']: me,
                    })}
                >
                    <div
                        className={classNames('flex items-center gap-2', {
                            [style['chat-item-message']]: true,
                        })}
                    >
                        <div
                            className={classNames('py-2 px-3 rounded-xl max-w-[100%] break-all shadow-sm flex flex-col text-1xl gap-2', {
                                ['bg-white']: true,
                                [' text-right']: me,
                                ['order-1']: me,
                                ['text-gray-primary italic']: data.recall,
                                ['items-end']: me,
                                ['items-start']: !me,
                            })}
                        >
                            {data.images && !data.recall && data.images.length > 0 && (
                                <div
                                    style={{
                                        gridTemplateColumns: `repeat(${data.images.length <= styles.maxImageOnRow ? data.images.length : styles.maxImageOnRow}, minmax(0, 1fr))`,
                                    }}
                                    className={classNames('grid max-w-full gap-2 ', {
                                        // [data.images.length <= styles.maxImageOnRow ? data.images.length : styles.maxImageOnRow]: true,
                                    })}
                                >
                                    {data.images.map((item, index) => {
                                        return (
                                            <img
                                                key={index}
                                                onClick={() => openImageViewer(index)}
                                                className="w-[80px] h-[80px] object-cover rounded-lg cursor-pointer hover:scale-105 transition-all ease-linear"
                                                src={item}
                                                alt={item}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {me && user?.username !== data.currentUser && <small>{data.currentUser}</small>}
                            {((data?.message && data.message.length > 0) || data.recall) && (
                                <p dangerouslySetInnerHTML={{ __html: !data.recall ? data.message : 'message has been recalled' }}></p>
                            )}
                        </div>

                        {me && !data.recall && <PopupMessage data={data} />}
                    </div>
                    <span className="text-xs px-2 text-[#8D8D8D] italic">{moment(data.sendAt).fromNow()}</span>
                </div>
            </div>

            {isViewerOpen && data.images && (
                <ImageViewer src={data.images} currentIndex={currentImage} disableScroll={false} closeOnClickOutside={true} onClose={closeImageViewer} />
            )}
        </div>
    );
}
