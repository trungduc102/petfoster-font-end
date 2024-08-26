'use client';
import { Box, Grid, Typography } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';

export interface IPaymentItemProps {
    title: string;
    children: ReactNode;
    action?: ReactNode;
    size?: string;
    mt?: string;
}

export default function PaymentItem({ title, children, action, size = 'text-2xl', mt = 'mt-5' }: IPaymentItemProps) {
    return (
        <div className="text-black-main">
            <div className="flex items-center justify-between">
                <h2 className={size}>{title}</h2>
                {action}
            </div>
            <div className={mt}>{children}</div>
        </div>
    );
}
