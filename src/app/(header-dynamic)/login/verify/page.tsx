'use client';
import { BoxSign, LoadingPrimary, SocialButton, TextField } from '@/components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { refreshVerifyCode, verifyCode } from '@/apis/user';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { ContainerContent } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faClose } from '@fortawesome/free-solid-svg-icons';

export interface IVerifyProps {}

export default function Verify(props: IVerifyProps) {
    const searchParam = useSearchParams();
    const router = useRouter();
    const code = searchParam.get('code');
    const [loading, setLoading] = useState(false);

    let node = <LoadingPrimary />;

    const handleRefreshCode = async () => {
        try {
            setLoading(true);
            const response = await refreshVerifyCode(code || '');
            setLoading(false);
            if (!response.errors && response.status === 200) {
                toast.success('Re-send code successfuly, please check your email');
            }
        } catch (error) {
            setLoading(false);
            toast.error(contants.messages.errors.server);
        }
    };

    if (!code) {
        toast.error(contants.messages.errors.server);
        router.push('/login');
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['login/verify', code],
        queryFn: () => verifyCode(code || ''),
    });

    if (data && data?.status === 200) {
        toast.success('Successfuly Authentication');
        router.push('/login');
        return node;
    }

    if (data && data?.status === 400) {
        toast.success(data.message);
        router.push('/login');
        return node;
    }

    if (data && (data?.status === 404 || data?.status === 401 || data?.status === 509)) {
        return (
            <ContainerContent>
                <div className="bg-[#f2f2f2] w-[40%] min-h-[200px] rounded-xl m-auto flex items-center justify-center flex-col text-black-main gap-4 mb-[-8%] my-28">
                    <FontAwesomeIcon className="text-4xl text-red-primary" icon={faCircleXmark} />
                    <span className="text-2xl uppercase">Code is expired.</span>

                    <span onClick={handleRefreshCode} className="cursor-pointer hover:underline text-blue-primary">
                        Click to re send a new code to your email{' '}
                    </span>
                    {loading && <LoadingPrimary />}
                </div>
            </ContainerContent>
        );
    }

    return node;
}
