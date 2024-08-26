'use client';
import React, { ChangeEvent, FocusEvent, FormEvent, FormEventHandler, InputHTMLAttributes, useEffect, useState } from 'react';
import { BoxSign, LoadingPrimary, SocialButton, TextField, WrapperAnimation } from '@/components';
import { ContainerContent } from '@/components/common';
import { faSquareFacebook, faSquareGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import Validate from '@/utils/validate';
import { resetPassword, verifyAndSendNewPasswordToEmail } from '@/apis/user';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { pushNoty } from '@/redux/slice/appSlice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { links } from '@/datas/links';
import { contants } from '@/utils/contants';
export interface IResetPasswordProps {}

export default function ResetPassword(props: IResetPasswordProps) {
    // router
    const router = useRouter();

    // pathname
    const searchParam = useSearchParams();

    const [loading, setloading] = useState(false);

    const [email, setEmail] = useState('');

    const [error, setError] = useState('');

    const validate = () => {
        let flag = false;

        const { message, error } = Validate.email(email);

        if (error) {
            setError(message);
            flag = error;
        } else {
            setError('');
        }

        return flag;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        try {
            setloading(true);
            const response = await resetPassword(email);
            setloading(false);
            if (!response.data) {
                if (response.status === 404) {
                    setError(response.message);
                    return;
                }

                const errorMess = response.errors as { email: string };
                setError(errorMess.email);

                return;
            }

            toast.success(`Please check your email`);

            // router.push(links.auth.login);
        } catch (error) {
            setloading(false);

            toast.error(contants.messages.errors.server);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        validate();
    };

    useEffect(() => {
        (async () => {
            if (!searchParam) return;

            const code = searchParam.get('code');

            if (!code) return;

            try {
                setloading(true);
                const response = await verifyAndSendNewPasswordToEmail(code);
                setloading(false);
                if (!response || response.errors || !response.data) {
                    toast.warn(contants.messages.errors.handle);
                    return;
                }

                toast.success(`Your new password has been sent. Please check your email`);
                router.push(links.auth.login);
            } catch (error) {
                toast.warn(contants.messages.errors.handle);
                setloading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam]);
    return (
        <BoxSign showForgot={false} title="RESET PASSWORD" onSubmit={handleSubmit}>
            <Typography
                variant="subtitle1"
                fontSize={{ xs: 12, md: 13, lg: 14 }}
                className=" text-[#6C6C6C]"
                sx={{
                    mb: '20px',
                    mt: '-26px',
                }}
            >
                {"Just enter your email address below and we'll send you a link to reset your password!"}
            </Typography>

            <TextField message={error} onBlur={handleBlur} value={email} onChange={handleChange} type="email" name="email" label={'Email'} size="small" fullWidth />

            {loading && <LoadingPrimary />}
        </BoxSign>
    );
}
