'use client';
import { BoxTitle, Pagination } from '@/components';
import React from 'react';
import FeedbackItem from './FeedbackItem';
import { Box } from '@mui/material';
import { links } from '@/datas/links';
import { notFound, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '@/apis/admin/feedback';

export interface IFeedbackManagementPageProps {}

export default function FeedbackManagementPage(props: IFeedbackManagementPageProps) {
    // params
    const searchParams = useSearchParams();
    const page = searchParams.get('page');

    const rawFeedbacks = useQuery({
        queryKey: ['feedbackManagementPage', page],
        queryFn: () => getFeedbacks(page),
    });

    if (rawFeedbacks.isError || rawFeedbacks.data?.errors) {
        notFound();
    }

    const data = rawFeedbacks.data && rawFeedbacks.data.data;
    return (
        <BoxTitle mt="mt-0" mbUnderline="mb-0" border={false} title="FEEDBACKS MANAGEMENT" className="">
            {data && data.data.length <= 0 && <div className="py-5 text-sm">Total: {data?.total} feedback</div>}
            <div className="flex flex-col gap-5">
                {data &&
                    data.data.length > 0 &&
                    data.data.map((item) => {
                        return <FeedbackItem key={item.id} data={item} />;
                    })}

                {data && data.data.length <= 0 && (
                    <div className="border border-gray-primary py-5 px-7 rounded-xl shadow-xl text-black-main text-1xl flex flex-col justify-center items-center">
                        <span>No feedback</span>
                    </div>
                )}
            </div>

            {data && data.data.length > 0 && <Box mt={'-2%'}>{<Pagination baseHref={`${links.adminFuntionsLink.feedbacks.index}?page=`} pages={data.pages} />}</Box>}
        </BoxTitle>
    );
}
