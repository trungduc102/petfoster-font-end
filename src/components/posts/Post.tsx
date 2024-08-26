/* eslint-disable @next/next/no-img-element */
'use client';
import React, { MouseEvent, createContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faImage, faTrash, faVideo } from '@fortawesome/free-solid-svg-icons';
import { toAbbrevNumber } from '@/utils/format';
import Tippy from '@tippyjs/react/headless';
import { OptionButton, PostDetailDialog } from '..';
import { IPost } from '@/configs/interface';
import { contants } from '@/utils/contants';
import Link from 'next/link';
import { links } from '@/datas/links';
import { useQueryState } from 'nuqs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setuid } from 'process';
export interface IPostProps {
    variant?: 'rounded' | 'circle';
    data: IPost;
}

export default function Post({ variant = 'circle', data }: IPostProps) {
    // modals state
    const [model, setModel] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);

    const [uuid, setUuid] = useQueryState('uuid');

    // handle funtionals
    const handleOpenDetail = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setUuid(data.id as string);
        setOpenDetail(true);
        setModel(false);
    };

    return (
        <div
            onMouseEnter={() => setModel(true)}
            onMouseLeave={() => {
                setModel(false);
            }}
            className={classNames('relative w-full h-full overflow-hidden cursor-pointer', {
                ['border-[3px] border-[#A1A2D3] rounded-[40px] min-h-[338px] min-w-[230px]']: variant === 'circle',
                ['min-h-[300px] min-w-[300px] rounded-lg']: variant === 'rounded',
            })}
        >
            {!data.containVideo && <img className="absolute w-full h-full object-cover " src={data.thumbnail} alt={data.thumbnail} />}
            {data.containVideo && <video className="absolute w-full h-full object-cover " src={data.thumbnail} />}

            <div className="absolute top-0 left-0 p-4 text-white  flex items-center justify-center text-sm">
                <FontAwesomeIcon className="shadow-primary" icon={data.containVideo ? faVideo : faImage} />
            </div>

            <AnimatePresence>
                {model && (
                    <motion.div
                        onClick={handleOpenDetail}
                        initial={{
                            scale: 1.2,
                            opacity: 0,
                        }}
                        exit={{
                            scale: 1.2,
                            opacity: 0,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        className={classNames('absolute bg-[rgba(0,0,0,0.45)] inset-0 w-full h-full  flex flex-col items-center justify-between py-8 pt-4 px-4 text-white', {
                            ['rounded-[20px]']: variant === 'circle',
                            ['rounded-[6px]']: variant === 'rounded',
                        })}
                    >
                        {/* <div className="flex items-center justify-end w-full p-4 pr-0 select-none">{<OptionButton options={{ hover: false }} />}</div> */}

                        <div className=""></div>
                        <div className="flex items-center gap-8 lowercase text-xl select-none">
                            <div
                                className={classNames('flex items-center gap-[6px]', {
                                    ['text-fill-heart']: data.isLike,
                                    ['text-white']: !data.isLike,
                                })}
                            >
                                <FontAwesomeIcon icon={faHeart} />
                                <span className="text-white">{toAbbrevNumber(data.likes)}</span>
                            </div>
                            <div className="flex items-center gap-[6px]">
                                <FontAwesomeIcon icon={faComment} />
                                <span>{toAbbrevNumber(data.comments)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                            <Avatar
                                sx={{
                                    width: '48px',
                                    height: '48px',
                                }}
                                src={data.user.avatar || contants.avartarDefault}
                            />
                            <div className="flex flex-col w-full flex-1 max-w-full">
                                <Link href={links.users.profiles.personalpage + data.user.username} className="truncate max-w-[70%] text-1xl font-medium hover:underline">
                                    {data.user.displayName || data.user.username}
                                </Link>
                                <p className="truncate  max-w-[70%] text-sm font-normal">{data.title}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {openDetail && (
                <PostDetailDialog
                    open={openDetail}
                    setOpen={setOpenDetail}
                    onClose={() => {
                        setUuid(null);
                        setModel(false);
                    }}
                />
            )}
        </div>
    );
}
