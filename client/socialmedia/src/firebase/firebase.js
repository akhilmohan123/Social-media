// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging,getToken } from "firebase/messaging";
import { _post, apiClient } from "../Socialmedia/axios/Axios";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const usertoken=localStorage.getItem("token");
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain:import.meta.env.VITE_AUTHDOMAIN ,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export const generatetoken = async()=>{
    const permission=await Notification.requestPermission()
    console.log(permission)
    if(permission=="granted")
    {
        const token=await getToken(messaging,{
            vapidKey:"BIu0MIerei_Qi3BQw_rtL6fkeNaX9Hn-1KY5BkhSvZrD7JNzVRAkJS3LhF1K1tht1LfZgmqYukVqmrTeCGLDFEc"
        });
        console.log(token)
        let tokenPayload={
            fcmtoken:token
        }
        
        //send the token to the backend 
         apiClient.defaults.headers.common["Authorization"] = `Bearer ${usertoken}`;
         const response=await _post("/api/save-token",tokenPayload);
         if(response.status==200)
         {
            console.log(response);
         }
    }
}



