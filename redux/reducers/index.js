import { combineReducers } from '@reduxjs/toolkit'
import UserReducer from "./UserReducer";
import ChatReducer from "./ChatReducer";

export const reducers = combineReducers({
    userInfo: UserReducer,
    chatInfo: ChatReducer,
})