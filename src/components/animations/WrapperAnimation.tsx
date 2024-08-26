'use client';
import React, { HTMLProps, MouseEventHandler, ReactHTML, ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence, HTMLMotionProps, ForwardRefComponent } from 'framer-motion';
export type Ref = HTMLDivElement & HTMLLabelElement;
// This interface of local component. Can delete if component haven't actribute
export interface IWrapperAnimationProps {
    styleAnimation?: {
        initial: {};
        animate: {};
        exits: {};
    };
    tag?: null | {};
    styleTag?: 'scale' | 'none';
    hover?: {};
    className?: string;
    children: ReactNode;
    htmlFor?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

const WrapperAnimation = forwardRef<Ref, IWrapperAnimationProps>(
    (
        {
            styleAnimation,
            hover = {
                scale: 1.1,
            },
            tag,
            children,
            styleTag = 'scale',
            className,
            htmlFor,
            onClick,
        },
        ref,
    ) => {
        const tags = {
            scale: {
                scale: 0.9,
            },
            none: {},
        };

        return (
            <AnimatePresence>
                <motion.div
                    ref={ref}
                    onClick={onClick}
                    className={className + ' select-none'}
                    whileTap={tag || tags[styleTag]}
                    animate={styleAnimation?.animate}
                    exit={styleAnimation?.exits}
                    initial={styleAnimation?.initial}
                    whileHover={hover}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        );
    },
);

// 👇️ set display name
WrapperAnimation.displayName = 'WrapperAnimation';

export default WrapperAnimation;
