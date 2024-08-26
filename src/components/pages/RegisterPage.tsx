'use client';
import { Button, FormControl, InputLabel, Grid, MenuItem, Typography, Box, Stack, AlertColor } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { ChangeEvent, FocusEvent, FormEvent, useState } from 'react';
import ContainerContent from '@/components/common/common-components/ContainerContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFacebook, faSquareGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { TextField, WrapperAnimation, Select, RoudedButton, SocialButton, LoadingPrimary, Notifycation } from '..';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Validate from '@/utils/validate';
import { RegisterFormData } from '@/configs/types';
import { register } from '@/apis/user';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { contants } from '@/utils/contants';
const initData = {
    username: '',
    gender: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export interface IRegisterPageProps {}

export default function RegisterPage(props: IRegisterPageProps) {
    const [form, setForm] = useState<RegisterFormData>(initData);
    const [errors, setErrors] = useState<RegisterFormData>(initData);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof RegisterFormData;

        if (dynamicKey === 'confirmPassword') {
            const { message } = Validate[dynamicKey](e.target.value, form.password);
            setErrors({
                ...errors,
                [dynamicKey]: message,
            });
            return;
        }

        const { message } = Validate[dynamicKey](e.target.value);
        setErrors({
            ...errors,
            [dynamicKey]: message,
        });
    };

    const validate = () => {
        let flag = false;
        const validateErrors: RegisterFormData = { ...initData };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof RegisterFormData;

            if (dynamic === 'confirmPassword') {
                const { message, error } = Validate[dynamic](form[dynamic], form.password);
                validateErrors[dynamic] = message;
                flag = error;
            } else {
                const { message, error } = Validate[dynamic](form[dynamic].toString());
                validateErrors[dynamic] = message;
                flag = error;
            }
        });

        setErrors(validateErrors);

        return flag;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        try {
            setLoading(true);
            const res = await register({ ...form, gender: Boolean(form.gender === 'Male') });
            setLoading(false);

            if (res.errors && Object.keys(res.errors).length > 0) {
                setErrors({
                    ...errors,
                    ...res.errors,
                });

                return;
            }

            toast.success('Register successfuly, please check your email to verify your account ❤️');
            router.push('/login');
        } catch (error) {
            setLoading(false);
            console.log('error in register page: ' + error);
            toast.error(contants.messages.errors.server);
        }
    };

    return (
        <ContainerContent className="pt-24">
            <Grid container sx={{ px: '10%' }} spacing={'20px'} component={'form'} onSubmit={handleSubmit}>
                <Grid item xs={12} md={12} lg={12} sx={{ mb: '2%' }}>
                    <div className="flex flex-col md:flex-row items-center md:justify-between w-full gap-4 md:gap-2">
                        <Typography variant="h3" fontSize={{ xs: 18, md: 22, lg: 32 }} fontWeight={600} className="uppercase text-[#4D4D4D]">
                            SIGN UP
                        </Typography>

                        <div className="w-full md:w-[60%] flex-col md:flex-row flex items-center justify-between gap-4">
                            <span className=" whitespace-nowrap ">Or sign in with</span>

                            <SocialButton mt="mt-0" title="Facebook" icon={faSquareFacebook} />
                            <SocialButton mt="mt-0" title="Google" background="#0D9488" icon={faSquareGooglePlus} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Stack spacing={'20px'}>
                        <TextField
                            onBlur={handleBlur}
                            message={errors.username}
                            id="username"
                            value={form.username}
                            name="username"
                            onChange={handleChange}
                            label="Username"
                            size="medium"
                        />

                        <Box sx={{ width: { xs: '100%', md: '60%', lg: '60%' } }}>
                            <TextField
                                onBlur={handleBlur}
                                message={errors.gender.toString()}
                                select
                                id="gender-select"
                                value={form.gender}
                                size="medium"
                                label="Gender"
                                name="gender"
                                onChange={handleChange}
                            >
                                <MenuItem value={'Female'} sx={{ fontSize: '14px !important' }}>
                                    Female
                                </MenuItem>
                                <MenuItem value={'Male'} sx={{ fontSize: '14px !important' }}>
                                    Male
                                </MenuItem>
                            </TextField>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Stack spacing={'20px'}>
                        <TextField
                            onBlur={handleBlur}
                            value={form.fullname}
                            message={errors.fullname}
                            name="fullname"
                            onChange={handleChange}
                            id="full-name"
                            label="Full Name"
                            size="medium"
                        />
                        <TextField onBlur={handleBlur} value={form.email} message={errors.email} name="email" onChange={handleChange} id="email" label="Email" size="medium" />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        onBlur={handleBlur}
                        value={form.password}
                        message={errors.password}
                        name="password"
                        onChange={handleChange}
                        type="password"
                        id="password"
                        label="Password"
                        size="medium"
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        onBlur={handleBlur}
                        message={errors.confirmPassword}
                        value={form.confirmPassword}
                        name="confirmPassword"
                        onChange={handleChange}
                        type="password"
                        id="confirm-password"
                        label="Password Confirm"
                        size="medium"
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ mt: '20px', fontSize: { xs: '12px', md: '13px', lg: '14px' } }}>
                            Already have an account?
                            <Link href={'/login'} className="text-blue-primary hover:underline ml-1">
                                Log in
                            </Link>
                        </Typography>

                        <RoudedButton type="submit" title={'SIGN UP'} />
                    </Box>
                </Grid>
            </Grid>

            {loading && <LoadingPrimary />}
        </ContainerContent>
    );
}
