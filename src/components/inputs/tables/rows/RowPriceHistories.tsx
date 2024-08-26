import * as React from 'react';
import TableRow from '../TableRow';
import { Avatar, TableCell, Tooltip, Typography } from '@mui/material';
import { IPriceHistories } from '@/configs/interface';
import { toCurrency, toGam } from '@/utils/format';
import { contants } from '@/utils/contants';
import Link from 'next/link';
import { links } from '@/datas/links';

export interface IRowPriceHistoriesProps {
    index: number;
    data: IPriceHistories;
}

export default function RowPriceHistories({ index, data }: IRowPriceHistoriesProps) {
    return (
        <TableRow>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {index + 1}
                </Typography>
            </TableCell>

            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    #{data.id}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {toCurrency(data.newInPrice)}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {toCurrency(data.oldInPrice)}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {toCurrency(data.newOutPrice)}
                </Typography>
            </TableCell>

            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {toCurrency(data.oldOutPrice)}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {toGam(data.size)}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {data.updateAt}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Link href={links.adminFuntionsLink.users.detail + data.user.id} className="flex items-center gap-3 flex-col">
                    <Tooltip title={data.user.fullname}>
                        <Avatar src={data.user.avartar || contants.avartarDefault} />
                    </Tooltip>
                </Link>
            </TableCell>
        </TableRow>
    );
}
