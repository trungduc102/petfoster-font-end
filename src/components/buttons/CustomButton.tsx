'use client';
import React, { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { ValidTags } from '@/configs/types';

export interface IMainButtonProps {
    children: ReactNode;
    href?: string;
    className?: string;
    style?: CSSProperties;
    disable?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<HTMLAnchorElement>;
}

export default function CustomButton({ children, href = '', className, style, disable, onClick }: IMainButtonProps) {
    let Tag: ValidTags | typeof Link = 'button';
    if (href && href !== '') {
        Tag = Link;
    }
    return (
        <Tag onClick={onClick} disabled={disable} style={style} className={className} href={href}>
            {children}
        </Tag>
    );
}
