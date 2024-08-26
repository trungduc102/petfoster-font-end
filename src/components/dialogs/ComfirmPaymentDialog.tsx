'use client';
import React, { memo, useEffect, useMemo, useState } from 'react';
import WraperDialog from './WraperDialog';
import { DialogContent, DialogTitle } from '@mui/material';
import { ContentComfirmPayment, WrapperAnimation } from '..';
import { ICart, IInfoAddress, IOrder } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { addressToString, capitalize, toCurrency, toGam } from '@/utils/format';
import { createOrder } from '@/apis/user';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { clearAllPayment } from '@/redux/slice/cartsSlide';
import { links } from '@/datas/links';
import { useRouter } from 'next/navigation';
import { dataCart } from '@/datas/cart-data';
import firebaseService from '@/services/firebaseService';
import { RootState } from '@/configs/types';

export interface IComfirmPaymentDialogProps {
    paymentData?: ICart[];
    addresses: IInfoAddress | null;
    form: IOrder;
    totalAndWeight: {
        value: number;
        weight: number;
        quantity: number;
    };
    open: boolean;
    setOpen: (v: boolean) => void;
    setLoading: (v: boolean) => void;
}

function ComfirmPaymentDialog({ open, setOpen, setLoading, addresses, totalAndWeight, form, paymentData }: IComfirmPaymentDialogProps) {
    // router
    const router = useRouter();

    // redux

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const dispatch = useAppDispatch();
    const [data, setData] = useState<IOrder>(form);

    const handleClearWhenSuccess = async (orderId?: number | string) => {
        dispatch(clearAllPayment());
        toast.success(contants.messages.success.payment);
        router.push(links.products);

        if (!paymentData || paymentData.length <= 0 || !user) return;

        await firebaseService.addSuccessfulPurchaseNotification({
            photourl: paymentData[0].image,
            username: user.username,
            displayName: user.displayName,
            orderId,
        });
    };

    const handleClickSubmit = async () => {
        if (totalAndWeight.weight > 30000 && form.deliveryId !== dataCart[0].id) {
            toast.warn(contants.messages.errors.exceedTheLimit);
            return;
        }
        setOpen(false);
        try {
            setLoading(true);
            const response = await createOrder(form);
            setLoading(false);
            if (!response) {
                toast.warn(contants.messages.errors.handle);
                return;
            }
            if (response.status !== 200) {
                toast.error(capitalize(response.message));
                return;
            }
            // handle cash method
            if (form.methodId == 1) {
                handleClearWhenSuccess(response.data);
                // handle pre-payment method
            } else if (form.methodId == 2) {
                window.location.assign(response.data);
            }
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    useEffect(() => {
        if (!form) return;
        setData(form);
    }, [form]);

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '18px',
                },
            }}
            fullWidth={true}
            maxWidth={'md'}
            open={open}
            setOpen={setOpen}
        >
            <DialogTitle
                sx={{
                    py: '20px',
                    px: '40px',
                    borderBottom: '1px solid #ECECEC',
                    fontWeight: '600',
                }}
                textAlign={'left'}
            >
                {'YOUR OPINION MATTERS TO US!'}
            </DialogTitle>

            <div className="flex items-start justify-between gap-6 rounded-xl px-10 mt-5 text-black-main">
                <ul className="max-w-[50%] flex flex-col gap-3">
                    <li className="text-xl font-semibold">Information</li>
                    <li className="flex flex-col text-1xl">
                        <p className="font-semibold"> Fullname: </p>
                        <span className=" tracking-wide ">{addresses && addresses.name}</span>
                    </li>
                    <li className="flex flex-col text-1xl">
                        <p className="font-semibold"> Phone: </p>
                        <span className=" tracking-wide ">{addresses && addresses.phone}</span>
                    </li>
                    <li className="flex flex-col text-1xl">
                        <p className="font-semibold"> Address: </p>
                        <span className=" tracking-wide ">{addresses && addressToString(addresses?.address)}</span>
                    </li>
                    <li className="flex flex-col text-1xl">
                        <p className="font-semibold">Payment Method:</p> <span className=" tracking-wide ">{data.methodId === 1 ? 'Cash' : 'Pre-Payment'}</span>
                    </li>
                    <li className="flex flex-col text-1xl">
                        {/* <p className="font-semibold">Delivery Method:</p> <span className=" tracking-wide ">{contants.dataCard[data.deliveryId - 1].title}</span> */}
                        <p className="font-semibold">Delivery Method:</p>{' '}
                        <span className=" tracking-wide ">{data.deliveryId === 1 ? contants.dataCard[0].title : contants.dataCard[1].title}</span>
                    </li>
                </ul>
                <ul className="flex-1 flex flex-col gap-3">
                    <li className="text-lg font-semibold">Order</li>

                    <li className="flex items-center text-1xl justify-between">
                        <p className="font-semibold">Total weight:</p> <span className="tracking-wide ">{toGam(totalAndWeight.weight)}</span>
                    </li>
                    <li className="flex items-center text-1xl justify-between">
                        <p className="font-semibold">Total order quantity: </p>
                        <span className=" tracking-wide ">x{totalAndWeight.quantity}</span>
                    </li>
                    <li className="flex items-center text-1xl justify-between">
                        <p className="font-semibold"> Subtotal: </p>
                        <span className=" tracking-wide ">{toCurrency(totalAndWeight.value)}</span>
                    </li>
                    <li className="flex items-center text-1xl justify-between">
                        <p className="font-semibold"> Ship: </p>
                        <span className=" tracking-wide ">{toCurrency(form.ship)}</span>
                    </li>
                    <li className="flex items-center text-1xl justify-between">
                        <p className="font-semibold"> Total: </p>
                        <span className=" tracking-wide ">{toCurrency(form.ship + totalAndWeight.value)}</span>
                    </li>
                </ul>
            </div>

            <div className="uppercase text-lg flex items-center w-full justify-end px-10 py-10 gap-5 ">
                <WrapperAnimation hover={{}} onClick={() => setOpen(false)} className="text-violet-primary text-1xl cursor-pointer">
                    cancel
                </WrapperAnimation>
                <WrapperAnimation
                    onClick={handleClickSubmit}
                    hover={{
                        y: -4,
                    }}
                    className="py-2 px-6 text-white bg-violet-primary rounded-md cursor-pointer text-1xl font-medium"
                >
                    OK
                </WrapperAnimation>
            </div>
        </WraperDialog>
    );
}

export default ComfirmPaymentDialog;
