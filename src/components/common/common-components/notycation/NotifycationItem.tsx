/* eslint-disable @next/next/no-img-element */
import { CustomDynamicCom } from '@/components';
import { INotification, IProfile } from '@/configs/interface';
import firebaseService from '@/services/firebaseService';
import { contants } from '@/utils/contants';
import { convertFirestoreTimestampToString } from '@/utils/format';
import { Avatar, Grid } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment';
import React from 'react';

export interface INotifycationItemProps {
    data: INotification;
    user: IProfile | null;
}

export default function NotifycationItem({ data, user }: INotifycationItemProps) {
    const handleIsRead = async () => {
        if (!user || data.read.includes(user.username)) return;
        await firebaseService.setRead(data.id, data.read, user?.username);
    };
    return (
        <CustomDynamicCom
            href={(contants.roles.manageRoles.includes(user?.role || '') ? data.linkAdmin || data.link : data.link) || undefined}
            onClick={handleIsRead}
            className={classNames('px-6 hover:bg-[#F1F1F1] py-4  w-full cursor-pointer transition-all duration-100', {
                ['bg-[#F1F1F1]']: user && !data.read.includes(user.username),
            })}
        >
            <Grid container spacing={1} className="flex items-center">
                <Grid item lg={2} className="flex justify-center items-center">
                    <Avatar
                        sx={{
                            width: '50px',
                            height: '50px',
                        }}
                        variant="rounded"
                        src={data?.photourl || contants.avartarDefault}
                    />
                </Grid>
                <Grid item lg={10}>
                    <div className="flex flex-col gap-2">
                        <span
                            className="text-1xl line-clamp-2"
                            dangerouslySetInnerHTML={{
                                __html: (() => {
                                    if (!user) return '';

                                    const content = contants.roles.manageRoles.includes(user?.role) ? data.adminCotent || data.content : data.content;

                                    if (data.options && data.options.end && data.options.start && data.type !== 'none') {
                                        const textWrap = content.substring(data.options.start, data.options.end);

                                        return content.replaceAll(textWrap, `<span class="text-${data.type}-notification">${textWrap}</span>`);
                                    }

                                    return content;
                                })(),
                            }}
                        ></span>
                        <p className="text-sm">{moment(data.createdAt instanceof Date ? data.createdAt : convertFirestoreTimestampToString(data.createdAt)).fromNow()}</p>
                    </div>
                </Grid>
            </Grid>
        </CustomDynamicCom>
    );
}
