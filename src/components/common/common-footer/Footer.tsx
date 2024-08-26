/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { Fab, Grid, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faEnvelope, faPhone, faAngleRight, faUserTie } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { ContainerContent } from '..';
import Link from 'next/link';
import { dataFooter } from '@/datas/footer';
import { ChatBox, Notifycation } from '@/components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { closeNoty } from '@/redux/slice/appSlice';
import { links } from '@/datas/links';
import { contants } from '@/utils/contants';
import { delay } from '@/utils/funtionals';

export interface IFooterProps {}

export default function Footer(props: IFooterProps) {
    const { notifycation } = useAppSelector((state: RootState) => state.appReducer);
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const [showChatbox, setShowChatbox] = useState(false);

    useEffect(() => {
        (async () => {
            if (user && user.role && !contants.roles.manageRoles.includes(user?.role)) {
                await delay(2000);
                setShowChatbox(true);
            } else {
                setShowChatbox(false);
            }
        })();
    }, [user]);

    const dispath = useAppDispatch();
    return (
        <footer className="bg-[#2F2E2E] pt-12 pb-14 max-w-[100%] overflow-hidden mt-[10%]">
            <ContainerContent className="text-white">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-[74px] ">
                    <div className=" lg:col-span-2 flex flex-col gap-[30px] ">
                        <div className="w-fit">
                            <img src="/images/logo-large-dark.svg" alt="logo-large-dark.svg" />
                            <div className="w-3/4 h-[3px] bg-white"></div>
                        </div>
                        <p>{dataFooter.petfoster}</p>
                    </div>
                    <div className="flex flex-col gap-[30px]">
                        <div className="w-fit">
                            <h4 className="text-[25px] text-green-5FA503 font-bold leading-[42px]">ABOUT US</h4>
                            <div className="w-3/4 h-[3px] bg-white"></div>
                        </div>
                        <ul className="flex flex-col gap-5">
                            {dataFooter.aboutUs.map((item) => {
                                return (
                                    <li key={item.title} className="flex items-center gap-1 hover:underline">
                                        <FontAwesomeIcon className="text-xs" icon={faAngleRight} />
                                        <Link className="text-1xl" href={item.link}>
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-[30px]">
                        <div className="w-fit">
                            <h4 className="text-[25px] text-green-5FA503 font-bold leading-[42px] uppercase">Contact us</h4>
                            <div className="w-3/4 h-[3px] bg-white"></div>
                        </div>
                        <ul className="flex flex-col gap-5">
                            {dataFooter.contacts.map((item) => {
                                return (
                                    <li key={item.title} className="flex items-center gap-2 hover:underline cursor-pointer">
                                        <FontAwesomeIcon className="text-xl h-5 w-5" icon={item.icon} />
                                        <span className="text-1xl">{item.title}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="bg-white h-[1px] w-full mt-16"></div>

                {showChatbox && (
                    <div className="fixed bottom-[2%] right-[2%] flex flex-col gap-4">
                        <ChatBox />
                    </div>
                )}
                <div className="flex items-center justify-center py-14">
                    <p>{dataFooter.coppyRight}</p>
                </div>

                <Notifycation
                    onClose={() => {
                        dispath(closeNoty());
                    }}
                    {...notifycation}
                />
            </ContainerContent>
        </footer>
    );
}
