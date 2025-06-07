import { configureStore } from "@reduxjs/toolkit";
import LiveReducer from './Bandwidthslice';
import userReducer from './UserSlice'
const store=configureStore({
    reducer:{
        Live:LiveReducer,
        User:userReducer,

    }
})
export default store;