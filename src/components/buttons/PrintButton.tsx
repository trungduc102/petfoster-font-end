'use client';
import { IRowStatusOrders } from '@/configs/interface';
import { faEllipsisVertical, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import React, { useState } from 'react';
import { Printbill } from '..';

export interface IPrintButtonProps {
    data: IRowStatusOrders;
}

export default function PrintButton({ data }: IPrintButtonProps) {
    const [link, setLink] = useState<string | null>(null);

    const [openOption, setOpenOption] = useState(false);
    const [openPrintModal, setOpenPrintModal] = useState(false);

    const handlePrint = async (type: 'bill' | 'invoice') => {
        if (type === 'invoice') {
            setLink((process.env.NEXT_PUBLIC_BASE_API || '') + `orders/print/${data.id}`);
            return;
        }

        if (!data.token) return;

        setOpenPrintModal(true);
    };

    const handleCloseOption = () => {
        setOpenOption(false);
        setLink(null);
    };

    return (
        <div>
            <Tippy
                interactive
                placement="right"
                onClickOutside={handleCloseOption}
                visible={openOption}
                render={(attr) => {
                    return (
                        <ul {...attr} tabIndex={-1} className="bg-white text-sm rounded-lg border border-gray-primary shadow-primary py-1">
                            <li onClick={() => handlePrint('invoice')} className="flex items-center gap-2 px-5 py-2 hover:bg-gray-200 transition-all ease-linear cursor-pointer">
                                <FontAwesomeIcon icon={faPrint} />
                                <p>{data.print ? `Printed invoice (${data.print})` : 'Print invoice'}</p>

                                {link && <iframe src={(process.env.NEXT_PUBLIC_BASE_API || '') + `orders/print/${data.id}`} hidden></iframe>}
                            </li>
                            {data.token && (
                                <li onClick={() => handlePrint('bill')} className="flex items-center gap-2 px-5 py-2 hover:bg-gray-200 transition-all ease-linear cursor-pointer">
                                    <FontAwesomeIcon icon={faPrint} />
                                    <p>{data.print ? `Printed bill of lading (${data.print})` : 'Print bill of lading'}</p>
                                </li>
                            )}
                        </ul>
                    );
                }}
            >
                <span
                    onClick={() => {
                        setOpenOption((prev) => !prev);
                        if (link) setLink(null);
                    }}
                    className="w-6 h-6 hover:bg-gray-300 text-lg rounded-full transition-all ease-linear select-none text-black-main flex items-center justify-center p-2"
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} />

                    {openPrintModal && <Printbill open={openPrintModal} setOpen={setOpenPrintModal} data={data} />}
                </span>
            </Tippy>
        </div>
    );
}
