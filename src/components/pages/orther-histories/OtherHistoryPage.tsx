'use client';
import { Pagination } from '@/components';
import { HeadHistory } from '@/components/common';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import OtherHistoryItem from './OtherHistoryItem';
import { useRouter, useSearchParams } from 'next/navigation';
import { BaseBreadcrumbs } from '../common';
import { links } from '@/datas/links';
import { otherHistory } from '@/apis/user';
export interface IOttherHistoryProps {}

export default function OttherHistoryPage(props: IOttherHistoryProps) {
    // param
    const searchParams = useSearchParams();
    const router = useRouter();
    const page = searchParams.get('page');

    // state
    const [status, setStatus] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['histories/otherHistory', page, status],
        queryFn: () => otherHistory(page ? parseInt(page) - 1 : undefined, status),
    });

    // variables

    const conditionCheck = data?.data && data.data.data;

    if (error) {
        router.push(links.auth.login);
        return;
    }

    return (
        <>
            <BaseBreadcrumbs
                stytle={{
                    mbUnderline: '0px',
                    border: false,
                }}
                title="MY ORDERS"
                isLoading={isLoading}
                breadcrumb={[
                    {
                        title: 'Order History',
                        href: links.history.orderHistory,
                    },
                ]}
            >
                <HeadHistory
                    onTab={(status) => {
                        if (parseInt(page || '1') > 1) {
                            router.push(links.history.orderHistory + `?page=1`);
                        }
                        setStatus(status.title.toLowerCase() === 'all order' ? '' : status.title);
                    }}
                />
                {conditionCheck && data.data.data.length > 0 && !isLoading && (
                    <>
                        <div className="flex flex-col items-center gap-8">
                            {data?.data?.data.map((item) => {
                                return <OtherHistoryItem key={item.id} data={item} />;
                            })}
                        </div>
                        <Pagination baseHref="/other-history?page=" pages={data.data.pages} />
                    </>
                )}
                {!conditionCheck && status === '' && (
                    <div className="flex items-center justify-center py-10">
                        <p className="flex items-center gap-1">
                            You have not purchased any products yet,{' '}
                            <Link href={'/take-action'} className="hover:underline text-violet-primary cursor-pointer font-medium">
                                shoping now
                            </Link>
                        </p>
                    </div>
                )}
                {!conditionCheck && status !== '' && (
                    <div className="flex items-center justify-center py-10">
                        <p className="flex items-center gap-1">
                            There are no orders <b>{status}</b>,{' '}
                            <Link href={'/take-action'} className="hover:underline text-violet-primary cursor-pointer font-medium">
                                shoping now
                            </Link>
                        </p>
                    </div>
                )}
            </BaseBreadcrumbs>
        </>
    );
}
