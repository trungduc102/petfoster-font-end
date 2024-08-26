'use client';
import React, { useState } from 'react';
import WraperDialog from './WraperDialog';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { TextArea, WrapperAnimation } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Validate from '@/utils/validate';
import { motion, AnimatePresence } from 'framer-motion';
import { contants } from '@/utils/contants';

export interface ICustomReasonDialogProps {
    handleAfterClickSend?: (reason: string) => void;
    onClose?: () => void;
    reasons: string[];
    label?: string;
}

export default function CustomReasonDialog({ reasons, label = 'Tell them the reason for the cancellation', handleAfterClickSend, onClose }: ICustomReasonDialogProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [reason, setReason] = useState('');
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickSend = () => {
        if (!handleAfterClickSend) return;

        if (validate()) return;

        handleAfterClickSend(reason);
        handleClose();
    };

    const handleClose = () => {
        setIsOpen(false);

        if (!onClose) return;
        onClose();
    };

    const validate = () => {
        if (Validate.isBlank(reason)) {
            setError(true);
            return true;
        } else {
            setError(false);
            return false;
        }
    };

    const handleChooseReason = (item: string, index: number) => {
        if (index === reasons.length - 1) {
            setReason('');
            setOpen(true);
            return;
        } else {
            setOpen(false);
        }
        setReason(item);
    };

    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '18px',
                },
            }}
            setOpen={setIsOpen}
            open={isOpen}
        >
            <div className="py-6 px-8 relative overflow-hidden">
                <h4 className="text-xl text-[#303B4E] font-semibold text-center mb-5 uppercase">{label}</h4>

                <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
                    {reasons.map((item, index) => {
                        return <FormControlLabel onClick={() => handleChooseReason(item, index)} key={item} value={item} control={<Radio />} label={item} />;
                    })}

                    <AnimatePresence>
                        {open && (
                            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="">
                                <TextArea autoFocus placeholder="write your reason..." className="w-full" value={reason} onChange={(e) => setReason(e.target.value)} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && <span className="text-xs text-red-primary">{contants.messages.review.whenEmptyReason}</span>}
                </RadioGroup>

                <div className="w-full flex items-center justify-center mt-5">
                    <WrapperAnimation
                        onClick={handleClickSend}
                        hover={{}}
                        className="flex items-center justify-center text-white bg-[#666666] rounded-lg py-1 px-10 uppercase font-medium"
                    >
                        <span>Send</span>
                    </WrapperAnimation>
                </div>

                <WrapperAnimation onClick={handleClose} hover={{}} className="absolute top-0 right-0 flex items-center justify-center text-lg py-3 px-4 cursor-pointer">
                    <FontAwesomeIcon icon={faXmark} />
                </WrapperAnimation>
            </div>
        </WraperDialog>
    );
}
