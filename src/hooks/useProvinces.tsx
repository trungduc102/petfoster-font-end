import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProvinces } from '@/apis/outside';

export default function useProvinces() {
    //use Query
    const { data, isLoading, error } = useQuery({
        queryKey: ['getProvinces'],
        queryFn: () => getProvinces(),
    });

    if (error) return { provinces: [], isLoading, error };

    return { provinces: data, isLoading, error };
}
