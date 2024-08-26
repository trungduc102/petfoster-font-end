import { ReviewProductDetailPage } from '@/components/pages';
import React from 'react';

export interface IReviewProductDetailProps {
    params: { id: string };
}

export default function ReviewProductDetail({ params }: IReviewProductDetailProps) {
    return <ReviewProductDetailPage id={params.id} />;
}
