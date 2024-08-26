'use client';
import dynamic from 'next/dynamic';
import React from 'react';
const C = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface IChartDetailUserAdopProps {
    series: { name: string; data: number[] }[];
}

export default function ChartDetailUserAdop({ series }: IChartDetailUserAdopProps) {
    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '100%',
        },
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '30%',
                // borderRadiusApplication: 'end',
                // borderRadiusWhenStacked: 'all',
            },
        },

        stroke: {
            show: true,
            width: 5,
            lineCap: 'butt',
            // colors: ['transparent'],
        },

        legend: {
            show: true,
            fontSize: '14px',
            position: 'right',
            offsetX: 0,
            offsetY: 50,
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
            categories: ['Purchase', 'Adoption'],
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
        fill: {
            opacity: 1,
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0,
                    },
                },
            },
        ],

        tooltip: {
            // theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: true,
        },
    };

    return (
        <div>
            <C options={optionscolumnchart} type={'bar'} series={series} width={'100%'} height="370px" />
        </div>
    );
}
