import { DetailOrderHistoryPage } from '@/components/pages';
import * as React from 'react';

export interface IDetailOrderProps {
    params: { id: '14' };
}

export default function DetailOrder(params: IDetailOrderProps) {
    return <DetailOrderHistoryPage id={params.params.id} />;
}
