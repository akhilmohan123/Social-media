import { configureStore } from "@reduxjs/toolkit";
import LiveReducer from './Bandwidthslice';
const store=configureStore({
    reducer:{
        live:LiveReducer
    }
})
export default store;