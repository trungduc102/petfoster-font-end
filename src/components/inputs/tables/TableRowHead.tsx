'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TableCell, TableCellProps, Typography } from '@mui/material';
import React, { useState } from 'react';
import { HeadItem } from './TableV2';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

export interface ITableRowHeadProps {
    data: HeadItem;
    styleHead?: TableCellProps;
    onSort?: (value: string) => void;
    className?: string;
}

export default function TableRowHead({ data, styleHead, className, onSort }: ITableRowHeadProps) {
    // sort is true => asc
    // sort is false => desc
    const [sort, setSort] = useState(true);

    const handleClick = (item: HeadItem) => {
        if (!item.asc || !item.desc) return;
        setSort((prev) => !prev);

        if (onSort) {
            onSort(sort ? item.desc : item.asc);
        }
    };

    return (
        <TableCell onClick={() => handleClick(data)} {...styleHead} key={data.title}>
            <div className={'flex items-center gap-2 select-none ' + className}>
                <Typography variant="subtitle2" fontSize={'16px'} fontWeight={600}>
                    {data.title}
                </Typography>
                {data.asc && data.desc && <FontAwesomeIcon icon={!sort ? faArrowDown : faArrowUp} />}
            </div>
        </TableCell>
    );
}
