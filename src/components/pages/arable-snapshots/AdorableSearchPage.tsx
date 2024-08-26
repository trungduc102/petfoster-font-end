'use client';
import { BoxPost, BoxPostHighlight, InfinityPosts, LoadingSecondary, Post, PostDialog, PrimaryPostButton, SearchInput } from '@/components';
import classNames from 'classnames';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { addPreviousUrl } from '@/utils/session';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { links } from '@/datas/links';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { appService } from '@/services/appService';
import { setOpenPostModal } from '@/redux/slice/adorableSlide';

export interface IAdorableSearchPageProps {}

export default function AdorableSearchPage(props: IAdorableSearchPageProps) {
    const pathname = usePathname();
    const router = useRouter();

    const searchParam = useSearchParams();
    const searchQuery = searchParam.get('q');

    const [search, setSearch] = useState(searchQuery || '');

    //redux
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const dispatch = useAppDispatch();

    const handleOpenPostModal = () => {
        if (!user) return appService.handleNonLogin(pathname, router);
        dispatch(setOpenPostModal(true));
    };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(links.adorables.search + `?q=${search}`);
    };

    return (
        <div className="pt-12">
            <div className="flex flex-col md:flex-row md:gap-0 gap-5 items-center justify-between mb-10">
                <PrimaryPostButton onClick={handleOpenPostModal} hover="up" title="New Post" size="md" variant="rouded-fill" />
                <form onSubmit={handleSearch} className="w-full md:w-2/3 lg:w-1/3">
                    <SearchInput
                        className="bg-[#F7F7F7] py-[15px] px-6 border-[#D6D6D6]"
                        classNameInput="bg-inherit placeholder:text-sm text-sm"
                        defaultStyle={false}
                        placeholder="Interested in..."
                        variant="circle"
                        value={search}
                        handleChange={(e) => setSearch(e.target.value)}
                        handleClose={() => {
                            router.push(links.adorables.search);
                            setSearch('');
                        }}
                    />
                </form>
            </div>

            <BoxPost title="OTHER POSTS" className="mt-20">
                <InfinityPosts />
            </BoxPost>
        </div>
    );
}
