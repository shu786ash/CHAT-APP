import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import messageReducer from './messageSlice.js'
import socketReducer from './socketSlice.js';
import { composeWithDevTools } from "redux-devtools-extension";

export const store = configureStore({
  reducer: {
    userReducer,
    messageReducer,
    socketReducer
  },
},composeWithDevTools());