import * as React from 'react';
import {WrapperAnimation} from '..';
import {Button} from '@mui/material';

export interface IRoudedButtonProps {
   title: string;
   background?: string;
   width?: {xs?: string; md?: string; lg?: string};
   type?: 'button' | 'submit' | 'reset' | undefined;
}

export default function RoudedButton({
   title,
   background = '#374151',
   width = {xs: '100%', md: '60%', lg: '40%'},
   type = 'submit',
}: IRoudedButtonProps) {
   return (
      <WrapperAnimation
         hover={{y: -2}}
         tag={{}}
         className='flex items-center justify-center md:justify-start mt-4'
      >
         <Button
            type={type}
            sx={{
               backgroundColor: background,
               color: '#fff',
               '&:hover': {
                  backgroundColor: background,
                  color: '#fff',
               },
               borderRadius: '24px',
               width: width,
               textTransform: 'uppercase',
               py: '12px',
            }}
         >
            {title}
         </Button>
      </WrapperAnimation>
   );
}
