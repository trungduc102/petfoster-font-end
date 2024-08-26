'use client';
import React, { ReactNode, useMemo } from 'react';
import { ContainerContent } from '../common';
import { IPet } from '@/configs/interface';
import { MainButton, Pagination, Pet } from '..';
import classNames from 'classnames';

type bottomStyle = 'load-more' | 'pagination' | 'none';

export interface IPetsProps {
    data: IPet[];
    heading?: ReactNode;
    bottom?: bottomStyle;
    background?: string;

    options?: {
        buttonTitle?: string;
        href?: string;
        baseHref?: string;
        pages?: number;
    };
}

export default function Pets({ data, heading, bottom = 'load-more', background = 'bg-[#F5FAFF]', options }: IPetsProps) {
    const memoData = useMemo(() => {
        return data;
    }, [data]);

    return (
        <ContainerContent
            classNameContainer={classNames('pt-14', {
                [background]: true,
            })}
        >
            {heading ? heading : <h2 className="text-black-main text-center pb-[48px] text-4xl font-semibold">RECENTLY FOSTER</h2>}

            <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 gap-[20px] gap-y-9">
                {memoData.map((pet) => {
                    return <Pet key={pet.id} data={pet} />;
                })}
            </div>
            {bottom === 'load-more' && (
                <div className="flex items-center justify-center w-full">
                    <MainButton href={options?.href} title={options?.buttonTitle || 'load more'} className="my-11" />
                </div>
            )}

            {bottom === 'pagination' && options?.pages && options.pages > 1 && <Pagination baseHref={options?.baseHref} pages={options?.pages || 1} />}
        </ContainerContent>
    );
}
