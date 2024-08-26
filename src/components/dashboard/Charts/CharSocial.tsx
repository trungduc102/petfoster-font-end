import React, { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
const C = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface ICharSocialProps {
    data: { name: string; data: number[] }[];
}

function CharSocial({ data }: ICharSocialProps) {
    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            height: 350,
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
            categories: ['Posts', 'Post Liked', 'Comment Liked', 'Comments'],
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
            <C options={optionscolumnchart} series={data} type={'bar'} width={'100%'} height="370px" />
        </div>
    );
}

export default memo(CharSocial);
