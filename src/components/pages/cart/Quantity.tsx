'use client';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Roboto_Flex } from 'next/font/google';
import { motion } from 'framer-motion';
import React, { FocusEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import Validate from '@/utils/validate';
const robotoFlex = Roboto_Flex({ subsets: ['latin'], style: ['normal'], weight: ['300', '400', '500', '600', '700', '800'] });
export interface IQuantityProps {
    maxValue: number;
    initValue?: number;
    onQuantity?: (value: number) => void;
}

export default function Quantity({ maxValue, initValue, onQuantity }: IQuantityProps) {
    const [value, setValue] = useState(initValue || 1);

    const ref = useRef<HTMLLIElement>(null);
    const closeEdit = () => {
        if (!ref.current) return;
        ref.current?.setAttribute('contentEditable', 'false');
    };

    const handleEdit = () => {
        if (!ref.current) return;
        closeEdit();
        const refValue = ref.current?.innerHTML;

        if (!Validate.isNumber(refValue)) {
            resetSetValue(1);
            return;
        }
        const curValue = parseInt(refValue);

        if (curValue > maxValue) {
            resetSetValue(maxValue);
            return;
        }
        setValue(curValue);
    };

    const resetSetValue = (nun: number) => {
        if (!ref.current) return;
        setValue(nun);
        ref.current.innerText = nun + '';
    };

    const handleClick = () => {
        if (!ref.current) return;

        ref.current?.setAttribute('contentEditable', 'true');
    };

    const handleBlur = (e: FocusEvent<HTMLLIElement>) => {
        handleEdit();
    };

    const handleKeyEnter = (e: KeyboardEvent<HTMLLIElement>) => {
        if (e.key !== 'Enter') return;
        handleEdit();
    };

    const handlePlus = () => {
        if (maxValue <= 0) return 0;

        setValue((prev) => {
            if (prev > maxValue - 1) return prev;

            return prev + 1;
        });
    };

    const handleMinus = () => {
        if (maxValue <= 0) return 0;
        setValue((prev) => {
            if (prev <= 1) return 1;
            return prev - 1;
        });
    };

    useEffect(() => {
        if (value > maxValue) {
            setValue(maxValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxValue]);

    useEffect(() => {
        if (!onQuantity) return;

        onQuantity(value);
    }, [value, onQuantity]);
    return (
        <div
            className={classNames('flex items-center gap-[40px] select-none', {
                [robotoFlex.className]: true,
            })}
        >
            <ul className={classNames('flex items-center rounded-md py-2 md:py-[8px] bg-[#F2F2F2] text-sm md:text-lg')}>
                <motion.li
                    onClick={handleMinus}
                    whileTap={{
                        scale: 0.8,
                    }}
                    className=" px-2 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faMinus} />
                </motion.li>
                <li onKeyDown={handleKeyEnter} tabIndex={-1} ref={ref} onBlur={handleBlur} onClick={handleClick} className=" px-3 border-l border-r border-gray-primary">
                    {value}
                </li>
                <motion.li
                    onClick={handlePlus}
                    whileTap={{
                        scale: 0.8,
                    }}
                    className=" px-2 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPlus} />
                </motion.li>
            </ul>
        </div>
    );
}
