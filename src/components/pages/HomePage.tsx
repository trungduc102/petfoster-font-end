'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feedback, ImpactOfYear, KnowldegeAboutFoster, Pets } from '..';
import { AboutCom } from '../common';
import { homepage } from '@/apis/app';
import { notFound } from 'next/navigation';
import { links } from '@/datas/links';

export interface IHomePageProps {}

// This is funtion server component
// All component don't have 'use client' is server component
export default function HomePage(props: IHomePageProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['homepage'],
        queryFn: () => homepage(),
    });

    if (error || data?.errors) {
        notFound();
    }

    return (
        <>
            <ImpactOfYear data={(data && data.data.impactOfYear) || []} />
            <AboutCom />
            <Pets
                options={{
                    buttonTitle: 'See all',
                    href: links.pets.adoptPage,
                }}
                data={(data && data.data.pets) || []}
            />
            <Feedback />
        </>
    );
}
