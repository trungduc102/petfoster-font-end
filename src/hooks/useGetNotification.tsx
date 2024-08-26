import { INotification } from '@/configs/interface';
import firebaseService from '@/services/firebaseService';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

export default function useGetNotification(
    id?: string,
    options?: {
        queryFn?: (notificationId: string) => Promise<DocumentSnapshot<DocumentData, DocumentData> | undefined>;
    },
) {
    const [notificationSnapshot, setNotificationSnapshot] = useState<INotification | null>(null);

    useEffect(() => {
        (async () => {
            if (!id) return;

            const data = options && options?.queryFn ? await options.queryFn(id) : await firebaseService.querys.getNotification(id);

            if (!data) {
                setNotificationSnapshot(null);
                return;
            }

            setNotificationSnapshot({
                id: data.id,
                ...data.data(),
            } as INotification);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return notificationSnapshot;
}
