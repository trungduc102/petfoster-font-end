import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nunito_Sans } from 'next/font/google';
import classNames from 'classnames';
import React, { memo } from 'react';
import { LinearProgress } from '@mui/material';

const nunitoSans = Nunito_Sans({
    subsets: ['latin'],
    weight: ['500', '600'],
});

const data = [
    {
        id: 1,
        title: 'Login',
    },
    {
        id: 2,
        title: 'Address',
    },
    {
        id: 3,
        title: 'Delivery',
    },
];

export interface ILineProPressProps {
    progressNun: number;
}

const _btn = ({
    check,
    data,
    value,
    options,
}: {
    check?: boolean;
    data: {
        id: number;
        title: string;
    };
    value?: number;
    options?: {
        hideProgress?: boolean;
    };
}) => {
    return (
        <div
            className={classNames('flex items-center gap-2 w-full', {
                [nunitoSans.className]: true,
            })}
        >
            <div
                className={classNames('h-[33px] w-[33px] rounded-full text-lg flex items-center justify-center text-white', {
                    ['bg-violet-primary']: (value && value >= 10) || check,
                    ['bg-[#C2C2C2]']: (value && value < 100) || !check,
                })}
            >
                {(value && value >= 100) || check ? <FontAwesomeIcon icon={faCheck} /> : <span className="text-sm">{data.id}</span>}
            </div>
            <span className="text-black-main text-lg">{data.title}</span>
            {!options?.hideProgress && (
                <div className="flex-1">
                    <LinearProgress variant="determinate" value={value} />
                </div>
            )}
        </div>
    );
};
function LineProPress({ progressNun }: ILineProPressProps) {
    return (
        <div className="mb-[60px] mt-[80px] px-[30px] hidden lg:flex items-center justify-between w-full gap-2">
            <div className="flex items-center justify-between flex-1 gap-2">
                {data.map((item, index) => {
                    return <_btn value={item.id < progressNun ? 100 : -1} key={item.id} data={item} />;
                })}
            </div>
            <div className="min-w-[10%]">
                <_btn
                    check={progressNun - 1 === data.length}
                    data={{
                        id: 4,
                        title: 'Payment',
                    }}
                    options={{ hideProgress: true }}
                />
            </div>
        </div>
    );
}

export default memo(LineProPress);
