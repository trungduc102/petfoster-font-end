'use client';
import { NotificationPageItem } from '@/components/pages';
import { INotification, IProfile } from '@/configs/interface';
import React, { useState } from 'react';
import UpdateNotificationDialog from './UpdateNotificationDialog';
import firebaseService from '@/services/firebaseService';

export interface ISettingConstantNotificationDialogItemProps {
    data: INotification;
    user: IProfile | null;
}

export default function SettingConstantNotificationDialogItem({ data, user }: ISettingConstantNotificationDialogItemProps) {
    const [open, setOpen] = useState(false);

    const handleOpen = (data: INotification) => {
        setOpen(true);
    };

    return (
        <div>
            <span className="text-[15px] font-medium mb-3">{data.title}</span>
            <NotificationPageItem onClick={handleOpen} data={data} user={user} options={{ disable: true, active: true }} />

            {open && (
                <UpdateNotificationDialog
                    disableDeleteButton={true}
                    disableImageDefault={true}
                    disableRecipient={true}
                    disableLink={true}
                    disableAdvanced={false}
                    options={{ queryFn: firebaseService.querys.getConstantNotification, conllectionName: 'config-constant-notifications' }}
                    open={open}
                    setOpen={setOpen}
                    idOpen={data.id}
                />
            )}
        </div>
    );
}
