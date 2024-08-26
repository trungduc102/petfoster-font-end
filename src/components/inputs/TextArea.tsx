'use client';
import Validate from '@/utils/validate';
import { TextareaAutosize, TextareaAutosizeProps } from '@mui/material';
import classNames from 'classnames';
import React, { forwardRef, useEffect, useRef } from 'react';

export type Ref = HTMLTextAreaElement;

export default function TextArea({
    rounded = 'rounded',
    rangeSelect,
    ...props
}: TextareaAutosizeProps & {
    rounded?: string;
    message?: string;
    rangeSelect?: { start: number | undefined; end: number | undefined };
    onSelected?: (start: number | undefined, end: number | undefined) => void;
}) {
    const refMessage = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!rangeSelect || !rangeSelect.end || !rangeSelect.start) return;

        refMessage.current?.focus();
        refMessage.current?.setSelectionRange(rangeSelect.start, rangeSelect.end);
    }, [rangeSelect]);

    return (
        <>
            <TextareaAutosize
                {...props}
                ref={refMessage}
                onSelect={() => {
                    if (!refMessage || refMessage.current?.selectionStart === refMessage.current?.selectionEnd || !props.onSelected) return;

                    props.onSelected(refMessage.current?.selectionStart, refMessage.current?.selectionEnd);
                }}
                minRows={props.minLength ? props.minLength : 4}
                className={classNames('border-[#d0cfd4] border resize-none  bg-transparent p-3 outline-none focus:border-[#6366F1] hover:border-[#6366F1]', {
                    [rounded]: true,
                    [props.className || '']: true,
                    ['border-[#FA896B]']: Validate.isNotBlank(props.message || '') && props.message,
                })}
            />
            {Validate.isNotBlank(props.message || '') && <small className="text-[#FA896B] ml-[14px] text-[0.8035714285714286rem] leading-[1.66]">{props.message}</small>}
        </>
    );
}
