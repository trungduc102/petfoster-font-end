import React, { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { IDataCharts } from '@/configs/interface';
const C = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface IChartProps {
    data: IDataCharts;
    type?:
        | 'bar'
        | 'area'
        | 'line'
        | 'pie'
        | 'donut'
        | 'radialBar'
        | 'scatter'
        | 'bubble'
        | 'heatmap'
        | 'candlestick'
        | 'boxPlot'
        | 'radar'
        | 'polarArea'
        | 'rangeBar'
        | 'rangeArea'
        | 'treemap'
        | undefined;
}

function Chart({ data, type = 'bar' }: IChartProps) {
    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    // chart
    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },

        stroke: {
            show: true,
            width: 5,
            lineCap: 'butt',
            colors: ['transparent'],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
            fontSize: '32px',
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
            labels: {
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                },
            },
        },
        xaxis: {
            categories: data.categories,
            axisBorder: {
                show: false,
            },
            labels: {
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                },
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: true,
        },
    };
    const seriescolumnchart = data.data;
    return (
        <div>
            <C options={optionscolumnchart} series={seriescolumnchart} type={type} width={'100%'} height="370px" />
        </div>
    );
}

export default memo(Chart);
