'use client';
import { getDataChartUsers } from '@/apis/admin/user';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

export default function useGetChartDataUser(id: string) {
    const dataChart = useQuery({
        queryKey: ['getDataChart', id],
        queryFn: () => {
            return getDataChartUsers(id);
        },
    });

    const chartMemo = useMemo(() => {
        if (!dataChart.data)
            return {
                chart: [],
                social: [],
            };

        const chart = dataChart.data.data.filter((item) => item.title !== 'Social');
        const social = dataChart.data.data.filter((item) => item.title === 'Social');

        return {
            chart,
            social,
        };
    }, [dataChart]);

    const seriesChart = useMemo(() => {
        let results: { name: string; data: number[] }[] = [];
        const { chart } = chartMemo;

        const labels = ['Placed / Wating', 'Shipping / Registed', 'Received / Adropted', 'Self cancel', 'Admin cancel'];

        if (chart.length < 1) return results;

        const purchase = chart[0];
        const adoption = chart[1];

        const mapArray = purchase.data.slice(0, -1);

        results = mapArray.map((item, index) => {
            return {
                name: labels[index],
                data: [purchase.data[index], adoption.data[index]],
            };
        });

        return results;
    }, [chartMemo]);

    const seriesSocial = useMemo(() => {
        let results: { name: string; data: number[] }[] = [];
        const { social } = chartMemo;

        if (social.length <= 0) return results;

        const posts = social[0];

        results = [
            {
                name: posts.title,
                data: posts.data,
            },
        ];

        return results;
    }, [chartMemo]);

    return { ...chartMemo, seriesChart, seriesSocial };
}
