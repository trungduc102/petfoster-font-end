import { IRecordTransaction } from '@/configs/interface-ousite';
import * as React from 'react';
import TableRow from '../TableRow';
import { TableCell, Typography } from '@mui/material';
import { formatIndex, toCurrency } from '@/utils/format';
import moment from 'moment';
import { IRowTransaction } from '@/configs/interface';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { contants } from '@/utils/contants';

export interface IRowListTransactionProps {
    page: string | null;
    index: number;
    data: IRowTransaction;
    showIdTransaction?: boolean;
}

export default function RowListTransaction({ index, page, data, showIdTransaction = true }: IRowListTransactionProps) {
    const { user } = useAppSelector((state: RootState) => state.userReducer);
    return (
        <TableRow>
            <TableCell>
                <Typography
                    sx={{
                        fontSize: '16px',
                        fontWeight: '500',
                    }}
                >
                    {formatIndex(parseInt(page || '0'), index)}
                </Typography>
            </TableCell>
            {showIdTransaction && (
                <TableCell align="left">
                    <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                        {data.idTransactionl}
                    </Typography>
                </TableCell>
            )}
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    {data.beneficiaryBank}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    {data.toAccountNumber}
                </Typography>
            </TableCell>
            {contants.roles.manageRoles.includes(user?.role || '') && (
                <TableCell align="left">
                    <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                        {data.donater}
                    </Typography>
                </TableCell>
            )}

            <TableCell>{data.donateAt}</TableCell>

            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    {toCurrency(data.donateAmount)}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    <p className="block max-w-[80px] line-clamp-1">{data.descriptions}</p>
                </Typography>
            </TableCell>
        </TableRow>
    );
}
