import * as React from 'react';
import TableRow from '../TableRow';
import { TableCell, Typography } from '@mui/material';
import { IBrand } from '@/configs/interface';

export interface IRowBrandProps {
    index: number;
    data: IBrand;
    handleOpenRow?: (data: IBrand) => void;
}

export default function RowBrand({ index, data, handleOpenRow }: IRowBrandProps) {
    return (
        <TableRow>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {index + 1}
                </Typography>
            </TableCell>

            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    #{data.id}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.brand}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.createdAt}
                </Typography>
            </TableCell>
            <TableCell onClick={handleOpenRow ? () => handleOpenRow(data) : undefined} align="center">
                <span className="text-violet-primary hover:underline cursor-pointer font-medium">Open</span>
            </TableCell>
        </TableRow>
    );
}
