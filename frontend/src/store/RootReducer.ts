import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./slices/User";
import { themeSlice } from "./slices/Theme";
import { userApiSlice } from "../api/userApi";
import { sketchApiSlice } from "../api/sketchApi";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  theme: themeSlice.reducer, 
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [sketchApiSlice.reducerPath]: sketchApiSlice.reducer

});

export default rootReducer;