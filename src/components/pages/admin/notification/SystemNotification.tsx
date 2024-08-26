'use client';
import { INotification } from '@/configs/interface';
import { RootState } from '@/configs/types';
import { useAppSelector } from '@/hooks/reduxHooks';
import firebaseService from '@/services/firebaseService';
import React, { useEffect, useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { NotificationPageItem } from '../..';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export interface ISystemNotificationProps {}

export default function SystemNotification(props: ISystemNotificationProps) {
    const { user } = useAppSelector((state: RootState) => state.userReducer);
    const [start, setStart] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>>();
    const [notificationSnapshot, loading] = useCollection(firebaseService.querys.getNotifications(user, { start, limit: Number(process.env.NEXT_PUBLIC_LIMIT_NOTIFI) }));
    const [data, setData] = useState<INotification[]>([]);

    const dataNotifications = useMemo(() => {
        if (!notificationSnapshot) return [];

        return notificationSnapshot.docs.map((item) => {
            return {
                id: item.id,
                ...item.data(),
            } as INotification;
        });
    }, [notificationSnapshot]);

    useEffect(() => {
        setData((prev) => [...prev, ...dataNotifications]);
    }, [dataNotifications]);

    const handleMarkAllAsRead = async () => {
        await firebaseService.handleMarkAllAsRead(dataNotifications, user);
    };

    const handleSeemore = () => {
        if (!notificationSnapshot?.docs) return;

        setStart(notificationSnapshot?.docs[notificationSnapshot.docs.length - 1]);
    };

    return (
        <div className="flex flex-col gap-5 py-5">
            <div className="w-full flex items-center justify-end px-5">
                <p onClick={handleMarkAllAsRead} className="text-fill-heart text-[16px] hover:underline cursor-pointer font-medium">
                    Mark all as read
                </p>
            </div>
            <div className="py-6 flex flex-col gap-2">
                {data.map((item) => {
                    return <NotificationPageItem key={item.id} data={item} user={user} />;
                })}
            </div>

            {dataNotifications.length >= Number(process.env.NEXT_PUBLIC_LIMIT_NOTIFI) && (
                <div className="flex items-center justify-center">
                    <span onClick={handleSeemore} className="text-fill-heart hover:underline cursor-pointer">
                        See more
                    </span>
                </div>
            )}
        </div>
    );
}
