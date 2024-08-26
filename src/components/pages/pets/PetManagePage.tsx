'use client';
import { BoxTitle, Comfirm, LoadingSecondary, MenuDropDown, MenuDropDownRadio, Pagination, RowListPet, Table, TippyChooser, WrapperAnimation } from '@/components';
import { HeadHistory, SortAdmin } from '@/components/common';
import TableV2, { HeadItem } from '@/components/inputs/tables/TableV2';
import { IRequestFilterPetAdmin } from '@/configs/interface';
import { dataTakeAction } from '@/datas/adopt';
import { dataHeadPet } from '@/datas/header';
import { links } from '@/datas/links';
import { useDebounce, useGetPetAttributes } from '@/hooks';
import { Box, Drawer, SwipeableDrawer, Tooltip } from '@mui/material';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { filterPetsAdmin } from '@/apis/admin/pets';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

const dataHeadTable = [
    { title: 'No' },
    { title: 'ID' },
    { title: 'Name' },
    { title: 'Color' },
    { title: 'Size' },
    { title: 'Status' },
    { title: 'Foster At', asc: 'latest', desc: 'oldest' },
    { title: 'Breed' },
    { title: 'Gender' },
    { title: 'Spay' },
];

export interface IPetManagePageProps {}

export default function PetManagePage(props: IPetManagePageProps) {
    const petAttributes = useGetPetAttributes();

    const baseUrl = links.adminFuntionsLink.pets.index;
    const searchParams = useSearchParams();

    const router = useRouter();

    const page = searchParams.get('page');

    const [filter, setFilter] = useState<IRequestFilterPetAdmin>({});

    const [open, setOpen] = useState(false);

    const nameDeboundce = useDebounce(filter.name || '', 600);

    const rawData = useQuery({
        queryKey: ['petFilterPage/filterPetsAdmin', { ...filter, name: nameDeboundce }, page],
        queryFn: () =>
            filterPetsAdmin({
                ...filter,
                name: nameDeboundce,
                page: typeof page === 'string' ? parseInt(page) - 1 + '' : '0',
            }),
    });

    // handle funtionals
    const conditionShowClearFiller = useCallback(() => {
        if (!filter) return false;

        if (filter.colors || filter.gender === false || filter.gender || filter.age) {
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
                delete filter[key as keyof IRequestFilterPetAdmin];
            }
        });

        setFilter({
            ...filter,
        });
    };

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }

        setOpen(!open);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (page) {
            router.push(baseUrl);
        }
        setFilter({
            ...filter,
            name: e.target.value,
        });
    };

    if (rawData.error || rawData.data?.errors) {
        notFound();
    }

    const data = rawData && rawData.data;

    return (
        <BoxTitle
            mt="mt-0"
            title="List Pet"
            actions={
                <Link className="text-violet-primary hover:underline" href={links.adminFuntionsLink.pets.create}>
                    Create
                </Link>
            }
        >
            <SortAdmin
                searchProps={{
                    value: filter.name || '',
                    handleChange,
                    handleClose: () => {
                        if (filter.name) {
                            delete filter.name;
                            setFilter({ ...filter });
                        }
                    },
                }}
                sortProps={{
                    data: petAttributes.data?.typies.map((item) => ({ id: item.id as string, title: item.name })) || [],
                    title: 'Type',
                    onValue(value) {
                        if ((!value || value.title.length <= 0) && filter.typeName) {
                            delete filter.typeName;
                            setFilter({ ...filter });
                            return;
                        }

                        setFilter({ ...filter, typeName: value.title });
                    },
                }}
                dateProps={{
                    label: 'Foster at',
                    onDatas: (date) => {
                        if (!data) return;

                        setFilter({
                            ...filter,
                            minDate: date.start,
                            maxDate: date.end,
                        });
                    },
                }}
                childrenBeforeDate={
                    <WrapperAnimation onClick={() => setOpen((prev) => !prev)} hover={{}} className="flex items-center justify-center p-2 cursor-pointer">
                        <Tooltip placeholder="top" title="Filter advanced">
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </Tooltip>
                    </WrapperAnimation>
                }
            />

            <HeadHistory
                onTab={(tabTitle) => {
                    if (page) {
                        router.push(baseUrl);
                    }
                    if ((tabTitle.index === 0 && filter.status) || filter.status == 'ALL') {
                        delete filter.status;
                        setFilter({ ...filter });
                    } else {
                        setFilter({ ...filter, status: tabTitle.title });
                    }
                }}
                styles="border-bottom"
                iniData={dataHeadPet}
            />

            <div className="rounded-xl overflow-hidden border border-gray-primary relative">
                {data?.data && (
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
                        {data?.data.data.map((item, index) => {
                            return <RowListPet key={item.id} index={index} page={page} data={item} />;
                        })}
                    </TableV2>
                )}
                {data?.data && data?.data.data.length <= 0 && (
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

            {data?.data && data?.data.data.length > 0 && <Box mt={'-2%'}>{<Pagination baseHref={links.adminFuntionsLink.pets.index + '?page='} pages={data?.data.pages} />}</Box>}

            <SwipeableDrawer onClose={toggleDrawer()} onOpen={toggleDrawer()} anchor={'right'} open={open}>
                <div className="md:w-[440px] h-full pt-9 px-5 text-black-main">
                    <div className="py-5 w-full border-b border-gray-primary flex items-center justify-between">
                        <h6 className="font-medium text-xl">Filters</h6>

                        {conditionShowClearFiller() && (
                            <Tooltip title="Clear all filters" placement="top">
                                <WrapperAnimation onClick={handleClearAllFilter} hover={{}}>
                                    <FontAwesomeIcon className="cursor-pointer" icon={faRotateLeft} />
                                </WrapperAnimation>
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
            </SwipeableDrawer>
        </BoxTitle>
    );
}
