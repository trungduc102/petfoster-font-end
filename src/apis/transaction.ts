import { ApiFilterTransaction, ApiGetTransaction, ApiReportDonation } from '@/configs/types';
import axios from '@/configs/axios';
import Validate from '@/utils/validate';
import { IFilterDonationRequest } from '@/configs/interface';

export const getTransaction: ApiGetTransaction = async (page?: string) => {
    const params: { page?: number } = {};

    if (page && Validate.isNumber(page)) {
        params.page = Number(page) - 1;
    } else {
        if (params.page) {
            delete params.page;
        }
    }
    const res = await axios({
        method: 'GET',
        url: 'transaction',

        params,
    });

    if (!res) return null;

    return res?.data;
};
export const reportDonation: ApiReportDonation = async () => {
    const res = await axios({
        method: 'GET',
        url: 'admin/donates/report',
    });

    if (!res) return null;

    return res?.data;
};

export const filterTransaction: ApiFilterTransaction = async (filter: IFilterDonationRequest) => {
    const params: IFilterDonationRequest = {};

    if (filter.page && Validate.isNumber(filter.page + '')) {
        params.page = Number(filter.page) - 1;
    } else {
        if (params.page) {
            delete params.page;
        }
    }

    Object.keys(filter).forEach((key) => {
        if (filter[key as keyof IFilterDonationRequest]) {
            params[key as keyof IFilterDonationRequest] = filter[key as keyof IFilterDonationRequest];
        }
    });

    const res = await axios({
        method: 'GET',
        url: 'admin/donates',
        params,
    });

    if (!res) return null;

    return res?.data;
};
