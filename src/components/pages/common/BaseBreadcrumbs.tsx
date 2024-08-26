'use client';
import { BoxTitle, LoadingSecondary } from '@/components';
import { ContainerContent } from '@/components/common';
import { Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import React, { ReactNode, memo, useEffect, useLayoutEffect, useState } from 'react';

type DataBreadcrumbs = {
    title: string;
    href: string;
};

export interface IBaseBreadcrumbsProps {
    isLoading?: boolean;
    title: string;
    breadcrumb: DataBreadcrumbs[];
    children: ReactNode;
    stytle?: {
        mbUnderline: string | undefined;
        border: boolean;
    };
    footer?: ReactNode;
    actions?: ReactNode;
}

function BaseBreadcrumbs({
    isLoading = false,
    breadcrumb,
    children,
    title,
    stytle = {
        mbUnderline: undefined,
        border: true,
    },
    footer,
    actions,
}: IBaseBreadcrumbsProps) {
    const [loading, setLoading] = useState(isLoading);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);
    return (
        <>
            <ContainerContent className="pt-12">
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link className="hover:underline" href="/">
                            Home
                        </Link>
                        {breadcrumb.map((item) => {
                            return (
                                <Link key={item.href} className="text-black-main hover:underline " href={item.href}>
                                    {item.title}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>
                </div>
            </ContainerContent>
            <BoxTitle
                actions={actions}
                border={stytle.border}
                mbUnderline={stytle.mbUnderline}
                mt="mt-[46px]"
                title={title}
                fontWeigth="font-semibold"
                underlineTitle
                locationTitle="left"
                fontSizeTitle="text-[32px]"
            >
                {children}
                {loading && <LoadingSecondary />}

                {footer}
            </BoxTitle>
        </>
    );
}

export default memo(BaseBreadcrumbs);
