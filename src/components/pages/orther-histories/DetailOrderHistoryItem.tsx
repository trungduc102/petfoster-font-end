'use client';
/* eslint-disable @next/next/no-img-element */
import { RatingDialog } from '@/components';
import { IProductDetailOrders } from '@/configs/interface';
import { StateType } from '@/configs/types';
import { toCurrency, toGam } from '@/utils/format';
import { Grid } from '@mui/material';
import classNames from 'classnames';

import React, { useState } from 'react';

export interface IDetailOrderhistoryItemProps {
    data: IProductDetailOrders & { status: StateType };
}

export default function DetailOrderhistoryItem({ data }: IDetailOrderhistoryItemProps) {
    const [togleDialog, setTogleDialog] = useState(false);

    const handleTogleDialog = () => {
        setTogleDialog(!togleDialog);
    };

    return (
        <>
            <Grid
                container
                key={4}
                spacing={1}
                py={'38px'}
                sx={{
                    borderBottom: '1px solid #DBDBDB',
                }}
            >
                <Grid item lg={6}>
                    <Grid container spacing={1} key={5}>
                        <Grid item lg={2}>
                            <img className="w-full h-full object-contain" src={data.image} alt={data.image} />
                        </Grid>
                        <Grid item lg={10}>
                            <div className="flex flex-col justify-between h-full">
                                <h3 className="font-medium mb-2">{data.name}</h3>
                                <div className="flex items-center text-sm ">
                                    <span className="">{'Zenit'}</span>
                                    <span className="h-5 bg-[#666666] w-[1px] mx-3"></span>
                                    <span>{toGam(data.size as number)}</span>
                                </div>

                                <span
                                    onClick={!data.isRate && data.status === 'delivered' ? handleTogleDialog : undefined}
                                    className={classNames('', {
                                        ['text-gray-300 cursor-default']: data.status !== 'delivered',
                                        ['text-fill-heart  cursor-pointer hover:underline']: data.status === 'delivered',
                                    })}
                                >
                                    {!data.isRate && 'Rate'}
                                </span>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={2}>
                    <div className="flex items-center justify-center h-full">
                        <span className="text-center text-[#303B4E]">{toCurrency(data.price)}</span>
                    </div>
                </Grid>
                <Grid item lg={2}>
                    <div className="flex items-center justify-center h-full">
                        <span className="text-center text-[#303B4E]">x{data.quantity}</span>
                    </div>
                </Grid>
                <Grid item lg={2}>
                    <div className="flex items-center justify-center h-full">
                        <span className="text-[#303B4E]">{toCurrency(data.price * data.quantity)}</span>
                    </div>
                </Grid>
            </Grid>

            <RatingDialog data={data} open={togleDialog} setOpen={setTogleDialog} />
        </>
    );
}
