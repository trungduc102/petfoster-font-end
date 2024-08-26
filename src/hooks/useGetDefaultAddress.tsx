import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAddressesById, getDefaultAddress } from '@/apis/user';

export default function useGetDefaultAddress() {
    const [id, setId] = useState(0);

    //use Query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['getDefaultAddress', id],
        queryFn: () => (id === 0 ? getDefaultAddress() : getAddressesById(id)),
    });

    if (error) return { defaultAddress: null, isLoading, error, refetch, setId };

    return { defaultAddress: data?.data, isLoading, error, refetch, setId };
}
