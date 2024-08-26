import { formatIndex } from '@/utils/format';
import * as React from 'react';
import TableRow from '../TableRow';
import { Avatar, Button, TableCell, Typography } from '@mui/material';
import TotipRepository from '@/components/pages/admin/products/TotipRepository';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';
import { IProductManageList, IRepository } from '@/configs/interface';

export interface IRowListProductProps {
    page: string | null;
    index: number;
    data: IProductManageList;
    handleDeleteProduct: (id: string) => void;
    handleTotalQuantiyRepo: (arr: IRepository[]) => number;
}

export default function RowListProduct({ page, index, data, handleDeleteProduct, handleTotalQuantiyRepo }: IRowListProductProps) {
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
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    {data.id}
                </Typography>
            </TableCell>
            <TableCell>
                <Avatar src={data.image} variant="rounded" />
            </TableCell>

            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    {data.name}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    {data.brand}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                    {data.type}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Tippy
                    key={index}
                    interactive
                    placement="left-end"
                    delay={200}
                    render={() => {
                        return <TotipRepository data={data.repo} />;
                    }}
                >
                    <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate cursor-default">
                        {handleTotalQuantiyRepo(data.repo)}
                    </Typography>
                </Tippy>
            </TableCell>
            <TableCell align="center">
                <Button onClick={() => handleDeleteProduct(data.id as string)}>
                    <FontAwesomeIcon className="text-red-400 text-lg" icon={faTrash} />
                </Button>
                <Link href={'/admin/dashboard/product/' + data.id}>
                    <Button>
                        <FontAwesomeIcon className="text-lg" icon={faEdit} />
                    </Button>
                </Link>
            </TableCell>
        </TableRow>
    );
}
