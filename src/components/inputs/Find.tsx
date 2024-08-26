import * as React from 'react';

export interface IFindProps {}

export default function Find({}: IFindProps) {
    return (
        <div className="w-[255px] h-[36px] bg-[rgba(0,0,0,0.4)] rounded-full border border-transparent focus-within:border-white transition-all ease-linear">
            <input
                placeholder="Find your pet here"
                className="w-full h-full bg-transparent outline-none text-white text-sm px-4 placeholder:text-white placeholder:text-sm"
                type="text"
            />
        </div>
    );
}
