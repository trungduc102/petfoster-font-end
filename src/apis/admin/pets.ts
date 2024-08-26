import { ApiActionImagePetAdmin, ApiActionPetAdmin, ApiFilterPets, ApiFilterPetsAdmin, ImageType } from '@/configs/types';
import axios from '../../configs/axios';
import { IPetManagementFormResuqest, IRequestFilterPetAdmin } from '@/configs/interface';

export const filterPetsAdmin: ApiFilterPetsAdmin = async (params: IRequestFilterPetAdmin) => {
    if (params.name && params.name.length <= 0) {
        delete params.name;
    }

    if (params.status && params.status.toLocaleLowerCase() == 'all') {
        delete params.status;
    }

    const res = await axios({
        method: 'GET',
        url: '/admin/pets',
        params,
    });

    if (!res) return null;

    return res?.data;
};

export const createPetAdmin: ApiActionPetAdmin = async (data: IPetManagementFormResuqest, differentData: { images?: ImageType[] }) => {
    console.log(data, differentData);
    if (!differentData.images) return null;
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('sex', String(data.sex === 'male'));
    formData.append('status', data.status);
    formData.append('breed', data.breed);
    formData.append('size', data.size);
    formData.append('fosterAt', data.fosterDate);
    formData.append('isSpay', String(data.spay));
    formData.append('color', Array.from(data.colors).join(', '));

    differentData.images.forEach((image) => {
        formData.append('images', image.data as File);
    });

    const res = await axios({
        method: 'POST',
        url: 'admin/pets',
        headers: {
            'content-type': 'multipart/form-data',
        },
        data: formData,
    });

    if (!res) return null;

    return res?.data;
};

export const updatePetAdmin: ApiActionPetAdmin = async (data: IPetManagementFormResuqest, differentData: { id?: string; images?: ImageType[] }) => {
    if (!differentData.id) return null;

    const color = Array.from(data.colors).join(', ');

    if (differentData.images && differentData.images.some((item) => item.data)) {
        try {
            if (!differentData.id || !differentData.images) return null;
            const response = await addImageForPet(differentData.id, differentData.images);

            if (!response || response.errors) return null;
        } catch (error) {
            console.log('updatePetAdmin: ' + error);
            return null;
        }
    }

    const res = await axios({
        method: 'POST',
        url: '/admin/pets/' + differentData.id,
        data: {
            name: data.name,
            color: color,
            isSpay: data.spay,
            fosterAt: data.fosterDate,
            description: data.description,
            size: data.size,
            sex: data.sex === 'male',
            breed: data.breed,
            status: data.status,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const addImageForPet: ApiActionImagePetAdmin = async (id: string, images: ImageType[]) => {
    const formData = new FormData();

    images.forEach((image) => {
        if (image.data) {
            formData.append('images', image.data as File);
        }
    });
    const res = await axios({
        method: 'POST',
        url: 'admin/images/pet/' + id,
        headers: {
            'content-type': 'multipart/form-data',
        },
        data: formData,
    });

    if (!res) return null;

    return res?.data;
};

export const deleteImageOfPet: ApiActionImagePetAdmin = async (id: string, images: ImageType[]) => {
    if (images.length <= 0) return null;

    const link = images[0].link;

    const nameImageArr = link.split('/');

    const nameImage = nameImageArr[nameImageArr.length - 1];

    const res = await axios({
        method: 'DELETE',
        url: 'admin/images/pet/' + id + `/${nameImage}`,
        headers: {
            'content-type': 'multipart/form-data',
        },
    });

    if (!res) return null;

    return res?.data;
};
