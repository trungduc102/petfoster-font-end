'use client';
import { TableRowTypeMap, TableRow as Tr, styled } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import React, { ReactNode } from 'react';

export interface ITableCellProps {
    children: ReactNode;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function TableRow({ children, onClick, onMouseEnter, onMouseLeave, ...props }: ITableCellProps) {
    return (
        <Tr
            sx={{
                '&:nth-of-type(odd)': {
                    backgroundColor: '#f8f8f8',
                },
                // hide last border
                '&:last-child td, &:last-child th': {
                    border: 0,
                },
                '&:hover': {
                    backgroundColor: '#f1f1f1',
                    transition: 'all ease-in .1s',
                },

                cursor: 'pointer',
            }}
            {...props}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </Tr>
    );
}
