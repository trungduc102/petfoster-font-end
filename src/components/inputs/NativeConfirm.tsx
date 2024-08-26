'use client';
import React, { ReactNode, useState } from 'react';
import { Comfirm } from '..';
import WraperDialogComfirm from '../dialogs/WraperDialogComfirm';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

export interface INativeComfirmProps {
    title: string;
    subtitle?: ReactNode;
    onClose?: () => void;
    handleSubmit?: () => void;
}

export default function NativeComfirm({ title, subtitle, onClose, handleSubmit }: INativeComfirmProps) {
    const [openComfirm, setOpenComfirm] = useState({ open: true, comfirm: 'cancel' });

    const handleComfirm = () => {
        if (!handleSubmit) return;
        handleSubmit();
    };

    const handleClose = () => {
        setOpenComfirm({ ...openComfirm, open: false });

        if (!onClose) return;
        onClose();
    };

    return (
        <WraperDialogComfirm open={openComfirm.open} setOpen={setOpenComfirm} handleClose={handleClose}>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography variant="button" sx={{ textTransform: 'capitalize' }}>
                        {subtitle}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setOpenComfirm({ ...openComfirm, comfirm: 'cancel' });
                        handleClose();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setOpenComfirm({ ...openComfirm, comfirm: 'ok' });
                        handleComfirm();
                        handleClose();
                    }}
                >
                    Ok
                </Button>
            </DialogActions>
        </WraperDialogComfirm>
    );
}
