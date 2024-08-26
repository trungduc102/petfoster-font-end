import { Skeleton, TableCell, TableRow } from '@mui/material';
import * as React from 'react';

export interface IAppProps {}

export default function App(props: IAppProps) {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
        return (
            <TableRow key={item}>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
                <TableCell>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </TableCell>
            </TableRow>
        );
    });
}
