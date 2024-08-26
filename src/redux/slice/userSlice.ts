import { curUser, updateUser } from '@/apis/user';
import { IProfile } from '@/configs/interface';
import { clearToken, getTokenFromCookie, setRoleToCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pushNoty } from './appSlice';
import { DataRequestUpdateUser, RoleType } from '@/configs/types';

export const fetchUserByToken = createAsyncThunk('user/fetchUserByToken', async (_, thunkApi) => {
    const token = getTokenFromCookie();

    if (!token || token === '' || token === 'null') return null;
    try {
        const res = await curUser();

        if (res.errors) {
            return null;
        }

        setRoleToCookie(res.data.role as RoleType);
        return res.data;
    } catch (error) {
        clearToken();
        return null;
    }
});

export const logout = createAsyncThunk('user/logout', async () => {
    clearToken();
    return null;
});

export const update = createAsyncThunk('user/update', async (data: DataRequestUpdateUser, thunkApi) => {
    const token = getTokenFromCookie();

    if (!token || token === '' || token === 'null') return null;
    try {
        const res = await updateUser(data);

        if (res.errors) {
            return null;
        }

        return res.data;
    } catch (error) {
        clearToken();
        thunkApi.dispatch(
            pushNoty({
                title: 'Some thing went wrong, please relogin to use',
                open: true,
                type: 'error',
                plament: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            }),
        );

        return null;
    }
});

// init a store for app
interface IInitUserStoreState {
    user: null | IProfile;
    token: string;
    loading: boolean;
}

const initState: IInitUserStoreState = {
    user: null,
    token: getTokenFromCookie() || '',
    loading: false,
};

export const user = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserByToken.pending, (state, action) => {
            state.loading = true;
        }),
            builder.addCase(fetchUserByToken.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            }),
            builder.addCase(fetchUserByToken.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
            }),
            //log out
            builder.addCase(logout.pending, (state, action) => {
                state.loading = true;
            }),
            builder.addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
            }),
            // update
            builder.addCase(update.pending, (state, action) => {
                state.loading = true;
            }),
            builder.addCase(update.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            }),
            builder.addCase(update.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
            });
    },
});

export const { setToken } = user.actions;
export default user.reducer;
