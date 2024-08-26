import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export interface IToastProviderProps {
    children: ReactNode;
}

export default function ToastProvider({ children }: IToastProviderProps) {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
}
