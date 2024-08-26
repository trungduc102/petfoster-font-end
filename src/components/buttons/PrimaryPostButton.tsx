'use client';
import React, { MouseEventHandler, ReactNode } from 'react';
import { CustomButton, WrapperAnimation } from '..';
import classNames from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IPrimaryPostButtonProps {
    href?: string;
    title: string | ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'full' | 'none';
    variant?: 'rouded-fill' | 'circle-fill' | 'circle' | 'rouded';
    leftIcon?: IconProp;
    rightIcon?: IconProp;
    className?: string;
    hover?: 'scale' | 'rotate' | 'up' | 'down' | 'none';
    meta?: {
        width?: string;
        height?: string;
        component?: 'div' | 'label';
        htmlFor?: string;
    };
    onClick?: MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<HTMLAnchorElement>;
}

export default function PrimaryPostButton({
    href,
    title,
    size = 'md',
    variant = 'circle',
    className,
    leftIcon,
    rightIcon,
    hover = 'none',
    meta = { component: 'div' },
    onClick,
}: IPrimaryPostButtonProps) {
    const __VARIANT_NONE_CLASS = 'bg-[#F6F6F6] text-violet-post-primary border-violet-post-primary font-medium';

    const __VARIANT_FILL_CLASS = 'bg-violet-post-primary text-white font-semibold';

    const sizes: { sm: string; md: string; lg: string; full: string; none: string } = {
        sm: 'py-3 px-6 text-sm',
        md: 'py-[14px] px-7 text-[15px]',
        lg: '',
        full: 'w-full h-full py-[14px] px-6',
        none: '',
    };

    const variants: { 'rouded-fill': string; 'circle-fill': string; rouded: string; circle: string; none: string } = {
        'rouded-fill': 'rounded-lg ' + __VARIANT_FILL_CLASS,
        'circle-fill': 'rounded-full ' + __VARIANT_FILL_CLASS,
        circle: 'rounded-full ' + __VARIANT_NONE_CLASS,
        rouded: 'rounded-lg ' + __VARIANT_NONE_CLASS,
        none: '',
    };

    const iconSizes = {
        sm: 'text-[20px]',
        md: 'text-[22px]',
        lg: '',
        full: '',
        none: '',
    };

    const hovers = {
        scale: {
            scale: 1.08,
        },
        rotate: {
            rotate: 10,
        },
        up: {
            y: -2,
        },
        down: {
            y: 2,
        },
        none: {},
    };

    return (
        <WrapperAnimation htmlFor={meta.htmlFor} hover={hovers[hover]} className="">
            <CustomButton
                onClick={onClick}
                href={href}
                className={classNames('flex items-center justify-center border gap-2 cursor-pointer', {
                    [sizes[size]]: true,
                    [variants[variant]]: true,
                    [className || '']: className,
                })}
            >
                {leftIcon && (
                    <FontAwesomeIcon
                        icon={leftIcon}
                        className={classNames('', {
                            [iconSizes[size]]: true,
                        })}
                    />
                )}
                <span>{title}</span>
                {rightIcon && (
                    <FontAwesomeIcon
                        icon={rightIcon}
                        className={classNames('', {
                            [iconSizes[size]]: true,
                        })}
                    />
                )}
            </CustomButton>
        </WrapperAnimation>
    );
}
