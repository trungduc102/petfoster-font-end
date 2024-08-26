'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LoadingSecondary, Post } from '@/components';
import classNames from 'classnames';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { delay } from '@/utils/funtionals';
import { getPosts } from '@/apis/posts';
import { IPost } from '@/configs/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faFaceSadCry } from '@fortawesome/free-solid-svg-icons';
import { usePathname, useSearchParams } from 'next/navigation';
import { links } from '@/datas/links';

export interface IInfinityPostsProps {}

export default function InfinityPosts(props: IInfinityPostsProps) {
    const refCountPage = useRef<number>(1);

    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);

    const pathname = usePathname();

    const searchParam = useSearchParams();
    const search = searchParam.get('q');

    const searchQueries = useMemo(() => {
        if (pathname !== links.adorables.search) return undefined;

        if (search) {
            return search;
        }
    }, [pathname, search]);

    const fetchPosts = useCallback(async (page = 0, search?: string) => {
        setLoading(true);

        // test loading
        await delay(800);
        const res = await getPosts({ page, search });

        if (!res || res.errors) {
            setLoading(false);
            setHasNextPage(false);
            return [];
        }

        const data = res.data;

        if (page >= data.pages) setHasNextPage(false);
        setLoading(false);

        return data.data;
    }, []);

    const lastPostRef = useIntersectionObserver<HTMLDivElement>(() => {
        refCountPage.current += 1;
        fetchPosts(refCountPage.current).then((newPosts) => setPosts((posts) => [...posts, ...newPosts]));
    }, [hasNextPage, !loading]);

    useEffect(() => {
        if (searchQueries) {
            fetchPosts(refCountPage.current, searchQueries).then((newPosts) => setPosts((posts) => [...newPosts]));
            return;
        }

        fetchPosts().then(setPosts);
    }, [fetchPosts, searchQueries]);

    return (
        <>
            <div
                className={classNames('grid', {
                    ['lg:grid-cols-4 gap-4 py-4']: true,
                    ['md:grid-cols-3']: true,
                })}
            >
                {posts.map((item, index, posts) => {
                    return (
                        <div key={index} ref={posts.length - 1 === index ? lastPostRef : null}>
                            <Post variant="rounded" data={item} />
                        </div>
                    );
                })}
            </div>
            {loading && (
                <div className="flex items-center justify-center py-10 overflow-hidden">
                    <LoadingSecondary color="#3E3771" defaultStyle={false} />
                </div>
            )}
            {!hasNextPage && posts.length > 0 && (
                <div className="flex items-center justify-center py-10 overflow-hidden flex-col gap-2 border-2 border-green-600 rounded-xl mb-10 mt-5">
                    <FontAwesomeIcon className="text-green-600 text-4xl" icon={faCircleCheck} />
                    <span className="text-black-main font-medium">All the latest bulletin boards have been loaded</span>
                </div>
            )}
            {!hasNextPage && posts.length <= 0 && searchQueries && (
                <div className="flex items-center justify-center py-10 overflow-hidden flex-col gap-2 border-2 border-green-600 rounded-xl mb-10 mt-5">
                    <FontAwesomeIcon className="text-green-600 text-4xl" icon={faFaceSadCry} />
                    <span className="text-black-main font-medium">There are no results matching the keyword &quot;{searchQueries}&ldquo;</span>
                </div>
            )}
        </>
    );
}
