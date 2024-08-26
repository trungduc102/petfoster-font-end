/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { motion } from 'framer-motion';
import * as React from 'react';
import { ImageAnimation } from '@/components';
import { takeActionData } from '@/datas/take-action';
import Link from 'next/link';

export interface ICategoriesOverviewProps {}

export default function CategoriesOverview(props: ICategoriesOverviewProps) {
    return (
        <div className="my-[68px] flex flex-col lg:flex-row items-center justify-center gap-[50px]">
            {takeActionData.categoriesOverview.map((item) => {
                return (
                    <Link href={item.link} key={item.id} className="w-[180px] h-[180px] rounded-full overflow-hidden border-[3px] border-[#FF7A00]">
                        <ImageAnimation animation="scale" className="w-full h-full object-cover cursor-pointer" src={item.thumbnail} alt={item.thumbnail} />;
                    </Link>
                );
            })}
        </div>
    );
}
