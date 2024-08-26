import * as React from 'react';
import TableRow from '../TableRow';
import { Avatar, Rating, TableCell, Typography } from '@mui/material';
import Link from 'next/link';
import { links } from '@/datas/links';
import { IRowReviewTable } from '@/configs/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEm } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { formatIndex } from '@/utils/format';
export interface IRowReviewProps {
    index: number;
    data: IRowReviewTable;
    page: string | null;
}

export default function RowReview({ index, page, data }: IRowReviewProps) {
    const router = useRouter();
    return (
        <TableRow onClick={() => router.push(links.reviews.management + `/${data.productId}`)}>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {formatIndex(parseInt(page || '0'), index)}
                </Typography>
            </TableCell>

            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.productId}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <span className="whitespace-normal"> {data.productName}</span>
            </TableCell>
            <TableCell align="center">
                <Avatar
                    sx={{
                        mixBlendMode: 'multiply',
                    }}
                    variant="square"
                    src={data.image}
                />
            </TableCell>
            <TableCell align="center">
                <Rating
                    name="read-only"
                    readOnly
                    precision={0.1}
                    value={data.rate}
                    icon={
                        <span className="text-[16px] mx-2">
                            <FontAwesomeIcon icon={faStar} />
                        </span>
                    }
                    emptyIcon={
                        <span className="text-[16px] mx-2">
                            <FontAwesomeIcon icon={faStarEm} />
                        </span>
                    }
                />
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    {data.lastest ? moment(data.lastest).format('DD/MM/yyyy') : 'not yet'}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    x{data.reviews}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography color="textSecondary" fontSize={'16px'} variant="subtitle2" fontWeight={400}>
                    x{data.commentNoRep}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Link href={links.reviews.management + `/${data.productId}`} className="text-violet-primary hover:underline cursor-pointer font-medium">
                    Open
                </Link>
            </TableCell>
        </TableRow>
    );
}
