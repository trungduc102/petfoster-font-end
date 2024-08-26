'use client';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TableBody, TableCell, TableHead, TableRow, Typography, Table as Tb, TableCellProps } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import TableRowHead from './TableRowHead';

export interface ITableV2Props {
    dataHead: HeadItem[];
    children: ReactNode;
    styleHead?: TableCellProps & { className?: string };
    onSort?: (value: string) => void;
}

export type HeadItem = {
    asc?: '';
    desc?: '';
    title: '';
};

export default function TableV2({ dataHead, children, styleHead, onSort }: ITableV2Props) {
    return (
        <Tb
            stickyHeader
            aria-label="orders-table"
            sx={{
                whiteSpace: 'nowrap',
            }}
        >
            <TableHead
                sx={{
                    backgroundColor: '#F2F2F2',
                    borderTopLeftRadius: '12px',
                }}
            >
                <TableRow>
                    {dataHead.map((item) => {
                        return <TableRowHead key={item.title} data={item} onSort={onSort} {...styleHead} />;
                    })}
                </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
        </Tb>
    );
}
