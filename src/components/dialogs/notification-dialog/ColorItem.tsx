import { INotificationKey } from '@/configs/interface';
import { useDebounce } from '@/hooks';
import React, { ChangeEvent, useEffect, useState } from 'react';

export interface IColorItemProps {
    item: INotificationKey;

    onColor?: (data: INotificationKey) => void;
}

export default function ColorItem({ item, onColor }: IColorItemProps) {
    const [data, setData] = useState(item.color);

    const dataDeboune = useDebounce(data, 400);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData(e.target.value);
    };

    const handleClickInherit = () => {
        setData('inherit');

        if (!onColor) return;

        onColor({ ...item, color: 'inherit' });
    };

    useEffect(() => {
        if (!onColor || dataDeboune === item.color) return;

        onColor({ ...item, color: dataDeboune });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataDeboune]);

    return (
        <li className="text-gray-400 italic text-sm flex items-center gap-2">
            <p className="capitalize">{item.name}</p> with color
            {data === 'inherit' ? (
                <span className="hover:underline cursor-pointer">{'inherit'}</span>
            ) : (
                <input onChange={handleChange} className="w-5 h-5" name={item.name} value={data} type="color" />
            )}
            <p>or </p>
            {data !== 'inherit' ? (
                <span onClick={handleClickInherit} className="hover:underline cursor-pointer">
                    {'inherit'}
                </span>
            ) : (
                <input onChange={handleChange} className="w-5 h-5" name={item.name} value={data} type="color" />
            )}
        </li>
    );
}
