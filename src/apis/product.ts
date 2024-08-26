import axios from '@/configs/axios';
import { ApiDetailProductType } from '@/configs/types';

export const detailProduct: ApiDetailProductType = async (idProduct: string) => {
    const res = await axios({
        method: 'GET',
        url: 'product/detail/' + idProduct,
    });

    if (!res) return null;

    return res?.data;
};
