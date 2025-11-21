import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    id: string;
    name: string;
    email: string;
    isLoggedIn: boolean;
    role: 'user' | 'admin';
}


const initialState: UserState = {
    id: '',
    name: '',
    email: '',
    isLoggedIn: true,
    role: 'user',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{id: string; name: string; email: string; role: 'user' | 'admin'}>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isLoggedIn = true;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.id = '';
            state.name = '';
            state.email = '';
            state.isLoggedIn = false;
            state.role = 'user';
        } 
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;