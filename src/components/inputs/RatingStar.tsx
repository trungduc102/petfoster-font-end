import React from 'react';
import { Rating, RatingProps } from '@mui/material';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEm } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function RatingStar({ className = 'text-[30px] mx-2', ...props }: RatingProps & { className?: string }) {
    return (
        <Rating
            {...props}
            icon={
                <span className={className}>
                    <FontAwesomeIcon icon={faStar} />
                </span>
            }
            emptyIcon={
                <span className={className}>
                    <FontAwesomeIcon icon={faStarEm} />
                </span>
            }
        />
    );
}
