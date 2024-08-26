'use client';
import * as React from 'react';
import { DashboardCard, LabelCard } from '.';
import { Grid } from '@mui/material';
import { MonetizationOn, MonetizationOnOutlined, MonetizationOnRounded, MonetizationOnSharp, Money } from '@mui/icons-material';
import { toCurrency } from '@/utils/format';
import { IReportAdopt, IReportDonate, IReports } from '@/configs/interface';
import { useQuery } from '@tanstack/react-query';
import { reportsAdopt } from '@/apis/dashboard';
import moment from 'moment';
import Link from 'next/link';
import { links } from '@/datas/links';
import { reportDonation } from '@/apis/transaction';
import { faDog, faShield, faShieldCat, faShieldDog } from '@fortawesome/free-solid-svg-icons';
import { RowReportAdoption, Table, TableV2 } from '..';
import { HeadItem } from '../inputs/tables/TableV2';
export interface IReportAdoptsProps {}

export default function ReportAdopts(props: IReportAdoptsProps) {
    const date = new Date();

    const dataHeadTable = ['Status', `${moment(date).format('MMM Do YY')}`, `${moment(date).format('MM/yyyy')}`, `${moment(date).format('yyyy')}`];

    const { data, isLoading, error } = useQuery({
        queryKey: ['reports/adopt'],
        queryFn: () => reportsAdopt(),
    });

    const dataDashboard: IReportAdopt[] | undefined = data?.data;

    return (
        <DashboardCard
            title="Adoption"
            action={
                <>
                    <Link href={links.adminFuntionsLink.adoption.index} className="text-blue-primary hover:underline">
                        Detail
                    </Link>
                </>
            }
        >
            {/* <div className="flex flex-col gap-8">
                {dataDashboard &&
                    dataDashboard.map((item, index) => {
                        return (
                            <div key={index} className="w-full flex flex-col gap-2">
                                <Grid container spacing={5} className="flex items-center">
                                    <Grid item xs={12} md={12} lg={4}>
                                        <LabelCard
                                            iconAsome={faShield}
                                            showPersnet={false}
                                            data={{
                                                value: item.day,
                                            }}
                                            title={item.title + ' ' + moment(date).format('MMM Do YY')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <LabelCard
                                            iconAsome={faShieldDog}
                                            underlineColor="#0D9488"
                                            showPersnet={false}
                                            data={{
                                                value: item.month,
                                            }}
                                            title={item.title + ' ' + moment(date).format('MM/yyyy')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <LabelCard
                                            iconAsome={faShieldCat}
                                            underlineColor="#FF7A00"
                                            showPersnet={false}
                                            data={{
                                                value: item.year,
                                            }}
                                            title={item.title + ' ' + moment(date).format('yyyy')}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        );
                    })}
            </div> */}
            <div className="border border-gray-primary rounded-lg overflow-hidden">
                {dataDashboard && (
                    <Table
                        styleHead={{
                            align: 'center',
                        }}
                        dataHead={dataHeadTable}
                    >
                        {dataDashboard?.map((item) => {
                            return <RowReportAdoption key={item.title} data={item} />;
                        })}
                    </Table>
                )}
            </div>
        </DashboardCard>
    );
}
