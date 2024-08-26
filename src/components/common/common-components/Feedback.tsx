'use client';
import React, { ChangeEvent, FocusEvent, FormEvent, useState } from 'react';
import { InputLabel, TextField as Tx, TextareaAutosize, styled } from '@mui/material';
import { BoxTitle, LoadingSecondary, MainButton, TextArea, TextField } from '@/components';
import Image from 'next/image';
import { IFeedBackRequest } from '@/configs/interface';
import Validate from '@/utils/validate';
import { sendFeedback } from '@/apis/app';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { donationMethod } from '@/datas/donation';

const initData = {
    fullname: '',
    email: '',
    message: '',
    phone: '',
} as IFeedBackRequest;

export interface IDonationComProps {
    className?: string;
}

export default function DonationCom({ className }: IDonationComProps) {
    const [form, setForm] = useState<IFeedBackRequest>({ ...initData });
    const [errors, setErrors] = useState<IFeedBackRequest>({ ...initData });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        try {
            setLoading(true);
            const response = await sendFeedback(form);

            if (!response || response.errors) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            toast.success('Your feedback has been sent. We will respond as soon as possible. Thank you for your interest ❤️');
            setForm({ ...initData });
        } catch (error) {
            toast.warn(contants.messages.errors.server);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const dynamicKey = e.target.name as keyof IFeedBackRequest;

        const { message } = Validate[dynamicKey](e.target.value);
        setErrors({
            ...errors,
            [dynamicKey]: message,
        });
    };

    const validate = () => {
        let flags: boolean[] = [];
        const validateErrors: IFeedBackRequest = { ...initData };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof IFeedBackRequest;

            const { message, error } = Validate[dynamic](form[dynamic].toString());
            validateErrors[dynamic] = message;
            flags.push(error);
        });

        setErrors(validateErrors);

        return flags.some((item) => item);
    };

    return (
        <BoxTitle className={className} title="FEEDBACK & SUPPORT US">
            <div className="w-full gap-[90px] grid grid-cols-1 lg:grid-cols-2 max-w-[100%]">
                <div className="w-full flex justify-center lg:justify-end">
                    <form onSubmit={handleSubmit} className="max-w-[505px] w-full bg-[#F8F6FC] px-9 py-8 rounded-2xl text-black-main shadow-primary relative overflow-hidden">
                        <h3 className="text-green-5FA503 font-semibold text-center text-2xl mb-3">{'give us a feedback'.toLocaleUpperCase()}</h3>
                        <p className="text-sm mb-7">If you have any question or feedback, please send a message for us by submit a form below:</p>
                        <div className="flex flex-col justify-between gap-[22px]">
                            <div className="flex flex-col justify-between gap-2">
                                <InputLabel>Full name: </InputLabel>
                                <TextField
                                    value={form.fullname}
                                    message={errors.fullname}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    id="fullname"
                                    name="fullname"
                                    fullWidth
                                    size="small"
                                />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <InputLabel>Phone number: </InputLabel>
                                <TextField
                                    value={form.phone}
                                    message={errors.phone}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    id="phone-number"
                                    name="phone"
                                    fullWidth
                                    size="small"
                                />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <InputLabel>Email: </InputLabel>
                                <TextField value={form.email} message={errors.email} onBlur={handleBlur} onChange={handleChange} id="email" name="email" fullWidth size="small" />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <InputLabel>Message: </InputLabel>
                                <TextArea value={form.message} message={errors.message} onBlur={handleBlur} onChange={handleChange} id="message" name="message" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center w-full">
                            <MainButton width={'208px'} title="send" className="mt-8" />
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-black-040 w-full h-full">
                                <LoadingSecondary />
                            </div>
                        )}
                    </form>
                </div>
                <div className="w-full flex-col flex items-center justify-center lg:items-start lg:justify-center">
                    <h3 className="text-green-5FA503 font-semibold text-2xl mb-8 text-center lg:text-left w-full">{'or donate via'.toLocaleUpperCase()}</h3>
                    <ul className="relative max-w-[552px] w-full bg-[#F8F6FC] rounded-2xl text-black-main shadow-primary py-16 px-9 md:px-20 flex flex-col gap-11">
                        {donationMethod.map((item) => {
                            return (
                                <li key={item.image} className="grid grid-cols-2 gap-2 items-center">
                                    <div className="relative w-[50%] h-[96px]">
                                        <Image fill src={item.image} className="object-contain" alt="tp-bank" />
                                    </div>
                                    <div className="text-1xl text-black-main flex-1">
                                        <span>{item.name}</span>
                                        <p className="mt-1">{item.bankNumber}</p>
                                    </div>
                                </li>
                            );
                        })}

                        {/* <li className="grid grid-cols-2 gap-2 items-center">
                            <div className="relative w-[50%] h-[96px]">
                                <Image fill src={'/icons/tp-bank.svg'} className="object-contain" alt="tp-bank" />
                            </div>
                            <div className="text-1xl text-black-main flex-1">
                                <span>Nguyễn Thị Lam Hà</span>
                                <p className="mt-1">03872866101</p>
                            </div>
                        </li>
                        <li className="grid grid-cols-2 items-center">
                            <div className="relative w-[50%] h-[96px]">
                                <Image fill src={'/icons/qr.jpg'} className="object-contain" alt="tp-bank" />
                            </div>
                            <div className="text-1xl text-black-main flex-1">
                                <span>QR VP Bank</span>
                                <p className="mt-1">Phạm Trung Đức</p>
                            </div>
                        </li>
                        <li className="grid grid-cols-2 items-center">
                            <div className="relative w-[50%] h-[96px]">
                                <Image fill src={'/icons/papal.svg'} className="object-contain" alt="tp-bank" />
                            </div>
                            <div className="text-1xl text-black-main flex-1">
                                <span>PetFoster</span>
                                <p className="mt-1">petfoster@gmail.com</p>
                            </div>
                        </li> */}

                        <div className="absolute w-[127px] h-[135px] top-[-20%] right-0">
                            <Image src={'/icons/cat-cute.svg'} fill alt="cat-cute" />
                        </div>
                    </ul>
                </div>
            </div>
        </BoxTitle>
    );
}
