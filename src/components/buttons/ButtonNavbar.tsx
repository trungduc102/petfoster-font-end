'use client';
import classNames from 'classnames';
import React, { memo } from 'react';
import { CustomButton, WrapperAnimation } from '..';
import { usePathname } from 'next/navigation';

export interface IButtonNavbarProps {
    href: string;
    contents: string;
    border?: boolean;
    isScroll?: boolean;
}

function ButtonNavbar({ href, contents, border, isScroll }: IButtonNavbarProps) {
    const path = usePathname();

    return (
        <WrapperAnimation
            hover={{
                y: -4,
            }}
        >
            <CustomButton
                className={classNames(
                    `font-bold transition-all ease-linear text-sm }
                border-2 py-2 px-6 rounded-lg `,
                    {
                        'text-green-main': path === href && !isScroll,
                        'text-green-main-dark': path === href && isScroll,
                        'border-green-main': Boolean(border && !isScroll),
                        'border-green-main-dark': Boolean(border && isScroll),
                        'border-transparent': !border,
                        'hover:text-green-main-dark': isScroll,
                        'hover:text-green-main': !isScroll,
                    },
                )}
                href={href}
            >
                <span>{contents.toUpperCase()}</span>
            </CustomButton>
        </WrapperAnimation>
    );
}

export default memo(ButtonNavbar);
