import { ApiAdoption, ApiAdoptions, ApiCancelAdoption, ApiFilterPets, ApiPetAttributes, ApiPetDetailPage, ApiPetFavorite, ApiPetManagement } from '@/configs/types';
import axios from '../configs/axios';
import { IRequestFilterPet } from '@/configs/interface';

export const petDetail: ApiPetDetailPage = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: '/pets/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const getPetManagement: ApiPetManagement = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/pets/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const favorite: ApiPetFavorite = async (id: string) => {
    const res = await axios({
        method: 'PUT',
        url: '/user/pets/favorite/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const filterPets: ApiFilterPets = async (params: IRequestFilterPet) => {
    const res = await axios({
        method: 'GET',
        url: '/pets',
        params,
    });

    if (!res) return null;

    return res?.data;
};

export const getPetAttibutes: ApiPetAttributes = async () => {
    const res = await axios({
        method: 'GET',
        url: '/pets/attributes',
    });

    if (!res) return null;

    return res?.data;
};

export const getAdoptions: ApiAdoptions = async (status: string, page?: number) => {
    const params: { page?: number } = {};

    if (page) {
        params.page = Number(page) - 1;
    } else {
        if (params.page) {
            delete params.page;
        }
    }
    const res = await axios({
        method: 'GET',
        url: '/user/adopts',
        params: {
            status: status === '0' ? 'all' : status,
            ...params,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const adoptionPet: ApiAdoption = async (data: { userId: string; petId: string; addressId: number }) => {
    const res = await axios({
        method: 'POST',
        url: '/user/adopts',
        data,
    });

    if (!res) return null;

    return res?.data;
};

export const cancelAdoptionPet: ApiCancelAdoption = async (data: { id: string; reason: string }) => {
    const res = await axios({
        method: 'PUT',
        url: '/user/adopts' + `/${data.id}`,
        data: {
            cancelReason: data.reason,
        },
    });

    if (!res) return null;

    return res?.data;
};
