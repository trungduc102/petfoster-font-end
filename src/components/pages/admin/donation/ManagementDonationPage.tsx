'use client';
import { links } from '@/datas/links';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, useMemo, useState } from 'react';
import { filterTransaction, getTransaction } from '@/apis/transaction';
import Link from 'next/link';
import { BoxTitle, LoadingSecondary, Pagination, RowListTransaction, TableV2 } from '@/components';
import { IFilterDonationRequest, IRowTransaction } from '@/configs/interface';
import { SortAdmin } from '@/components/common';
import { HeadItem } from '@/components/inputs/tables/TableV2';
import { Box } from '@mui/material';
import { useDebounce } from '@/hooks';
import { toCurrency } from '@/utils/format';

const dataHeadTable = [
    { title: 'No' },
    { title: 'Id transaction' },
    { title: 'Beneficiary bank' },
    { title: 'To account number' },
    { title: 'From account number' },
    { title: 'When', asc: 'latest', desc: 'oldest' },
    { title: 'Amout' },
    { title: 'Description' },
];

export interface IManagementDoantionPageProps {}

export default function ManagementDoantionPage(props: IManagementDoantionPageProps) {
    const baseUrl = links.adminFuntionsLink.donation.index;
    const searchParams = useSearchParams();

    const router = useRouter();

    const page = searchParams.get('page');

    const [filter, setFilter] = useState<IFilterDonationRequest>({});

    const search = useDebounce(filter.search || '', 600);

    const rawData = useQuery({
        queryKey: ['donationPage', { ...filter, search }, page],
        queryFn: () =>
            filterTransaction({
                ...filter,
                search,
                page: typeof page === 'string' ? parseInt(page) - 1 + '' : '0',
            }),
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (page) {
            router.push(baseUrl);
        }
        setFilter({
            ...filter,
            search: e.target.value,
        });
    };

    if (rawData.isError || rawData.data?.errors) {
        notFound();
    }

    const data = useMemo(() => {
        if (!rawData.data?.data.data) return [] as IRowTransaction[];

        return rawData.data?.data.data;
    }, [rawData]);

    return (
        <BoxTitle mt="mt-0" title="List Donation">
            <SortAdmin
                searchProps={{
                    value: filter.search || '',
                    handleChange,
                    handleClose: () => {
                        if (filter.search) {
                            delete filter.search;
                            setFilter({ ...filter });
                        }
                    },
                }}
                dateProps={{
                    label: 'Donate at',
                    onDatas: (date) => {
                        if (!data) return;

                        setFilter({
                            ...filter,
                            minDate: date.start,
                            maxDate: date.end,
                        });
                    },
                }}
            />

            <div className="rounded-xl overflow-hidden border border-gray-primary relative">
                {data && (
                    <>
                        <TableV2
                            onSort={(value) => {
                                if (!value) return;

                                setFilter({
                                    ...filter,
                                    sort: value,
                                });
                            }}
                            dataHead={dataHeadTable as HeadItem[]}
                        >
                            {data.map((item, index) => {
                                return <RowListTransaction key={item.id} index={index} page={page} data={item} />;
                            })}
                        </TableV2>
                        {rawData.data && <div className="flex items-center justify-end px-7 py-5">Total: {toCurrency(rawData.data?.data.total)}</div>}
                    </>
                )}
                {data && data.length <= 0 && (
                    <div className="flex items-center justify-center py-5 text-violet-primary">
                        <b>No data available</b>
                    </div>
                )}

                {rawData.isLoading && (
                    <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-[rgba(0,0,0,0.04)]">
                        <LoadingSecondary />
                    </div>
                )}
            </div>

            {data && data.length > 0 && rawData.data && rawData.data.data.pages > 1 && (
                <Box mt={'-2%'}>{<Pagination baseHref={baseUrl + '?page='} pages={rawData?.data?.data.pages || 0} />}</Box>
            )}
        </BoxTitle>
    );
}
