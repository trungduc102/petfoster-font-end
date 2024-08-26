'use client';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { MainButton, SocialButton } from '..';
import dynamic from 'next/dynamic';
import { contants } from '@/utils/contants';
import { dataURLtoFile } from '@/utils/format';
import WraperDialog from '../dialogs/WraperDialog';

const AvatarEditor = dynamic(() => import('react-avatar-edit'), { ssr: false });

export interface IAvatarEditProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    onComfirm?: (value: 'ok' | 'cancel') => void;
    onAvartar?: (avartar: string | null) => void;
}

export default function AvatarEdit({ open, setOpen, onComfirm, onAvartar }: IAvatarEditProps) {
    const [confirm, setConfirm] = useState<'ok' | 'cancel'>('cancel');
    // state
    const [preview, setPreview] = useState('');

    const handleClose = () => {
        setOpen(false);
        setPreview('');
        setConfirm('cancel');
    };

    const handleCloseEditor = () => {
        setPreview('');
    };

    const handleCrop = (e: string) => {
        setPreview(e);
    };

    const handleSubmit = () => {
        setConfirm('ok');
        setOpen(false);
        if (!onAvartar) return;

        onAvartar(preview || null);
    };

    useEffect(() => {
        if (!onComfirm) return;
        onComfirm(confirm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirm]);

    useEffect(() => {}, [preview]);
    return (
        <WraperDialog open={open} setOpen={setOpen}>
            <DialogTitle id="alert-dialog-title">{'Select Your Avatar'}</DialogTitle>
            <DialogContent>
                <AvatarEditor
                    width={390}
                    height={295}
                    onCrop={handleCrop}
                    onClose={handleCloseEditor}
                    // onBeforeFileLoad={onBeforeFileLoad}
                />

                <div className="flex items-center justify-end">
                    <Stack direction={'row'} width={'80%'} gap={'10px'} justifyContent={'flex-end'}>
                        <SocialButton onClick={handleClose} title="Cancel" background="#EF4444" />
                        <SocialButton onClick={handleSubmit} title="OK" background="#65A30D" />
                    </Stack>
                </div>
            </DialogContent>
        </WraperDialog>
    );
}
