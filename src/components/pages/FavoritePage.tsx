'use client';
import React from 'react';
import { Pets } from '..';
import { useQuery } from '@tanstack/react-query';
import { notFound, useSearchParams } from 'next/navigation';
import { getFavorite } from '@/apis/user';

export interface IFavoritePageProps {}

export default function FavoritePage(props: IFavoritePageProps) {
    // params
    const searchParams = useSearchParams();
    const page = searchParams.get('page');

    const rawData = useQuery({
        queryKey: ['favoritePage', page],
        queryFn: () => getFavorite(page),
    });

    if (rawData.error || rawData.data?.errors) {
        notFound();
    }

    const data = rawData.data && rawData.data.data;

    return (
        <Pets
            bottom="pagination"
            heading={<h2 className="text-black-main text-left pb-[35px] text-4xl font-bold uppercase">MY FAVORITE</h2>}
            options={{
                pages: data?.pages,
            }}
            background="bg-white"
            data={data?.data || []}
        />
    );
}
