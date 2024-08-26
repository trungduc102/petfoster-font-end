import { TextField } from '@/components';
import { Stack, TextFieldProps, Typography } from '@mui/material';

const ComInput = ({
    title,
    propsInput,
    children,
}: {
    title: string;
    propsInput?: TextFieldProps & {
        message?: string;
    };
    children?: React.ReactNode;
}) => {
    return (
        <Stack>
            <Typography sx={{ fontWeight: '500', fontSize: '14px' }} mb={'10px'}>
                {title}
            </Typography>
            {!children ? <TextField {...propsInput} size="small" /> : children}
        </Stack>
    );
};

export default ComInput;
