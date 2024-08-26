import axios from '@/configs/axios';
import { IBrand } from '@/configs/interface';
import { ApiActionBrand, ApiGetBrands } from '@/configs/types';

export const getBrands: ApiGetBrands = async () => {
    const res = await axios({
        method: 'GET',
        url: 'admin/brands/',
    });

    if (!res) return null;

    return res?.data;
};

export const createBrand: ApiActionBrand = async (data: IBrand) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/brands/',
        data: {
            name: data.brand,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const updateBrand: ApiActionBrand = async (data: IBrand) => {
    if (!data.id) return;
    const res = await axios({
        method: 'PUT',
        url: 'admin/brands/' + data.id,
        data: {
            id: data.id,
            name: data.brand,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const deleteBrand: ApiActionBrand = async (data: IBrand) => {
    if (!data.id) return;
    const res = await axios({
        method: 'DELETE',
        url: 'admin/brands/' + data.id,
    });

    if (!res) return null;

    return res?.data;
};
