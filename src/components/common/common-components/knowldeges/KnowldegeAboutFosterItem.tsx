/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { IPost } from '@/configs/interface';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface IKnowldegeAboutFosterItemProps {
    data: IPost;
}

export default function KnowldegeAboutFosterItem({ data }: IKnowldegeAboutFosterItemProps) {
    return (
        <li className="w-full h-[33.33333%] flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <div className="w-full md:w-[40%] h-full rounded-2xl max-h-[209px] overflow-hidden">
                <motion.img
                    whileHover={{
                        scale: 1.1,
                    }}
                    className="w-full h-full object-cover"
                    src={data.thumbnail}
                    alt={data.thumbnail}
                />
            </div>
            <div className="flex-1 py-4 flex flex-col justify-between gap-1">
                <Link href={'/'} className="text-2xl text-green-5FA503 font-semibold uppercase hover:underline">
                    {data.title}
                </Link>
                <p className="text-black-main text-1xl line-clamp-5">{data.title}</p>
            </div>
        </li>
    );
}
