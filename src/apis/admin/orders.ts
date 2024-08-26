import axios from '@/configs/axios';
import { IOrderAdminFillterForm } from '@/configs/interface';
import { ApiGetDetailFilterOrderAdmin, ApiGetFilterOrderAdmin, ApiGetOrders, ApiUpdateReadOrderAdmin, ApiUpdateStatusOrder, UpdateStatusOrderType } from '@/configs/types';
import Validate from '@/utils/validate';

export const getOrdersAdmin: ApiGetOrders = async () => {
    const res = await axios({
        method: 'GET',
        url: 'admin/orders',
    });

    if (!res) return null;

    return res?.data;
};

export const getOrdersAdminWithFilter: ApiGetFilterOrderAdmin = async (data: IOrderAdminFillterForm, page: string | null) => {
    const other: { status?: string } = { status: data.status };

    const params = {
        username: !Validate.isNumber(data.search) ? data.search : '',
        orderId: Validate.isNumber(data.search) ? data.search : '',
        sort: data.sort,
        maxDate: data.dateEnd,
        minDate: data.dateStart,
        page: page ? parseInt(page) - 1 : 0,
        read: data.read || false,
        ...other,
    };

    if (!data.status || Validate.isBlank(data.status)) {
        delete params.status;
    }

    const res = await axios({
        method: 'GET',
        url: 'admin/orders/filter',
        params,
    });

    if (!res) return null;

    return res?.data;
};

export const updateReadForOrder: ApiUpdateReadOrderAdmin = async (id: number) => {
    const res = await axios({
        method: 'PUT',
        url: 'admin/orders/read/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const updatePrintForOrder: ApiUpdateReadOrderAdmin = async (id: number) => {
    const res = await axios({
        method: 'PUT',
        url: 'admin/orders/print/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const getOrdersDetailAdminWithFilter: ApiGetDetailFilterOrderAdmin = async (id: number | undefined) => {
    if (id === 0) return;
    const res = await axios({
        method: 'GET',
        url: 'admin/orders/details/' + id,
    });

    if (!res) return null;

    return res?.data;
};

export const updateStatusOrder: ApiUpdateStatusOrder = async (data: UpdateStatusOrderType) => {
    const res = await axios({
        method: 'POST',
        url: 'admin/orders/status/' + data.id,
        data: {
            status: data.status === 'cancelled' ? 'cancelled_by_admin'.toLocaleUpperCase() : data.status.toLocaleUpperCase(),
            reason: data.reason,
        },
    });

    if (!res) return null;

    return res?.data;
};
