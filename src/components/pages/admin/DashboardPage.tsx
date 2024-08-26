'use client';
import { PageContainer } from '@/components/common';
import { ProductPerformance, Report, ReportAdopts, ReportDonation, SalesOverview } from '@/components/dashboard';
import { dataDashboard } from '@/datas/dashboard';
import { Box, Grid } from '@mui/material';
import * as React from 'react';
export interface IDashboarddPageProps {}

function DashboardPage(props: IDashboarddPageProps) {
    return (
        <PageContainer title="Dashboard" description="this is Dashboard">
            <Box>
                <Report />

                <div className="w-full mt-10">
                    <ReportDonation />
                </div>
                <div className="w-full mt-10">
                    <ReportAdopts />
                </div>
                <Grid container spacing={3} mt={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <SalesOverview dataOusite={dataDashboard.salesOverview} />
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                        <ProductPerformance dataOutsite={dataDashboard.productRevenueByDate} />
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
}

export default DashboardPage;
