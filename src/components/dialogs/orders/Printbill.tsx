'use client';
import React, { useState } from 'react';
import WraperDialog from '../WraperDialog';
import { LoadingSecondary, SocialButton, WrapperAnimation } from '@/components';
import { IRowStatusOrders } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { getTokenPrint } from '@/apis/outside';
import { toast } from 'react-toastify';
import { appService } from '@/services/appService';

export interface IPrintbillProps {
    data: IRowStatusOrders;
    open: boolean;
    setOpen: (v: boolean) => void;
}

const printMethod = [
    {
        title: 'Print A5 mm',
        url: contants.apis.ghn.printMethod.a5,
    },
    {
        title: 'Print 80x80 mm',
        url: contants.apis.ghn.printMethod[8080],
    },
    {
        title: 'Print 50x72 mm',
        url: contants.apis.ghn.printMethod[5072],
    },
];

export default function Printbill({ data, open, setOpen }: IPrintbillProps) {
    const [activeMethod, setActiveMethod] = useState<(typeof printMethod)[0] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleActiveMethod = async (dataMethod: (typeof printMethod)[0]) => {
        if (!data.token) return;
        try {
            setLoading(true);
            const response = await getTokenPrint(data.token);

            if (!response) return toast.error(contants.messages.errors.server);

            const token = response.token;

            appService.handleSetPrint(data.id);

            setActiveMethod({
                ...dataMethod,
                url: dataMethod.url + `?token=${token}`,
            });
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                },
            }}
            fullWidth={true}
            maxWidth={'md'}
            open={open}
            setOpen={setOpen}
            onClose={() => {
                setActiveMethod(null);
            }}
        >
            <div className="flex flex-col items-center p-5 text-black-main gap-4 relative overflow-hidden">
                <h3 className="text-xl font-medium">
                    Print the order for the order code <b className="text-blue-primary">{data.token}</b>
                </h3>
                <div className="flex items-center justify-center">
                    <p className="text-sm italic text-justify max-w-[80%] font-medium">
                        Note: size 52 x 70 mm and size 80 x 80 mm are only for thermal printers, printing and pasting directly onto the item
                    </p>
                </div>
                <div className="w-full flex items-center justify-between gap-5 px-5">
                    {printMethod.map((item) => {
                        return <SocialButton onClick={() => handleActiveMethod(item)} key={item.title} title={item.title} />;
                    })}
                </div>

                {activeMethod && <iframe src={activeMethod.url} hidden></iframe>}

                {loading && (
                    <div className="absolute flex items-center inset-0 bg-black-040">
                        <LoadingSecondary color="#0EA5E9" />
                    </div>
                )}
            </div>
        </WraperDialog>
    );
}
