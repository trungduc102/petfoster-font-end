'use client';
import { BoxTitle, Comfirm, DivTextfield, LoadingPrimary, MainButton } from '@/components';
import React, { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { BaseProfilePage } from '../common';
import Validate from '@/utils/validate';
import { IFormChangePassword } from '@/configs/interface';
import { changePassword } from '@/apis/user';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';

const initData = {
    password: '',
    newPassword: '',
    confirmPassword: '',
};

export interface IChangePasswordPageProps {}

export default function ChangePasswordPage(props: IChangePasswordPageProps) {
    const [form, setForm] = useState<IFormChangePassword>(initData);
    const [errors, setErrors] = useState<IFormChangePassword>({ ...initData });
    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });
    const [isLoading, setIsLoading] = useState(false);

    const [showBtn, setShowBtn] = useState(false);

    const handleOpenConfirm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) return;
        setOpenComfirm({ ...openComfirm, open: true });
    };

    const handleComfirm = async (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (v.open || v.comfirm === 'cancel') return;

        if (validate()) return;

        try {
            setIsLoading(true);
            const response = await changePassword(form);
            setIsLoading(false);

            if (response && response.errors) {
                if (response.status === 404) {
                    toast.warn(response.message);
                }

                setErrors({
                    ...errors,
                    ...(response.errors as unknown as IFormChangePassword),
                });

                return;
            }

            toast.success(response.message);

            setForm({
                password: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            setIsLoading(false);
            toast.success(contants.messages.errors.server);
        }
    };

    const validate = () => {
        const flagList: boolean[] = [];

        const validateErrors: IFormChangePassword = { ...initData };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof IFormChangePassword;

            if (dynamic === 'confirmPassword') {
                const { message, error } = Validate.confirmPassword(form[dynamic], form.newPassword);
                validateErrors[dynamic] = message;

                flagList.push(error);
            } else {
                const { message, error } = Validate[dynamic](form[dynamic]);
                validateErrors[dynamic] = message;
                flagList.push(error);
            }
        });

        if (form.newPassword == form.password) {
            const { message, error } = Validate.newPassword(form.newPassword, 6, form.password);
            validateErrors.newPassword = message;
            flagList.push(error);
        }

        setErrors({
            ...validateErrors,
        });

        return flagList.some((item) => item);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof IFormChangePassword;

        if (dynamicKey === 'confirmPassword') {
            const { message } = Validate.confirmPassword(e.target.value, form.newPassword);
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

    useEffect(() => {
        if (JSON.stringify(initData) != JSON.stringify(form)) {
            setShowBtn(true);
        } else {
            setShowBtn(false);
        }
    }, [form]);
    return (
        <BaseProfilePage title="CHANGE PASSWORD">
            <form onSubmit={handleOpenConfirm} className="flex flex-col gap-5 mt-8">
                <DivTextfield
                    propsInput={{
                        name: 'password',
                        onChange: handleChange,
                        onBlur: handleBlur,
                        message: errors.password,
                        value: form.password,
                        type: 'password',
                    }}
                    label="Current Password"
                />
                <DivTextfield
                    propsInput={{
                        name: 'newPassword',
                        onChange: handleChange,
                        onBlur: handleBlur,
                        message: errors.newPassword,
                        value: form.newPassword,
                        type: 'password',
                    }}
                    label="New password"
                />
                <DivTextfield
                    propsInput={{
                        name: 'confirmPassword',
                        onChange: handleChange,
                        onBlur: handleBlur,
                        message: errors.confirmPassword,
                        value: form.confirmPassword,
                        type: 'password',
                    }}
                    label="New password confirm"
                />

                <div className="flex items-center justify-center w-full mt-14">{showBtn && <MainButton width={'208px'} title="CHANGE" />}</div>
            </form>

            {isLoading && <LoadingPrimary />}

            <Comfirm title={'Notification'} subtitle={'Are want to update your password ?'} open={openComfirm.open} setOpen={setOpenComfirm} onComfirm={handleComfirm} />
        </BaseProfilePage>
    );
}
