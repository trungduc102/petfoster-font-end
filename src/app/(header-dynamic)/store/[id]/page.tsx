import * as React from 'react';

export interface IStoreParamProps {
    params: { id: string };
}

export default function StoreParam({ params }: IStoreParamProps) {
    return (
        <div>
            This is StoreParam <span className="text-lg text-red-500">{params.id}</span>
        </div>
    );
}
