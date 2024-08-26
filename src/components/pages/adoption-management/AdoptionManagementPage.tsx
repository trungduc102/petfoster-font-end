'use client';
import { BoxTitle, DialogDateChooser, LoadingPrimary, LoadingSecondary, Pagination, TableV2, TippyChooser } from '@/components';
import { HeadHistory, SortAdmin } from '@/components/common';
import { useQuery } from '@tanstack/react-query';
import { dataHeadAdoption } from '@/datas/header';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { filterAdoptionAdmin } from '@/apis/admin/adoption';
import { Box } from '@mui/material';
import { links } from '@/datas/links';
import { AdoptionPageItem } from '..';
import { IRequestFilterAdoptionAdmin } from '@/configs/interface';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks';
import { LabelAdopt } from '@/configs/types';

export interface IAdoptionManagementPageProps {}

const dataPopup = [
    {
        id: 'id-desc',
        title: 'Id desc',
    },
    {
        id: 'id-asc',
        title: 'Id asc',
    },
    {
        id: 'pet-desc',
        title: 'Pet desc',
    },
    {
        id: 'pet-asc',
        title: 'Pet asc',
    },

    {
        id: 'adopt-desc',
        title: 'Adopt desc',
    },
    {
        id: 'adopt-asc',
        title: 'Adopt asc',
    },
];

export default function AdoptionManagementPage(props: IAdoptionManagementPageProps) {
    const baseUrl = links.adminFuntionsLink.adoption.index;
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = searchParams.get('page');

    const [filter, setFilter] = useState<Partial<IRequestFilterAdoptionAdmin>>({});

    const nameDeboundce = useDebounce(filter.petName || '', 600);

    const rawData = useQuery({
        queryKey: ['adoptionManagement-page', , { ...filter, petName: nameDeboundce }, page],
        queryFn: () =>
            filterAdoptionAdmin({
                ...filter,
                petName: nameDeboundce,
                page: typeof page === 'string' ? parseInt(page) - 1 + '' : '0',
            }),
    });

    const data = useMemo(() => {
        if (!rawData || rawData.isError || rawData.data?.errors) return null;

        return rawData.data?.data;
    }, [rawData]);

    const handleBefore = useCallback(() => {
        rawData.refetch();
    }, [rawData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (page) {
            router.push(baseUrl);
        }
        setFilter({
            ...filter,
            petName: e.target.value,
        });
    };

    return (
        <BoxTitle mt="mt-0" mbUnderline="mb-0" border={false} title="ADOPTION MANAGEMENT" className="">
            <SortAdmin
                searchProps={{
                    placeholder: 'search for name pet',
                    value: filter.petName || '',
                    handleChange,
                    handleClose: () => {
                        if (filter.petName) {
                            delete filter.petName;
                            setFilter({ ...filter });
                        }
                    },
                }}
                childrenBeforeDate={
                    <TippyChooser
                        onValue={(sort) => {
                            console.log(sort);
                            setFilter({
                                ...filter,
                                sort: sort.id,
                            });
                        }}
                        title="Sort"
                        data={dataPopup}
                        styles={{
                            minWidth: 'min-w-[160px]',
                        }}
                    />
                }
            >
                <DialogDateChooser
                    onDatas={(date) => {
                        if (!data) return;

                        setFilter({
                            ...filter,
                            registerStart: date.start,
                            registerEnd: date.end,
                        });
                    }}
                    label="Register date"
                />
                <DialogDateChooser
                    onDatas={(date) => {
                        if (!data) return;

                        setFilter({
                            ...filter,
                            adoptStart: date.start,
                            adoptEnd: date.end,
                        });
                    }}
                    label="Adopt date"
                />
            </SortAdmin>
            <HeadHistory
                onTab={(tab) => {
                    if (page) {
                        router.push(baseUrl);
                    }
                    setFilter({
                        ...filter,
                        status: tab.title === 'All' ? 'all' : (tab.title.toLowerCase() as LabelAdopt),
                    });
                }}
                styles="outline"
                iniData={dataHeadAdoption}
            />

            <div className="w-full h-full relative flex flex-col gap-5">
                {data &&
                    data.data.map((item) => {
                        return (
                            <AdoptionPageItem
                                onBeforeCancel={handleBefore}
                                onBeforeAccept={handleBefore}
                                onBeforeComfirm={handleBefore}
                                advanced={true}
                                showDetailType={true}
                                styles={{ image: 'w-1/5' }}
                                key={item.id}
                                data={item}
                                showHeart={false}
                            />
                        );
                    })}

                {rawData.isLoading && (
                    <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-[rgba(0,0,0,0.04)]">
                        <LoadingSecondary />
                    </div>
                )}
            </div>

            {!data?.data ||
                (data.data.length <= 0 && (
                    <div className="flex-1 flex flex-col items-center text-violet-primary w-full min-h-[200px]">
                        <b>No data available</b>
                    </div>
                ))}

            {data && data.pages > 1 && <Box mt={'-2%'}>{<Pagination baseHref={baseUrl + `?page=`} pages={data.pages} />}</Box>}
        </BoxTitle>
    );
}
