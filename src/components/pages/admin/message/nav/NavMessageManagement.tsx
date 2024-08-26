'use client';
import { LoadingSecondary, TippyChooser, WraperTippy, WrapperAnimation } from '@/components';
import { contants } from '@/utils/contants';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBookmark, faChevronDown, faComment, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, useMemo, useState } from 'react';
import NavChatItem from './NavChatItem';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebaseService from '@/services/firebaseService';
import { IConversationId, INavChatItemData } from '@/configs/interface';
import { useAppSelector } from '@/hooks/reduxHooks';
import { RootState, TippyChooserType } from '@/configs/types';
import { OrderByDirection } from 'firebase/firestore';
import Tippy from '@tippyjs/react/headless';
import Filter from './Filter';

const NavContainer = ({
    children,
    head,
}: {
    children: ReactNode;
    head: {
        title: string;
        icon: IconProp;
    };
}) => {
    return (
        <div className="mt-5">
            <div className="flex items-center gap-2 text-[#303B4E] font-medium text-1xl px-5">
                <FontAwesomeIcon icon={head.icon} />
                <h4 className="uppercase">{head.title}</h4>
            </div>
            <div className="mt-5">{children}</div>
        </div>
    );
};

export interface INavMessageManamentProps {}

export default function NavMessageManament(props: INavMessageManamentProps) {
    const [sortValue, setsortValue] = useState<OrderByDirection>('desc');

    const [conversationSnapshot, loading] = useCollection(firebaseService.querys.getConversations(sortValue));
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const memoData = useMemo(() => {
        if (!conversationSnapshot) return [] as IConversationId[];

        return conversationSnapshot.docs.map((item) => {
            return {
                ...item.data(),
                id: item.id,
            } as IConversationId;
        });
    }, [conversationSnapshot]);

    const memoHasGimData = useMemo(() => {
        if (!conversationSnapshot) return [] as IConversationId[];

        const listAffterFilter = conversationSnapshot.docs.filter((item) => {
            return (item?.data() as IConversationId).gim;
        });

        return listAffterFilter.map((item) => {
            return {
                ...item.data(),
                id: item.id,
            } as IConversationId;
        });
    }, [conversationSnapshot]);

    const handleSort = (value: TippyChooserType) => {
        const sort = (value.title === '' ? 'desc' : value.id) as OrderByDirection;
        console.log(value);
        setsortValue(sort);
    };

    return (
        <div className="w-full h-full py-8 pr-2 flex flex-col justify-between items-center gap-8  border-r border-gray-primary">
            <h2 className=" px-5 text-[28px] font-semibold text-left w-full">CHAT MANAGEMENT</h2>
            <div style={contants.styleMessageManagePage} className="w-full flex flex-col gap-8  h-full">
                <Filter handleSort={handleSort} />

                {/* contents */}

                <div className="scroll hide-scroll overflow-y-auto w-full h-full relative pb-[120px]">
                    {/* List conversations has gim */}
                    {memoHasGimData.length > 0 && (
                        <NavContainer head={{ title: 'BOOKMARKED', icon: faBookmark }}>
                            {memoHasGimData.map((item) => {
                                return <NavChatItem key={item?.id} currentUser={user} data={item} />;
                            })}
                        </NavContainer>
                    )}
                    <NavContainer head={{ title: 'ALL MESSAGES', icon: faComment }}>
                        {memoData &&
                            memoData.map((item) => {
                                return <NavChatItem key={item.id} data={item} currentUser={user} />;
                            })}
                    </NavContainer>

                    {loading && (
                        <div className="bg-[rgba(0,0,0,.04)] w-full h-full absolute">
                            <LoadingSecondary />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
