import axios from '@/configs/axios';
import axioss from 'axios';
import { DataProductType, IBaseResponse, ProductInfo } from '@/configs/interface';
import {
    ApiCreateProduct,
    ApiDelete,
    ApiDetailProductManaege,
    ApiGetImagesByProduct,
    ApiGetPriceHistories,
    ApiGetProductInfo,
    ApiGetRepositories,
    ApiProductsManage,
    ApiUpdateProduct,
    ApiUpdateProductWithInfo,
} from '@/configs/types';

export const productManage: ApiProductsManage = async (page: number | undefined, filter: {}) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/product/',
        params: {
            page: page || 0,
            ...filter,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const detailProductManage: ApiDetailProductManaege = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/product/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const deleteProduct: ApiDelete = async (id: string) => {
    const res = await axios({
        method: 'DELETE',
        url: 'admin/product/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const updateProduct: ApiUpdateProduct = async (data: DataProductType) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/product/' + data.id,
        data: {
            name: data.name,
            desc: data.description,
            productType: data.type,
            brand: data.brand,
            productsRepo: data.repo,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const createProduct: ApiCreateProduct = async (data: DataProductType) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('type', data.type);
    formData.append('brand', data.brand);

    data.images.forEach((image) => {
        formData.append('images', image as File);
    });

    data.repo.forEach((repo, index) => {
        formData.append(`repo[${index}].size`, repo.size);
        formData.append(`repo[${index}].quantity`, repo.quantity);
        formData.append(`repo[${index}].inPrice`, repo.inPrice);
        formData.append(`repo[${index}].outPrice`, repo.outPrice);
    });

    const res = await axios({
        method: 'POST',
        url: 'admin/product/',
        headers: {
            'content-type': 'multipart/form-data',
        },
        data: formData,
    });

    if (!res) return null;

    return res?.data;
};

export const getInfoProduct: ApiGetProductInfo = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/product/info/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const updateInfoProduct: ApiUpdateProductWithInfo = async (id: string, data: ProductInfo) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/product/info/' + id,
        data: {
            ...data,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const getRepositories: ApiGetRepositories = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/product-repo/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const getImages: ApiGetImagesByProduct = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/images/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const getPriceHistories: ApiGetPriceHistories = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/price-changes/' + id,
    });

    if (!res) return null;

    return res?.data;
};
