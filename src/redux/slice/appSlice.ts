import { INotifycationProps } from '@/components/notifycations/Notifycation';
import { IInitAppStoreState, IUser } from '@/configs/interface';
import { getTokenFromCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const loginRedux = createAsyncThunk('app/login', async () => {});

// init a store for app

const initState: IInitAppStoreState = {
    numberCart: 0,
    user: null,
    notifycation: { open: false, title: '' },
};

export const app = createSlice({
    name: 'app',
    initialState: initState,
    reducers: {
        increment: (state) => {
            state.numberCart++;
        },
        descrement: (state) => {
            state.numberCart--;
        },

        addUser: (state, action: PayloadAction<IUser>) => {
            return {
                ...state,
                user: {
                    ...action.payload,
                },
            };
        },

        closeNoty: (state) => {
            return {
                ...state,
                notifycation: {
                    ...state.notifycation,
                    open: false,
                },
            };
        },

        pushNoty: (state, action: PayloadAction<INotifycationProps>) => {
            return {
                ...state,
                notifycation: {
                    ...state.notifycation,
                    ...action.payload,
                },
            };
        },
    },
});

export const { increment, descrement, addUser, closeNoty, pushNoty } = app.actions;
export default app.reducer;
