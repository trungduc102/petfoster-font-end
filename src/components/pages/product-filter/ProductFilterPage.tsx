'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { LoadingSecondary, MenuDropDownRadio, Pagination, Product } from '@/components';
import { ContainerContent, Sort } from '@/components/common';
import { SortType } from '@/configs/types';
import { dataTakeAction } from '@/datas/adopt';
import { dataProductFilter } from '@/datas/data-product-filter';
import { useQuery } from '@tanstack/react-query';
import { filterPage, typesAndBrands } from '@/apis/app';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { pushNoty } from '@/redux/slice/appSlice';
import { IDataRequestFilter } from '@/configs/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

export interface IProductFilterPageProps {}

export default function ProductFilterPage(props: IProductFilterPageProps) {
    const baseUrl = '/take-action/products';
    const searchParams = useSearchParams();

    const page = searchParams.get('page');
    const type = searchParams.get('type');

    const [filter, setFilter] = useState<IDataRequestFilter>({});

    const dispatch = useAppDispatch();

    const router = useRouter();

    const typesAndBrandsData = useQuery({
        queryKey: ['typeandbrand'],
        queryFn: () => typesAndBrands(),
    });

    const { data, error, isLoading } = useQuery({
        queryKey: ['productFilterPage/filter-date', filter, page],
        queryFn: () =>
            filterPage({
                ...filter,
                page: typeof page === 'string' ? parseInt(page) - 1 + '' : '0',
            }),
    });

    const conditionShowClearFiller = useCallback(() => {
        if (!filter) return false;

        if (filter.maxPrice || filter.minPrice || filter.stock || filter.brand) {
            return true;
        }
    }, [filter]);

    const handleClearAllFilter = () => {
        if (page) {
            router.push(baseUrl);
        }
        setFilter({
            ...filter,
            minPrice: undefined,
            maxPrice: undefined,
            stock: undefined,
            brand: undefined,
        });
    };

    if (typesAndBrandsData.error || error) {
        router.push('/');
        dispatch(
            pushNoty({
                title: 'Something went wrong !',
                type: 'error',
                open: true,
            }),
        );
    }

    useEffect(() => {
        if (!type) return;

        setFilter({
            ...filter,
            typeName: type,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    return (
        <ContainerContent className="">
            <Sort
                initDataCategory={type || ''}
                categories={typesAndBrandsData.data?.data.types || []}
                sorts={dataTakeAction.sorts}
                onCategories={(value) => {
                    if (page) {
                        router.push(baseUrl);
                    }
                    setFilter({
                        ...filter,
                        typeName: value || undefined,
                    });
                }}
                onSorts={(value: SortType) => {
                    if (value) {
                        setFilter({
                            ...filter,
                            sort: value,
                        });
                    }
                }}
                onSearch={(value: string) => {
                    setFilter({
                        ...filter,
                        productName: value || undefined,
                    });
                }}
            />

            <div className="flex md:flex-row flex-col justify-between min-h-[1000px] mt-9 gap-[38px]">
                <div className="w-full md:w-[24%] lg:w-[20%] min-h-full text-black-main select-none shadow-md p-5">
                    <div className="py-5 w-full border-b border-gray-primary flex items-center justify-between">
                        <h6 className="font-medium text-xl">Filter</h6>

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
                    <MenuDropDownRadio
                        clearValue={{
                            value: !conditionShowClearFiller(),
                            option: {
                                closeOnClear: true,
                            },
                        }}
                        onValues={(price) => {
                            if (price) {
                                if (page) {
                                    router.push(baseUrl);
                                }

                                const [min, max] = price.toString().split(',');

                                setFilter({
                                    ...filter,
                                    minPrice: min,
                                    maxPrice: max,
                                });
                            }
                        }}
                        title={'Price'}
                        data={dataProductFilter.fillters.prices}
                    />

                    <MenuDropDownRadio
                        clearValue={{
                            value: !conditionShowClearFiller(),
                            option: {
                                closeOnClear: true,
                            },
                        }}
                        onValues={(brand, name) => {
                            if (brand && typeof brand === 'string') {
                                if (page) {
                                    router.push(baseUrl);
                                }
                                setFilter({
                                    ...filter,
                                    brand: name,
                                });
                            }
                        }}
                        title={'Brand'}
                        data={typesAndBrandsData.data?.data.brands || []}
                    />
                </div>
                <div className="flex-1 flex flex-col items-center">
                    {data?.data && !isLoading && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] gap-y-9">
                                {data?.data.filterProducts.map((product) => {
                                    return <Product key={product.id} data={product} />;
                                })}
                            </div>
                            <Pagination baseHref={baseUrl + '?page='} pages={data.data.pages} />
                        </>
                    )}

                    {isLoading && <LoadingSecondary />}

                    {((data?.data && data.data.filterProducts.length <= 0) || !data?.data) && <p className="text-black-main text-lg">No products were found</p>}
                </div>
            </div>
        </ContainerContent>
    );
}
