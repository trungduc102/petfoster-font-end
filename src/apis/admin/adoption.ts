import {
    ApiAcceptStateAdoptionAdmin,
    ApiCancelAdoptionAdmin,
    ApiChangeStateAdoptionAdmin,
    ApiFilterAdoptionAdmin,
    ApiFilterPets,
    ApiFilterPetsAdmin,
    ApiReportAdopt,
    LabelAdopt,
} from '@/configs/types';
import axios from '../../configs/axios';
import { IRequestFilterAdoptionAdmin, IRequestFilterPetAdmin } from '@/configs/interface';

export const filterAdoptionAdmin: ApiFilterAdoptionAdmin = async (params: Partial<IRequestFilterAdoptionAdmin>) => {
    if (params.petName && params.petName.length <= 0) {
        delete params.petName;
    }

    if (params.status && params.status.toLocaleLowerCase() == 'all') {
        delete params.status;
    }

    const res = await axios({
        method: 'GET',
        url: '/admin/adopts',
        params,
    });

    if (!res) return null;

    return res?.data;
};

export const cancelAdoptionAdmin: ApiCancelAdoptionAdmin = async (data: { id: string; reason: string }) => {
    const res = await axios({
        method: 'POST',
        url: '/admin/adopts/' + data.id,
        data: {
            cancelReason: data.reason,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const acceptAdoptionAdmin: ApiAcceptStateAdoptionAdmin = async (data: { id: string; state?: LabelAdopt; data: string }) => {
    const res = await axios({
        method: 'PUT',
        url: '/admin/adopts/' + data.id,
        data: {
            pickUpDate: data.data,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const comfirmAdoptionAdmin: ApiChangeStateAdoptionAdmin = async (data: { id: string; state?: LabelAdopt; data: string }) => {
    const res = await axios({
        method: 'PUT',
        url: '/admin/adopts/confirmed/' + data.id,
    });

    if (!res) return null;

    return res?.data;
};
