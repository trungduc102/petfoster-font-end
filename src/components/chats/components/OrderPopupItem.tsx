/* eslint-disable @next/next/no-img-element */
import { WrapperAnimation } from '@/components';
import { IOtherHistory } from '@/configs/interface';
import { links } from '@/datas/links';
import { stringToUrl, toCurrency } from '@/utils/format';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

export interface IOrderPopupItemProps {
    data: IOtherHistory | null;
    onSend?: (data: IOtherHistory) => void;
}

export default function OrderPopupItem({ data, onSend }: IOrderPopupItemProps) {
    return (
        <>
            <div className="flex items-center justify-between px-3 py-2">
                <span className={classNames('font-medium text-sm text-black-main')}>
                    #{data?.id} {data?.state} {data?.datePlace}
                </span>
            </div>
            <div className="flex flex-col gap-3 mb-1">
                {data && (
                    <div key={data.products[0].id} className="flex items-center gap-2 text-sm px-3 py-2">
                        <img className="w-[60px] h-[60px] object-contain" src={data.products[0].image} alt={data.products[0].image} />

                        <div className="w-full  flex-1">
                            <Link href={links.produt + `${data.products[0].id}/${stringToUrl(data.products[0].name)}`} className="line-clamp-1 hover:underline">
                                {data.products[0].name}
                            </Link>
                            <div className="flex items-center gap-2">
                                <p className="text-red-primary">{toCurrency(10000)}</p>
                                <del className="text-xs">{toCurrency(12000)}</del>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {data && (
                <div className="text-sm flex items-center gap-2 justify-end px-3">
                    <span>{data?.products.length} products</span>
                    <span>|</span>
                    <span className="text-red-primary">{toCurrency(data?.total)}</span>
                </div>
            )}
            <div className="flex items-center justify-end px-3 mt-2">
                <Link href={links.history.orderHistory + `/${data?.id}`} className="text-xs text-center hover:underline">
                    Show this order
                </Link>
                <WrapperAnimation
                    onClick={onSend && data ? () => onSend(data) : undefined}
                    hover={{}}
                    className="text-xs py-1 px-2 rounded-md border border-gray-primary hover:border-green-5FA503 transition-all ease-linear cursor-pointer ml-2"
                >
                    Send
                </WrapperAnimation>
            </div>
        </>
    );
}
