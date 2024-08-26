'use client';
import React, { MouseEvent, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Select, TextField, WraperTippy } from '../..';
import { useQuery } from '@tanstack/react-query';
import { FormControl, MenuItem, Select as Sl, SelectChangeEvent, capitalize } from '@mui/material';
import { RootState, SortType } from '@/configs/types';
import { IFilter, ISearchItem } from '@/configs/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from '@/hooks';
import { searchHistory } from '@/datas/others';
import { SearchItem } from '..';
import { addSearchHistories, deleteSearchHistories, getSearchHistories } from '@/apis/user';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { useAppSelector } from '@/hooks/reduxHooks';
export interface ISortProps {
    initDataCategory?: string;
    categories: IFilter[];
    sorts?: { title: string; value: string }[];
    onCategories?: (value: SortType, id?: string) => void;
    onSorts?: (value: SortType) => void;
    onSearch?: (value: string) => void;
    options?: {
        search?: {
            placeholder?: string;
        };
        sort?: {
            title: string;
        };
        categorie?: {
            title: string;
            useId?: boolean;
        };
    };
}

function Sort({
    categories,
    sorts,
    initDataCategory,
    options = { search: { placeholder: 'Search for product...' }, sort: { title: 'Sort' }, categorie: { title: 'Categories:', useId: false } },
    onCategories,
    onSorts,
    onSearch,
}: ISortProps) {
    const searchHistories = useQuery({
        queryKey: ['getSearchHistories'],
        queryFn: () => getSearchHistories(),
    });

    // redux

    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const ref = useRef<HTMLDivElement>(null);

    const [category, setCategory] = useState(initDataCategory || '');
    const [sort, setSort] = useState<'high' | 'low'>('low');
    const [search, setSearch] = useState('');
    const [toggleHisroy, setToggleHisroy] = useState(false);

    const searchDebounce = useDebounce(search, 600);

    const handleChangeCategory = (event: SelectChangeEvent<any>) => {
        setCategory(event.target.value as string);
        if (onCategories) {
            onCategories((event.target.value as string) === '' ? null : (event.target.value as string));
        }
    };

    const addSearchHistory = useQuery({
        queryKey: ['addSearchHistories', searchDebounce],
        queryFn: () => {
            if (!user) return;
            return addSearchHistories({ id: 0, title: searchDebounce });
        },
    });

    const handleOpenHistory = () => {
        setToggleHisroy(true);
    };

    const handlePushSearchHistory = (e: MouseEvent<HTMLDivElement>, data: ISearchItem) => {
        setSearch(data.title);
        setToggleHisroy(false);
    };

    const handleDeleteSearchItem = async (data: ISearchItem) => {
        try {
            const response = await deleteSearchHistories(data);

            if (!response || response.errors) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            searchHistories.refetch();
        } catch (error) {
            console.log('Sort :' + error);
        }
    };

    useEffect(() => {
        if (!onSearch) return;
        onSearch(searchDebounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchDebounce]);

    useEffect(() => {
        if (!onSorts) return;
        onSorts(sort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

    useEffect(() => {
        if (addSearchHistory.isFetched) {
            searchHistories.refetch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addSearchHistory.data]);

    const searchHistoriesData = useMemo(() => {
        if (searchHistories.error) {
            return [];
        }

        if (!searchHistories.data?.data) {
            return [];
        }

        return searchHistories.data.data;
    }, [searchHistories]);

    return (
        <div className="flex md:flex-row flex-col justify-between gap-[38px] border-b border-[#DBDBDB] mt-24 pb-[22px]">
            <div className="w-full md:w-[24%] lg:w-[20%] h-full text-black-main select-none">
                <WraperTippy
                    interactive
                    visible={toggleHisroy && searchHistoriesData.length > 0}
                    onClickOutside={() => setToggleHisroy(false)}
                    renderEl={
                        <>
                            <div className="scroll w-full max-h-[200px] overflow-y-auto bg-[#F2F2F2] rounded py-2 flex flex-col">
                                {searchHistoriesData.map((item) => {
                                    return <SearchItem handleDelete={handleDeleteSearchItem} onClickItem={handlePushSearchHistory} key={item.id} data={item} />;
                                })}
                            </div>
                        </>
                    }
                >
                    <div className="w-full relative">
                        <TextField
                            onClick={handleOpenHistory}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            id="search-pet-1"
                            name="pet"
                            fullWidth
                            size="small"
                            placeholder={options.search?.placeholder}
                            autoComplete="off"
                        />

                        {search.length > 0 && (
                            <span onClick={() => setSearch('')} className="absolute top-[50%] translate-y-[-50%] right-3 cursor-pointer">
                                <FontAwesomeIcon icon={faXmark} />
                            </span>
                        )}
                    </div>
                </WraperTippy>
            </div>
            <div className="flex-1">
                <div className="flex md:items-center flex-row w-full gap-3 justify-between">
                    <div className="flex items-center gap-[10px] flex-1">
                        <h4 className="text-lg">{options.categorie?.title}</h4>
                        <div ref={ref} className="w-full md:max-w-[210px]">
                            <FormControl fullWidth size="small">
                                <Select name="category" displayEmpty id="category" value={category} onChange={handleChangeCategory}>
                                    <MenuItem value={''}>{capitalize('all')}</MenuItem>
                                    {categories.map((category) => {
                                        return (
                                            <MenuItem key={category.name} value={(options.categorie?.useId ? String(category.id) : category.name) || category.name}>
                                                {capitalize(category.name)}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="w-[28%] lg:w-[14%] flex items-center justify-end select-none">
                        <div onClick={() => setSort(sort === 'high' ? 'low' : 'high')} className="cursor-pointer flex items-center gap-2 justify-end h-full hover:underline">
                            <span className="text-lg">{options.sort?.title}</span>
                            <FontAwesomeIcon className="text-sm" icon={sort === 'high' ? faChevronUp : faChevronDown} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Sort);
