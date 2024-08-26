'use client';
import { Pagination, RowListTransaction, TableV2 } from '@/components';
import { HeadItem } from '@/components/inputs/tables/TableV2';
import { donationMethod } from '@/datas/donation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { BaseBreadcrumbs } from '../common';
import { links } from '@/datas/links';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { getTransaction } from '@/apis/transaction';
import { IRowTransaction } from '@/configs/interface';
import { Box } from '@mui/material';

export interface IDonationPageProps {}

const dataHeadTable = [{ title: 'No' }, { title: 'Beneficiary bank' }, { title: 'To account' }, { title: 'When' }, { title: 'Amout' }, { title: 'Description' }];

export default function DonationPage(props: IDonationPageProps) {
    const baseUrl = links.donation;
    const searchParams = useSearchParams();

    const router = useRouter();

    const page = searchParams.get('page');

    const rawData = useQuery({
        queryKey: ['donationPage', page],
        queryFn: () => getTransaction(page + ''),
    });

    if (rawData.isError || rawData.data?.errors) {
        notFound();
    }

    const data = useMemo(() => {
        if (!rawData.data?.data.data) return [] as IRowTransaction[];

        return rawData.data?.data.data;
    }, [rawData]);

    return (
        <BaseBreadcrumbs
            isLoading={rawData.isLoading}
            title="List Donation"
            breadcrumb={[
                {
                    title: 'donation',
                    href: links.donation,
                },
            ]}
        >
            <div className="flex gap-10">
                <div className="w-3/4">
                    <TableV2 dataHead={dataHeadTable as HeadItem[]}>
                        {data.map((item, index) => {
                            return <RowListTransaction showIdTransaction={false} key={item.id} page={page} index={index} data={item} />;
                        })}
                    </TableV2>

                    {data && data.length > 1 && rawData.data && rawData.data?.data.pages > 1 && (
                        <Box mt={'-2%'}>{<Pagination baseHref={`${baseUrl}?page=`} pages={rawData.data?.data.pages || 0} />}</Box>
                    )}
                </div>
                <ul className="flex flex-col gap-5 flex-1">
                    {donationMethod.map((item) => {
                        return (
                            <li key={item.image} className="grid grid-cols-2 gap-2 items-center ">
                                <div className="relative w-[50%] h-[96px]">
                                    <Image fill src={item.image} className="object-contain" alt="tp-bank" />
                                </div>
                                <div className="text-1xl text-black-main flex-1">
                                    <span>{item.name}</span>
                                    <p className="mt-1">{item.bankNumber}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </BaseBreadcrumbs>
    );
}
