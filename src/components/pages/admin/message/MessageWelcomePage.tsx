/* eslint-disable @next/next/no-img-element */
import * as React from 'react';

export interface IMessageWelcomePageProps {}

export default function MessageWelcomePage(props: IMessageWelcomePageProps) {
    return (
        <div className="w-full h-full flex items-center justify-center text-black-main flex-col">
            <img className="w-[174px] h-[174px]" src="/icons/icon-chat-now.svg" alt="icon-chat-now.svg" />
            <span className="text-lg font-semibold">Welcome to Petfoster</span>
            <p className="text-sm">Select a conversation to chat</p>
        </div>
    );
}
