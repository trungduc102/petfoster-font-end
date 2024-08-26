import axios from '@/configs/axios';
import { IReview, IReviewAdminFillterForm } from '@/configs/interface';
import { ApiFilterReviews, ApiGetReview, ApiGetReviews, ApiReplayReview } from '@/configs/types';

export const getReviews: ApiGetReviews = async (data: IReviewAdminFillterForm, page: string | null) => {
    let search = {};

    let pages = {};

    if (data.search.length > 0) {
        search = {
            productName: data.search,
        };
    }

    if (pages) {
        pages = {
            page: parseInt(page || '1') - 1,
        };
    }

    const res = await axios({
        method: 'GET',
        url: 'admin/reviews',
        params: {
            maxStar: data.maxStar,
            minStar: data.minStar,
            sort: data.sort,
            ...search,
            ...pages,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const getReview: ApiGetReview = async (id: string) => {
    let search = {};

    const res = await axios({
        method: 'GET',
        url: 'admin/reviews/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const replayReview: ApiReplayReview = async (data: IReview) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/reviews',
        data: {
            idReplay: data.id,
            comment: data.comment,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const deleteReview: ApiReplayReview = async (data: IReview) => {
    const res = await axios({
        method: 'DELETE',
        url: 'admin/reviews/' + data.id,
    });

    if (!res) return null;

    return res?.data;
};

export const filterReviewsOfProduct: ApiFilterReviews = async (data: { id: string; noReplay: boolean }) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/reviews/details',
        params: {
            id: data.id,
            notReply: data.noReplay,
        },
    });

    if (!res) return null;

    return res?.data;
};
