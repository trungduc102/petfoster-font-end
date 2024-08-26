'use client';
import { delay } from '@/utils/funtionals';
import React, { useRef, useState } from 'react';
import useIntersectionObserver from './useIntersectionObserver';
import { IBaseResponse, PagiantionResponse } from '@/configs/interface';

export default function useInfinities<T>({ queryFN }: { queryFN: (page?: number) => Promise<IBaseResponse<PagiantionResponse<T>>> }) {
    const refCountPage = useRef<number>(1);
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);

    const fetchPosts = async (skip = 0, limit = 10) => {
        setLoading(true);

        // test loading
        await delay(1000);
        const res = await queryFN(skip);

        if (!res || res.errors) {
            return [];
        }

        const data = res.data;

        if (refCountPage.current >= data.pages) setHasNextPage(false);
        setLoading(false);

        return data.data;
    };

    const lastDataRef = useIntersectionObserver<HTMLDivElement>(() => {
        refCountPage.current += 1;
        fetchPosts(refCountPage.current).then((newData) => setData((data) => [...data, ...newData]));
    }, [hasNextPage, !loading]);

    React.useEffect(() => {
        fetchPosts().then(setData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        lastDataRef,
        data,
        loading,
        hasNextPage,
    };
}
