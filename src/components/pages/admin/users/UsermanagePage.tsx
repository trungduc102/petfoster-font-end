'use client';
import { deleteUser, usersManage } from '@/apis/admin/user';
import { BoxTitle, Comfirm, LoadingSecondary, Pagination, RowListUser, Table } from '@/components';
import { HeadHistory, SortAdmin } from '@/components/common';
import { DashboardCard } from '@/components/dashboard';
import { dataHeadListUser } from '@/datas/header';
import { links } from '@/datas/links';
import { useDebounce } from '@/hooks';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { pushNoty } from '@/redux/slice/appSlice';
import { contants } from '@/utils/contants';
import { Box } from '@mui/material';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const listHead = ['No', 'Avatar', 'Username', 'Display name', 'Fullname', 'Email', 'Gender', 'Phone', 'Role', 'Actions'];

const listSort = [
    {
        id: 'username-asc',
        title: 'Username asc',
    },
    {
        id: 'username-desc',
        title: 'Username desc',
    },
    {
        id: 'fullname-asc',
        title: 'Fullname asc',
    },
    {
        id: 'fullname-desc',
        title: 'Fullname desc',
    },
    {
        id: 'create-asc',
        title: 'Create asc',
    },
    {
        id: 'create-desc',
        title: 'Create desc',
    },
    {
        id: 'birthday-asc',
        title: 'Birthday asc',
    },
    {
        id: 'birthday-desc',
        title: 'Birthday desc',
    },
];

type FilterType = {
    keyword?: string;
    sort?: string;
    role?: string;
};

export interface IUserManagePageProps {}

export default function UserManagePage(props: IUserManagePageProps) {
    const searchParam = useSearchParams();
    const prevPage = searchParam.get('page');
    const page = prevPage ? parseInt(prevPage) - 1 : 0;
    const baseUrl = links.admin + 'users?page=';

    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });
    const [filter, setFilter] = useState<FilterType>({ role: 'user' });

    const [loading, setLoading] = useState(false);

    const [idDelete, setIdDelete] = useState('');
    const router = useRouter();
    const dispatch = useAppDispatch();

    const keywordDebound = useDebounce(filter.keyword || '', 600);

    const users = useQuery({
        queryKey: ['userManagePage/users', page, { ...filter, keyword: keywordDebound }],
        queryFn: () => usersManage(page, { ...filter, keyword: keywordDebound }),
    });

    const handleDeleteUser = (id: string) => {
        setOpenComfirm({ ...openComfirm, open: true });
        setIdDelete(id);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter({
            ...filter,
            keyword: e.target.value,
        });
    };

    if (users.error) {
        dispatch(
            pushNoty({
                title: `Something went wrong. Can't get data !`,
                open: true,
                type: 'error',
            }),
        );

        return;
    }

    const data = users && users.data?.data;

    return (
        <BoxTitle
            mt="mt-0"
            title="List User"
            actions={
                <Link className="text-violet-primary hover:underline" href={links.adminFuntionsLink.users.create}>
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
                        minWidth: 'min-w-[190px]',
                    },
                    data: listSort,
                    title: 'Sort by',
                    onValue(value) {
                        setFilter({
                            ...filter,
                            sort: value.id,
                        });
                    },
                }}
            />
            <HeadHistory
                onTab={(value) => {
                    setFilter({
                        ...filter,
                        role: value.index === 0 ? 'user' : 'admin',
                    });
                }}
                layouts="flex-start"
                styles="outline"
                iniData={dataHeadListUser}
            />

            {data && (
                <>
                    <div className="rounded-xl overflow-hidden border border-gray-primary relative">
                        <Table styleHead={{ align: 'center' }} dataHead={listHead}>
                            {data.data.map((item, index) => {
                                return <RowListUser key={item.id} index={index} handleDeleteUser={(id) => handleDeleteUser(id)} data={item} />;
                            })}
                        </Table>
                        {data.data.length <= 0 && (
                            <div className="flex items-center justify-center py-5 text-violet-primary">
                                <b>No data available</b>
                            </div>
                        )}

                        {(users.isLoading || loading) && (
                            <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-[rgba(0,0,0,0.04)]">
                                <LoadingSecondary />
                            </div>
                        )}
                    </div>
                    <Box mt={'-2%'} mb={'4%'}>
                        {data.pages > 1 && <Pagination baseHref={baseUrl} pages={data.pages} />}
                    </Box>
                </>
            )}

            {data?.data && (
                <Comfirm
                    title={'Comfirm delete user'}
                    open={openComfirm.open}
                    setOpen={setOpenComfirm}
                    onComfirm={async (value) => {
                        if (value.comfirm === 'ok' && idDelete !== '') {
                            try {
                                setLoading(true);
                                const response = await deleteUser(idDelete);
                                setLoading(false);
                                if (response.errors) {
                                    toast.error("Can't delete this user. try again");
                                    return;
                                }
                                users.refetch();
                                if (page && data.pages && page > data.pages - 1) {
                                    router.push(links.admin + 'product');
                                }

                                toast.success(`${idDelete} deleted`);
                                return;
                            } catch (error) {
                                setLoading(false);
                                toast.success(`Can't delete this user. try again`);
                            }
                        }
                    }}
                />
            )}
        </BoxTitle>
    );
}
