import { LoadingSecondary, Review } from '@/components';
import { IReviewHasReplay } from '@/configs/interface';
import { toAbbrevNumber } from '@/utils/format';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tab, Tabs, Typography, styled } from '@mui/material';
import classNames from 'classnames';
import React, { SyntheticEvent, useEffect, useState } from 'react';

export interface IDesAndReviewProps {
    description: string;
    reviews: IReviewHasReplay[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?: string;
}

const AntTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: '#FF7A00',
    },
    '& .Mui-selected': {
        color: '#333 !important',
    },
    '&': { color: '#333333 !important' },
});

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, className, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <div
                    className={classNames('mt-[30px]', {
                        [className ?? '']: true,
                    })}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export default function DesAndReview({ description, reviews }: IDesAndReviewProps) {
    const [value, setValue] = useState(0);

    const [limit, setLimit] = useState(reviews.length > 3 ? 3 : reviews.length);
    const [setshowLoadMore, setShowLoadMore] = useState(reviews.length > 3);
    const [loading, setLoading] = useState(false);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleLoadMore = () => {
        setLimit(reviews.length);
        setShowLoadMore(false);
    };

    useEffect(() => {
        setLimit(reviews.length > 3 ? 3 : reviews.length);
        setShowLoadMore(reviews.length > 3);
    }, [reviews]);
    return (
        <Box sx={{ width: '100%', mt: '32px', position: 'relative' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <AntTabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Description" {...a11yProps(0)} />
                    <Tab label={`Review ( ${toAbbrevNumber(reviews.length)} )`} {...a11yProps(1)} />
                </AntTabs>
            </Box>
            <CustomTabPanel className="text-1xl text-[#374151]" value={value} index={0}>
                <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className="flex flex-col gap-6">
                    {reviews.slice(0, limit).map((review) => {
                        return <Review data={review} key={review.id} />;
                    })}
                </div>

                {setshowLoadMore && (
                    <div className="text-center mt-11">
                        <span onClick={handleLoadMore} className="text-[#727272] text-1xl hover:underline cursor-pointer">
                            Load more <FontAwesomeIcon icon={faChevronDown} />
                        </span>
                    </div>
                )}

                {loading && (
                    <div className="absolute flex items-center justify-center inset-0 bg-[rgba(0,0,0,.1)]">
                        <LoadingSecondary />
                    </div>
                )}
            </CustomTabPanel>
        </Box>
    );
}
