'use client';
import React, {ReactNode, useEffect, useLayoutEffect, useState} from 'react';
import {Dialog} from '@mui/material';

export interface IWraperDialogComfirmProps {
   open: boolean;
   setOpen: (value: {open: boolean; comfirm: 'ok' | 'cancel'}) => void;
   handleClose: () => void;
   children: ReactNode;
}

export default function WraperDialogComfirm({
   open,
   children,
   handleClose,
   setOpen,
}: IWraperDialogComfirmProps) {
   useEffect(() => {
      if (!open) return;
      document.body.style.paddingRight = '0px';

      return () => {
         document.body.style.paddingRight = 'auto';
      };
   }, [open]);
   return (
      <>
         <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby='alert-dialog-slide-description'
         >
            {children}
         </Dialog>
      </>
   );
}
