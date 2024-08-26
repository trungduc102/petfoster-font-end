/* eslint-disable @next/next/no-img-element */
import { BoxTitle, KnowldegeAboutFosterItem, KnowldegeAboutFosterPreview } from '@/components';
import { IPost } from '@/configs/interface';
import * as React from 'react';

export interface IKnowldegeAboutFosterProps {
    data: IPost[];
    className?: string;
}

export default function KnowldegeAboutFoster({ data, className }: IKnowldegeAboutFosterProps) {
    const [first, ...prevData] = data;

    console.log(first);

    return (
        <BoxTitle className={className} title="SHARING KNOWLDEGE ABOUT FOSTER">
            <div className="w-full p-11 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-9 bg-[#F8F6FC] rounded-[20px]  shadow-primary">
                <KnowldegeAboutFosterPreview data={first} />
                <ul className="flex-1 h-full flex flex-col items-center gap-4">
                    {prevData.map((item) => {
                        return <KnowldegeAboutFosterItem key={item.id} data={item} />;
                    })}
                </ul>
            </div>
        </BoxTitle>
    );
}
