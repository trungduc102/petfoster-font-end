import axios from '@/configs/axios';
import { ApiReportAdopt, ApiReportType, ApiRevenueDateType, ApiSalesOverviewType } from '@/configs/types';

export const dailyReport: ApiReportType = async () => {
    const res = await axios({
        method: 'GET',
        url: 'admin/report/daily',
    });

    if (!res) return null;

    return res?.data;
};

export const salesOverview: ApiSalesOverviewType = async (year: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/report/sales-overview',
        params: {
            year,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const productRevenue: ApiRevenueDateType = async (dates: { start?: string; end?: string }) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/report/product-revenue-by-date',
        params: {
            minDate: dates.start,
            maxDate: dates.end,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const reportsAdopt: ApiReportAdopt = async () => {
    const res = await axios({
        method: 'GET',
        url: '/admin/adopts/report',
    });

    if (!res) return null;

    return res?.data;
};
