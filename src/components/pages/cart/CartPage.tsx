'use client';
import styles from './styles/cart.module.css';
import { BoxTitle, MainButton } from '@/components';
import { ContainerContent } from '@/components/common';
import { Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { dataCart } from '@/datas/cart-data';
import { toCurrency } from '@/utils/format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { addPaymentFromCard } from '@/redux/slice/cartsSlide';
import { useRouter } from 'next/navigation';
import { RootState } from '@/configs/types';
import { links } from '@/datas/links';
import { updateCartUser } from '@/apis/user';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';

const Carts = dynamic(() => import('./Carts'), { ssr: false });

export interface ICartPageProps {}

export default function CartPage(props: ICartPageProps) {
    // router
    const router = useRouter();
    const [total, setTotal] = useState(0);
    const dispatch = useAppDispatch();

    const { cartUser, payment } = useAppSelector((state: RootState) => state.cartReducer);

    const handleCheckout = () => {
        dispatch(addPaymentFromCard());
        router.push(links.users.payment);
    };

    useEffect(() => {
        return () => {
            (async () => {
                try {
                    const response = await updateCartUser(cartUser);

                    if (!response) {
                        toast.warn(contants.messages.errors.handle);
                        return;
                    }
                } catch (error) {
                    toast.error(contants.messages.errors.handle + `. Can't save your cart !`);
                }
            })();
        };
    }, [cartUser]);

    return (
        <>
            <ContainerContent className="pt-12">
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link className="hover:underline" href="/">
                            Home
                        </Link>
                        <Link className="text-black-main hover:underline " href="/cart">
                            Cart
                        </Link>
                    </Breadcrumbs>
                </div>
            </ContainerContent>
            {
                <BoxTitle
                    // actions={
                    //     <>
                    //         {payment.length > 0 && (
                    //             <div className="flex gap-1 items-center hover:text-violet-primary text-1xl">
                    //                 <Link className="hover:underline  transition-all ease-linear" href={'/payment'}>
                    //                     Go to pay page
                    //                 </Link>
                    //                 <FontAwesomeIcon className="text-sm" icon={faArrowRight} />
                    //             </div>
                    //         )}
                    //     </>
                    // }
                    mt="mt-[46px]"
                    mbUnderline="pb-0"
                    title="my cart"
                    fontWeigth="font-semibold"
                    underlineTitle
                    locationTitle="left"
                    fontSizeTitle="text-[32px]"
                >
                    {cartUser.length <= 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <span>{contants.messages.cart.empty}</span>
                        </div>
                    ) : (
                        <Carts onTotal={(t) => setTotal(t)} data={dataCart} />
                    )}

                    {cartUser.length > 0 && (
                        <div className="flex items-center justify-between mt-10 text-lg md:text-xl text-black-main">
                            <div className="flex items-center justify-start w-[10%]">
                                <span className="">Total</span>
                            </div>

                            <div className="flex items-center justify-center w-[20%] ">
                                <p className="">{toCurrency(total)}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center mt-20 mb-[60px] lg:mb-[-100px] gap-6">
                        {cartUser.length > 0 && cartUser.filter((i) => i.checked && i.repo > 0).length > 0 && (
                            <MainButton onClick={handleCheckout} title="Checkout" background="bg-violet-primary" />
                        )}
                        <Link
                            href={'/take-action'}
                            className={classNames(' hover:underline text-violet-primary flex items-center gap-[10px] text-1xl', {
                                [styles['cart-page']]: true,
                            })}
                        >
                            <span>Continue to buying</span>
                            <FontAwesomeIcon
                                className={classNames(' transition-all ease-linear', {
                                    [styles['link']]: true,
                                })}
                                icon={faArrowRight}
                            />
                        </Link>
                    </div>
                </BoxTitle>
            }
        </>
    );
}
