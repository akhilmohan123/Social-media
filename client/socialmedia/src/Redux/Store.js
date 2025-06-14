import { configureStore } from "@reduxjs/toolkit";
import LiveReducer from './Bandwidthslice';
import userReducer from './UserSlice'
import SocialReducer from './SocialCompent';
const store=configureStore({
    reducer:{
        Live:LiveReducer,
        User:userReducer,
        Social:SocialReducer

    }
})
export default store;