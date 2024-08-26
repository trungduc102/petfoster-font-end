'use client';
import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';
import { CustomButton, WrapperAnimation } from '..';

export interface IMainButtonProps {
    className?: string;
    title: string;
    width?: number | string;
    height?: number | string;
    background?: string;
    href?: string;
    upercase?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function MainButton({ className, title, width, height, background = 'bg-[#5FA503]', href, upercase = true, onClick }: IMainButtonProps) {
    return (
        <WrapperAnimation onClick={onClick} hover={{ y: -2 }}>
            <CustomButton
                href={href}
                style={width || height ? { width: width, height: height } : undefined}
                className={classNames(' text-1xl font-medium text-white py-[14px] px-8 rounded-md flex items-center justify-center', {
                    [className ?? '']: Boolean(className),
                    'w-[188px]': !Boolean(width),
                    'h-[48px]': !Boolean(height),
                    [background]: true,
                })}
            >
                <span
                    className={classNames('', {
                        ['uppercase']: upercase,
                    })}
                >
                    {title}
                </span>
            </CustomButton>
        </WrapperAnimation>
    );
}
