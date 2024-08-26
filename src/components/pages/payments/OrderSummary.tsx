'use client';
import styles from './styles/pamentcart.module.css';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { PaymentItem } from '..';
import { dataCart } from '@/datas/cart-data';
import OrderItem from './OrderItem';
import { toCurrency } from '@/utils/format';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { deletePayment, getPayment } from '@/redux/slice/cartsSlide';
import { unwrapResult } from '@reduxjs/toolkit';
import { RootState } from '@/configs/types';

export interface IOrderSummaryProps {
    dataDelevery: { title: string; business: string; price: number };
}

function OrderSummary({ dataDelevery }: IOrderSummaryProps) {
    //redux
    const dispatch = useAppDispatch();
    const { payment } = useAppSelector((state: RootState) => state.cartReducer);

    const total = useMemo(() => {
        if (payment.length <= 0) return 0;

        const results = payment.reduce((result, item) => {
            return (result += item.price * item.quantity);
        }, 0);
        return results;
    }, [payment]);

    const handleDelete = (index: number) => {
        dispatch(deletePayment(index));
    };

    return (
        <PaymentItem title="Order Summary">
            <div className="border border-gray-primary rounded-xl px-[32px] py-[25px]">
                <div id={styles['payment-cart']} className=" flex flex-col gap-5 max-h-[550px] overflow-y-auto">
                    {payment.map((item, index) => {
                        return <OrderItem onDeleteItem={() => handleDelete(index)} key={item.id + (item.size + '')} data={item} />;
                    })}
                </div>
                <div className="mt-7 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                        <span>Subtotal</span>
                        <p>{toCurrency(total)}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Shipping</span>
                        <p>{toCurrency(dataDelevery.price)}</p>
                    </div>
                    <div className="w-full h-[1px] bg-[#DBDBDB]"></div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                        <span>Total</span>
                        <p>{toCurrency(total + dataDelevery.price)}</p>
                    </div>
                </div>
            </div>
        </PaymentItem>
    );
}

export default memo(OrderSummary);
