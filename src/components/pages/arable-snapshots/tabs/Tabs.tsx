'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tab, { Active } from './Tab';
import { listTabsPostProfile } from '@/datas/header';

interface TabsProps {
    onTab?: (value: string) => void;
    dataTabs: {
        title: string;
    }[];
}

const Tabs = ({ dataTabs, onTab }: TabsProps) => {
    const [active, setActive] = useState<Active>({ value: dataTabs[0].title, initBorder: 0, left: 0, width: 0 });

    return (
        <div className={`w-full flex items-center relative mb-2`}>
            <div className="flex items-center relative w-2/6 justify-between">
                {dataTabs.map((item) => {
                    return (
                        <Tab
                            onClick={() => {
                                if (!onTab) return;
                                onTab(item.title);
                            }}
                            active={active}
                            key={item.title}
                            setActive={setActive}
                            title={item.title}
                            selected={item.title === active.value}
                        />
                    );
                })}

                <motion.div
                    animate={{
                        left: active.left,
                    }}
                    className="absolute w-1/2 h-[2px] bg-[#3E3771] bottom-0"
                ></motion.div>
            </div>

            <div className="absolute w-full h-[1px] bg-post-primary bottom-0"></div>
        </div>
    );
};

export default Tabs;
