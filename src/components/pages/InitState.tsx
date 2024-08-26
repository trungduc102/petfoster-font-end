'use client';
import { RootState } from '@/configs/types';
import { useAppSelector } from '@/hooks/reduxHooks';
import React, { ReactNode, useEffect } from 'react';
import { handleSetLastSeenInfoFirebase } from '@/utils/firebaseUltils';
import { usePathname, useRouter } from 'next/navigation';
import { links } from '@/datas/links';

export interface IInitStateProps {
    children: ReactNode;
}

export default function InitState({ children }: IInitStateProps) {
    const { user, token } = useAppSelector((state: RootState) => state.userReducer);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        window.addEventListener('beforeunload', () => handleSetLastSeenInfoFirebase(user));
    }, [user]);

    useEffect(() => {
        if (user && token && Object.values(links.auth).some((item) => pathname.includes(item) || pathname === item)) {
            router.push(links.home);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token, pathname]);

    return <>{children}</>;
}
