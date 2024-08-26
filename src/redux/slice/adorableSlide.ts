import { INotifycationProps } from '@/components/notifycations/Notifycation';
import { IInitAppStoreState, IPet, IPetDetail, IUser } from '@/configs/interface';
import { getTokenFromCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// init a store for app

interface IInitAdorableStoreState {
    openPostModal: boolean;
}

const initState: IInitAdorableStoreState = {
    openPostModal: false,
};

export const adorable = createSlice({
    name: 'adorable',
    initialState: initState,
    reducers: {
        setOpenPostModal: (state, action: PayloadAction<boolean>) => {
            state.openPostModal = action.payload;
        },
    },
});

export const { setOpenPostModal } = adorable.actions;
export default adorable.reducer;
