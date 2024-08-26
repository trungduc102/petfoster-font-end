'use client';

import React, { ReactNode, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export interface IDivAnitmationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    variants?: {};
}

export default function DivAnitmation({
    children,
    className,
    delay = 0.1,
    duration = 0.5,
    variants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
    },
}: IDivAnitmationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const mainControl = useAnimation();
    useEffect(() => {
        if (isInView) {
            mainControl.start('visible');
        } else {
            mainControl.start('hidden');
        }
    }, [isInView, mainControl]);
    return (
        <motion.div ref={ref} variants={variants} initial={'hidden'} animate={mainControl} transition={{ duration, delay }} className={className}>
            {children}
        </motion.div>
    );
}
