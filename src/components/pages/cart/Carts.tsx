'use client';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Cart from './Cart';
import { dataCart } from '@/datas/cart-data';
import { ICart } from '@/configs/interface';
import { Checkbox } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { checkedAll, getCheckedAllCart, setCheckedAllCartItem, updateDataCartWhenMount } from '@/redux/slice/cartsSlide';

export interface ICartsProps {
    data: ICart[];
    onTotal?: (value: number) => void;
}

export default function Carts({ data, onTotal }: ICartsProps) {
    const { cartUser, checkAll } = useAppSelector((state: RootState) => state.cartReducer);
    const [checked, setChecked] = useState(checkAll);

    const dispatch = useAppDispatch();

    const cartUserMemo = useMemo(() => {
        return cartUser;
    }, [cartUser]);

    const total = useMemo(() => {
        if (cartUserMemo.length <= 0) return 0;

        const newCart = cartUserMemo.filter((item) => {
            return item.checked;
        });

        const results = newCart.reduce((result, item) => {
            return (result += item.price * item.quantity);
        }, 0);
        return results;
    }, [cartUserMemo]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);

        dispatch(checkedAll(event.target.checked));
        dispatch(setCheckedAllCartItem(event.target.checked));
    };

    useEffect(() => {
        setChecked(checkAll);
    }, [checkAll]);

    useEffect(() => {
        if (!onTotal) return;

        onTotal(total);
    }, [total, onTotal]);

    useEffect(() => {
        dispatch(getCheckedAllCart());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="flex items-center py-4 text-sm md:text-1xl border-b border-gray-primary font-semibold text-black-main">
                <div className="w-[8%] flex items-center">
                    <Checkbox onChange={handleChange} checked={checked} />
                </div>
                <div className="flex-1 ml-8 flex flex-col items-center justify-center gap-5">
                    <span>Product</span>
                </div>
                <div className="w-[40%] lg:w-[10%] flex flex-col items-center justify-center">
                    <span>Quantity</span>
                </div>

                <div className="ml-2 md:w-[16%] flex items-center justify-center">
                    <span>Price</span>
                </div>

                <div className="ml-2 md:w-[16%] flex items-center justify-center">
                    <span>Total</span>
                </div>
            </div>
            {cartUser.map((cart, index) => {
                return <Cart index={index} key={cart.id + cart.size.toString() + cart.brand} data={cart} />;
            })}
        </>
    );
}
