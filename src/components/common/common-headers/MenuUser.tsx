'use client';
import { CustomBadge, WrapperAnimation, NotifycationCom } from '@/components';
import { MenuHeaderType, RootState } from '@/configs/types';
import { listProfile } from '@/datas/header';
import { links } from '@/datas/links';
import { useAppSelector } from '@/hooks/reduxHooks';
import { contants } from '@/utils/contants';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
export interface IMenuUserProps {
    isChangeBg?: boolean;
}

export default function MenuUser({ isChangeBg }: IMenuUserProps) {
    const [openMenu, setOpenMenu] = useState(false);

    const [isClient, setisClient] = useState(false);

    const { cartUser } = useAppSelector((state: RootState) => state.cartReducer);
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    let listProfileBeforeCheck: MenuHeaderType[];

    if (user && contants.roles.manageRoles.includes(user?.role)) {
        listProfileBeforeCheck = [
            {
                title: 'Dashboard',
                href: links.admin,
                icon: faChartLine,
            },
            ...listProfile,
        ];
    } else {
        listProfileBeforeCheck = [...listProfile];
    }

    useEffect(() => {
        setisClient(true);
    }, []);

    return (
        <div className="flex gap-4 ">
            {isClient ? (
                <Tippy
                    interactive
                    visible={openMenu}
                    onClickOutside={() => setOpenMenu(false)}
                    placement="bottom-end"
                    render={(attr) => {
                        return (
                            <ul className="w-[188px] bg-[#F2F2F2] text-[#4C4C4C] rounded-lg overflow-hidden shadow-xl" tabIndex={0} {...attr}>
                                {listProfileBeforeCheck.map((profile, index) => {
                                    return (
                                        <li
                                            key={profile.href}
                                            className="cursor-pointer w-full hover:bg-green-65a30d transition-all ease-linear duration-1500 hover:text-white px-3 h-10 flex items-center pl-6"
                                        >
                                            <Link className="w-full flex items-center gap-[10px]" href={profile.href}>
                                                <FontAwesomeIcon className="w-4 h-4" icon={profile.icon} />
                                                <span>{profile.title}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    }}
                >
                    <div className="flex items-center justify-between gap-4 cursor-pointer select-none">
                        <NotifycationCom
                            icon={
                                <span
                                    className={classNames('text-xl ', {
                                        ['text-white']: !isChangeBg,
                                        ['text-black']: isChangeBg,
                                    })}
                                >
                                    <FontAwesomeIcon icon={faBell} />
                                </span>
                            }
                        />
                        <CustomBadge invisible={openMenu || cartUser.length <= 0} badgeContent={cartUser.length}>
                            <Link
                                href={links.users.cart}
                                className={classNames('text-xl  flex items-center justify-center', {
                                    ['text-white']: !isChangeBg,
                                    ['text-black']: isChangeBg,
                                })}
                            >
                                <WrapperAnimation hover={{ rotate: 10 }} className="flex items-center justify-center">
                                    <ShoppingCartOutlinedIcon />
                                </WrapperAnimation>
                            </Link>
                        </CustomBadge>

                        <WrapperAnimation onClick={() => setOpenMenu(true)} hover={{}}>
                            <Avatar alt="avartar" className="cursor-pointer border-2" src={user?.avatar || contants.avartarDefault} />
                        </WrapperAnimation>
                    </div>
                </Tippy>
            ) : (
                ''
            )}
        </div>
    );
}
