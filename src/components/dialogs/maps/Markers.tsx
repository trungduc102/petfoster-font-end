'use client';
import { Point, RootState } from '@/configs/types';
import { useAppSelector } from '@/hooks/reduxHooks';
import { contants } from '@/utils/contants';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import classNames from 'classnames';

const Markers = ({
    point,
    isShop,
    option = { showName: true, size: 'md' },
    avartar,
    username,
}: {
    point: Point;
    isShop?: boolean;
    option?: { showName?: boolean; size: 'md' | 'xs' };
    avartar?: string;
    username?: string;
}) => {
    const { user } = useAppSelector((state: RootState) => state.userReducer);

    const sizes = {
        xs: {
            component: 'p-1',
            avatar: '40px',
        },
        md: {
            component: 'p-3',
            avatar: '54px',
        },
    };
    return (
        <AdvancedMarker position={point}>
            <div className="drop-shadow-lg">
                <div
                    className={classNames('speech down bg-white shadow-lg text-black-main flex flex-col gap-2 relative rounded-xl justify-center items-center', {
                        [sizes[option.size].component]: option.size,
                    })}
                >
                    <Avatar
                        sx={{
                            width: sizes[option.size].avatar,
                            height: sizes[option.size].avatar,
                            '.MuiAvatar-img ': {
                                objectFit: isShop ? 'contain' : 'cover',
                            },
                        }}
                        src={isShop ? '/icons/icon-chat-now.svg' : (avartar ? avartar : user?.avatar) || contants.avartarDefault}
                    />
                    {option.showName && <span className="text-center">{isShop ? process.env.NEXT_PUBLIC_WEB_NAME : username || user?.displayName || user?.username}</span>}
                </div>
            </div>
        </AdvancedMarker>
    );
};

export default Markers;
