'use client';
import React, { useContext, useEffect, useState } from 'react';
import WraperDialog from './WraperDialog';
import { Chip, Grid, capitalize } from '@mui/material';
import { Comfirm, PrintButton, ReasonDialog, RowOrderSummaryUpdateStatus, Table, WrapperAnimation } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { statusColor } from '../../../tailwind.config';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { StateType } from '@/configs/types';
import { formatStatus, toCurrency, toStatus } from '@/utils/format';
import { getOrdersDetailAdminWithFilter, updateStatusOrder } from '@/apis/admin/orders';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { OrderAdminPageContext } from '../pages/admin/orders/OrdersAdminPage';
import Validate from '@/utils/validate';
import moment from 'moment';
import firebaseService from '@/services/firebaseService';
import { IRowStatusOrders } from '@/configs/interface';

const Header = ({ title, chip, options = { border: true }, buttonPrint }: { title: string; chip?: StateType; options?: { border?: boolean }; buttonPrint?: IRowStatusOrders }) => {
    return (
        <div
            className={classNames('flex items-center justify-between  text-2xl font-medium w-full  pb-4', {
                ['border-b border-gray-primary']: options?.border,
            })}
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <h2 className="capitalize">{title}</h2>
                    {chip && (
                        <Chip
                            label={formatStatus(chip)}
                            variant="outlined"
                            size="medium"
                            sx={{
                                backgroundColor: statusColor[chip],
                                borderColor: statusColor[chip],
                                textTransform: 'capitalize',
                            }}
                        />
                    )}
                </div>

                {buttonPrint && (
                    <div>
                        <PrintButton data={buttonPrint} />
                    </div>
                )}
            </div>
        </div>
    );
};

