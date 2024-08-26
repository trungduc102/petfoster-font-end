'use client';
import React, { useMemo, useState } from 'react';
import WraperDialog from '../WraperDialog';
import { RowDetailAdopUser, RowDetailPostUser, Table } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getDataChartUsers, getUserManage } from '@/apis/admin/user';
import { IAdoption } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { Avatar } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment';
import { getAddressesWithUsernameByAdmin } from '@/apis/admin/addresses';
import { addressToString } from '@/utils/format';
import ChartDetailUserAdop from '@/components/dashboard/Charts/ChartDetailUserAdop';
import useGetChartDataUser from '@/hooks/useGetChartUserData';
import CharSocial from '@/components/dashboard/Charts/CharSocial';

export interface IDetailUserAdoptionDialogProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    data: IAdoption;
}

const dataHeadChart = ['', 'Placed / Wating', 'Shipping / Registed', 'Received / Adropted', 'Self cancel', 'Admin cancel', 'Total'];
const dataHeadSocial = ['', 'Posts', 'Post Liked', 'Comment Liked', 'Comments'];

export default function DetailUserAdoptionDialog({ open, data, setOpen }: IDetailUserAdoptionDialogProps) {
    const dataAddress = useQuery({
        queryKey: ['getAddresses', data.user.username],
        queryFn: () => {
            return getAddressesWithUsernameByAdmin(data.user.username);
        },
    });

    const { chart, social, seriesSocial, seriesChart } = useGetChartDataUser(data.user.id);

    const [showAllAddress, setShowAllAddress] = useState(false);
    const [styleShow, setStyleShow] = useState<'table' | 'chart'>('table');

    const addressMemo = useMemo(() => {
        if (!dataAddress.data) return null;

        if (!showAllAddress) {
            return dataAddress.data.data.filter((item) => {
                return item.isDefault;
            });
        }

        return dataAddress.data.data;
    }, [dataAddress, showAllAddress]);

    const handleTogleAddress = () => {
        setShowAllAddress((prev) => !prev);
    };

    console.log({ seriesSocial });

    return (
        <WraperDialog fullWidth={true} maxWidth={'lg'} open={open} setOpen={setOpen}>
            <div className="p-8 flex flex-col gap-5 scroll">
                <div className="flex items-end justify-between select-none w-full">
                    <div className="flex items-center w-full gap-6">
                        <div className={classNames('relative rounded-full overflow-hidden', {})}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                }}
                                alt="avatar"
                                src={data.user.avatar || contants.avartarDefault}
                            />
                        </div>

                        <div className="text-xl font-semibold text-black-main">
                            <h2>{data.user.displayName || data.user.username}</h2>
                            <div className="text-xs text-gray-400 font-normal mt-1 flex flex-col gap-[2px]">
                                <p>id: {data.user.id}</p>
                                <p>username: {data.user.username}</p>
                                <p>display name: {data.user.displayName}</p>
                                <span className="">created: {moment(data.user.createAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    {addressMemo &&
                        addressMemo.map((item) => {
                            return (
                                <div
                                    className={classNames('flex flex-col border rounded-lg p-3 text-sm', {
                                        ['border-blue-primary']: item.isDefault,
                                    })}
                                    key={item.id}
                                >
                                    <span className="whitespace-nowrap">Phone: {item.phone}</span>
                                    <span className="whitespace-nowrap">Address: {addressToString(item.address)}</span>
                                </div>
                            );
                        })}

                    {dataAddress.data && dataAddress.data?.data?.length > 1 && (
                        <span onClick={handleTogleAddress} className="text-sm text-blue-primary hover:underline text-center cursor-pointer">
                            {showAllAddress ? 'Show less' : 'Show more addresses'}
                        </span>
                    )}
                </div>

                <div className="mt-5">
                    <span
                        onClick={() => {
                            setStyleShow(styleShow === 'chart' ? 'table' : 'chart');
                        }}
                        className="text-sm text-blue-primary hover:underline cursor-pointer text-right capitalize w-full block my-2"
                    >
                        {styleShow === 'table' ? 'Chart' : 'Table'}
                    </span>
                    <div className="flex flex-col gap-10">
                        {/* Social */}
                        <div className="border border-gray-primary rounded-lg overflow-hidden">
                            {styleShow === 'table' && (
                                <Table
                                    dataHead={dataHeadSocial}
                                    styleHead={{
                                        align: 'center',
                                        ignores: [
                                            {
                                                index: 0,
                                                style: {
                                                    align: 'left',
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    {social.map((item, index) => {
                                        return <RowDetailPostUser key={index} data={item} />;
                                    })}
                                </Table>
                            )}

                            {styleShow === 'chart' && (
                                <div className="p-3">
                                    <CharSocial data={seriesSocial} />
                                </div>
                            )}
                        </div>

                        {/* Order */}

                        <div className="border border-gray-primary rounded-lg overflow-hidden ">
                            {styleShow === 'table' && (
                                <Table
                                    dataHead={dataHeadChart}
                                    styleHead={{
                                        align: 'center',
                                        ignores: [
                                            {
                                                index: 0,
                                                style: {
                                                    align: 'left',
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    {chart.map((item, index) => {
                                        return <RowDetailAdopUser key={index} data={item} />;
                                    })}
                                </Table>
                            )}

                            {styleShow === 'chart' && (
                                <div className="p-3">
                                    <ChartDetailUserAdop series={seriesChart} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </WraperDialog>
    );
}
