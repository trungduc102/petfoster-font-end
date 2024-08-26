'use client';
import { bestSellers } from '@/apis/app';
import { Products } from '@/components';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { takeActionPageData } from '@/datas/take-action';
export default function LogicalTakeAction() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['product/logicalTakeAction'],
        queryFn: () => bestSellers(0),
    });

    return (
        <>
            <Products id="best-sellers" loading={isLoading} data={error ? takeActionPageData.bestSellers.data : data?.data?.data || []} title="BEST SELLERS" />
        </>
    );
}
