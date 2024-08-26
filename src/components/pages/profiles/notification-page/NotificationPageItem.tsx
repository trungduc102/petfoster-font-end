'use client';
import { CustomDynamicCom } from '@/components';
import { INotification, IProfile } from '@/configs/interface';
import firebaseService from '@/services/firebaseService';
import { contants } from '@/utils/contants';
import { convertFirestoreTimestampToString } from '@/utils/format';
import { Avatar } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment';
import React from 'react';

export interface INotificationPageItemProps {
    data: INotification;
    user: IProfile | null;
    options?: {
        active?: boolean;
        disable?: boolean;
    };
    onClick?: (data: INotification) => void;
}

export default function NotificationPageItem({ data, user, options, onClick }: INotificationPageItemProps) {
    const handleIsRead = async () => {
        if (onClick) {
            onClick(data);
            return;
        }

        if (!user || data.read.includes(user.username) || options?.disable) return;
        await firebaseService.setRead(data.id, data.read, user?.username);
    };

    return (
        <CustomDynamicCom
            href={data.link || undefined}
            onClick={handleIsRead}
            className={classNames(
                'w-full max-w-full flex flex-col sm:flex-row items-center justify-between text-black-main py-4 px-4 sm:px-7 rounded-lg shadow-sm hover:bg-[#F1F1F1] cursor-pointer',
                {
                    ['bg-[#F1F1F1]']: options?.active,
                },
            )}
        >
            <div className="flex-1 flex items-center gap-4">
                <Avatar
                    variant="rounded"
                    sx={{
                        width: '56px',
                        height: '56px',
                    }}
                    src={data.photourl}
                />

                <p
                    className="text-[15px] max-w-full"
                    dangerouslySetInnerHTML={{
                        __html: (() => {
                            // if (data.options && data.options.end && data.options.start && data.type !== 'none') {
                            //     const textWrap = data.content.substring(data.options.start, data.options.end);

                            //     return data.content.replaceAll(textWrap, `<span class="text-${data.type}-notification">${textWrap}</span>`);
                            // }

                            // return data.content;
                            if (!user) return '';

                            const content = contants.roles.manageRoles.includes(user?.role) ? data.adminCotent || data.content : data.content;

                            if (data.options && data.options.end && data.options.start && data.type !== 'none') {
                                const textWrap = content.substring(data.options.start, data.options.end);

                                return content.replaceAll(textWrap, `<span class="text-${data.type}-notification">${textWrap}</span>`);
                            }

                            return content;
                        })(),
                    }}
                ></p>
            </div>

            <div className="w-full mt-1 sm:mt-0 sm:w-1/4 flex items-center text-sm justify-end gap-8">
                <span>{moment(data.createdAt instanceof Date ? data.createdAt : convertFirestoreTimestampToString(data.createdAt)).fromNow()}</span>
                <small
                    className={classNames('w-2 h-2 rounded-full', {
                        'bg-fill-heart': user && !data.read.includes(user?.username),
                        'bg-transparent': user && data.read.includes(user?.username),
                    })}
                ></small>
            </div>
        </CustomDynamicCom>
    );
}
