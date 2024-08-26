'use client';
import { createPetAdmin } from '@/apis/admin/pets';
import DetailPetManagementPage from '@/components/pages/pets/DetailPetManamentPage';
import React from 'react';

export interface ICreatePetProps {}

export default function CreatePet(props: ICreatePetProps) {
    return <DetailPetManagementPage actionFN={createPetAdmin} />;
}
