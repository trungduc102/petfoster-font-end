import { MessagePage } from '@/components/pages';
import React from 'react';

export interface IMessageProps {
    params: { id: string[] };
}

export default function Message({ params }: IMessageProps) {
    return <MessagePage params={{ id: params.id[1], username: params.id[0] }} />;
}
