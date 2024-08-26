'use client';
import { PaymentItem } from '@/components/pages';
import React, { ChangeEvent, FocusEvent, FormEvent, MouseEvent, useContext, useEffect, useState } from 'react';
import TextField from '../TextField';
import { motion, AnimatePresence } from 'framer-motion';
import { FormControlLabel, Radio, Stack } from '@mui/material';
import AddressTippy from './AddressTippy';
import { AddressInfoPayment, Comfirm, SocialButton } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getDistrichts, getProvinces, getWards } from '@/apis/outside';
import { IAddress, IDistrict, IInfoAddress, IWard } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { useGetDefaultAddress, useProvinces } from '@/hooks';
import Address from './Address';
import Validate from '@/utils/validate';
import { addAddress, updateAddress } from '@/apis/user';
import { toast } from 'react-toastify';
import { AddressDialogContext } from './AddressDialog';
import { AddressInfoPaymentContext } from './AddressInfoPayment';
import Link from 'next/link';
import { links } from '@/datas/links';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';

export interface IAddressFormProps {
    initData?: IInfoAddress;
    updateMode?: boolean;
    onBeforeAdd?: () => void;
    onBeforeUpdate?: () => void;
    showNotiAdopt?: boolean;
}

export default function AddressForm({ initData, updateMode = false, showNotiAdopt = false, onBeforeAdd, onBeforeUpdate }: IAddressFormProps) {
    // context
    const context = useContext(AddressDialogContext);

    const parentContext = useContext(AddressInfoPaymentContext);
    const { petAdopt, asked } = useAppSelector((state: RootState) => state.adoptReducer);

    // cutum hooks

    const defaultAddress = useGetDefaultAddress();

    // variables
    let adddresValite: () => boolean;
    const [form, setForm] = useState<IInfoAddress>({
        id: 0,
        name: '',
        phone: '',
        address: {
            province: '',
            district: '',
            ward: '',
            address: '',
        },
    });
    const [isCheck, setIsCheck] = useState(false);
    const [addresses, setAddresses] = useState<IAddress>({
        province: '',
        district: '',
        ward: '',
        address: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        phone: '',
    });

    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });

    useEffect(() => {
        if (!initData || !updateMode) return;

        setForm({ ...initData });
        setIsCheck(!!initData.isDefault);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData]);

    const handleOpenConfirm = (e?: MouseEvent<HTMLSpanElement>, data?: IInfoAddress) => {
        setOpenComfirm({ ...openComfirm, open: true });
    };

    const handleComfirm = async (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (v.open || v.comfirm === 'cancel') return;

        await handleUpdate({
            ...form,
            address: addresses,
        });
    };

    const handleShowGoToAdoptPet = () => {
        if (!petAdopt || !asked) return;

        toast.success(
            <div className="flex items-center gap-2 text-black-main">
                <span>
                    <b>{petAdopt.name}</b> is waiting for you.
                    <Link className="hover:underline text-blue-primary" href={links.pets.ask}>
                        Click to continue to register
                    </Link>
                </span>
            </div>,
        );
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { error, message } = Validate.address(e.target.value);

        setErrors({
            ...errors,
            [e.target.name]: message,
        });
    };

    const validate = () => {
        const validErrors = { name: '', phone: '' };
        const results: boolean[] = [];

        const fullname = Validate.fullname(form.name);

        validErrors.name = fullname.message;
        results.push(fullname.error);

        const phone = Validate.phone(form.phone);

        validErrors.phone = phone.message;
        results.push(phone.error);

        results.push(adddresValite());

        setErrors({
            ...validErrors,
        });

        return results.some((item) => item);
    };

    const handleAdd = async (data: IInfoAddress) => {
        try {
            const response = await addAddress({ ...data, isDefault: isCheck });

            if (!response.data) {
                toast.error(response.message);
                return;
            }

            if (!onBeforeAdd) {
                context.back();
            } else {
                onBeforeAdd();
            }

            // show noti
            if (showNotiAdopt) {
                handleShowGoToAdoptPet();
            }
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const handleUpdate = async (data: IInfoAddress) => {
        try {
            const response = await updateAddress({ ...data, isDefault: isCheck });

            if (!response.data) {
                toast.error(response.message);
                return;
            }

            if (!onBeforeUpdate) {
                requestIdleCallback(() => {
                    if (parentContext.addressActive?.id === data.id && !data.isDefault) {
                        parentContext.setDefaultValue(response.data);
                    }
                });
                context.back();
            } else {
                onBeforeUpdate();
            }

            // show noti
            if (showNotiAdopt) {
                handleShowGoToAdoptPet();
            }
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setForm({
            ...form,
            address: addresses,
        });

        if (validate()) return;

        if (updateMode) {
            handleOpenConfirm();
        } else {
            await handleAdd({
                ...form,
                address: addresses,
            });
        }

        if (isCheck || updateMode) {
            defaultAddress.refetch();
        }
    };

    return (
        <AnimatePresence initial={true} custom={1}>
            <motion.form onSubmit={handleSubmit} key={'address-form'} {...contants.animations.addressForm} className="w-full pt-5 flex flex-col gap-7">
                <PaymentItem title="Information" size="text-lg" mt="mt-[14px]">
                    <Stack spacing={'26px'}>
                        <TextField onChange={handleChange} onBlur={handleBlur} message={errors.name} value={form.name} name="name" size="small" label={'Fullname'} />
                        <TextField onChange={handleChange} onBlur={handleBlur} message={errors.phone} name="phone" value={form.phone} size="small" label={'Phone'} />
                    </Stack>
                </PaymentItem>
                <PaymentItem title="Address" size="text-lg" mt="mt-[14px]">
                    <Address
                        initData={initData && initData?.address}
                        onAddress={(values) => {
                            setAddresses({
                                ...(values as IAddress),
                            });
                        }}
                        onValidate={(validate) => {
                            adddresValite = validate;
                        }}
                    />
                </PaymentItem>
                <PaymentItem title="Setting" size="text-lg" mt="mt-[0px]">
                    <FormControlLabel value={isCheck} control={<Radio checked={isCheck} onClick={(e) => setIsCheck(!isCheck)} />} label="Set to default" />
                </PaymentItem>

                <div className="w-full  flex items-center justify-center pb-4">
                    <div className="w-[80%]">
                        <SocialButton type="submit" maxWidth="max-w-full" background="#505DE8" title="Save" />
                    </div>
                </div>
            </motion.form>

            <Comfirm title={'Notification'} subtitle={'Are want to update ?'} open={openComfirm.open} setOpen={setOpenComfirm} onComfirm={handleComfirm} />
        </AnimatePresence>
    );
}
