'use client';
import React, { ChangeEvent, useState } from 'react';
import WraperDialog from './WraperDialog';
import { Button, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { TextField, WrapperAnimation } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

type DialogDateChooserType = { start: string | undefined; end: string | undefined };

const iniData = { start: undefined, end: undefined };

export interface IDialogDateChooserProps {
    className?: string;
    onDatas?: (dates: DialogDateChooserType) => void;
    label?: string;
}

export default function DialogDateChooser({ className, label = 'CHOOSE DATE', onDatas }: IDialogDateChooserProps) {
    const [dates, setDates] = useState<DialogDateChooserType>(iniData);
    const [open, setOpen] = useState(false);
    const handleChangeDate = (e: ChangeEvent<HTMLInputElement>) => {
        setDates({
            ...dates,
            [e.target.name]: e.target.value,
        });
    };

    const handleClose = (type: 'ok' | 'cancel') => {
        if (type === 'ok' && onDatas) {
            onDatas(dates);
        }

        setOpen(false);
    };

    return (
        <div className="">
            <span
                onClick={() => setOpen((prev) => !prev)}
                className={classNames('text-violet-primary font-medium text-right cursor-pointer hover:underline', {
                    [className || '']: className,
                })}
            >
                {label}
            </span>

            <WraperDialog open={open} setOpen={setOpen}>
                <DialogTitle>{'Choose date you want to show on table'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={'10px'} mb={'20px'}>
                        <div className="flex items-center justify-between">
                            <span>Start Date</span>
                            <WrapperAnimation
                                onClick={() =>
                                    setDates({
                                        start: undefined,
                                        end: undefined,
                                    })
                                }
                                hover={{}}
                            >
                                <FontAwesomeIcon className="text-violet-primary cursor-pointer" icon={faRefresh} />
                            </WrapperAnimation>
                        </div>
                        <div className="flex-1">
                            <TextField value={dates.start || ''} type="date" onChange={handleChangeDate} fullWidth name="start" size="small" />
                        </div>
                    </Stack>
                    <Stack spacing={'10px'}>
                        <div>Start Date</div>
                        <div className="flex-1">
                            <TextField value={dates.end || ''} type="date" name="end" onChange={handleChangeDate} fullWidth size="small" />
                        </div>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose('cancel')}>Cancel</Button>
                    <Button onClick={() => handleClose('ok')}>Ok</Button>
                </DialogActions>
            </WraperDialog>
        </div>
    );
}
