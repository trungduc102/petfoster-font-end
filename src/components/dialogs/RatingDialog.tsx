/* eslint-disable @next/next/no-img-element */
'use client';
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import WraperDialog from './WraperDialog';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Rating, capitalize } from '@mui/material';
import { TextArea } from '..';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEm } from '@fortawesome/free-regular-svg-icons';
import { DetailOrderHistoryContext } from '../pages/orther-histories/DetailOrderHistoryPage';
import { IDataReview, IProductDetailOrders } from '@/configs/interface';
import Validate from '@/utils/validate';
import { createReview } from '@/apis/user';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import firebaseService from '@/services/firebaseService';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';

export interface IRatingDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: IProductDetailOrders;
}

export default function RatingDialog({ open, data, setOpen }: IRatingDialogProps) {
    const context = useContext(DetailOrderHistoryContext);

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const [form, setForm] = useState<IDataReview>({
        content: '',
        star: 0,
    });

    const [errors, setErrors] = useState<string | null>(null);

    const handleValidate = () => {
        const { error, message } = Validate.review(form);

        setErrors(message);

        return error;
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setForm({ ...form, content: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (handleValidate()) return;
        console.log(form, data.id, context.data?.id);

        try {
            const response = await createReview({
                ...form,
                productId: data.id as string,
                orderId: context.data?.id as number,
            });

            if (!response) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            if (response.status !== 200) {
                toast.error(capitalize(response.message));
                return;
            }

            context.refetch();
            setOpen(false);
            toast.success(contants.messages.success.review);

            if (!user) return;

            await firebaseService.publistRatingProductNotification(data, user?.username);
        } catch (error) {
            toast.warn(contants.messages.errors.server);
        }
    };

    return (
        <WraperDialog open={open} setOpen={setOpen}>
            <DialogTitle
                sx={{
                    py: '20px',
                }}
                textAlign={'center'}
            >
                {'YOUR OPINION MATTERS TO US!'}
            </DialogTitle>
            <DialogContent
                sx={{
                    minWidth: { xs: '100%', md: '520px', lg: '520px' },
                }}
            >
                <form onSubmit={handleSubmit} className="w-full h-full flex flex-col items-center gap-4 ">
                    <div className="h-[140px] overflow-hidden">
                        <img className="w-full h-full object-contain" src={data.image} alt={data.image} />
                    </div>

                    <h5>How was quality of the product ?</h5>
                    <Rating
                        name="read-only"
                        value={form.star}
                        onChange={(event, newValue) => {
                            setForm({ ...form, star: newValue || 0 });
                        }}
                        icon={
                            <span className="text-[30px] mx-2">
                                <FontAwesomeIcon icon={faStar} />
                            </span>
                        }
                        emptyIcon={
                            <span className="text-[30px] mx-2">
                                <FontAwesomeIcon icon={faStarEm} />
                            </span>
                        }
                    />
                    <TextArea
                        spellCheck={false}
                        value={form.content}
                        onChange={handleChange}
                        rounded="rounded-[18px]"
                        className="w-[90%] mt-9 mb-6 mx-6 text-sm"
                        placeholder="Leave a comment here if you want"
                    />
                    {errors && <span className="text-red-primary text-xs">{errors}</span>}

                    <motion.button
                        whileTap={{
                            scale: 0.9,
                        }}
                        whileHover={{
                            y: -4,
                        }}
                        className="bg-[#F87171] py-[8px] max-w-[138px] px-[34px] text-white font-medium rounded-lg mt-5 uppercase min-w-[180px]"
                    >
                        Rate
                    </motion.button>
                </form>
            </DialogContent>
            <DialogActions
                onClick={() => setOpen(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: '20px',
                }}
            >
                <span className="text-cente text-[#989898] cursor-pointer">Maybe later</span>
            </DialogActions>
        </WraperDialog>
    );
}
