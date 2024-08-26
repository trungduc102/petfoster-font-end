'use client';
import { BorderLinearProgress, RatingStar, Review, TippyChooser } from '@/components';
import { contants } from '@/utils/contants';
import { Avatar, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getReview } from '@/apis/admin/reviews';
import { toast } from 'react-toastify';
import { notFound } from 'next/navigation';
import { IReviewHasReplay } from '@/configs/interface';
import ReviewOfDetail from './ReviewOfDetail';

export interface IReviewProductDetailPageProps {
    id: string;
}

export default function ReviewProductDetailPage({ id }: IReviewProductDetailPageProps) {
    const reviews = useQuery({
        queryKey: ['getReview/reviewProductDetailPage', id],
        queryFn: () => getReview(id),
    });

    const handleError = () => {
        toast.warn(contants.messages.errors.notFound);
        notFound();
    };

    if (reviews.error) {
        handleError();
    }

    const data = reviews.data?.data;

    return (
        <div className="text-black-main">
            <h3 className="text-2xl font-medium">Ratings & Reviews Of {`" ${data?.name} "`}</h3>

            <Grid pt={'3.4rem'} container spacing={4}>
                <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item lg={2}>
                    <Avatar
                        sx={{
                            width: '200px',
                            height: '200px',
                            '& .MuiAvatar-root': {
                                mixBlendMode: 'multiply',
                            },
                        }}
                        variant="rounded"
                        src={data?.image}
                    />
                </Grid>
                <Grid item lg={5}>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="flex items-start justify-center flex-col gap-4">
                            <span className="text-fill-heart text-[2.2rem] font-bold text-left ">{data?.rate.toFixed(1)}</span>
                            {data && <RatingStar sx={{ ml: '-12px' }} readOnly value={data.rate} precision={0.1} />}
                            <p className="text-lg ">{data?.totalRate} ratings</p>
                        </div>
                    </div>
                </Grid>
                <Grid item lg={5}>
                    <ul className="w-full flex-col flex items-center justify-center gap-3">
                        <li className="flex items-center justify-between text-sm gap-4">
                            <RatingStar defaultValue={5} readOnly className="text-xl mx-1" name="12312" />
                            <div className="flex-1 min-w-[200px] w-full">
                                <BorderLinearProgress variant="determinate" value={((data?.detailRate.five || 0) * 100) / (data?.totalRate || 0)} />
                            </div>
                            <span className="text-lg">{data?.detailRate.five}</span>
                        </li>
                        <li className="flex items-center justify-between text-sm gap-4">
                            <RatingStar defaultValue={4} readOnly className="text-xl mx-1" name="12312" />
                            <div className="flex-1 min-w-[200px] w-full">
                                <BorderLinearProgress variant="determinate" value={((data?.detailRate.four || 0) * 100) / (data?.totalRate || 0)} />
                            </div>
                            <span className="text-lg">{data?.detailRate.four}</span>
                        </li>
                        <li className="flex items-center justify-between text-sm gap-4">
                            <RatingStar defaultValue={3} readOnly className="text-xl mx-1" name="12312" />
                            <div className="flex-1 min-w-[200px] w-full">
                                <BorderLinearProgress variant="determinate" value={((data?.detailRate.three || 0) * 100) / (data?.totalRate || 0)} />
                            </div>
                            <span className="text-lg">{data?.detailRate.three}</span>
                        </li>
                        <li className="flex items-center justify-between text-sm gap-4">
                            <RatingStar defaultValue={2} readOnly className="text-xl mx-1" name="12312" />
                            <div className="flex-1 min-w-[200px] w-full">
                                <BorderLinearProgress variant="determinate" value={((data?.detailRate.two || 0) * 100) / (data?.totalRate || 0)} />
                            </div>
                            <span className="text-lg">{data?.detailRate.two}</span>
                        </li>
                        <li className="flex items-center justify-between text-sm gap-4">
                            <RatingStar defaultValue={1} readOnly className="text-xl mx-1" name="12312" />
                            <div className="flex-1 min-w-[200px] w-full">
                                <BorderLinearProgress variant="determinate" value={((data?.detailRate.one || 0) * 100) / (data?.totalRate || 0)} />
                            </div>
                            <span className="text-lg">{data?.detailRate.one}</span>
                        </li>
                    </ul>
                </Grid>
            </Grid>

            <ReviewOfDetail data={data} id={id} refetch={reviews.refetch} />
        </div>
    );
}
