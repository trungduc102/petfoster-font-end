'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LoadingSecondary, Post } from '@/components';
import classNames from 'classnames';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { delay } from '@/utils/funtionals';
import { getPosts, getPostsOfUser } from '@/apis/posts';
import { IPost } from '@/configs/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faFaceSadCry, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { usePathname, useSearchParams } from 'next/navigation';
import { links } from '@/datas/links';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';

export interface IInfinityPostsProps {
    type?: string;
    username: string;
}

export default function InfinityPosts({ type, username }: IInfinityPostsProps) {
    const refCountPage = useRef<number>(1);

    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);

    const [loadingFullPage, setLoadingFullPage] = useState(false);

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const fetchPosts = useCallback(
        async (page = 0) => {
            setLoading(true);

            // test loading
            const res = await getPostsOfUser({ page, type, username: username });

            if (!res || res.errors) {
                setLoading(false);
                setHasNextPage(false);
                if (type) {
                    setLoadingFullPage(false);
                }
                return [];
            }

            const data = res.data;

            if (page >= data.pages) setHasNextPage(false);
            setLoading(false);
            if (type) {
                setLoadingFullPage(false);
            }
            return data.data;
        },
        [type, username],
    );

    const lastPostRef = useIntersectionObserver<HTMLDivElement>(() => {
        refCountPage.current += 1;
        fetchPosts(refCountPage.current).then((newPosts) => setPosts((posts) => [...posts, ...newPosts]));
    }, [hasNextPage, !loading]);

    useEffect(() => {
        fetchPosts().then(setPosts);
    }, [fetchPosts]);

    useEffect(() => {
        refCountPage.current = 1;
        setHasNextPage(true);
        if (type) {
            setLoadingFullPage(true);
        }
        fetchPosts().then(setPosts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    return (
        <>
            <div
                className={classNames('grid relative', {
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

                {loadingFullPage && (
                    <div className="absolute bg-black-040 inset-0">
                        <LoadingSecondary color="#3E3771" defaultStyle={false} />
                    </div>
                )}
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
            {!hasNextPage && posts.length <= 0 && (
                <div className="flex items-center justify-center py-10 overflow-hidden flex-col gap-2 border-2 border-green-600 rounded-xl mb-10 mt-5">
                    <FontAwesomeIcon className="text-green-600 text-4xl" icon={faFaceSmile} />
                    <span className="text-black-main font-medium">{type ? 'Post your funny moments with your boss' : "You haven't liked any posts yet"}</span>
                </div>
            )}
        </>
    );
}
