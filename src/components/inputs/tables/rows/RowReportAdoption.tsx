import * as React from 'react';
import TableRow from '../TableRow';
import { Avatar, TableCell, Tooltip, Typography } from '@mui/material';
import { IPriceHistories, IReportAdopt } from '@/configs/interface';
import { toCurrency, toGam } from '@/utils/format';
import { contants } from '@/utils/contants';
import Link from 'next/link';
import { links } from '@/datas/links';

export interface IRowPriceHistoriesProps {
    data: IReportAdopt;
}

export default function RowReportAdoption({ data }: IRowPriceHistoriesProps) {
    return (
        <TableRow>
            <TableCell align="center">
                <Typography color="textSecondary" style={{ textTransform: 'capitalize' }} variant="subtitle2" fontWeight={400}>
                    {data.title}
                </Typography>
            </TableCell>

            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {data.day}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {data.month}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {data.year}
                </Typography>
            </TableCell>
        </TableRow>
    );
}
