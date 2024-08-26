/* eslint-disable @next/next/no-img-element */
import { WrapperAnimation } from '@/components';
import { IOtherHistory } from '@/configs/interface';
import { StateType } from '@/configs/types';
import { links } from '@/datas/links';
import { getIconWithStatus, stringToUrl, toCurrency, toGam } from '@/utils/format';
import { faBox, faCarSide, faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import * as React from 'react';

export interface IOtherHistoryItemProps {
    data: IOtherHistory;
}

const _Li = ({ title, value, styleContent }: { title: string; value: string | number; styleContent?: string }) => {
    return (
        <li className="flex flex-col text-black-main">
            <span>{title}</span>
            <p
                className={classNames('text-sm text-gray-primary', {
                    [styleContent || '']: styleContent && true,
                })}
            >
                {value}
            </p>
        </li>
    );
};

export default function OtherHistoryItem({ data }: IOtherHistoryItemProps) {
    const status = data.state.toLowerCase() as StateType;

    return (
        <div className="w-full rounded-lg max-w-full">
            <div className="py-3 px-4 md:px-10 bg-[#F2F2F2] text-sm md:text-1xl flex items-center justify-between rounded-t-lg">
                <ul className="flex items-center gap-4 md:gap-24">
                    <_Li title="Order ID" value={'#' + data.id} />
                    <_Li title="Date Place" value={data.datePlace} />
                    <_Li title="Order Items" value={'x' + data.products.length} styleContent="text-center" />
                    <_Li title="Total Amount" value={toCurrency(data.total)} />
                </ul>
                <Link
                    href={links.history.orderHistory + '/' + data.id}
                    className={classNames(' hover:underline', {
                        ['text-violet-primary']: data.isTotalRate || status !== 'delivered',
                        ['text-red-primary']: !data.isTotalRate && status === 'delivered',
                    })}
                >
                    {!data.isTotalRate && status === 'delivered' ? 'Rating now' : 'View details'}
                </Link>
            </div>

            <div className="pt-10 flex flex-col gap-3  px-5 border border-gray-primary rounded-b-lg border-t-0">
                <div key={data.products[0].id + (data.products[0].size + '')} className="flex items-center justify-between border-gray-primary pb-3 border-b ">
                    <div className=" w-full flex gap-8">
                        <div className=" w-[100px] h-[100px] md:w-[10%]">
                            <img className="w-full h-full object-cover" loading="lazy" src={data.products[0].image} alt={data.products[0].image} />
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <h2 className="text-sm md:text-1xl">{data.products[0].name}</h2>

                            <div className="flex items-center text-sm ">
                                <span className="">{data.products[0].brand}</span>
                                <span className="h-5 bg-[#666666] w-[1px] mx-3"></span>
                                <span>{toGam(data.products[0].size as number)}</span>
                            </div>
                            <p>{toCurrency(data.products[0].price * data.products[0].quantity)}</p>
                        </div>
                    </div>

                    <WrapperAnimation
                        hover={{
                            y: -2,
                        }}
                    >
                        <Link
                            href={links.produt + `${data.products[0].id}/${stringToUrl(data.products[0].name)}`}
                            className=" bg-violet-primary py-2 px-3 flex items-center justify-center text-xs md:text-sm text-white rounded-lg max-h-[40px] w-[120px] md:w-[150px]"
                        >
                            <span>View product</span>
                        </Link>
                    </WrapperAnimation>
                </div>

                <div className=" py-4 flex items-center text-sm gap-[10px] rounded-lg">
                    {(() => {
                        const { icon, color } = getIconWithStatus(status);

                        return <FontAwesomeIcon color={color} icon={icon} />;
                    })()}

                    <p className="capitalize">{` ${data.stateMessage} ${data.datePlace}`}</p>
                </div>
            </div>
        </div>
    );
}
