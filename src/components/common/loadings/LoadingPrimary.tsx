import { Backdrop, CircularProgress } from '@mui/material';
import * as React from 'react';

export interface ILoadingPrimaryProps {
    color?: string;
}

export default function LoadingPrimary({ color = '#86EFAC' }: ILoadingPrimaryProps) {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: 999 }} open={true}>
            <CircularProgress sx={{ color }} />
        </Backdrop>
    );
}
