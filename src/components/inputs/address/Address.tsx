'use client';
import React, { ChangeEvent, FocusEvent, createContext, memo, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevisionDistrictes, getDevisionProvinces, getDevisionWards, getDistrichts, getProvinces, getWards } from '@/apis/outside';
import { IAddress, IDistrict, IDistrictOutside, IProvinceOutside, IProvinces, IWard, IWardOutside } from '@/configs/interface';
import Validate from '@/utils/validate';
import AddressTippy from './AddressTippy';
import TextField from '../TextField';
import Provinces from './Provinces';
import Districtes from './Districtes';
import Wards from './Wards';

export interface Address {
    province: IProvinceOutside | undefined;
    district: IDistrictOutside | undefined;
    ward: IWardOutside | undefined;
}

export interface IAddressProps {
    onValidate?: (validateFuc: () => boolean) => void;
    onAddress?: (values: IAddress) => void;
    initData?: IAddress;
}

function Address({ initData, onValidate, onAddress }: IAddressProps) {
    //use Query
    const { data, isLoading } = useQuery({
        queryKey: ['getProvinces'],
        queryFn: () => getDevisionProvinces(),
    });

    // variables
    const validFucs = {
        province: () => false,
        districh: () => false,
        ward: () => false,
    };

    // states

    const [address, setAddress] = useState<Address>({
        province: undefined,
        district: undefined,
        ward: undefined,
    });

    const [form, setForm] = useState<IAddress>(
        initData || {
            province: '',
            district: '',
            ward: '',
            address: '',
        },
    );

    const [districhs, setDistrichs] = useState<IDistrictOutside[] | undefined | null>(undefined);
    const [wards, setWards] = useState<IWardOutside[] | undefined | null>(undefined);

    const [error, setError] = useState('');

    // functions and handle events

    const validate = (initData: string | undefined) => {
        const { error, message } = Validate.address(initData || '');
        setError(message);

        return error;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        validate(e.target.value);
    };

    const validateAll = () => {
        const validError: boolean[] = [];
        const value = validate(form.address);
        validError.push(value);

        Object.values(validFucs).forEach((func) => {
            const value = func();
            validError.push(value);
        });

        return validError.some((item) => item);
    };

    const handleClearForm = () => {
        setForm({
            province: '',
            district: '',
            ward: '',
            address: '',
        });
    };

    // use effects

    useEffect(() => {
        if (!initData) return;
        setForm(initData);
    }, [initData]);

    useEffect(() => {
        setForm({
            ...form,
            province: address.province?.ProvinceName || '',
            district: address.district?.DistrictName || '',
            ward: address.ward?.WardName || '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    useEffect(() => {
        if (!onValidate) return;

        onValidate(validateAll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validateAll]);

    useEffect(() => {
        if (!onAddress) return;

        onAddress(form);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    return (
        <div className="flex flex-col justify-between gap-[26px] w-full">
            <div className="flex md:flex-row flex-col items-center justify-between gap-5">
                <Provinces
                    onValidate={(validFuc) => {
                        validFucs.province = validFuc;
                    }}
                    name="province"
                    initData={initData && initData.province}
                    onValue={async (value) => {
                        setAddress({
                            ...address,
                            province: value as IProvinceOutside,
                            district: undefined,
                            ward: undefined,
                        });

                        if (!value) {
                            setDistrichs(null);
                            setWards(null);
                            return;
                        }

                        try {
                            const response = await getDevisionDistrictes(value);

                            setDistrichs(null);
                            setWards(null);
                            if (response) {
                                setDistrichs(response.data);
                                return;
                            }

                            setDistrichs(null);
                            setWards(null);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    data={data?.data}
                    label="Province"
                />
                <Districtes
                    onValidate={(validFuc) => {
                        validFucs.districh = validFuc;
                    }}
                    name="district"
                    initData={initData && initData.district}
                    messageUndefined="Please choose your province"
                    onValue={async (value) => {
                        setAddress({
                            ...address,
                            district: value as IDistrictOutside,
                            ward: undefined,
                        });

                        if (!value) {
                            setWards(null);
                            return;
                        }

                        try {
                            const response = await getDevisionWards(value);

                            setWards(null);
                            if (response) {
                                setWards(response.data);
                                return;
                            }
                            setWards(null);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    data={districhs}
                    label="District"
                />
                <Wards
                    onValidate={(validFuc) => {
                        validFucs.ward = validFuc;
                    }}
                    name="ward"
                    initData={initData && initData.ward}
                    messageUndefined="Please choose your district"
                    onValue={(value) => {
                        setAddress({
                            ...address,
                            ward: value as IWardOutside,
                        });
                    }}
                    data={wards}
                    label="Ward"
                />
            </div>

            <TextField name="address" onChange={handleChange} onBlur={handleBlur} autoComplete="address" value={form.address} message={error} size="small" label={'Address'} />
        </div>
    );
}
export default memo(Address);
