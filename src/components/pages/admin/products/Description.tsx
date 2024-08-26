'use client';
import dynamic from 'next/dynamic';
import React, { memo, useEffect, useState } from 'react';
import '../styles/texteditor.module.css';
import 'react-quill/dist/quill.snow.css';
import { CardInfo } from '@/components';
const ReactQuill = dynamic(
    async () => {
        const ReactQuill = await import('react-quill');
        const { Quill } = ReactQuill.default;
        const Block = Quill.import('blots/block');
        Block.tagName = 'div';
        Quill.register(Block);

        return ReactQuill;
    },
    { ssr: false },
);
export interface IDescriptionProps {
    inidata?: string;
    message?: string;
    onValues?: (value: string) => void;
}

function Description({ inidata, message, onValues }: IDescriptionProps) {
    const [value, setValue] = useState(inidata || '');

    useEffect(() => {
        setValue(inidata || '');
    }, [inidata]);

    useEffect(() => {
        if (!onValues) return;

        onValues(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return (
        <CardInfo title="Description">
            <div className="overflow-auto h-[600px] pb-[4%] w-full ">
                <ReactQuill placeholder="Enter description" className="w-full h-full" modules={{ toolbar: true }} theme="snow" value={value} onChange={setValue} />
            </div>
            {message && <span className="text-sm text-[#FA896B] text-[.75rem] mt-[4px] ml-[14px]">{message}</span>}
        </CardInfo>
    );
}

export default memo(Description);
