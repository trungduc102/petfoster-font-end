'use client';
import { BannerTakeAction, ContainerContent } from '@/components/common';
import React from 'react';
import { CategoriesOverview, Overview } from '..';
import { LoadingPrimary, ProductRecents, Products } from '@/components';
import { useRouter } from 'next/navigation';
import { takeAction } from '@/apis/app';
import LogicalTakeAction from './LogicalTakeAction';
import { useQuery } from '@tanstack/react-query';

export interface ITakeAtionPageProps {}

export default function TakeAtionPage(props: ITakeAtionPageProps) {
    const router = useRouter();
    const { data, isLoading, error } = useQuery({
        queryKey: ['product/TakeAtionPage'],
        queryFn: () => takeAction(),
    });

    if (error) {
        router.push('/');
        return <span></span>;
    }

    return (
        <>
            <ContainerContent>
                <Overview />
                <CategoriesOverview />
            </ContainerContent>
            <Products data={data?.data.newArrivals || []} title="NEW ARRIVALS" />
            <BannerTakeAction />
            {/* <Products data={takeActionPageData.bestSellers.data} title="BEST SELLERS" pagination /> */}
            <LogicalTakeAction />
            <ProductRecents title={'YOUR RECENT VIEW'} />

            {isLoading && <LoadingPrimary />}
        </>
    );
}
