import axios from '@/configs/axios';
import { ApiGetFeedbacks, ApiUpdateSeenFeedback } from '@/configs/types';
import Validate from '@/utils/validate';

export const updateStateFeedback: ApiUpdateSeenFeedback = async (id: string) => {
    const res = await axios({
        method: 'PUT',
        url: 'admin/feedbacks/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const getFeedbacks: ApiGetFeedbacks = async (page?: string | null) => {
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
        url: 'admin/feedbacks/',
        params,
    });

    if (!res) return null;

    return res?.data;
};
