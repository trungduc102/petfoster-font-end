import * as React from 'react';
import styles from './styles/banner-take-action.module.css';
import classNames from 'classnames';
import { ContainerContent } from '.';
import Image from 'next/image';
import { takeActionData } from '@/datas/take-action';
import Link from 'next/link';

export interface IBannerTakeActionProps {}

export default function BannerTakeAction(props: IBannerTakeActionProps) {
    return (
        <ContainerContent>
            <nav className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] mt-[73px] mb-[88px]">
                {takeActionData.banners.map((item) => {
                    return (
                        <Link
                            href={item.link}
                            content={item.content}
                            key={item.image}
                            className={classNames(
                                `lg:[&:nth-child(2)]:col-span-2 [&:nth-child(3)]:col-span-2 lg:[&:nth-child(3)]:col-span-1 
                                lg:[&:nth-child(2)]:row-span-2 [&:nth-child(3)]:row-span-2 lg:[&:nth-child(3)]:row-span-1 
                                h-[158px] relative lg:[&:nth-child(2)]:h-auto overflow-hidden before:text-lg before:uppercase
                                 before:font-semibold `,
                                {
                                    [styles['item']]: true,
                                },
                            )}
                        >
                            <Image className="w-full h-full object-cover" fill src={item.image} alt={item.image} />
                        </Link>
                    );
                })}
            </nav>
        </ContainerContent>
    );
}
