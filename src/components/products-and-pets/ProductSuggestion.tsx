'use client';
import React, { useState } from 'react';
import { BoxTitle, ProductRecent } from '..';
import { IProduct } from '@/configs/interface';
import classNames from 'classnames';

export interface IProductSuggestionProps {
    data: IProduct[];
    title: string;
    fontSizeTitle?: string;
}

export default function ProductSuggestion({ data, title, fontSizeTitle }: IProductSuggestionProps) {
    const [isHideScroll, setIsHideScroll] = useState(true);

    return (
        <BoxTitle title={title} locationTitle="left" underlineTitle fontSizeTitle={fontSizeTitle}>
            <div
                style={{
                    overscrollBehaviorInline: 'contain',
                }}
                onMouseEnter={() => setIsHideScroll(false)}
                onMouseLeave={() => setIsHideScroll(true)}
                className={classNames('scroll grid grid-flow-col auto-cols-[60%] md:auto-cols-[40%] lg:auto-cols-[30%] gap-[10px] pb-4 select-none transition-all ease-linear', {
                    'hide-scroll ': isHideScroll,
                })}
            >
                {data.map((product) => {
                    return <ProductRecent key={product.id} data={product} />;
                })}
            </div>
        </BoxTitle>
    );
}
