import axios from '@/configs/axios';
import { RolesName } from '@/configs/enum';
import { IUserManage } from '@/configs/interface';
import {
    ApiAllUser,
    ApiCreateUserManage,
    ApiDataChartUser,
    ApiDelete,
    ApiGetUserManage,
    ApiGetUserProfileMessageManage,
    ApiUpdateRoleUser,
    ApiUpdateUserManage,
} from '@/configs/types';
import { dataURLtoFile } from '@/utils/format';

export const usersManage: ApiAllUser = async (page: number | undefined, filter: {}) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/users',
        params: {
            page,
            ...filter,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const deleteUser: ApiDelete = async (id: string) => {
    const res = await axios({
        method: 'DELETE',
        url: 'admin/users/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const getUserManage: ApiGetUserManage = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/users/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const getUserManageWithUsername: ApiGetUserProfileMessageManage = async (username: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/users/username/' + username,
    });

    if (!res) return null;

    return res?.data;
};

export const updateUserManage: ApiUpdateUserManage = async (data: IUserManage) => {
    const res = await axios({
        method: 'PUT',
        url: 'admin/users',
        headers: {
            'Content-type': 'multipart/form-data',
        },
        data: {
            id: data.id,
            fullname: data.fullname,
            birthday: data.birthday,
            gender: data.gender,
            phone: data.phone,
            avatar: data.avatar ? dataURLtoFile(data.avatar) : null,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const createUserManage: ApiCreateUserManage = async (data: IUserManage) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/users',
        headers: {
            'Content-type': 'multipart/form-data',
        },
        data: {
            username: data.username,
            fullname: data.fullname,
            birthday: data.birthday,
            gender: data.gender,
            phone: data.phone,
            email: data.email,
            role: data.role,
            password: data.password,
            avatar: data.avatar ? dataURLtoFile(data.avatar) : null,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const updateRoleUser: ApiUpdateRoleUser = async (data: { id: string; roleId: RolesName }) => {
    const res = await axios({
        method: 'PUT',
        url: 'admin/authorities',

        data: {
            userId: data.id,
            roleId: data.roleId,
        },
    });

    if (!res) return null;

    return res?.data;
};

export const getDataChartUsers: ApiDataChartUser = async (id: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/users/chart-info/' + id,
    });

    if (!res) return null;

    return res?.data;
};
