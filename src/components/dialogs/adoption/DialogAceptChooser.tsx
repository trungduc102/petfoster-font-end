'use client';
import React, { ChangeEvent, ReactNode, useState } from 'react';
import WraperDialog from '../WraperDialog';
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { TextArea, TextField, WrapperAnimation } from '../..';
import Validate from '@/utils/validate';
import { changeDataAdoptionReasons } from '@/datas/reason';
import { contants } from '@/utils/contants';
import { motion, AnimatePresence } from 'framer-motion';

export interface IDialogAceptChooserProps {
    iniData?: string;
    className?: string;
    onDatas?: (dates: string, reason?: string) => void;
    title?: string;
    label?: ReactNode | string;
    isShowreason?: boolean;
    id?: number;
}

export default function DialogAceptChooser({ className, id, label, title = 'Choose date you want to show on table', iniData, isShowreason, onDatas }: IDialogAceptChooserProps) {
    const [dates, setDates] = useState<string | undefined>(iniData);
    const [message, setMessage] = useState('');

    const [reason, setReason] = useState('');
    const [error, setError] = useState(false);
    const [openReason, setOpenReason] = useState(false);

    const [open, setOpen] = useState(false);
    const handleChangeDate = (e: ChangeEvent<HTMLInputElement>) => {
        setDates(e.target.value);
    };

    const handleOk = () => {
        if (!onDatas || validate()) return;

        if (isShowreason && validateReason()) return;

        console.log(dates);

        if (isShowreason) {
            onDatas(dates || '', reason);
        } else {
            onDatas(dates || '');
        }

        setOpen(false);
    };

    const validate = () => {
        const { message, error } = Validate.date(dates || '');

        setMessage(message);

        return error;
    };

    const validateReason = () => {
        if (Validate.isBlank(reason)) {
            setError(true);
            return true;
        } else {
            setError(false);
            return false;
        }
    };

    const handleChooseReason = (item: string, index: number) => {
        if (index === changeDataAdoptionReasons.length - 1) {
            setReason('');
            setOpenReason(true);
            return;
        } else {
            setOpenReason(false);
        }
        setReason(item);
    };

    return (
        <div className="">
            <div className={className} onClick={() => setOpen((prev) => !prev)}>
                {label}
            </div>

            <WraperDialog open={open} setOpen={setOpen}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Stack spacing={'10px'}>
                        <div className="flex-1">
                            <TextField message={message} value={dates || ''} type="date" name="date" onChange={handleChangeDate} fullWidth size="small" />
                        </div>
                    </Stack>

                    {id && (
                        <div className="mt-3">
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Have 3 same request. Are you want to cancel all other request ?" />
                        </div>
                    )}
                    {isShowreason && (
                        <div className="mt-3">
                            <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
                                {changeDataAdoptionReasons.map((item, index) => {
                                    return <FormControlLabel onClick={() => handleChooseReason(item, index)} key={item} value={item} control={<Radio />} label={item} />;
                                })}

                                <AnimatePresence>
                                    {openReason && (
                                        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="">
                                            <TextArea autoFocus placeholder="write your reason..." className="w-full" value={reason} onChange={(e) => setReason(e.target.value)} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {error && <span className="text-xs text-red-primary">{contants.messages.review.whenEmptyReason}</span>}
                            </RadioGroup>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleOk()}>Ok</Button>
                </DialogActions>
            </WraperDialog>
        </div>
    );
}
