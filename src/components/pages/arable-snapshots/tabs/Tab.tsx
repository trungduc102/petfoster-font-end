'use client';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export interface Active {
    value: string;
    initBorder: number;
    left: number;
    width: number;
}

interface TabProps {
    title: string;
    selected: boolean;
    icon?: IconProp;
    active: Active;
    setActive: ({ value, initBorder, left }: Active) => void;
    onClick?: () => void;
}

const Tab = ({ title, selected, icon, active, setActive, onClick }: TabProps) => {
    const ref = useRef<HTMLParagraphElement>(null);

    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        if (!ref.current) return;
        setWidth(ref.current.getBoundingClientRect().width);
    }, []);

    return (
        <p
            onMouseEnter={() => setActive({ ...active, left: ref.current ? ref.current?.offsetLeft : 0 })}
            onMouseLeave={() => setActive({ ...active, left: active.initBorder })}
            ref={ref}
            onClick={() => {
                setActive({
                    value: title,
                    initBorder: ref.current ? ref.current?.offsetLeft : 0,
                    left: ref.current ? ref.current?.offsetLeft : 0,
                    width: width,
                });
                if (!onClick) return;
                onClick();
            }}
            className={` h-full flex items-center justify-center
             font-bold text-lg leading-[25px] w-1/2 py-3
           cursor-pointer ${selected ? 'text-post-primary' : 'text-white-opacity-50'}`}
        >
            {icon && (
                <span>
                    <FontAwesomeIcon icon={icon} />
                </span>
            )}
            <span className={`${icon ? 'ml-2' : ''}`}>{title}</span>
        </p>
    );
};

export default Tab;
