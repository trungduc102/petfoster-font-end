import { getPriceHistories } from '@/apis/admin/product';
import { LoadingSecondary, RowPriceHistories, Table } from '@/components';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const dataHeadTable = ['No', 'Id', 'New In Price', 'New Out Price', 'Old In Price', 'Old Out Price', 'Size', 'Update At', 'User'];

export interface IPriceHistoriesProps {
    id: string;
}

export default function PriceHistories({ id }: IPriceHistoriesProps) {
    const priceHistories = useQuery({
        queryKey: ['getPriceHistories', id],
        queryFn: () => getPriceHistories(id),
    });

    const data = priceHistories.data?.data;
    return (
        <div className="rounded-xl overflow-hidden border border-gray-primary">
            {data && (
                <Table styleHead={{ align: 'center' }} dataHead={dataHeadTable}>
                    {data.map((item, index) => {
                        return <RowPriceHistories key={item.id} index={index} data={item} />;
                    })}
                </Table>
            )}

            {data && data.length <= 0 && (
                <div className="flex items-center justify-center py-5 text-violet-primary">
                    <b>The product has no change history </b>
                </div>
            )}

            {priceHistories.isLoading && (
                <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-[rgba(0,0,0,0.04)]">
                    <LoadingSecondary />
                </div>
            )}
        </div>
    );
}
