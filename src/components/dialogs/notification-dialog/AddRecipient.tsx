'use client';
import React, { ChangeEvent, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ConversationDialog, LoadingSecondary, MiniLoading, WrapperAnimation } from '@/components';
import { IUserFirebase } from '@/configs/interface';
import { useDebounce } from '@/hooks';
import firebaseService from '@/services/firebaseService';
import { convertFirestoreTimestampToString } from '@/utils/format';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import Tippy from '@tippyjs/react/headless';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/navigation';
import { links } from '@/datas/links';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import SearchFilterItem from '@/components/pages/admin/message/nav/SearchFilterItem';

export interface IAddRecipientProps {
    onUser?: (user: IUserFirebase) => void;
}

export default function AddRecipient({ onUser }: IAddRecipientProps) {
    // redux
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const ref = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState('');

    const searchDebound = useDebounce(search, 400);

    const [usersSnapshot, loading] = useCollection(firebaseService.querys.getUsersToAddRecidient(searchDebound));

    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        if (!ref.current) return;

        setWidth(ref.current.clientWidth);
    }, [ref]);

    const searhMemo = useMemo(() => {
        if (!usersSnapshot?.docs) return [] as IUserFirebase[];

        const newUserShapshot = usersSnapshot.docs?.map((item) => {
            return {
                ...item.data(),
                lassSeen: convertFirestoreTimestampToString(item.data().lassSeen),
            } as IUserFirebase;
        });

        // remove the currently logged in user
        return newUserShapshot.filter((item) => {
            return item.username !== user?.username;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersSnapshot]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickItem = (data: IUserFirebase) => {
        if (!onUser) return;

        onUser(data);
    };
    return (
        <Tippy
            onClickOutside={handleClose}
            interactive
            placement="bottom"
            visible={open}
            render={(attr) => {
                return (
                    <div
                        style={{
                            width,
                        }}
                        {...attr}
                        tabIndex={-1}
                        className="rounded bg-white shadow-lg w-full py-2 border border-gray-primary"
                    >
                        {searhMemo.length > 0 &&
                            !loading &&
                            searhMemo.map((item) => {
                                return <SearchFilterItem handleClickItem={handleClickItem} key={item.username} data={item} />;
                            })}

                        {searhMemo.length <= 0 && !loading && (
                            <div className="flex items-center justify-center gap-2 hover:bg-[#f2f2f2] px-3 py-2 transition-all ease-linear cursor-pointer max-w-full">
                                <span className="line-clamp-2 truncate w-full text-center">No results for {`"${searchDebound}"`}</span>
                            </div>
                        )}

                        {loading && (
                            <div className="h-[60px]">
                                <MiniLoading />
                            </div>
                        )}
                    </div>
                );
            }}
        >
            <div ref={ref} className="cursor-pointer bg-[#F2F2F2] py-2 px-3 flex-1 w-1/3 max-w-[200px] rounded-lg border hover:border-gray-500 active:border-gray-500">
                <div className="flex items-center justify-between  rounded  w-full">
                    <input
                        spellCheck={false}
                        value={search}
                        onChange={handleChange}
                        onClick={() => setOpen(true)}
                        placeholder="Search user"
                        className="outline-none border-none bg-transparent flex-1 w-full"
                        type="text"
                    />
                    <WrapperAnimation hover={{}} className="w-[30px] h-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </WrapperAnimation>
                </div>
            </div>
        </Tippy>
    );
}
