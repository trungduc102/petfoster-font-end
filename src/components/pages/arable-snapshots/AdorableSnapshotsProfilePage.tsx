'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { BoxPostHighlight, InfinityPosts, InfinityProfilePosts, UpdatePostDialog } from '@/components';
import { Avatar } from '@mui/material';
import { Tabs } from './tabs';
import { useAppSelector } from '@/hooks/reduxHooks';
import { ApiHightlightPostPage, RootState } from '@/configs/types';
import { contants } from '@/utils/contants';
import { hightlightOfUserPost } from '@/apis/posts';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { listTabsPostProfile } from '@/datas/header';
import { useQueryState } from 'nuqs';
import { getUserWithUsername } from '@/apis/user';

export interface IAdorableSnapshotsProfilePageProps {
    id: string;
}

export default function AdorableSnapshotsProfilePage({ id }: IAdorableSnapshotsProfilePageProps) {
    // redux
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const [type, setType] = useState<string | undefined>();

    const [openEdit, setOpenEdit] = useState(false);

    const [idPost, setIdPost] = useQueryState('post-id');

    const rawData = useQuery({
        queryKey: ['hightlightOfUserPost', id],
        queryFn: () => {
            return hightlightOfUserPost({ username: id });
        },
    });

    const profileData = useQuery({
        queryKey: ['profile-data', id],
        queryFn: () => {
            return getUserWithUsername(id);
        },
    });

    if (rawData.isError || rawData.data?.errors) {
        notFound();
    }

    const data = useMemo(() => {
        if (rawData.data?.errors || !rawData.data?.data) return [];

        return rawData.data.data;
    }, [rawData]);

    const dataUser = useMemo(() => {
        if (!id) return;

        if (user) {
            if (id === user?.username) {
                return user;
            }
        }

        if (!profileData.data || profileData.data.errors) return null;

        return profileData.data.data;

        // do something
    }, [id, user, profileData]);

    const dataTabs = useMemo(() => {
        const tabs = [listTabsPostProfile[0]];

        if (!id) return;

        if (user) {
            if (id === user?.username) {
                return listTabsPostProfile;
            }
        }

        return tabs;
    }, [user, id]);

    useEffect(() => {
        if (!idPost) return;

        setOpenEdit(true);
    }, [idPost]);

    return (
        <div className="w-full max-w-full">
            <div className="w-full flex flex-col items-center justify-center gap-2 py-8 text-post-primary">
                <Avatar
                    sx={{
                        width: '14rem',
                        height: '14rem',
                    }}
                    alt="avatar"
                    src={dataUser?.avatar || contants.avartarDefault}
                />

                <h1 className="text-[2.1rem] font-semibold ">{dataUser?.displayName || dataUser?.username}</h1>
            </div>

            {/* hightlight */}
            {data && data.length > 0 && <BoxPostHighlight data={data} options={{ captialize: false, tracking: 'tracking-wide' }} title="Highlight" />}

            <div className="my-16 w-full flex flex-col gap-6">
                {dataTabs && (
                    <Tabs
                        dataTabs={dataTabs}
                        onTab={(v) => {
                            setType(v.toLowerCase());
                        }}
                    />
                )}

                <div>
                    <InfinityProfilePosts username={id} type={type} />
                </div>
            </div>

            {openEdit && <UpdatePostDialog onClose={() => setIdPost(null)} open={openEdit} setOpen={setOpenEdit} />}
        </div>
    );
}
