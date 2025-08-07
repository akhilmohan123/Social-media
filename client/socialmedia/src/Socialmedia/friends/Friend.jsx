import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Friends from './Friends';
import LoadingSpinnerComponent from 'react-spinners-components';
import socket from '../Socket/Socket';
function Friend() {
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    backgroundColor:'#9de2ff'
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id,setid]=useState(null)
  const user=localStorage.getItem("userId")
  let [color, setColor] = useState("#ffffff");
   let token=localStorage.getItem('token')
    //   window.addEventListener("load", () => {
    //   socket.connect()
    //   socket.emit("new-user-add",user)
    // });
   
   useEffect(()=>{
    console.log("toke nin friend page is "+token)
    console.log("user id is",localStorage.getItem("userId"))
   },[])
    useEffect(()=>{
        function fetchfriends(){
          console.log("toke is "+token)
          axios.get("http://localhost:3001/friends",{
            headers:{
              Authorization:`Bearer ${token}`
            }
           }).then((res)=>{
            console.log(res)
            if(res){
              setData(res.data.authorizedUsers)
              setid(res.data.id)
            }else{
              return <div>Loading.....</div>
            }
           })
        }
        fetchfriends();
    },[token])
    console.log(data)
  console.log(data &&data.map(d=>console.log(d._id)))
  return (
    <div className="height:100vh" style={{ backgroundColor: '#9de2ff' }}>
        {data && data.map((dat) => (
                <Friends key={dat._id} friend={dat} id={id}/>
            ))} 
      <LoadingSpinnerComponent
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
       
  </div>
  );
}
    
export default Friend
