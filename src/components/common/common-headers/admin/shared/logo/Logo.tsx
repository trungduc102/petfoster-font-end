import Link from 'next/link';
import { styled } from '@mui/material';
import Image from 'next/image';

const LinkStyled = styled(Link)(() => ({
    height: '70px',
    width: '180px',
    overflow: 'hidden',
    display: 'block',
}));

const Logo = () => {
    return (
        <LinkStyled href="/admin/dashboard" sx={{ pt: '10px' }}>
            <Image src="/images/logo-large-dark.svg" alt="logo" height={60} width={174} priority />
        </LinkStyled>
    );
};

export default Logo;
