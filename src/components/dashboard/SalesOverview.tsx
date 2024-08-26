'use client';
import React from 'react';
import { Select, MenuItem, Tabs, Tab, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DashboardCard } from '.';
import { toCurrency } from '@/utils/format';
import { IDataCharts } from '@/configs/interface';
import Chart from './Charts/Chart';
import { useQuery } from '@tanstack/react-query';
import { salesOverview } from '@/apis/dashboard';
import moment from 'moment';
interface ISalesOverviewProps {
    dataOusite: {
        revenue: IDataCharts;
        productRevenueByType: IDataCharts;
    };
}

const SalesOverview = ({ dataOusite }: ISalesOverviewProps) => {
    // select
    const [month, setMonth] = React.useState(moment(new Date()).format('yyyy'));

    const { data, isLoading, error } = useQuery({
        queryKey: ['sales-overview', month],
        queryFn: () => salesOverview(month),
    });

    const dataCharts = data?.data.salesOverview;

    const handleChange = (event: any) => {
        setMonth(event.target.value);
    };

    const [value, setValue] = React.useState(0);

    const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
                {value === index && <>{children}</>}
            </div>
        );
    }
    return (
        <DashboardCard
            title="Sales Overview"
            action={
                <Select labelId="month-dd" id="month-dd" value={month} size="small" onChange={handleChange}>
                    <MenuItem value={'2023'}>2023</MenuItem>
                    <MenuItem value={'2024'}>2024</MenuItem>
                    <MenuItem value={'2025'}>2025</MenuItem>
                </Select>
            }
            middlecontent={
                <>
                    <Typography sx={{ fontSize: '20px', mt: '10px', fontWeight: '700' }}>
                        Total: {toCurrency((value === 1 ? dataCharts?.productRevenueByType.total : dataCharts?.revenue.total) || 0)}
                    </Typography>
                </>
            }
        >
            <>
                <Tabs value={value} onChange={handleChanges} aria-label="tabs-sales-overviews">
                    <Tab sx={{ fontSize: '18px' }} label="Revenue" />
                    <Tab sx={{ fontSize: '18px' }} label="Product Revenue By Type" />
                </Tabs>
                <CustomTabPanel value={value} index={0}>
                    <Chart data={dataCharts?.revenue || dataOusite.revenue} type="area" />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <Chart data={dataCharts?.productRevenueByType || dataOusite.productRevenueByType} type="bar" />
                </CustomTabPanel>
            </>
        </DashboardCard>
    );
};

export default SalesOverview;
