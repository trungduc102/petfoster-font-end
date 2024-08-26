/* eslint-disable @next/next/no-img-element */
'use client';
import * as React from 'react';
import { IPost } from '@/configs/interface';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface IKnowldegeAboutFosterPreviewProps {
    data?: IPost;
}

export default function KnowldegeAboutFosterPreview({ data }: IKnowldegeAboutFosterPreviewProps) {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-[70%] max-h-[500px] overflow-hidden rounded-2xl">
                <motion.img whileHover={{ scale: 1.1, rotate: 4 }} className="w-full h-full max-h-full object-cover" loading="lazy" src={data?.thumbnail} alt={data?.thumbnail} />
            </div>
            <div className="flex-1 mt-4">
                <Link href={'/'} className="text-green-5FA503 mt-6 mb-4 text-2xl font-semibold uppercase hover:underline">
                    {data?.title}
                </Link>

                <p className="text-1xl text-black-main line-clamp-3 text-ellipsis">{data?.title}</p>
            </div>
        </div>
    );
}
