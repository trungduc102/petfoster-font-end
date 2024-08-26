import WraperDialog from '@/components/dialogs/WraperDialog';
import React, { ReactNode } from 'react';

export interface IBaseAddressDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
    title: ReactNode;
}

export default function BaseAddressDialog({ open, children, title, setOpen }: IBaseAddressDialogProps) {
    return (
        <WraperDialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '14px',
                    overflowX: 'hidden',
                },
            }}
            maxWidth={'md'}
            open={open}
            setOpen={setOpen}
        >
            <div className="w-full  text-black-main select-none min-h-[600px] py-6 px-10">
                <div className="flex items-center justify-between  text-[#303B4E] text-xl  border-b border-gray-primary">{title}</div>

                <div className="min-w-full md:min-w-[820px] ">{children}</div>
            </div>
        </WraperDialog>
    );
}
