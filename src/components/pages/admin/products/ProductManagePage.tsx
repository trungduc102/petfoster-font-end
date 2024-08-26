/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

import Tippy from '@tippyjs/react/headless';
import { productManageListData } from '@/datas/product-manage-data';
import { BoxTitle, Comfirm, LoadingPrimary, LoadingSecondary, Pagination, RowListProduct, SekeletonTableItems, Table, TableV2, TippyChooser } from '@/components';
import Link from 'next/link';
import { DashboardCard } from '@/components/dashboard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { deleteProduct, productManage } from '@/apis/admin/product';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { pushNoty } from '@/redux/slice/appSlice';
import { IRepository } from '@/configs/interface';
import { links } from '@/datas/links';
import { formatIndex } from '@/utils/format';
import { SortAdmin } from '@/components/common';
import { Box } from '@mui/material';
import { useDebounce, useTypeAndBrand } from '@/hooks';
import { TippyChooserType } from '@/configs/types';
import Validate from '@/utils/validate';
import { HeadItem } from '@/components/inputs/tables/TableV2';
export interface IProductManagePageProps {}

const dataHead = ['No', 'Id', 'Image', 'Name', 'Brand', 'Type', 'Total Repository', 'Actions'];

const listSort = [
    {
        id: 'id-asc',
        title: 'Id asc',
    },
    {
        id: 'id-desc',
        title: 'Id desc',
    },
    // {
    //     id: 'date-asc',
    //     title: 'Date asc',
    // },

    // {
    //     id: 'date-desc',
    //     title: 'Date desc',
    // },
    {
        id: 'name-asc',
        title: 'Name asc',
    },

    {
        id: 'name-desc',
        title: 'Name desc',
    },
];

type FilterType = {
    keyword?: string;
    typeName?: string;
    brand?: string;
    sort?: string;
};

