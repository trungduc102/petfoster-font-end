'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
interface IProviders {
    children: ReactNode;
}

export function Providers({ children }: IProviders) {
    const [client] = useState(new QueryClient());
    return (
        <Provider store={store}>
            <QueryClientProvider client={client}>
                <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
            </QueryClientProvider>
        </Provider>
    );
}
