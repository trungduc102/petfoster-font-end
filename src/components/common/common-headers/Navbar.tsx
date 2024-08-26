import classnames from 'classnames';
import { ButtonNavbar } from '@/components';
import { navbar } from '@/datas/header';
import React, { memo } from 'react';

export interface INavBarProps {
    isScroll: boolean;
}

function NavBar({ isScroll }: INavBarProps) {
    return (
        <ul
            className={classnames('h-navbar lg:flex hidden items-center gap-1', {
                'text-white': !isScroll,
                'text-[#111]': isScroll,
            })}
        >
            {navbar.map((nav) => {
                return (
                    <li key={nav.title}>
                        <ButtonNavbar isScroll={isScroll} contents={nav.title} href={nav.href} border={nav?.style?.border} />
                    </li>
                );
            })}
        </ul>
    );
}

export default memo(NavBar);
