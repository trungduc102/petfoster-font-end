'use client';
import { updateStateFeedback } from '@/apis/admin/feedback';
import { MiniLoading, WrapperAnimation } from '@/components';
import { IFeedback } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { delay } from '@/utils/funtionals';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Li = ({ title, content }: { title: string; content: string }) => {
    return (
        <li className="flex gap-4">
            <span className="capitalize w-1/12">{title}</span>
            <p className="font-medium flex-1">{content}</p>
        </li>
    );
};

export interface IFeedbackItemProps {
    data: IFeedback;
}

export default function FeedbackItem({ data }: IFeedbackItemProps) {
    const [seen, setSeen] = useState(data.seen);
    const [loading, setLoading] = useState(false);

    const handleClickSeen = async () => {
        try {
            setLoading(true);
            const response = await updateStateFeedback(data.id);

            if (!response || response.errors) {
                toast.warn(contants.messages.errors.handle);
                return;
            }
            setSeen(true);
        } catch (error) {
            toast.warn(contants.messages.errors.server);
        } finally {
            await delay(1000);
            setLoading(false);
        }
    };

    return (
        <ul className="border border-gray-primary py-5 px-7 rounded-xl shadow-xl text-black-main text-1xl flex flex-col gap-5 relative">
            {Object.keys(data).map((item) => {
                if (item !== 'seen') {
                    return <Li key={item} title={item} content={item === 'id' ? `#${String(data[item as keyof IFeedback])}` : String(data[item as keyof IFeedback])} />;
                }
            })}

            {!seen && (
                <div className="absolute top-5 right-7">
                    <WrapperAnimation
                        onClick={!loading ? handleClickSeen : undefined}
                        hover={{}}
                        className="py-3 px-5 border border-gray-primary hover:border-green-800 text-sm rounded-lg transition-all ease-linear cursor-pointer overflow-hidden relative"
                    >
                        <span>Answered</span>

                        {loading && (
                            <div className="absolute inset-0 bg-black-040 flex items-center justify-center">
                                <MiniLoading />
                            </div>
                        )}
                    </WrapperAnimation>
                </div>
            )}
        </ul>
    );
}
