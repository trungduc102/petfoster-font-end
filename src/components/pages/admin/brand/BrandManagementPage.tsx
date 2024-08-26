'use client';
import { BoxTitle, FormBrandDialog, LoadingSecondary, RowBrand, SearchInput, Table } from '@/components';
import React, { ChangeEvent, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBrands } from '@/apis/admin/brand';
import { IBrand } from '@/configs/interface';
import Validate from '@/utils/validate';
import { useDebounce } from '@/hooks';
export interface IBrandManagementPageProps {}

export default function BrandManagementPage(props: IBrandManagementPageProps) {
    const brands = useQuery({
        queryKey: ['brands/getBrands'],
        queryFn: () => getBrands(),
    });

    // states
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState<{ open: boolean; data: IBrand | undefined }>({
        open: false,
        data: undefined,
    });

    const searchDebounce = useDebounce(search, 400);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleOpen = (data: IBrand | undefined) => {
        setOpen({ open: true, data });
    };

    const data = brands.data?.data;

    let dataAfterSort: IBrand[] = useMemo(() => {
        if (!data) return [];

        if (Validate.isBlank(searchDebounce)) return data;

        return data.filter((item) => {
            return JSON.stringify(item).toLowerCase().includes(searchDebounce.toLowerCase());
        });
    }, [searchDebounce, data]);

    return (
        <BoxTitle
            actions={
                <span onClick={() => handleOpen(undefined)} className="text-violet-primary hover:underline cursor-pointer">
                    Create
                </span>
            }
            mt="mt-0"
            mbUnderline="mb-0"
            border={false}
            title="Brands MANAGEMENT"
            className=""
        >
            <div className="flex items-center justify-between text-1xl mb-10 w-full">
                <SearchInput handleClose={() => setSearch('')} value={search} handleChange={handleChange} />
            </div>

            {data && (
                <div className="rounded-xl overflow-hidden border border-gray-primary relative">
                    <Table styleHead={{ align: 'center' }} dataHead={['No', 'Id', 'Name', 'Created At', 'Action']}>
                        {dataAfterSort.map((brand, index) => {
                            return <RowBrand handleOpenRow={handleOpen} key={brand.id} index={index} data={brand} />;
                        })}
                    </Table>
                    {dataAfterSort && dataAfterSort.length <= 0 && (
                        <div className="flex items-center justify-center py-5 text-violet-primary">
                            <b>No data available</b>
                        </div>
                    )}

                    {brands.isLoading && (
                        <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-[rgba(0,0,0,0.04)]">
                            <LoadingSecondary />
                        </div>
                    )}
                </div>
            )}

            <FormBrandDialog
                onAfterSubmit={() => {
                    brands.refetch();
                }}
                initData={open.data}
                open={open.open}
                setOpen={(v: boolean) => {
                    setOpen({ ...open, open: v });
                }}
            />
        </BoxTitle>
    );
}
