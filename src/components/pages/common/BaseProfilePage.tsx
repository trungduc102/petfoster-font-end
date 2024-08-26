'use client';
import React, { ReactNode, useEffect, useState } from 'react';

export interface IBaseProfilePageProps {
    children: ReactNode;
    title: string;
    action?: ReactNode;
}

export default function BaseProfilePage({ children, title, action }: IBaseProfilePageProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="px-14 text-black-main">
            <div className="w-full flex items-center justify-between py-6 font-semibold text-xl border-b border-gray-primary ">
                <h2 className="uppercase">{title}</h2>

                {action}
            </div>
            {isClient && children}
        </div>
    );
}
