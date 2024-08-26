import { CircularProgress } from '@mui/material';
import classNames from 'classnames';
import * as React from 'react';

export interface IMiniLoadingProps {
    size?: string;
    className?: string;
    color?: string;
}

export default function MiniLoading({ size = '20px', className, color = '#86EFAC' }: IMiniLoadingProps) {
    return (
        <div
            className={classNames('', {
                ['w-full h-full flex items-center justify-center  min-h-[60px]']: !className,
                [className || '']: className,
            })}
        >
            <CircularProgress sx={{ color: color }} size={size} />
        </div>
    );
}
