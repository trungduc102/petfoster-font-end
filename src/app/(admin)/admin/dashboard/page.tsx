'use client';
import { PageContainer } from '@/components/common';
import { DashboardCard, LabelCard, MonthlyEarnings, ProductPerformance, SalesOverview, YearlyBreakup } from '@/components/dashboard';
import { DashboardPage } from '@/components/pages';
import { dataDashboard } from '@/datas/dashboard';
import { toCurrency } from '@/utils/format';
import { ShoppingCart, MonetizationOn, SupervisedUserCircle } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';
import * as React from 'react';

export interface IDashboardProps {}

export default function Dashboard(props: IDashboardProps) {
    return <DashboardPage />;
}
