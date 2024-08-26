import classNames from 'classnames';
import React, { ReactNode } from 'react';

export interface IBoxPostProps {
    title: string;
    children: ReactNode;
    className?: string;
    options?: {
        captialize?: boolean;
        tracking?: string;
    };
}

export default function BoxPost({ children, title, className, options = { captialize: true, tracking: 'tracking-widest' } }: IBoxPostProps) {
    return (
        <div
            className={classNames('text-post-primary', {
                [className || '']: className,
            })}
        >
            <h2
                className={classNames('font-bold text-3xl', {
                    ['uppercase']: options.captialize,
                    [options.tracking || '']: true,
                })}
            >
                {title}
            </h2>
            <div className="w-full">{children}</div>
        </div>
    );
}
