import { ValidTags } from '@/configs/types';
import Link from 'next/link';
import React, { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface ICustomDynamicComProps {
    children: ReactNode;
    href?: string;
    className?: string;
    style?: CSSProperties;
    onClick?: MouseEventHandler<HTMLDivElement> & MouseEventHandler<HTMLAnchorElement>;
}

export default function CustomDynamicCom({ children, href = '', ...props }: ICustomDynamicComProps) {
    let Tag: ValidTags | typeof Link = 'div';

    if (href && href !== '') {
        Tag = Link;
    }
    return (
        <Tag href={href} {...props}>
            {children}
        </Tag>
    );
}
