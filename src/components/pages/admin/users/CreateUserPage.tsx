'use client';
import { faChevronDown, faChevronUp, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import style from './styles/createorupdate.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Button, Grid, Stack } from '@mui/material';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, FocusEvent, FormEvent, useState } from 'react';
import { contants } from '@/utils/contants';
import { AvartarEdit, DivTextfield, LoadingPrimary, TextField } from '@/components';
import moment from 'moment';
import Validate from '@/utils/validate';
import { IUserManage } from '@/configs/interface';
import { createUserManage } from '@/apis/admin/user';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { links } from '@/datas/links';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RoleType, RootState } from '@/configs/types';

export interface ICreateOrUpdateUserProps {
    param: string | 'create';
}

interface IErrors {
    username: string;
    fullname: string;
    birthday: string;
    phone: string;
    avatar: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const initdata: IUserManage & { confirmPassword: string } = {
    id: '',
    username: '',
    fullname: '',
    birthday: '',
    gender: true,
    phone: '',
    avatar: '',
    email: '',
    role: 'ROLE_USER',
    createAt: '',
    active: true,
    password: '',
    confirmPassword: '',
};

const initdataErrors: IErrors = {
    username: '',
    fullname: '',
    birthday: '',
    phone: '',
    avatar: '',
    email: '',
    password: '',
    confirmPassword: '',
};
export default function CreateUser({ param }: ICreateOrUpdateUserProps) {
    const router = useRouter();

    // redux

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const [avartar, setAvartar] = useState(contants.avartarDefault);
    const [openEditor, setOpenEditor] = useState(false);
    const [openPassword, setOpenPassword] = useState(param === 'create');
    const [errors, setErrors] = useState({ ...initdataErrors });
    const [data, setData] = useState(initdata);
    const [loading, setLoading] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof IErrors;

        if (dynamicKey === 'confirmPassword') {
            const { message } = Validate[dynamicKey](e.target.value, data.password);
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
        const validateErrors: IErrors = { ...initdataErrors };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof IErrors;

            if (dynamic === 'confirmPassword') {
                const { message, error } = Validate[dynamic](data[dynamic], data.password);
                validateErrors[dynamic] = message;
                flag = error;
            } else {
                const { message, error } = Validate[dynamic](data[dynamic].toString());
                validateErrors[dynamic] = message;
                flag = error;
            }
        });

        flag = Object.values(validateErrors).some((item) => {
            return item.length > 1;
        });

        setErrors(validateErrors);

        return flag;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        try {
            setLoading(true);
            const response = await createUserManage({ ...data, avatar: avartar });
            setLoading(false);

            if (response.errors && response.status === 501) {
                setErrors({
                    ...errors,
                    ...(response.errors as unknown as IErrors),
                });
                return;
            }

            if (response.errors) {
                toast.error(response.message);
                return;
            }

            router.push(links.admin + 'users');
            toast.success(response.message);
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    return (
        <div>
            <Grid container spacing={4} component={'form'} onSubmit={handleSubmit}>
                <Grid item xs={12} md={12} lg={12}>
                    <div className="flex items-end justify-between select-none">
                        <div className="flex items-center w-full gap-6">
                            <div
                                className={classNames('relative rounded-full overflow-hidden', {
                                    [style['avatar']]: true,
                                })}
                            >
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                    }}
                                    alt="avatar"
                                    src={avartar || contants.avartarDefault}
                                />

                                <div
                                    onClick={() => setOpenEditor(true)}
                                    className={classNames(
                                        'absolute bg-[rgba(0,0,0,.4)] inset-0 flex items-center justify-center text-white transition-all ease-linear cursor-pointer',
                                        {
                                            [style['avatar-backdrop']]: true,
                                        },
                                    )}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </div>
                            </div>

