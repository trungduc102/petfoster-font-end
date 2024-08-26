import { ClipboardEvent } from 'react';

export const getValueOnClipboard = (e: ClipboardEvent<HTMLInputElement>) => {
    const clipboardData = e.clipboardData;
    return clipboardData.getData('Text');
};
