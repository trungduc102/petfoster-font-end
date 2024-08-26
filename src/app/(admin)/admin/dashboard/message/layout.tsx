import { MessageManageLayout } from '@/components/layouts';
import React, { ReactNode } from 'react';

export interface ILayoutMessageProps {
    children: ReactNode;
}

export default function LayoutMessage({ children }: ILayoutMessageProps) {
    return (
        <div className="md:mx-[-10%] ">
            <MessageManageLayout>{children}</MessageManageLayout>
        </div>
    );
}
