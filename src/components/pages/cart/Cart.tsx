/* eslint-disable @next/next/no-img-element */
'use client';
import { ICart } from '@/configs/interface';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { toCurrency, toGam } from '@/utils/format';
import Quantity from './Quantity';
import { Checkbox } from '@mui/material';
import { modifyChecked, modifyQuantity, removeCart } from '@/redux/slice/cartsSlide';
import { Comfirm } from '@/components';
import { useAppDispatch } from '@/hooks/reduxHooks';

export interface ICartProps {
    data: ICart;
    index: number;
}

function Cart({ data, index }: ICartProps) {
    const [quantity, setQuantity] = useState(data.quantity);
    const [checked, setChecked] = useState(data.checked);
    const [openComfirm, setOpenComfirm] = useState({ open: false, comfirm: 'cancel' });

    const dispatch = useAppDispatch();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);

        dispatch(modifyChecked({ data, checked: event.target.checked }));
    };

    const handleRemove = () => {
        setOpenComfirm({ ...openComfirm, open: true });
    };

    const handleComfirm = (v: { open: boolean; comfirm: 'cancel' | 'ok' }) => {
        if (v.comfirm === 'cancel') return;

        dispatch(removeCart({ data, index }));
    };

    useEffect(() => {
        setChecked(data.checked);
    }, [data.checked]);

    return (
        <div className="flex items-center py-[34px] h-[170px] border-b border-gray-primary text-black-main max-w-full">
            <div className="w-[8%]">
                {data.repo > 0 ? (
                    <Checkbox checked={checked} onChange={handleChange} />
                ) : (
                    <div className="w-fit py-1 md:py-2 px-2 md:px-3 flex items-center whitespace-nowrap border border-red-primary text-red-primary text-sm rounded font-bold">
                        <span>Out stock</span>
                    </div>
                )}
            </div>
            <div className="w-[20%] md:w-[6%] h-full">
                <img className="w-full h-full object-contain" loading="lazy" src={data.image} alt={data.image} />
            </div>
            <div className="flex-1 ml-8 flex flex-col gap-5">
                <h2 className="text-sm md:text-lg line-clamp-1">{data.name}</h2>
                <div className="flex items-center text-xs md:text-sm">
                    <span className="">{data.brand}</span>
                    <span className="h-5 bg-[#666666] w-[1px] mx-3"></span>
                    <span>{toGam(data.size as number)}</span>
                </div>
            </div>

            <div className=" lg:w-[10%] text-black-main flex flex-col items-center gap-3 select-none">
                <Quantity
                    initValue={data.quantity}
                    onQuantity={(value: number) => {
                        setQuantity(value);
                        dispatch(modifyQuantity({ ...data, quantity: value }));
                    }}
                    maxValue={data.repo}
                />
                <span onClick={handleRemove} className="cursor-pointer md:text-lg text-sm hover:underline text-violet-primary">
                    Remove
                </span>
            </div>
            <div className="ml-2 md:w-[16%]  flex items-center justify-center md:text-xl md:ml-0">
                <span className="text-sm md:text-lg">{toCurrency(data.price)}</span>
            </div>
            <div className="ml-2 md:w-[16%]  flex items-center justify-center md:text-xl md:ml-0">
                <span className="text-sm md:text-lg">{toCurrency(data.price * quantity <= 0 ? data.price : data.price * quantity)}</span>
            </div>

            <Comfirm
                title={'Comfirm update user'}
                subtitle={
                    <>
                        <p>
                            {'Are you sure delete '} <b>{data.name}</b>
                        </p>
                    </>
                }
                open={openComfirm.open}
                setOpen={setOpenComfirm}
                onComfirm={handleComfirm}
            />
        </div>
    );
}

export default memo(Cart);
