import axios from '@/configs/axios';
import { ApiAddARepository, ApiDeleteARepository, ApiUpdateARepository, RepoType } from '@/configs/types';

export const addRepository: ApiAddARepository = async (id: string, data: RepoType) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/product-repo/' + id + '/c',
        data: {
            ...data,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const updateRepository: ApiUpdateARepository = async (data: RepoType) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/product-repo/' + data.id + '/u',
        data: {
            inPrice: data.inPrice,
            outPrice: data.outPrice,
            quantity: data.quantity,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const deleteRepository: ApiDeleteARepository = async (id: number) => {
    const res = await axios({
        method: 'DELETE',
        url: 'admin/product-repo/' + id,
    });

    if (!res) return null;

    return res?.data;
};
