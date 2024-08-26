'use client';
import React, { useState } from 'react';
import TableRow from '../TableRow';
import { Avatar, TableCell, Typography } from '@mui/material';
import { INotification } from '@/configs/interface';
import { convertFirestoreTimestampToString } from '@/utils/format';
import moment from 'moment';
import Link from 'next/link';
import { NotificationDialog, UpdateNotificationDialog } from '@/components';

export interface IRowNotificationProps {
    index: number;
    data: INotification;
}

export default function RowNotification({ index, data }: IRowNotificationProps) {
    const [open, setOpen] = useState(false);
    return (
        <TableRow>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {index + 1}
                </Typography>
            </TableCell>

            <TableCell align="center">
                <span className="truncate block w-[60px]">{data.id}</span>
            </TableCell>

            <TableCell
                align="center"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Avatar
                    sx={{
                        mixBlendMode: 'multiply',
                    }}
                    variant="rounded"
                    src={data.photourl}
                />
            </TableCell>

            <TableCell align="left">
                <span className="truncate block w-[100px]"> {data.title}</span>
            </TableCell>

            <TableCell align="left">
                <span className="truncate block w-[140px]"> {data.content}</span>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {moment(data.createdAt instanceof Date ? data.createdAt : convertFirestoreTimestampToString(data.createdAt)).fromNow()}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.type}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.target[0] === 'all' ? data.target[0] : `${data.target.length} recipients`}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <span onClick={() => setOpen(true)} className="text-violet-primary hover:underline cursor-pointer font-medium">
                    Open
                </span>
            </TableCell>

            {open && <UpdateNotificationDialog open={open} setOpen={setOpen} idOpen={data.id} />}
        </TableRow>
    );
}
