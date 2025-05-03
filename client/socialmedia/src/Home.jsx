import Footer from "./Homedata/Footer";
import Header from "./Homedata/Header";
import Middle from "./Homedata/Middle";
import {Route,Routes } from "react-router-dom";
import Login from "./Userdata/Login";
import './index.css'
export default function Home(){

    return (
        <>
        <Header/>
        <Middle/>
        <Footer/> 
        </>
    )
}