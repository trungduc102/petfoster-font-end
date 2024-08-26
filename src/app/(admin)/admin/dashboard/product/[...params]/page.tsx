import { UpdateProductPage } from '@/components/pages';
import { ModeType } from '@/configs/types';
import * as React from 'react';

export interface ICreateOrUpdateProductProps {
    params: {
        params: [string, string];
    };
}

export default function CreateOrUpdateProduct({ params }: ICreateOrUpdateProductProps) {
    console.log(params.params);

    return <UpdateProductPage idProduct={params.params[0] as ModeType} />;
}
