import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Usage {
    used: number,
    limit: number,
    remaining: number
}

export interface UserState {
    id: string;
    name: string;
    email: string;
    isLoggedIn: boolean;
    role: 'user' | 'admin';
    usage: Usage | null
}


const initialState: UserState = {
    id: '',
    name: '',
    email: '',
    isLoggedIn: false,
    role: 'user',
    usage: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        storeLogin: (state, action: PayloadAction<{id: string; name: string; email: string; role: 'user' | 'admin'; isLoggedIn: boolean, usage: Usage}>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isLoggedIn = action.payload.isLoggedIn;
            state.role = action.payload.role;
            state.usage = action.payload.usage
        },
        logout: (state) => {
            state.id = '';
            state.name = '';
            state.email = '';
            state.isLoggedIn = false;
            state.role = 'user';
            state.usage = null
        } 
    }
});

export const { storeLogin, logout } = userSlice.actions;

export default userSlice.reducer;