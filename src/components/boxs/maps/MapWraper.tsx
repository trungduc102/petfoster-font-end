'use client';
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps';

import React, { PropsWithChildren, ReactNode } from 'react';

export interface IMapWraperProps extends PropsWithChildren<MapProps> {
    children: ReactNode;
}

export default function MapWraper({ children, ...props }: IMapWraperProps) {
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}>
            <Map mapId={process.env.NEXT_PUBLIC_MAP_ID} {...props}>
                {children}
            </Map>
        </APIProvider>
    );
}
