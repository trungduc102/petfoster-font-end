import { INotifycationProps } from '@/components/notifycations/Notifycation';
import { IInitAppStoreState, IPet, IPetDetail, IUser } from '@/configs/interface';
import { getTokenFromCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// init a store for app

interface IInitAdoptStoreState {
    petAdopt: IPetDetail | null;
    asked: string[] | null;
}

const initState: IInitAdoptStoreState = {
    petAdopt: null,
    asked: null,
};

export const adopt = createSlice({
    name: 'adopt',
    initialState: initState,
    reducers: {
        setPetAdopt: (state, action: PayloadAction<IPetDetail>) => {
            state.petAdopt = action.payload;
        },
        setAsked: (state, action: PayloadAction<string[]>) => {
            state.asked = action.payload;
        },
        clearPetAdopt: (state) => {
            state.petAdopt = null;
        },
        clearAsked: (state) => {
            state.asked = null;
        },
        clear: (state) => {
            state.asked = null;
            state.petAdopt = null;
        },
    },
});

export const { setPetAdopt, clearPetAdopt, clearAsked, clear, setAsked } = adopt.actions;
export default adopt.reducer;
