import { Button, CircularProgress, Grid, MenuItem, Stack } from '@mui/material';
import React, { ChangeEvent, FocusEvent, FormEvent, memo, useEffect, useState } from 'react';
import ComInput from '../ComInput';
import { DynamicInput, InputBrand, LoadingPrimary, TextField } from '@/components';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { typesAndBrands } from '@/apis/app';
import Validate from '@/utils/validate';
import { ProductInfo } from '@/configs/interface';
import { getInfoProduct, updateInfoProduct } from '@/apis/admin/product';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { useTypeAndBrand } from '@/hooks';
const Description = dynamic(() => import('../Description'), {
    loading: () => (
        <Stack justifyContent={'center'} mt={'40px'} alignItems={'center'}>
            <CircularProgress />
        </Stack>
    ),
    ssr: false,
});

const initData = {
    name: '',
    brand: 'Nekko',
    type: 'CF',
    description: '',
};

const initDataErrors = {
    name: '',
    brand: '',
    type: '',
    description: '',
};

export interface InfomationProps {
    id: string;
}

function Infomation({ id }: InfomationProps) {
    // get types and brands on server
    const { typesAndBrandsData, refetch } = useTypeAndBrand();
    // get init data on server
    const productInfoData = useQuery({
        queryKey: ['productInfoData', id],
        queryFn: () => getInfoProduct(id),
    });

    if (productInfoData.error) {
        console.log('error: ', productInfoData.error);
    }

    // state
    const [data, setData] = useState<ProductInfo>(initData);
    const [errors, setErrors] = useState<ProductInfo>(initDataErrors);
    const [loading, setLoading] = useState(false);

    // handle change data input
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    // handle validate when blur input
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const dynamicKey = e.target.name as keyof ProductInfo;

        if (dynamicKey !== 'id') {
            const { message } = Validate[dynamicKey](e.target.value);
            setErrors({
                ...errors,
                [dynamicKey]: message,
            });
        }
    };

    // handle validate
    const validate = () => {
        let flag = false;

        const validateErrors: ProductInfo = { ...initDataErrors };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof ProductInfo;

            if (dynamic !== 'id') {
                const { message, error } = Validate[dynamic](data[dynamic]);
                validateErrors[dynamic] = message;
                flag = error;
            }
        });

        setErrors(validateErrors);

        return flag;
    };

    // handle submit. Handle update info
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) return;

        try {
            setLoading(true);
            const response = await updateInfoProduct(id, { ...data, id });
            setLoading(false);

            if (response.errors) {
                toast.error(response.message);
                return;
            }

            toast.success('Update successfuly product ' + id);
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    // listent productInfodata reset state data
    useEffect(() => {
        if (productInfoData.data?.data) {
            setData({
                ...productInfoData.data?.data,
            });
        }
    }, [productInfoData.data]);
    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={4} p={'14px'}>
                <Grid lg={12} md={12} xs={12} item>
                    <ComInput
                        title="Name"
                        propsInput={{
                            placeholder: 'ME-O Tuna In Jelly',
                            name: 'name',
                            value: data.name,
                            message: errors.name,
                            onChange: handleChange,
                            onBlur: handleBlur,
                        }}
                    />
                </Grid>
                <Grid item lg={6} md={12} xs={12}>
                    <ComInput title="Type">
                        <TextField select id="type" name="type" value={data.type} onChange={handleChange} size="small">
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

            <Description
                inidata={data.description}
                message={errors.description}
                onValues={(description) => {
                    setData({
                        ...data,
                        description,
                    });
                }}
            />

            <Stack p={'14px'} direction={'row'} justifyContent={'flex-end'}>
                <Button type="submit" variant="contained">
                    Update
                </Button>
            </Stack>

            {(productInfoData.isLoading || loading) && <LoadingPrimary />}
        </form>
    );
}

export default memo(Infomation);
