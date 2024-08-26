'use client';
import React, { createElement, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import TableRow from '../TableRow';
import { Chip, TableCell, Typography, capitalize } from '@mui/material';
import { IRowStatusOrders } from '@/configs/interface';
import { formatIndex, formatStatus, toCurrency } from '@/utils/format';
import { statusColor } from '../../../../../tailwind.config';
import moment from 'moment';
import { updatePrintForOrder, updateReadForOrder } from '@/apis/admin/orders';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPrint } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { getTokenPrint } from '@/apis/outside';
import { appService } from '@/services/appService';
import WraperDialog from '@/components/dialogs/WraperDialog';
import { PrintButton, Printbill } from '@/components';

export interface IRowStatusProps {
    data: IRowStatusOrders;
    index: number;
    page: string | null;
    handleOpen?: (data: IRowStatusOrders) => void;
}

export default function RowStatus({ data, index, page, handleOpen }: IRowStatusProps) {
    const [isRead, setIsRead] = useState(data.read);

    const handleUpdateRead = async () => {
        if (!handleOpen) return;
        handleOpen(data);

        if (isRead) return;

        try {
            const response = await updateReadForOrder(data.id);

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            setIsRead(response.data.read);
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    return (
        <TableRow>
            <TableCell>
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {formatIndex(parseInt(page || '0'), index)}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    #{data.id}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.user}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {toCurrency(data.price)}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {moment(data.placedData).format('DD/MM/yyyy')}
                </Typography>
            </TableCell>
            <TableCell>
                <Chip
                    label={formatStatus(data.status)}
                    variant="outlined"
                    sx={{
                        backgroundColor: statusColor[data.status],
                        borderColor: statusColor[data.status],
                        textTransform: 'capitalize',
                    }}
                />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-4">
                    <span onClick={handleOpen ? handleUpdateRead : undefined} className="text-violet-primary hover:underline cursor-pointer select-none font-medium">
                        Open
                    </span>
                    {/* <Tippy
                        interactive
                        placement="right"
                        onClickOutside={handleCloseOption}
                        visible={openOption}
                        render={(attr) => {
                            return (
                                <ul {...attr} tabIndex={-1} className="bg-white rounded-lg border border-gray-primary shadow-primary py-1">
                                    <li
                                        onClick={() => handlePrint('invoice')}
                                        className="flex items-center gap-2 px-5 py-2 hover:bg-gray-200 transition-all ease-linear cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faPrint} />
                                        <p>{print ? `Printed invoice (${print})` : 'Print invoice'}</p>

                                        {link && <iframe src={(process.env.NEXT_PUBLIC_BASE_API || '') + `orders/print/${data.id}`} hidden></iframe>}
                                    </li>
                                    {data.token && (
                                        <li
                                            onClick={() => handlePrint('bill')}
                                            className="flex items-center gap-2 px-5 py-2 hover:bg-gray-200 transition-all ease-linear cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faPrint} />
                                            <p>{print ? `Printed bill of lading (${print})` : 'Print bill of lading'}</p>
                                        </li>
                                    )}
                                </ul>
                            );
                        }}
                    >
                        <span
                            onClick={() => {
                                setOpenOption(true);
                                if (link) setLink(null);
                            }}
                            className="w-6 h-6 hover:bg-gray-300 rounded-full transition-all ease-linear text-black-main flex items-center justify-center p-2"
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />

                            {openPrintModal && <Printbill open={openPrintModal} setOpen={setOpenPrintModal} data={data} />}
                        </span>
                    </Tippy> */}
                    <PrintButton data={data} />
                    {!isRead && <span className="bg-red-primary w-2 h-2 rounded-full block"></span>}
                </div>
            </TableCell>
        </TableRow>
    );
}
