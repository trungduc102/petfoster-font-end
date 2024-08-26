import { CreateUserPage, UpdateUserPage } from '@/components/pages';
import * as React from 'react';

export interface ICreateOrUpdateUserProps {
    params: {
        params: [string];
    };
}

export default function CreateOrUpdateUser({ params }: ICreateOrUpdateUserProps) {
    return params.params[0] === 'create' ? <CreateUserPage param="create" /> : <UpdateUserPage param={params.params[0]} />;
}
