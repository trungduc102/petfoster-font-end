'use client';
import * as React from 'react';
import { DashboardCard, LabelCard } from '.';
import { Grid } from '@mui/material';
import { MonetizationOn, MonetizationOnOutlined, MonetizationOnRounded, MonetizationOnSharp, Money } from '@mui/icons-material';
import { toCurrency } from '@/utils/format';
import { IReportDonate, IReports } from '@/configs/interface';
import { useQuery } from '@tanstack/react-query';
import { dailyReport } from '@/apis/dashboard';
import moment from 'moment';
import Link from 'next/link';
import { links } from '@/datas/links';
import { reportDonation } from '@/apis/transaction';
export interface IReportDonationProps {}

export default function ReportDonation(props: IReportDonationProps) {
    const date = new Date();

    const { data, isLoading, error } = useQuery({
        queryKey: ['reports/donate'],
        queryFn: () => reportDonation(),
    });

    const dataDashboard: IReportDonate | undefined = data?.data;

    return (
        <DashboardCard
            title="Donation"
            action={
                <>
                    <Link href={links.adminFuntionsLink.donation.index} className="text-blue-primary hover:underline">
                        Detail
                    </Link>
                </>
            }
        >
            <Grid container spacing={5}>
                <Grid item xs={12} md={12} lg={4}>
                    <LabelCard
                        Icon={MonetizationOnOutlined}
                        showPersnet={false}
                        data={{
                            value: toCurrency(dataDashboard?.day || 0),
                        }}
                        title={'Donate ' + moment(date).format('MMM Do YY')}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                    <LabelCard
                        Icon={MonetizationOn}
                        underlineColor="#0D9488"
                        showPersnet={false}
                        data={{
                            value: toCurrency(dataDashboard?.month || 0),
                        }}
                        title={'Donate ' + moment(date).format('MM/yyyy')}
                    />
                </Grid>

                <Grid item xs={12} md={12} lg={4}>
                    <LabelCard
                        Icon={Money}
                        underlineColor="#FF7A00"
                        showPersnet={false}
                        data={{
                            value: toCurrency(dataDashboard?.year || 0),
                        }}
                        title={'Donate ' + moment(date).format('yyyy')}
                    />
                </Grid>
            </Grid>
        </DashboardCard>
    );
}
