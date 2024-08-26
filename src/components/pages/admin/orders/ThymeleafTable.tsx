'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrdersAdmin } from '@/apis/admin/orders';
export interface IThymeleafTableProps {}

export default function ThymeleafTable(props: IThymeleafTableProps) {
    const { data } = useQuery({
        queryKey: ['ordersAdminPage/get'],
        queryFn: () => getOrdersAdmin(),
    });

    return <div dangerouslySetInnerHTML={{ __html: data }}></div>;
}
