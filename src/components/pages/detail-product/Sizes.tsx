'use client';
import { WrapperAnimation } from '@/components';
import { toGam } from '@/utils/format';
import classNames from 'classnames';
import React, { memo, useEffect, useState } from 'react';

export interface ISizesProps {
    data: string[] | number[];
    onSize?: (size: string | number, index?: number) => void;
}

function Sizes({ data, onSize }: ISizesProps) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!onSize) return;

        onSize(data[active], active);
    }, [active, data, onSize]);

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {data.map((item, index) => {
                return (
                    <WrapperAnimation hover={{}} key={item}>
                        <div
                            onClick={() => setActive(index)}
                            className={classNames(
                                `py-2 px-4 w-full max-w-full  text-lg rounded-md min-w-[110px] border-2 flex items-center justify-center cursor-pointer select-none 
                                hover:border-orange-primary transition-all ease-linear max-h-[60px]`,
                                {
                                    ['border-gray-primary']: active !== index,
                                    ['border-orange-primary']: active === index,
                                },
                            )}
                        >
                            <span>{toGam(item as number)}</span>
                        </div>
                    </WrapperAnimation>
                );
            })}
        </div>
    );
}

export default memo(Sizes);
