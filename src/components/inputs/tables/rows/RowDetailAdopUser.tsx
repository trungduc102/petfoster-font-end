/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import TableRow from '../TableRow';
import { useRouter } from 'next/navigation';
import { TableCell, Typography } from '@mui/material';
import { formatIndex } from '@/utils/format';
import { links } from '@/datas/links';
import Tippy from '@tippyjs/react/headless';
import { IPetDetail, IRowDetailUserAdoption } from '@/configs/interface';

export interface IRowDetailAdopUserProps {
    data: IRowDetailUserAdoption;
}

export default function RowDetailAdopUser({ data }: IRowDetailAdopUserProps) {
    return (
        <TableRow>
            <TableCell align="left">
                <Typography color="textSecondary" style={{ textTransform: 'capitalize' }} fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.title}
                </Typography>
            </TableCell>
            {data.data.map((item, index) => {
                return (
                    <TableCell key={index} align="center">
                        <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                            {item}
                        </Typography>
                    </TableCell>
                );
            })}
        </TableRow>
    );
}
