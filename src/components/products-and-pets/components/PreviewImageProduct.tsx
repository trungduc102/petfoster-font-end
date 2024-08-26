/* eslint-disable @next/next/no-img-element */
'use client';
import { ImageAnimation } from '@/components';
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const variants = {
    initial: (direction: number) => {
        return {
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        };
    },
    animate: {
        x: 0,
        opacity: 1,

        transition: {
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
        },
    },
    exit: (direction: number) => {
        return {
            x: direction > 0 ? -100 : 100,
            opacity: 0,

            transition: {
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        };
    },
};

export interface IPreviewImageProps {
    images: string[];
}

function PreviewImageProduct({ images }: IPreviewImageProps) {
    const [curImage, setCurImage] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleClick = (index: number) => {
        setDirection(1);
        setCurImage(index);
    };

    function nextStep() {
        setDirection(1);
        if (curImage === images.length - 1) {
            setCurImage(0);
            return;
        }
        setCurImage(curImage + 1);
    }

    function prevStep() {
        setDirection(-1);
        if (curImage === 0) {
            setCurImage(images.length - 1);
            return;
        }
        setCurImage(curImage - 1);
    }

    return (
        <div className={classNames('w-full flex flex-col  items-center gap-[30px] select-none')}>
            <AnimatePresence initial={false} custom={direction}>
                <div className="w-full  rounded-xl overflow-hidden relative h-[386px]">
                    <motion.img
                        loading="lazy"
                        variants={variants}
                        animate="animate"
                        initial="initial"
                        exit="exit"
                        src={images[curImage]}
                        alt="slides"
                        className="w-full h-[200px] md:h-full md:max-h-[392px] object-contain"
                        key={images[curImage]}
                        custom={direction}
                    />

                    <div className="absolute px-5 top-[50%] flex items-center justify-between w-full md:hidden">
                        <motion.div
                            onClick={prevStep}
                            whileHover={{ x: -10 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-slide-btn h-slide-btn bg-[rgba(255,255,255,0.4)] top-[50%] 
                            flex items-center rounded-full justify-center cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </motion.div>
                        <motion.div
                            onClick={nextStep}
                            whileHover={{ x: 10 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-slide-btn h-slide-btn bg-[rgba(255,255,255,0.4)] top-[50%] 
                            flex items-center rounded-full justify-center cursor-pointer md:hidden"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </motion.div>
                    </div>
                </div>
            </AnimatePresence>

            <div className="grid-cols-4 h-[95px] gap-4 hidden md:grid">
                {images.map((img, index) => {
                    return (
                        <div
                            onClick={() => handleClick(index)}
                            key={index}
                            className={classNames(
                                `w-full h-full rounded-[11px] overflow-hidden border-2 
                             hover:border-green-main-dark transition-all ease-linear`,
                                { 'border-green-main-dark': curImage === index, ' border-transparent': curImage !== index },
                            )}
                        >
                            <ImageAnimation className=" max-h-[392px] object-cover" src={img} alt={img} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default memo(PreviewImageProduct);
