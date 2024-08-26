import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { typesAndBrands } from '@/apis/app';

export default function useTypeAndBrand() {
    //use Query
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['typeandbrand'],
        queryFn: () => typesAndBrands(),
    });

    if (error)
        return {
            typesAndBrandsData: {
                types: [],
                brands: [],
            },
            isLoading,
            error,
            refetch,
        };

    if (data && data.data) {
        return {
            typesAndBrandsData: {
                types: data.data.types,
                brands: data.data.brands,
            },
            isLoading,
            error,
            refetch,
        };
    }
    return {
        typesAndBrandsData: {
            types: [],
            brands: [],
        },
        isLoading,
        error,
        refetch,
    };
}
