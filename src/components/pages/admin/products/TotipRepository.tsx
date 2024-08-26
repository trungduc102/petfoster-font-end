import { IRepository } from '@/configs/interface';
import { toCurrency, toGam } from '@/utils/format';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Tippy from '@tippyjs/react/headless';
import * as React from 'react';

export interface ITotipRepositoryProps {
    data: IRepository[];
}

export default function TotipRepository({ data }: ITotipRepositoryProps) {
    return (
        <Box
            sx={{
                overflow: 'auto',
                width: {
                    xs: '280px',
                    sm: 'auto',
                    backgroundColor: '#fff',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                },
                padding: '20px',
                borderRadius: '8px',
            }}
        >
            <Table
                aria-label="simple table"
                sx={{
                    whiteSpace: 'nowrap',
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                                No
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Size
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Quantity
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                                In Price
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Out Price
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => {
                        return (
                            <TableRow key={item.size} hover sx={{ cursor: 'default' }}>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {index + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell>{toGam(item.size)}</TableCell>
                                <TableCell align="left">
                                    <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                        {item.quantity}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                        {toCurrency(item.inPrice)}
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    <Typography color="textSecondary" variant="subtitle2" maxWidth={'200px'} fontWeight={400} className="truncate">
                                        {toCurrency(item.outPrice)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    );
}
