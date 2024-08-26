import { AdorableSnapshotsProfilePage } from '@/components/pages';
import React from 'react';

export interface IAdorableSnapshotsProfileProps {
    params: { id: string };
}

export default function AdorableSnapshotsProfile({ params }: IAdorableSnapshotsProfileProps) {
    return <AdorableSnapshotsProfilePage id={params.id} />;
}
