'use client';
import { updatePetAdmin } from '@/apis/admin/pets';
import DetailPetManagementPage from '@/components/pages/pets/DetailPetManamentPage';
import React from 'react';

export interface IDetailPetManagementProps {
    params: { id: string };
}

export default function DetailPetManagement({ params }: IDetailPetManagementProps) {
    return <DetailPetManagementPage actionFN={updatePetAdmin} id={params.id} />;
}
