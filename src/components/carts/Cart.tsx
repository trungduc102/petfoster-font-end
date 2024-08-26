'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/configs/types';
import { descrement, increment } from '@/redux/slice/appSlice';
import { WrapperAnimation } from '..';
import Link from 'next/link';

export interface ICartProps {}

// This is client component
// Component have 'use client' is client component
export default function Cart(props: ICartProps) {
    // get data from redux store
    // This line is equivalent to const { numberCart } = useAppSelector((state: RootState) => state.appReducer);
    // const cart = useAppSelector((state: RootState) => state.appReducer);
    // Use destractering to get value
    const { numberCart } = useAppSelector((state: RootState) => state.appReducer);

    // dispatch to store
    const dispatch = useAppDispatch();

    // Arrow funtion (recoment using arrow funtion). It handle increment number cart
    const handleIncrementNumberCart = () => {
        dispatch(increment());
    };

    // Funtion component. It handle descrement number cart
    function handleDescrementNumberCart() {
        dispatch(descrement());
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 font-bold text-lg">
            <span>This is Cart Number {numberCart}</span>
            <div className="flex items-center justify-between gap-4">
                {/* Wrap WrapperAnimation to use animation */}
                <WrapperAnimation>
                    <Button onClick={handleDescrementNumberCart} variant="contained" className="select-non flex items-center gap-2">
                        {/* Use  FontAwesomeIcon for app*/}
                        <FontAwesomeIcon icon={faMinus} />
                        <span>Click me !</span>
                    </Button>
                </WrapperAnimation>
                {/* Wrap WrapperAnimation to use animation */}
                <WrapperAnimation>
                    <Button onClick={handleIncrementNumberCart} variant="contained" className="select-non flex items-center gap-2">
                        {/* Use  FontAwesomeIcon for app*/}
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Click me !</span>
                    </Button>
                </WrapperAnimation>
            </div>
            <Button>
                <Link href={'/login'}>Go to Login Page</Link>
            </Button>
        </div>
    );
}
