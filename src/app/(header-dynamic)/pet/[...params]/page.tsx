/* eslint-disable @next/next/no-img-element */
'use client';
import { ImageAnimation } from '@/components';
import { ContainerContent } from '@/components/common';
import { DetailPetPage } from '@/components/pages';
import React from 'react';

export interface IDetailPetProps {
    params: { params: [string, string] };
}

export default function DetailPet({ params }: IDetailPetProps) {
    const [id, name] = params.params;

    return <DetailPetPage params={params.params} />;
}
