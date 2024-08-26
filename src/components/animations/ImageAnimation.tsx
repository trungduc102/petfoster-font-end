/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

type animationType = {
    scaleAndRotate: {};
    scale: {};
    none: {};
};

export interface IImageAniamtionProps {
    className?: string;
    src: string;
    alt: string;
    animation?: keyof animationType;
}

export default function ImageAniamtion({ className, animation = 'scaleAndRotate', ...props }: IImageAniamtionProps) {
    const [onClick, setOnClick] = useState(false);

    const animationTypes: animationType = {
        scaleAndRotate: { scale: 1.4, rotate: 4 },
        scale: { scale: 1.2 },
        none: {},
    };

    return (
        <motion.img
            animate={{ scale: 1.1 }}
            onClick={() => setOnClick(!onClick)}
            whileHover={animationTypes[animation]}
            className={classNames('w-full h-full object-cover', {
                [className ?? '']: className,
            })}
            {...props}
        />
    );
}
