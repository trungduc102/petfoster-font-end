'use client';
import { IImagePost } from '@/configs/interface';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

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

export interface IMediaPostDetailMobileProps {
    images: IImagePost[];
}

export default function MediaPostDetailMobile({ images }: IMediaPostDetailMobileProps) {
    const [curImage, setCurImage] = useState(0);
    const [direction, setDirection] = useState(0);

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
        <>
            {/* mobile */}
            <AnimatePresence initial={false} custom={direction}>
                <div className="flex-1 w-full h-full md:hidden sm:flex flex-col gap-2 overflow-hidden relative mb-2 pt-2 border-t border-gray-primary">
                    <motion.img
                        variants={variants}
                        animate="animate"
                        initial="initial"
                        exit="exit"
                        src={images[curImage]?.url}
                        alt={images[curImage]?.url}
                        className="w-full max-w-full h-full sm:object-contain md:object-fill"
                        key={images[curImage]?.url}
                        custom={direction}
                    />

                    <div className="absolute inset-0 flex items-center justify-center z-30">
                        <div className="w-full flex items-center justify-between px-6">
                            <span className="text-2xl text-gray-500 cursor-pointer" onClick={prevStep}>
                                <FontAwesomeIcon icon={faChevronCircleLeft} />
                            </span>
                            <span className="text-2xl text-gray-500 cursor-pointer" onClick={nextStep}>
                                <FontAwesomeIcon icon={faChevronCircleRight} />
                            </span>
                        </div>
                    </div>

                    <div className="absolute flex items-end justify-center gap-[6px] w-full h-full inset-0 pb-4">
                        {images.map((item, index) => {
                            return (
                                <span
                                    key={index}
                                    className={classNames('w-2 h-2  rounded-full', {
                                        ['bg-gray-300']: index !== curImage,
                                        ['bg-white']: index === curImage,
                                    })}
                                ></span>
                            );
                        })}
                    </div>
                </div>
            </AnimatePresence>
            {/* mobile */}
        </>
    );
}
