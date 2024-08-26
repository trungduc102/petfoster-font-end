'use client';
import { ImportExport } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import WraperDialog from '../dialogs/WraperDialog';
import WraperDialogComfirm from '../dialogs/WraperDialogComfirm';

export interface IComfirmProps {
    open: boolean;
    title: string | ReactNode;
    subtitle?: string | ReactNode;
    setOpen: (value: { open: boolean; comfirm: 'ok' | 'cancel' }) => void;
    onComfirm?: (value: { open: boolean; comfirm: 'ok' | 'cancel' }) => void;
    onClose?: () => void;
}

export default function Comfirm({ title, open, subtitle = 'You want to delete this product ?', setOpen, onComfirm, onClose }: IComfirmProps) {
    const [confirm, setConfirm] = useState<{
        open: boolean;
        comfirm: 'ok' | 'cancel';
    }>({ open: false, comfirm: 'cancel' });

    const handleClose = () => {
        setOpen({ ...confirm, open: false });
        if (!onClose) return;
        onClose();
    };

    useEffect(() => {
        if (!onComfirm) return;
        onComfirm(confirm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirm]);

    return (
        <div>
            <WraperDialogComfirm open={open} setOpen={setOpen} handleClose={handleClose}>
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
                            setConfirm({ ...confirm, comfirm: 'cancel' });
                            handleClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setConfirm({ ...confirm, comfirm: 'ok' });
                            handleClose();
                        }}
                    >
                        Ok
                    </Button>
                </DialogActions>
            </WraperDialogComfirm>
        </div>
    );
}
