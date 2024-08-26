import { Badge, BadgeTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import React, { MouseEventHandler, ReactNode, forwardRef } from 'react';

export interface ICustomBadgeProps {
    invisible?: boolean;
    children: ReactNode;
    badgeContent: string | number;
    dot?: boolean;
    onClick?: MouseEventHandler<HTMLSpanElement>;
}

export type Ref = HTMLDivElement;

const CustomBadge = forwardRef<Ref, ICustomBadgeProps>(({ invisible = true, badgeContent, children, dot, onClick }, ref) => {
    return (
        <div ref={ref}>
            <Badge
                sx={{
                    '& .MuiBadge-badge': {
                        color: 'white',
                        backgroundColor: '#65A30D',
                    },
                }}
                invisible={invisible}
                badgeContent={badgeContent}
                color="primary"
                variant={dot ? 'dot' : undefined}
                onClick={onClick}
            >
                {children}
            </Badge>
        </div>
    );
});

// 👇️ set display name
CustomBadge.displayName = 'CustomBadge';

export default CustomBadge;
