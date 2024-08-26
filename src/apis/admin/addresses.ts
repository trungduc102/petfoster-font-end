import axios from '@/configs/axios';
import { ApiGetAddressesWithUsernameByAdmin } from '@/configs/types';

export const getAddressesWithUsernameByAdmin: ApiGetAddressesWithUsernameByAdmin = async (username: string) => {
    const res = await axios({
        method: 'GET',
        url: 'admin/addresses/' + username,
    });

    if (!res) return null;

    return res?.data;
};
