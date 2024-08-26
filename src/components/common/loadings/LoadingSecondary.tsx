import { CircularProgress } from '@mui/material';
import classNames from 'classnames';
import React from 'react';

export interface ILoadingSecondaryProps {
    defaultStyle?: boolean;
    className?: string;
    color?: string;
}

export default function LoadingSecondary({ defaultStyle = false, className = '', color = '#86EFAC' }: ILoadingSecondaryProps) {
    return (
        <div
            className={classNames('w-full h-full flex items-center justify-center ', {
                ['min-h-[400px]']: defaultStyle,
                [className]: className,
            })}
        >
            <CircularProgress sx={{ color }} />
        </div>
    );
}
