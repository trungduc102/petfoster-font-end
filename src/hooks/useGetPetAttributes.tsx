import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPetAttibutes } from '@/apis/pets';

export default function useGetPetAttributes() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['getPetAttributes'],
        queryFn: getPetAttibutes,
    });

    if (!data || data.errors || error) return { isLoading, data: null, refetch };

    return { isLoading, data: data.data, refetch };
}
