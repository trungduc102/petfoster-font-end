'use client';
import { Box, Container, styled } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import Header from '../common/common-headers/admin/header/Header';
import Sidebar from '../common/common-headers/admin/sidebar/Sidebar';
import { Notifycation } from '..';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { closeNoty } from '@/redux/slice/appSlice';

export interface IDashboardLayoutProps {
    children: ReactNode;
}
const MainWrapper = styled('div')(() => ({
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
}));

const PageWrapper = styled('div')(() => ({
    display: 'flex',
    flexGrow: 1,
    paddingBottom: '60px',
    flexDirection: 'column',
    zIndex: 1,
    backgroundColor: 'transparent',
}));
export default function DashboardLayout({ children }: IDashboardLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const { notifycation } = useAppSelector((state: RootState) => state.appReducer);

    const dispath = useAppDispatch();
    return (
        <MainWrapper className="mainwrapper">
            <Sidebar isSidebarOpen={isSidebarOpen} isMobileSidebarOpen={isMobileSidebarOpen} onSidebarClose={() => setMobileSidebarOpen(false)} />

            <PageWrapper className="page-wrapper">
                <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />

                <Box
                    sx={{
                        paddingTop: '20px',
                        width: '100%',
                        maxWidth: '100%',
                        px: { xs: '24px', md: '10%', lg: '10%' },
                        margin: '0 auto',
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>{children}</Box>
                </Box>
            </PageWrapper>

            <Notifycation
                onClose={() => {
                    dispath(closeNoty());
                }}
                {...notifycation}
            />
        </MainWrapper>
    );
}
