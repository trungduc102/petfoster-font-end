'use client';
import { RootState } from '@/configs/types';
import { profileUiData } from '@/datas/profile';
import { useAppSelector } from '@/hooks/reduxHooks';
import { contants } from '@/utils/contants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export interface INavProfileProps {}

export default function NavProfile(props: INavProfileProps) {
    const pathname = usePathname();

    const { user } = useAppSelector((state: RootState) => state.userReducer);
    return (
        <div className="py-[25px] px-9 w-full h-full rounded">
            <div className="flex items-center gap-2 mb-[38px]">
                <Avatar
                    sx={{
                        width: 60,
                        height: 60,
                    }}
                    alt="avatar"
                    src={user?.avatar || contants.avartarDefault}
                />
                <span className="font-medium text-lg">{user?.displayName || user?.username}</span>
            </div>

            <ul>
                {profileUiData.listMethod.map((item) => {
                    return (
                        <li key={item.title} className={'border-b border-gray-primary py-1'}>
                            <Link
                                className={classNames(
                                    `flex items-center gap-3 text-black-main text-sm px-[18px] py-2  w-full hover:bg-green-65a30d rounded hover:text-white transition-all 
                            ease-linear cursor-pointer text-1xl`,
                                    {
                                        'bg-green-65a30d text-white': item.link === pathname,
                                    },
                                )}
                                href={item.verify ? item.link + user?.username : item.link}
                            >
                                <div className="h-[18px] w-[18px]">
                                    <FontAwesomeIcon className="text-1xl" icon={item.icon} />
                                </div>
                                <p className=" uppercase">{item.title}</p>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
