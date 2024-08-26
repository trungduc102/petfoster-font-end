/* eslint-disable @next/next/no-img-element */
'use client';
import { CardInfo, DynamicInput, TextField, Notifycation, LoadingPrimary, InputBrand } from '@/components';
import { SelectImages } from '@/components/common';
import { DashboardCard } from '@/components/dashboard';
import { Button, CircularProgress, Grid, MenuItem, Stack, capitalize } from '@mui/material';
import Link from 'next/link';
import React, { ChangeEvent, FocusEvent, useState } from 'react';
import Repository from './Repository';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { productManageData } from '@/datas/product-manage-data';
import Validate from '@/utils/validate';
import { ModeType, RepoType } from '@/configs/types';
import { INotifycationProps } from '@/components/notifycations/Notifycation';
import ComInput from './ComInput';
import { typesAndBrands } from '@/apis/app';
import { createProduct } from '@/apis/admin/product';
import { useDispatch } from 'react-redux';
import { pushNoty } from '@/redux/slice/appSlice';
import { links } from '@/datas/links';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { useTypeAndBrand } from '@/hooks';
const Description = dynamic(() => import('./Description'), {
    loading: () => (
        <Stack justifyContent={'center'} alignItems={'center'}>
            <CircularProgress />
        </Stack>
    ),
    ssr: false,
});

type DataProductType = {
    name: string;
    type: string;
    brand: string;
    images: File[];
    repo: RepoType[];
    description: string;
};
type DataProductErrorsType = {
    name: string;
    type: string;
    brand: string;
    images: string;
    repo: string;
    description: string;
};

const initData: DataProductType = {
    name: '',
    brand: '1',
    type: 'CF',
    images: [],
    description: '',
    repo: [],
};
const initDataErrors: DataProductErrorsType = {
    name: '',
    brand: '',
    type: '',
    images: '',
    description: '',
    repo: '',
};

export interface ICreateOrUpdateProductProps {
    dataOusite?: DataProductType;
}

export default function CreateOrUpdateProduct({ dataOusite }: ICreateOrUpdateProductProps) {
    const { typesAndBrandsData, refetch } = useTypeAndBrand();

    const router = useRouter();
    const dispatch = useDispatch();
    const [data, setData] = useState<DataProductType>(initData);
    const [errors, setErrors] = useState<DataProductErrorsType>(initDataErrors);
    const [loading, setLoading] = useState(false);

    const [notify, setNotify] = useState<INotifycationProps>({ title: '', type: 'error', open: false });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof DataProductType;

        const { message } = Validate.infomation(e.target.value, () => {
            return capitalize(dynamicKey);
        });

        setErrors({
            ...errors,
            [dynamicKey]: message,
        });
    };

    const validate = () => {
        let flag = false;
        const validateErrors: DataProductErrorsType = { ...initDataErrors };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof DataProductType;

            if (dynamic === 'description') {
                const { message, error } = Validate.description(data[dynamic]);
                validateErrors[dynamic] = message;
                flag = error;
            } else if (dynamic !== 'images' && dynamic !== 'repo') {
                const { message, error } = Validate.infomation(data[dynamic], () => {
                    return capitalize(key);
                });
                validateErrors[dynamic] = message;
                flag = error;
            } else {
                if (data.repo.length <= 0 || data.images.length <= 0) {
                    flag = true;
                }
            }
        });

        setErrors(validateErrors);

        return flag;
    };

    const handleSubmit = async () => {
        if (validate()) {
            toast.warn('Incomplete data');
            return;
        }

        console.log(data);

        try {
            setLoading(true);
            const response = await createProduct({
                description: data.description,
                id: '',
                brand: data.brand,
                name: data.name,
                repo: data.repo,
                images: data.images,
                type: data.type,
            });
            setLoading(false);

            if (!response.data || response.errors) {
                toast.error("Can't Create Product, Pls try again !");
                return;
            }

            toast.success('Create Succcessfuly !');
            router.push(links.admin + 'product');
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    return (
        <DashboardCard
            title="Create Product"
            // action={
            //     <>
            //         <Button>
            //             <Link href={'/admin/dashboard/product/preview'}>Preview</Link>
            //         </Button>
            //     </>
            // }
        >
            <>
                <CardInfo title="Information">
                    <Grid container spacing={4}>
                        <Grid lg={12} md={12} xs={12} item>
                            <ComInput
                                title="Name"
                                propsInput={{
                                    placeholder: 'ME-O Tuna In Jelly',
                                    name: 'name',
                                    message: errors.name,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12}>
                            <ComInput title="Type">
                                <TextField select id="type" name="type" value={data.type} size="small" onChange={handleChange} onBlur={handleBlur}>
                                    {typesAndBrandsData.types.map((type, index) => {
                                        return (
                                            <MenuItem key={type.name} value={typeof type.id === 'object' ? type.id.join() : type.id}>
                                                {type.name}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </ComInput>
                        </Grid>
                        <Grid item lg={6} md={12} xs={12}>
                            <InputBrand
                                propsInput={{
                                    name: 'brand',
                                    value: data.brand + '',
                                    message: errors.brand,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                }}
                                dataSelect={typesAndBrandsData.brands || []}
                                title="Brand"
                                onAfterSubmit={() => {
                                    refetch();
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardInfo>

                <SelectImages
                    onImages={(images) => {
                        setData({
                            ...data,
                            images,
                        });
                    }}
                />

                <Repository
                    onRepos={(repo) => {
                        setData({
                            ...data,
                            repo,
                        });
                    }}
                />

                <Description
                    onValues={(description) => {
                        setData({
                            ...data,
                            description,
                        });
                    }}
                />

                <CardInfo>
                    <Stack direction={'row'} justifyContent={'flex-end'}>
                        <Button onClick={handleSubmit} variant="outlined">
                            {'Create'}
                        </Button>
                    </Stack>
                </CardInfo>
                <Notifycation onClose={() => setNotify({ ...notify, open: false })} {...notify} />

                {loading && <LoadingPrimary />}
            </>
        </DashboardCard>
    );
}
