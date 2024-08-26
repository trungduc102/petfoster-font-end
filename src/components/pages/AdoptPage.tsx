'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ContainerContent, Sort } from '../common';
import { dataTakeAction } from '@/datas/adopt';
import { SortType } from '@/configs/types';
import { LoadingPrimary, MenuDropDown, MenuDropDownRadio, Pagination, Pet } from '..';
import { Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { links } from '@/datas/links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { filterPets } from '@/apis/pets';
import { IRequestFilterPet } from '@/configs/interface';
import { useGetPetAttributes } from '@/hooks';
export interface AdoptPageProps {}

export default function AdoptPage({}: AdoptPageProps) {
    const baseUrl = links.pets.adoptPage;
    const searchParams = useSearchParams();

    const router = useRouter();

    const page = searchParams.get('page');

    const [filter, setFilter] = useState<IRequestFilterPet>({});

    const petAttributes = useGetPetAttributes();

    const rawData = useQuery({
        queryKey: ['petFilterPage/filterPets', filter, page],
        queryFn: () =>
            filterPets({
                ...filter,
                page: typeof page === 'string' ? parseInt(page) - 1 + '' : '0',
            }),
    });

    // states
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    // handle funtionals
    const conditionShowClearFiller = useCallback(() => {
        if (!filter) return false;

        if (filter.colors || filter.gender || filter.gender === false || filter.age) {
            return true;
        }
    }, [filter]);

    const handleClearAllFilter = () => {
        const persitKey = ['name', 'typeName', 'sort'];

        if (page) {
            router.push(baseUrl);
        }

        Object.keys(filter).forEach((key) => {
            if (!persitKey.includes(key)) {
                delete filter[key as keyof IRequestFilterPet];
            }
        });

        setFilter({
            ...filter,
        });
    };

    if (rawData.error || rawData.data?.errors) {
        notFound();
    }

    const data = rawData && rawData.data;

    return (
        <ContainerContent className="">
            <Sort
                categories={petAttributes?.data?.typies || []}
                onCategories={(value: SortType) => {
                    if (!value) {
                        if (filter.typeName) {
                            delete filter.typeName;
                            setFilter({ ...filter });
                        }

                        return;
                    }

                    setFilter({
                        ...filter,
                        typeName: value.toLowerCase(),
                    });
                }}
                onSorts={(value: SortType) => {
                    setFilter({
                        ...filter,
                        sort: value === 'low' ? 'latest' : 'oldest',
                    });
                }}
                onSearch={(value: string) => {
                    setFilter({
                        ...filter,
                        name: value,
                    });
                }}
                options={{
                    search: {
                        placeholder: 'Search for name pet...',
                    },
                    sort: {
                        title: 'Foster at',
                    },
                    categorie: {
                        title: 'Type',
                    },
                }}
            />

            <div className="flex md:flex-row flex-col justify-between min-h-[1000px] mt-9 gap-[38px]">
                <div className="w-full md:w-[24%] lg:w-[20%] h-full text-black-main select-none">
                    <div className="py-5 w-full border-b border-gray-primary flex items-center justify-between">
                        <h6 className="font-medium text-xl">Filters</h6>

                        {conditionShowClearFiller() && (
                            <Tooltip title="Clear all filters" placement="top">
                                <motion.div
                                    onClick={handleClearAllFilter}
                                    whileTap={{
                                        scale: 0.9,
                                    }}
                                >
                                    <FontAwesomeIcon className="cursor-pointer" icon={faRotateLeft} />
                                </motion.div>
                            </Tooltip>
                        )}
                    </div>
                    <MenuDropDown
                        clearValue={{
                            value: !conditionShowClearFiller(),
                            option: {
                                closeOnClear: true,
                            },
                        }}
                        onValues={(colors: string[]) => {
                            if (page) {
                                router.push(baseUrl);
                            }

                            if (!colors.length && filter.colors) {
                                delete filter.colors;
                                setFilter({ ...filter });
                                return;
                            }
                            setFilter({
                                ...filter,
                                colors: colors.join(','),
                            });
                        }}
                        title={'Color'}
                        data={petAttributes?.data?.colors.map((color) => color.name) || []}
                    />
                    <MenuDropDownRadio
                        clearValue={{
                            value: !conditionShowClearFiller(),
                            option: {
                                closeOnClear: true,
                            },
                        }}
                        onValues={(age) => {
                            if (age && typeof age === 'string') {
                                if (page) {
                                    router.push(baseUrl);
                                }
                                setFilter({
                                    ...filter,
                                    age,
                                });
                            }
                        }}
                        title={'Size'}
                        data={dataTakeAction.fillters.ages}
                    />

                    <MenuDropDownRadio
                        clearValue={{
                            value: !conditionShowClearFiller(),
                            option: {
                                closeOnClear: true,
                            },
                        }}
                        onValues={(gender) => {
                            if (gender && typeof gender === 'string') {
                                if (page) {
                                    router.push(baseUrl);
                                }
                                setFilter({
                                    ...filter,
                                    gender: gender === 'male',
                                });
                            }
                        }}
                        title={'Gender'}
                        data={dataTakeAction.fillters.genthers}
                    />
                </div>
                {((page && data?.data && parseInt(page) - 1 > data?.data.pages) || !data?.data.data.length) && !loading && (
                    <div className="flex-1 flex flex-col items-center text-black-main">
                        <b>No data available</b>
                    </div>
                )}
                {data?.data && data.data.data.length > 0 && !loading && (
                    <div className="flex-1 flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] gap-y-9">
                            {data?.data.data.map((pet) => {
                                return <Pet key={pet.id} data={pet} />;
                            })}
                        </div>
                        <Pagination baseHref={baseUrl + '?page='} pages={data?.data.pages || 1} />
                    </div>
                )}

                {(rawData.isLoading || loading) && <LoadingPrimary />}
            </div>
        </ContainerContent>
    );
}