export interface IUpdateStateOrderDialogProps {
    idOpen: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function UpdateStateOrderDialog({ idOpen, open, setOpen }: IUpdateStateOrderDialogProps) {
    const context = useContext(OrderAdminPageContext);

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['ordersAdminPage/getOrdersDetailAdminWithFilter', idOpen],
        queryFn: () => getOrdersDetailAdminWithFilter(idOpen),
    });

    // state
    const [dataUpdate, setDataUpdate] = useState<StateType | null>(null);

    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });

    const renderStateUpdate = (curState: StateType): StateType[] => {
        let status: StateType[] = ['placed', 'shipping', 'delivered', 'cancelled'];

        switch (curState) {
            case 'placed': {
                return ['shipping', 'cancelled'];
            }
            case 'shipping': {
                return ['delivered', 'cancelled'];
            }
            case 'delivered': {
                return [];
            }
            case 'cancelled': {
                return [];
            }
            case 'cancelled_by_admin': {
                return [];
            }
            case 'cancelled_by_customer': {
                return [];
            }
            default: {
                return status;
            }
        }
    };

    if (error) {
        setOpen(false);
        toast.warn(contants.messages.errors.handle);
        return;
    }

    const dataDetail = data?.data;

    const status = dataDetail && toStatus(dataDetail.state.toLowerCase());

    const handleUpdateStatus = async (reason?: string) => {
        if (!dataUpdate || !dataDetail) return;

        if (contants.stateCancel.includes(dataUpdate) && (!reason || Validate.isBlank(reason))) return;

        try {
            const response = await updateStatusOrder({ id: dataDetail.id, status: dataUpdate, reason });

            if (!response) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            if (response.errors) {
                toast.warn(capitalize(response.message));
                return;
            }

            toast.success(`Change success #${dataDetail.id} form ${dataDetail.state} to ${capitalize(dataUpdate)}`);
            refetch();

            // send notifycaiton
            await sendNotifycation(reason);
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    const sendNotifycation = async (reason?: string) => {
        if (!dataDetail) return;

        switch (dataUpdate) {
            case 'shipping': {
                await firebaseService.publistStateShippingOrderNotification({ ...dataDetail, orderId: idOpen + '' });
                break;
            }
            case 'delivered': {
                await firebaseService.publistStateDeleveredOrderNotification({ ...dataDetail, orderId: idOpen + '' });
                break;
            }
            case 'cancelled': {
                console.log('abc');
                await firebaseService.publistStateCancelByAdminOrderNotification({ ...dataDetail, orderId: idOpen + '', reason: reason || '' });
                break;
            }
            case 'cancelled_by_admin': {
                return [];
            }
            case 'cancelled_by_customer': {
                return [];
            }
            default: {
                return status;
            }
        }
    };

    const handleOpenConfirm = (data: StateType) => {
        setOpenComfirm({ ...openComfirm, open: true });
        setDataUpdate(data || null);
    };

    const handleComfirm = async (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (v.open || v.comfirm === 'cancel') return;

        handleUpdateStatus();
    };

    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                },
            }}
            fullWidth={true}
            maxWidth={'xl'}
            open={open}
            setOpen={setOpen}
        >
            <div className="py-10 px-12 relative">
                <WrapperAnimation onClick={() => setOpen(false)} hover={{}} className="absolute right-12 text-2xl cursor-pointer flex items-center justify-center">
                    <FontAwesomeIcon icon={faXmark} />
                </WrapperAnimation>

                {dataDetail && (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={12} lg={5}>
                            <Header
                                title="DELIVERY DETAILS"
                                chip={status}
                                buttonPrint={{
                                    id: dataDetail.id,
                                    placedData: dataDetail.placedDate,
                                    price: dataDetail.total,
                                    status: dataDetail.state as StateType,
                                    user: dataDetail.username || '',
                                    print: dataDetail.print,
                                    read: dataDetail.read,
                                    token: dataDetail.token,
                                }}
                            />
                            <div className="w-full text-black-main py-6 border-b border-gray-primary mb-6">
                                <ul className="w-full flex flex-col gap-5">
                                    <li className="flex items-start gap-3">
                                        <span className="text-black font-medium">Order ID: </span> <p>#{dataDetail.id}</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-black font-medium">Date Placed: </span> <p> {dataDetail.placedDate}</p>
                                    </li>
                                    <li className="flex flex-col items-start gap-1">
                                        <span className="text-black font-medium whitespace-nowrap">Shipping Info: </span>
                                        <p>{`${dataDetail.name} - ${dataDetail.address}`}</p>
                                    </li>
                                    <li className="flex flex-col items-start gap-1">
                                        <span className="text-black font-medium">Payment Method: </span> <p>{dataDetail.paymentMethod}</p>
                                    </li>
                                    <li className="flex flex-col items-start gap-1">
                                        <span className="text-black font-medium">Delivery Method: </span> <p>{dataDetail.deliveryMethod}</p>
                                    </li>
                                    {status === 'cancelled' && (
                                        <li className="flex flex-col items-start gap-1">
                                            <span className="text-black font-medium">Reason: </span> <p>{dataDetail.description}</p>
                                        </li>
                                    )}
                                    {dataDetail.expectedTime && (
                                        <li className="flex flex-col items-start gap-1">
                                            <span className="text-black font-medium">Expected Time: </span> <p>{moment(dataDetail.expectedTime).format('D/MM/yyyy')}</p>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {renderStateUpdate(status || 'placed').length > 0 && <Header title="UPDATE STATUS" options={{ border: false }} />}
                            <div className="flex items-center gap-5">
                                {renderStateUpdate(status || 'placed').map((item) => {
                                    return (
                                        <WrapperAnimation onClick={() => handleOpenConfirm(item)} key={item} className="cursor-pointer">
                                            <Chip
                                                label={capitalize(item)}
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    backgroundColor: statusColor[item],
                                                    borderColor: statusColor[item],
                                                }}
                                            />
                                        </WrapperAnimation>
                                    );
                                })}
                            </div>
                        </Grid>
                        <Grid item xs={12} md={12} lg={7}>
                            <Header title="ORDER SUMMARY" />

                            <div className="py-6 ">
                                <div className="rounded-lg border border-gray-primary h-[400px] md:overflow-y-auto scroll">
                                    <Table
                                        styleHead={{
                                            align: 'center',
                                        }}
                                        dataHead={['Id', 'Product', 'Price', 'Size', 'Quantity']}
                                    >
                                        {dataDetail.products.map((item) => {
                                            return (
                                                <RowOrderSummaryUpdateStatus
                                                    key={`${item.id} ${item.size}`}
                                                    data={{
                                                        id: item.id,
                                                        image: item.image,
                                                        name: item.name,
                                                        price: item.price,
                                                        quantity: item.quantity,
                                                    }}
                                                />
                                            );
                                        })}
                                    </Table>
                                </div>

                                <ul className="px-6 py-5 flex flex-col gap-5">
                                    <li className="flex items-start justify-between gap-3">
                                        <span className="text-black font-medium">Subtotal: </span> <p>{toCurrency(dataDetail.subTotal)}</p>
                                    </li>
                                    <li className="flex items-start justify-between gap-3">
                                        <span className="text-black font-medium">Shipping Fee: </span> <p>{toCurrency(dataDetail.shippingFee)}</p>
                                    </li>
                                    <li className="flex items-start justify-between gap-3">
                                        <span className="text-black font-medium">Total: </span> <p>{toCurrency(dataDetail.total)}</p>
                                    </li>
                                </ul>
                            </div>
                        </Grid>
                    </Grid>
                )}
            </div>

            {dataUpdate && !contants.stateCancel.includes(dataUpdate) && (
                <Comfirm
                    title={'Notification'}
                    subtitle={
                        <>
                            {`Are want to update #`}
                            {<b>{dataDetail?.id}</b>} {` to `} <b>{capitalize(dataUpdate || '')}</b>
                        </>
                    }
                    open={openComfirm.open}
                    setOpen={setOpenComfirm}
                    onComfirm={handleComfirm}
                />
            )}

            {dataUpdate && contants.stateCancel.includes(dataUpdate) && (
                <ReasonDialog
                    onClose={() => setDataUpdate(null)}
                    handleAfterClickSend={async (reason) => {
                        await handleUpdateStatus(reason);
                        requestIdleCallback(() => {
                            setDataUpdate(null);
                        });
                    }}
                />
            )}
        </WraperDialog>
    );
}
