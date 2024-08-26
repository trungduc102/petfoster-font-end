import { ICart, IChatGPTResponse, IDistrict, IDistrictOutside, IPetManagementFormResuqest, IProvinceOutside, IProvinces, IWardOutside } from '@/configs/interface';
import { ApiGetShippingFee, DataFormShippingFee } from '@/configs/type-ousite';
import {
    AddressCodeType,
    ApiDevisionDistrictOutside,
    ApiDevisionProvincesOutside,
    ApiDevisionWardOutside,
    ApiDistrictOutside,
    ApiProvinces,
    ApiProvincesOutside,
    ApiWardOutside,
} from '@/configs/types';
import { contants } from '@/utils/contants';
import { replaceValidDistrich } from '@/utils/format';
import axios from 'axios';

// address

export const getProvinces: ApiProvinces<IProvinces[]> = async (data?: string | number) => {
    const res = await axios({
        method: 'GET',
        url: contants.apis.provinces,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res) return null;

    return res?.data;
};

export const searchProvincesWithName: ApiProvinces<IProvinces[]> = async (data?: string | number) => {
    const res = await axios({
        method: 'GET',
        url: contants.apis.provinces + `search/?q=` + data,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res) return null;

    return res?.data;
};

export const searchProvinces: ApiProvincesOutside = async (data?: string | number) => {
    const res = await axios({
        method: 'GET',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.token,
        },
    });

    if (!res) return null;

    if (res?.data?.data) {
        return res?.data?.data.find((item: IProvinceOutside) => {
            return data && item.NameExtension.includes(data as string);
        });
    }

    return null;
};

export const getDevisionProvinces: ApiDevisionProvincesOutside = async () => {
    const res = await axios({
        method: 'GET',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.token,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const getDistrichts: ApiProvinces<IProvinces> = async (data?: string | number) => {
    const res = await axios({
        method: 'GET',
        url: contants.apis.districts(data || 0),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res) return null;

    return res?.data;
};

export const searchDistrichts: ApiDistrictOutside = async (data: IProvinceOutside, district: string) => {
    const res = await axios({
        method: 'GET',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.token,
        },
        params: {
            province_id: data.ProvinceID,
        },
    });

    if (!res) return null;

    if (res?.data.data) {
        return res?.data.data.find((item: IDistrictOutside) => {
            if (!item?.NameExtension) {
                return item.DistrictName.includes(district);
            }

            return item.NameExtension.includes(district);
        });
    }

    return null;
};

export const getDevisionDistrictes: ApiDevisionDistrictOutside = async (data: IProvinceOutside) => {
    const res = await axios({
        method: 'GET',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.token,
        },
        params: {
            province_id: data.ProvinceID,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const getDevisionWards: ApiDevisionWardOutside = async (data: IDistrictOutside) => {
    const res = await axios({
        method: 'GET',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.token,
        },
        params: {
            district_id: data.DistrictID,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const getWards: ApiProvinces<IDistrict> = async (data?: string | number) => {
    const res = await axios({
        method: 'GET',
        url: contants.apis.wards(data || 0),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res) return null;

    return res?.data;
};

export const searchWards: ApiWardOutside = async (data: IDistrictOutside, ward: string) => {
    const res = await axios({
        method: 'GET',
        url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.token,
        },
        params: {
            district_id: data.DistrictID,
        },
    });

    if (!res) return null;

    if (res?.data.data) {
        return res?.data.data.find((item: IWardOutside) => {
            return item.NameExtension.includes(ward);
        });
    }

    return null;
};

export const getShippingFee = async (
    data: AddressCodeType,
    totalAndWeight: {
        value: number;
        weight: number;
        quantity: number;
    },
) => {
    const res = await axios({
        method: 'POST',
        url: contants.apis.ghn.shippingFee,
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.token,
            shopId: contants.apis.ghn.clientId,
        },
        data: {
            service_id: 53320,
            service_type_id: null,
            to_district_id: data.district,
            to_ward_code: data.ward,
            weight: totalAndWeight.weight,
            insurance_value: 0,
            coupon: null,
        },
    });

    if (!res) return null;

    if (res?.data.data) {
        return res?.data.data.total;
    }

    return null;
};

export const generateContentWithAi = async (data: IPetManagementFormResuqest) => {
    const prompt = `Write me an introduction about a pet with the following information: ${data.colors ? Array.from(data.colors).join(', ') : 'brown'} color, ${
        data.size || 'adult'
    } size, ${data.sex || 'male'} gender, ${data.name || ''} name. Limit 255 character`;

    console.log(prompt);
    const res = await axios({
        method: 'POST',
        url: process.env.NEXT_PUBLIC_CHAT_GPT_API + `/completions`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_CHAT_GPT_TOKEN,
        },
        data: {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        },
    });

    if (!res) return null;

    return res?.data as IChatGPTResponse;
};

export const getTokenPrint = async (token: string) => {
    const res = await axios({
        method: 'POST',
        url: contants.apis.ghn.base + `a5/gen-token`,
        headers: {
            'Content-Type': 'application/json',
            token: contants.apis.ghn.tokenPrint,
        },
        data: {
            order_codes: [token],
            source: '5sao',
        },
    });

    return res.data.data;
};
