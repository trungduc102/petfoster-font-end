/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import classNames from 'classnames';
import React from 'react';
import { Sansita_Swashed } from 'next/font/google';
import ImpactOfYearItem from './ImpactOfYearItem';
import { homePageData } from '@/datas/home-page';
import { DivAnitmation } from '..';
import { IImpact } from '@/configs/interface';

const sansita = Sansita_Swashed({
    subsets: ['latin'],
    weight: ['800'],
});

export interface IImpactOfYearProps {
    data: IImpact[];
}

export default function ImpactOfYear({ data }: IImpactOfYearProps) {
    return (
        <div>
            <div className="w-full ">
                <div className="w-full min-h-[315px] bg-[#F1F1F1]  md:px-0">
                    <div className="px-10 flex flex-col items-center">
                        <h1
                            className={classNames('tracking-[.4rem] text-xl md:text-3xl lg:text-[48px] my-12 lg:my-[6rem] text-main', {
                                [sansita.className]: true,
                            })}
                        >
                            The impact of 1st year
                        </h1>

                        <div className="w-full flex flex-col md:flex-row items-center justify-evenly md:justify-between lg:justify-evenly gap-16">
                            {data.map((item, index) => {
                                return (
                                    <DivAnitmation delay={index * 0.2} key={item.title}>
                                        <ImpactOfYearItem data={item} />
                                    </DivAnitmation>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="w-full h-full max-h-[200px]">
                    <img loading="lazy" src={'/images/clip-path.svg'} alt="clip-path" />
                </div>
            </div>
        </div>
    );
}
