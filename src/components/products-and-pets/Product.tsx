/* eslint-disable @next/next/no-img-element */
import { updateRecentViews } from '@/apis/user';
import { IProduct } from '@/configs/interface';
import { links } from '@/datas/links';
import { contants } from '@/utils/contants';
import { capitalize, stringToUrl, toCurrency, toGam } from '@/utils/format';
import { Rating } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';
import { toast } from 'react-toastify';

export interface IProductProps {
    data: IProduct;
}

export default function Product({ data }: IProductProps) {
    const handleClickProduct = async () => {
        try {
            const response = await updateRecentViews(data.id as string);

            if (!response || response.errors) {
                toast.warn(contants.messages.errors.handle);
                return;
            }
        } catch (error) {
            console.log('Product: ' + error);
        }
    };

    return (
        <div className="flex flex-col items-center hover:shadow-primary pb-[21px] transition-all ease-linear max-h-[468px] rounded">
            <div className="w-full h-3/5 min-h-[304px] relative">
                <img className="w-full h-full object-contain" loading="lazy" src={data.image} alt={data.image} />

                <div className="absolute top-4 right-3 bg-[#EF4444] px-[14px] py-1 text-white font-medium rounded-full text-sm">
                    <span>-{data.discount}%</span>
                </div>
            </div>
            <div className="px-[20px] w-full">
                <div className="flex items-center justify-between w-full text-gray-primary text-sm">
                    <span className="w-full max-w-[80%] line-clamp-1">{capitalize(data.brand)}</span>
                    <p>{toGam(data.size[0] as number)}</p>
                </div>
                <Link
                    onClick={handleClickProduct}
                    href={links.produt + `${data.id}/${stringToUrl(data.name)}`}
                    className="text-[18px] line-clamp-1 hover:underline cursor-pointer mt-2 mb-2"
                >
                    {data.name}
                </Link>
                <Rating
                    sx={{
                        '& .MuiSvgIcon-root': {
                            fontSize: '16px',
                        },
                    }}
                    name="read-only"
                    value={data.rating}
                    readOnly
                />
                <div className="flex items-center gap-[10px] mt-3">
                    <span className="text-xl text-[#EF4444] font-medium tracking-wide">{toCurrency(data.price)}</span>
                    <del className="text-sm text-black-main">{toCurrency(data.oldPrice)}</del>
                </div>
            </div>
        </div>
    );
}
