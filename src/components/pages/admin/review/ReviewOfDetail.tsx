'use client';
import { filterReviewsOfProduct } from '@/apis/admin/reviews';
import { Review } from '@/components';
import { IDataDetailReview, IReviewHasReplay } from '@/configs/interface';
import { contants } from '@/utils/contants';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface IReviewOfDetailProps {
    data: IDataDetailReview | undefined;
    id: string;
    refetch: () => void;
}

function ReviewOfDetail({ data, id, refetch }: IReviewOfDetailProps) {
    const [dataReview, setdataReview] = useState(data && data.reviews);
    const [noReplay, setNoReplay] = useState(false);

    const handleAffterRelpay = (data: IReviewHasReplay, item: IReviewHasReplay) => {
        if (!item.replayItems) return;
        item.replayItems = [...item.replayItems, data];
    };

    const handleAffterDelete = () => {
        refetch();
    };

    const handleClickFilter = async () => {
        try {
            const response = await filterReviewsOfProduct({ id, noReplay: !noReplay });
            if (!response || response.errors) {
                toast.warn(contants.messages.errors.handle);
                return;
            }

            const { data } = response;

            if (data.length <= 0) {
                toast.info('All comments have been answered');
                return;
            }

            setdataReview(data);
            setNoReplay((prev) => !prev);
        } catch (error) {
            toast.error(contants.messages.errors.server);
        }
    };

    useEffect(() => {
        setdataReview(data?.reviews);
    }, [data]);

    return (
        <>
            <div className="flex items-center justify-between py-4 px-5 border-t border-b border-gray-primary mt-[4%]">
                <h2 className="text-xl font-medium">Product Reivews</h2>
                <div className="flex items-center justify-between gap-5">
                    <div onClick={handleClickFilter} className="flex items-center justify-between gap-2 cursor-pointer select-none">
                        <div className="w-6 h-6 bg-[#D9D9D9] rounded flex items-center justify-center">
                            {noReplay && <FontAwesomeIcon icon={faCheck} className="text-sm text-green-5FA503" />}
                        </div>
                        <p className="whitespace-nowrap">No reply</p>
                    </div>
                </div>
            </div>

            {data && data.reviews && dataReview && dataReview.length ? (
                <div className="mt-9 flex flex-col gap-5">
                    {dataReview.map((item, index) => {
                        return (
                            <Review
                                key={`${index} ${item.comment}`}
                                data={item}
                                option={{
                                    replay: true,
                                    delete: true,
                                }}
                                handleAfterReplay={(data) => handleAffterRelpay(data, item)}
                                handleAffterDelete={handleAffterDelete}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center border border-gray-primary py-[100px] w-full rounded-xl mt-9">
                    <span className="text-violet-primary text-xl font-semibold">No review for {id}</span>
                </div>
            )}
        </>
    );
}

export default memo(ReviewOfDetail);
