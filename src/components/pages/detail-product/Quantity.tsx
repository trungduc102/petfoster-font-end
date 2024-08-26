'use client';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Roboto_Flex } from 'next/font/google';
import { motion } from 'framer-motion';
import React, { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import Validate from '@/utils/validate';

const robotoFlex = Roboto_Flex({ subsets: ['latin'], style: ['normal'], weight: ['300', '400', '500', '600', '700', '800'] });
export interface IQuantityProps {
    title?: string;
    maxValue: number;
    onQuantity?: (value: number) => void;
}

export default function Quantity({ title = 'Quantity', maxValue, onQuantity }: IQuantityProps) {
    const [value, setValue] = useState(1);

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

    const handlePlus = () => {
        setValue((prev) => {
            if (prev > maxValue - 1) return prev;

            return prev + 1;
        });
    };

    const handleMinus = () => {
        setValue((prev) => {
            if (prev <= 1) return 1;
            return prev - 1;
        });
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
        <div className="flex flex-col lg:flex-row lg:items-center  gap-5 lg:gap-[40px] mt-9">
            <div
                className={classNames('flex items-center gap-[40px] select-none', {
                    [robotoFlex.className]: true,
                })}
            >
                <span className="text-xl">{title}</span>
                <ul className={classNames('flex items-center rounded-md py-[8px] bg-[#F2F2F2] text-lg')}>
                    <motion.li
                        onClick={handleMinus}
                        whileTap={{
                            scale: 0.8,
                        }}
                        className=" px-2"
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
                        className=" px-2"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </motion.li>
                </ul>
            </div>
            <span
                className={classNames('"flex-none', {
                    [robotoFlex.className]: true,
                })}
            >
                Stock: {maxValue}
            </span>
        </div>
    );
}
