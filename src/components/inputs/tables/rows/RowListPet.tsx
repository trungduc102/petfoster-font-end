/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import TableRow from '../TableRow';
import { useRouter } from 'next/navigation';
import { TableCell, Typography } from '@mui/material';
import { formatIndex } from '@/utils/format';
import { links } from '@/datas/links';
import Tippy from '@tippyjs/react/headless';
import { IPetDetail } from '@/configs/interface';

export interface IRowListPetProps {
    index: number;
    data: IPetDetail;
    page: string | null;
}

export default function RowListPet({ index, data, page }: IRowListPetProps) {
    // const [openPopup, setOpenPopup] = useState(false);

    const router = useRouter();
    return (
        <TableRow onClick={() => router.push(links.adminFuntionsLink.pets.detail + `/${data.id}`)}>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {formatIndex(parseInt(page || '0'), index)}
                </Typography>
            </TableCell>

            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.id}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Tippy
                    key={index}
                    interactive
                    placement="left-end"
                    delay={200}
                    render={(attr) => {
                        return (
                            <div {...attr} tabIndex={-1} className="w-[200px] h-[200px] max-w-[240px] max-h-[240px] bg-white rounded-lg border border-gray-primary shadow-lg p-3">
                                <img className="w-full h-full object-contain" alt={data.image} loading="lazy" src={data.image} />
                            </div>
                        );
                    }}
                >
                    <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                        {data.name}
                    </Typography>
                </Tippy>
            </TableCell>
            <TableCell align="left">{data.color}</TableCell>
            <TableCell align="left">{data.size}</TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    <p className="block truncate max-w-[80px] capitalize">{data.status}</p>
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.fostered}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.breed}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.sex}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.sterilization}
                </Typography>
            </TableCell>
        </TableRow>
    );
}
