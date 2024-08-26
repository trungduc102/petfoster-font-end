/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import TableRow from '../TableRow';
import { TableCell, Typography } from '@mui/material';
import { toCurrency, toGam } from '@/utils/format';
import { RowOrderSummaryUpdateStatusType } from '@/configs/types';

export interface IRowOrderSummaryUpdateStatusProps {
    data: RowOrderSummaryUpdateStatusType;
}

export default function RowOrderSummaryUpdateStatus({ data }: IRowOrderSummaryUpdateStatusProps) {
    return (
        <TableRow>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {data.id}
                </Typography>
            </TableCell>
            <TableCell>
                <div className="w-full max-w-full flex items-center gap-3">
                    <div className="w-[70px] h-[70px] flex items-center justify-start ">
                        <img className="mix-blend-multiply object-contain w-full h-full" src={data.image} alt={data.image} />
                    </div>
                    <p className=" whitespace-normal flex-1">{data.name}</p>
                </div>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {toCurrency(data.price)}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {toGam(200)}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    x{data.quantity}
                </Typography>
            </TableCell>
        </TableRow>
    );
}