                            <div className="text-xl font-semibold text-black-main">
                                <h2>{data.username || 'khavt'}</h2>
                                <div className="text-xs text-gray-400 font-normal mt-1 flex flex-col gap-[2px]">
                                    <p>active: true</p>
                                    <span className="">created: {moment(new Date().getTime()).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                        {param !== 'create' && (
                            <div
                                onClick={() => setOpenPassword(!openPassword)}
                                className="text-blue-primary text-sm whitespace-nowrap hover:underline cursor-pointer flex gap-2 items-center"
                            >
                                <span>Show password</span>
                                <FontAwesomeIcon icon={!openPassword ? faChevronDown : faChevronUp} />
                            </div>
                        )}
                    </div>
                </Grid>
                {param === 'create' && (
                    <Grid item xs={12} md={12} lg={12}>
                        <DivTextfield
                            propsInput={{
                                name: 'username',
                                placeholder: 'khavt',
                                onChange: handleChange,
                                onBlur: handleBlur,
                                value: data.username,
                                message: errors.username,
                            }}
                            label="Username"
                        />
                    </Grid>
                )}

                <Grid item xs={12} md={6} lg={6}>
                    <div className="flex flex-col gap-[40px]">
                        <DivTextfield
                            propsInput={{
                                name: 'fullname',
                                type: 'fullname',
                                placeholder: 'Võ Thanh Kha',
                                onChange: handleChange,
                                onBlur: handleBlur,
                                value: data.fullname,
                                message: errors.fullname,
                            }}
                            label="Fullname"
                        />
                        <DivTextfield
                            propsInput={{
                                name: 'phone',
                                type: 'phone',
                                placeholder: '0344507492',
                                onChange: handleChange,
                                onBlur: handleBlur,
                                value: data.phone,
                                message: errors.phone,
                            }}
                            label="Phone"
                        />
                        <DivTextfield
                            propsInput={{
                                name: 'email',
                                type: 'email',
                                placeholder: 'kha@gmail.com',
                                onChange: handleChange,
                                onBlur: handleBlur,
                                value: data.email,
                                message: errors.email,
                            }}
                            label="Email"
                        />
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <div className="flex flex-col gap-[40px]">
                        <DivTextfield
                            dataSelect={[
                                {
                                    id: 'true',
                                    name: 'Male',
                                },
                                {
                                    id: 'false',
                                    name: 'Female',
                                },
                            ]}
                            propsInput={{
                                name: 'gender',
                                onChange: handleChange,
                                value: data.gender + '',
                            }}
                            label="Gender"
                        />
                        <DivTextfield
                            dataSelect={[
                                {
                                    id: 'ROLE_USER',
                                    name: 'User',
                                },
                                {
                                    id: 'ROLE_ADMIN',
                                    name: 'Admin',
                                },
                            ]}
                            propsInput={{
                                name: 'role',
                                onChange: handleChange,
                                value: data.role,
                                disabled: (user?.role as RoleType) !== 'ROLE_SUPER',
                            }}
                            label="Role"
                        />
                        <DivTextfield
                            propsInput={{
                                name: 'birthday',
                                type: 'date',
                                onChange: handleChange,
                                onBlur: handleBlur,
                                value: data.birthday,
                                message: errors.birthday,
                            }}
                            label="Birthday"
                        />
                    </div>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <AnimatePresence>
                        {openPassword && (
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                exit={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="relative flex justify-between items-center gap-[32px] pb-8"
                            >
                                <DivTextfield
                                    showEye={true}
                                    propsInput={{
                                        name: 'password',
                                        type: 'password',
                                        placeholder: 'Your password',
                                        onChange: handleChange,
                                        onBlur: handleBlur,
                                        value: data.password,
                                        message: errors.password,
                                    }}
                                    label="Password"
                                />
                                <DivTextfield
                                    showEye={true}
                                    propsInput={{
                                        name: 'confirmPassword',
                                        type: 'password',
                                        placeholder: 'Comfirm password',
                                        onChange: handleChange,
                                        onBlur: handleBlur,
                                        value: data.confirmPassword,
                                        message: errors.confirmPassword,
                                    }}
                                    label="Comfirm Password"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    sx={{
                        pt: '0px !important',
                    }}
                ></Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Stack direction={'row'} justifyContent={'flex-end'}>
                        <Button type="submit" variant="contained">
                            {param !== 'create' ? 'Update' : 'Create'}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <AvartarEdit
                setOpen={setOpenEditor}
                onAvartar={(avatar) => {
                    setAvartar(avatar || contants.avartarDefault);
                }}
                open={openEditor}
            />

            {loading && <LoadingPrimary />}
        </div>
    );
}