export default function ProductManagePage(props: IProductManagePageProps) {
    const router = useRouter();

    // cutom hook

    const typeAndBrand = useTypeAndBrand();

    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });
    const [filter, setFilter] = useState<FilterType>({});

    const [loading, setLoading] = useState(false);

    const [idDelete, setIdDelete] = useState('');

    const searchParams = useSearchParams();
    const dispath = useAppDispatch();

    const page = searchParams.get('page');

    const keywordDebound = useDebounce(filter.keyword || '', 600);

    const product = useQuery({
        queryKey: ['products-manage', page, { ...filter, keyword: keywordDebound }],
        queryFn: () => productManage(page ? parseInt(page) - 1 : 0, { ...filter, keyword: keywordDebound }),
    });

    const getTotalQuantiyRepo = useCallback((arr: IRepository[]): number => {
        return arr.reduce((acumentlator, curentValue) => {
            return (acumentlator += curentValue.quantity);
        }, 0);
    }, []);

    const listTypeAndBand = useMemo(() => {
        if (typeAndBrand.error) return { type: [], brand: [] };

        if (!typeAndBrand.typesAndBrandsData) return { type: [], brand: [] };

        const { typesAndBrandsData } = typeAndBrand;

        const brand = typesAndBrandsData.brands.map((item) => {
            return {
                id: item.id,
                title: item.name,
            } as TippyChooserType;
        });
        const type = typesAndBrandsData.types.map((item) => {
            return {
                id: item.id,
                title: item.name,
            } as TippyChooserType;
        });

        return { type, brand };
    }, [typeAndBrand]);

    if (product.error) {
        dispath(
            pushNoty({
                title: "Something went wrong !, Can't get data",
                open: true,
                type: 'error',
            }),
        );
        return;
    }

    const handleDeleteProduct = (id: string) => {
        setOpenComfirm({ ...openComfirm, open: true });
        setIdDelete(id);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter({
            ...filter,
            keyword: e.target.value,
        });
    };

    const data = product.data && product.data.data;

    return (
        <BoxTitle
            mt="mt-0"
            title="List Product"
            actions={
                <Link className="text-violet-primary hover:underline" href={links.adminFuntionsLink.product.create}>
                    Create
                </Link>
            }
        >
            <SortAdmin
                searchProps={{
                    value: filter.keyword || '',
                    handleChange,
                    handleClose: () => setFilter({ ...filter, keyword: undefined }),
                }}
                sortProps={{
                    styles: {
                        minWidth: 'min-w-[160px]',
                    },
                    data: listTypeAndBand.brand,
                    title: 'Brand',
                    onValue(value) {
                        if (Validate.isBlank(value.title) && filter.brand) {
                            delete filter.brand;
                            setFilter({
                                ...filter,
                            });
                            return;
                        }
                        setFilter({
                            ...filter,
                            brand: value.title,
                        });
                    },
                }}
            >
                <TippyChooser
                    styles={{
                        minWidth: 'min-w-[160px]',
                    }}
                    title="Type"
                    data={listTypeAndBand.type}
                    onValue={(value) => {
                        if (Validate.isBlank(value.title) && filter.typeName) {
                            delete filter.typeName;
                            setFilter({
                                ...filter,
                            });
                            return;
                        }
                        setFilter({
                            ...filter,
                            typeName: value.title,
                        });
                    }}
                />
                <TippyChooser
                    styles={{
                        minWidth: 'min-w-[160px]',
                    }}
                    title="Sort by"
                    data={listSort}
                    onValue={(value) => {
                        setFilter({
                            ...filter,
                            sort: value.id,
                        });
                    }}
                />
            </SortAdmin>

            {data && (
                <>
                    <div className="rounded-xl overflow-hidden border border-gray-primary relative">
                        <Table styleHead={{ align: 'center' }} dataHead={dataHead}>
                            {data.data.map((item, index) => {
                                return (
                                    <RowListProduct
                                        key={item.id}
                                        index={index}
                                        page={page}
                                        handleTotalQuantiyRepo={getTotalQuantiyRepo}
                                        handleDeleteProduct={(id) => handleDeleteProduct(id)}
                                        data={item}
                                    />
                                );
                            })}
                        </Table>

                        {data.data.length <= 0 && (
                            <div className="flex items-center justify-center py-5 text-violet-primary">
                                <b>No data available</b>
                            </div>
                        )}

                        {(product.isLoading || loading) && (
                            <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-[rgba(0,0,0,0.04)]">
                                <LoadingSecondary />
                            </div>
                        )}
                    </div>
                    <Box mt={'-2%'}>{data.pages > 1 && <Pagination baseHref="/admin/dashboard/product?page=" pages={data.pages} />}</Box>
                </>
            )}

            {data && (
                <Comfirm
                    title={'Comfirm delete product'}
                    subtitle={<span className="normal-case">You want to delete this product ?</span>}
                    open={openComfirm.open}
                    setOpen={setOpenComfirm}
                    onComfirm={async (value) => {
                        if (value.comfirm === 'ok' && idDelete !== '') {
                            try {
                                setLoading(true);
                                const response = await deleteProduct(idDelete);
                                setLoading(false);

                                if (response.errors) {
                                    dispath(
                                        pushNoty({
                                            title: `Can't delete this product. try again`,
                                            open: true,
                                            type: 'error',
                                        }),
                                    );
                                    return;
                                }

                                product.refetch();

                                if (page && data.pages && parseInt(page) > data.pages - 1) {
                                    router.push(links.admin + 'product');
                                }
                                dispath(
                                    pushNoty({
                                        title: `${idDelete} deleted`,
                                        open: true,
                                        type: 'success',
                                    }),
                                );
                                return;
                            } catch (error) {
                                setLoading(false);
                                dispath(
                                    pushNoty({
                                        title: `Can't delete this product. try again`,
                                        open: true,
                                        type: 'error',
                                    }),
                                );
                            }
                        }
                    }}
                />
            )}
        </BoxTitle>
    );
}
