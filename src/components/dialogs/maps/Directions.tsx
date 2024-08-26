'use client';
import React, { memo, useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export interface IDirectionsProps {
    to: string;
    onRoutes?: (routes: google.maps.DirectionsRoute[]) => void;
}

function Directions({ to, onRoutes }: IDirectionsProps) {
    const map = useMap();
    const routesLibary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();

    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

    useEffect(() => {
        if (!routesLibary || !map) return;

        setDirectionsService(new routesLibary.DirectionsService());
        setDirectionsRenderer(new routesLibary.DirectionsRenderer({ map }));
    }, [routesLibary, map]);

    useEffect(() => {
        if (!directionsRenderer || !directionsService) return;

        if (!to) {
            directionsRenderer.setDirections(null);
            return;
        }

        directionsService
            .route({
                origin: process.env.NEXT_PUBLIC_ADDRESS as string,
                destination: to,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true,
            })
            .then((res: any) => {
                directionsRenderer.setDirections(res);

                setRoutes(res.routes);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [directionsRenderer, directionsService, to]);

    useEffect(() => {
        if (!onRoutes) return;
        onRoutes(routes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routes]);

    return <span></span>;
}

export default memo(Directions);
