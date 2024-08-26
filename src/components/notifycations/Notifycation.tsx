import { Alert, AlertColor, Snackbar, SnackbarCloseReason } from '@mui/material';
import * as React from 'react';

export interface INotifycationProps {
    title: string;
    autohide?: number;
    open: boolean;
    type?: AlertColor;
    plament?: {
        vertical: 'top' | 'bottom';
        horizontal: 'center' | 'left' | 'right';
    };
    onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

export default function Notifycation({ title, autohide = 4000, open, type = 'success', plament = { vertical: 'bottom', horizontal: 'right' }, onClose }: INotifycationProps) {
    return (
        <Snackbar anchorOrigin={plament} onClose={onClose} open={open} autoHideDuration={autohide}>
            <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
                {title}
            </Alert>
        </Snackbar>
    );
}
