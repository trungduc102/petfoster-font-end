import styles from './styles/hand-cat-button.module.css';
import React, { MouseEventHandler, ReactNode } from 'react';
import classNames from 'classnames';
import { CustomButton } from '..';

export interface IHandCatButtonProps {
    size?: string;
    title: ReactNode;
    disable?: boolean;
    active?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<HTMLAnchorElement>;
    href?: string;
}

export default function HandCatButton({ size, title, disable, active, href, onClick }: IHandCatButtonProps) {
    return (
        <CustomButton
            onClick={disable ? undefined : onClick}
            disable={disable}
            style={size ? ({ '--height': size, display: 'block' } as React.CSSProperties) : undefined}
            className={classNames('', {
                [styles['hand-cat-btn']]: true,
                [styles['active']]: active,
            })}
        >
            <span
                className={classNames('', {
                    [styles['hand-cat-btn-text']]: true,
                    'text-gray-400': disable,
                })}
            >
                {title}
            </span>
        </CustomButton>
    );
}
