'use client';
import React, { useMemo } from 'react';
import BoxPost from './BoxPost';
import classNames from 'classnames';
import { Post } from '@/components';

import { IPost } from '@/configs/interface';

export interface IBoxPostHighlightProps {
    title: string;
    data: IPost[];
    options?: {
        captialize?: boolean | undefined;
        tracking?: string;
    };
}

export default function BoxPostHighlight({ title, options, data }: IBoxPostHighlightProps) {
    return (
        <BoxPost options={options} title={title}>
            <div
                className={classNames('grid', {
                    ['lg:grid-cols-5 gap-6 py-4']: true,
                    ['md:grid-cols-3']: true,
                })}
            >
                {data.map((item) => {
                    return <Post key={item.id} data={item} />;
                })}
            </div>
        </BoxPost>
    );
}
