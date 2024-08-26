import { Source_Serif_4 } from 'next/font/google';
import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import { IImpact } from '@/configs/interface';
const sourceSerif4 = Source_Serif_4({
    subsets: ['latin'],
    weight: ['400', '500'],
});

export interface IImpactOfYearItemProps {
    data: IImpact;
}

export default function ImpactOfYearItem({ data }: IImpactOfYearItemProps) {
    return (
        <div className={classNames('flex flex-col items-center justify-center gap-4')}>
            <div className={classNames('relative w-[100px] h-[100px]')}>
                <Image fill src={`/icons/${data.image}`} alt="img-icon" />
            </div>
            <h4 className="font-bold text-green-main-dark text-2xl lg:text-[48px] py-2 tracking-wider">
                {data.prefix && data.prefix}
                {data.prefix ? (Number(data.quantity) / Number(process.env.NEXT_PUBLIC_USD)).toFixed(1) : data.quantity}
            </h4>
            <span className="text-lg lg:text-xl font-semibold text-black-main tracking-wider">{`${data.title}`}</span>
        </div>
    );
}
