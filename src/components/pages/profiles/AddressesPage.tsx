'use client';
import React, { MouseEvent, createContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BaseProfilePage } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddressForm, AddressItem, BaseAddressDialog, Comfirm, LoadingSecondary, WrapperAnimation } from '@/components';
import { deleteAddress, getAddresses } from '@/apis/user';
import { IInfoAddress } from '@/configs/interface';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { addressToString } from '@/utils/format';

export const BaseProfilePageContext = createContext<{
    refetch: () => any;
}>({ refetch: () => {} });

export interface IAddressesPageProps {}

export default function AddressesPage(props: IAddressesPageProps) {
    //use Query
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['getAddresses'],
        queryFn: () => getAddresses(),
    });

    const [open, setOpen] = useState(false);
    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });
    const [updateData, setUpdateData] = useState<{
        data: IInfoAddress | null;
        updateMode: boolean;
    }>({
        data: null,
        updateMode: false,
    });

    const [deleteData, setDeleteData] = useState<IInfoAddress | null>(null);
    const handleClose = () => {
        setOpen(false);

        if (updateData.updateMode) {
            setUpdateData({
                data: null,
                updateMode: false,
            });
        }
    };

    const handleDelete = async () => {
        try {
            if (!deleteData) return;

            const response = await deleteAddress(deleteData);

            if (!response.data) {
                toast.error(response.message);
                return;
            }

            refetch();
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const handleOpenConfirm = (e?: MouseEvent<HTMLSpanElement>, data?: IInfoAddress) => {
        setOpenComfirm({ ...openComfirm, open: true });
        setDeleteData(data || null);
    };

    const handleComfirm = async (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (v.open || v.comfirm === 'cancel') return;

        handleDelete();
    };

    const handleUpdate = (e?: MouseEvent<HTMLSpanElement>, data?: IInfoAddress) => {
        if (!data) return;

        setUpdateData({
            data,
            updateMode: true,
        });

        setOpen(true);
    };

    return (
        <BaseProfilePageContext.Provider value={{ refetch }}>
            <BaseProfilePage
                title="ADDRESS LIST"
                action={
                    <WrapperAnimation hover={{}}>
                        {data && data.data.length < 4 && (
                            <button
                                onClick={() => setOpen(true)}
                                className="flex items-center justify-center py-2 px-4 bg-green-65a30d text-white font-medium text-1xl gap-1 hover:rounded transition"
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-[18px]" />
                                <span>Add address</span>
                            </button>
                        )}
                    </WrapperAnimation>
                }
            >
                <div className="">
                    {data && data?.data && (
                        <div key={'address-list'} className="w-full h-full">
                            {data.data.length > 0 ? (
                                data.data.map((address) => {
                                    return <AddressItem handleEdit={handleUpdate} handleDelete={handleOpenConfirm} key={address.id} data={address} />;
                                })
                            ) : (
                                <div className="flex items-center justify-center h-[133px] border-b border-gray-primary">
                                    <span>{"You don't have a delivery address yet"}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {isLoading && <LoadingSecondary />}
                </div>
            </BaseProfilePage>

            <BaseAddressDialog
                title={
                    <>
                        <div className="flex items-center ">
                            <h2 className="font-semibold uppercase">{'SHIPPING INFO'}</h2>
                        </div>
                        <WrapperAnimation onClick={handleClose} hover={{}} className="flex items-center justify-center p-5 pr-0">
                            <FontAwesomeIcon className="cursor-pointer" icon={faXmark} />
                        </WrapperAnimation>
                    </>
                }
                open={open}
                setOpen={setOpen}
            >
                {open && (
                    <AddressForm
                        showNotiAdopt={true}
                        initData={updateData.data || undefined}
                        updateMode={updateData.updateMode}
                        onBeforeAdd={() => {
                            requestIdleCallback(() => {
                                refetch();
                                handleClose();
                            });
                        }}
                        onBeforeUpdate={() => {
                            requestIdleCallback(() => {
                                refetch();
                                handleClose();
                            });
                        }}
                    />
                )}

                <Comfirm
                    title={'Notification'}
                    subtitle={
                        <>
                            {'Are want to delete '} {deleteData && !deleteData.isDefault ? <b>{addressToString(deleteData?.address)}</b> : <b>{'default address'}</b>}
                        </>
                    }
                    open={openComfirm.open}
                    setOpen={setOpenComfirm}
                    onComfirm={handleComfirm}
                />
            </BaseAddressDialog>
        </BaseProfilePageContext.Provider>
    );
}
