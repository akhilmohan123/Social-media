import React, { useEffect, useState } from 'react'
import CreatePost from './Createpost'
import Showfeed from './Showfeed'
import axios from 'axios'
import LoadingSpinnerComponent from 'react-spinners-components';
import { useNavigate } from 'react-router-dom';
function Socialmiddle() {
const token=localStorage.getItem('token')
const[data,setdata]=useState([])
const[error,seterror]=useState(null)
let [color, setColor] = useState("#ffffff");
const navigate=useNavigate()
const [loading, setLoading] = useState(true);
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  backgroundColor:'#9de2ff'
};
useEffect(()=>{
  axios.get("http://localhost:3001/get-post",{
    headers:{
      Authorization:`Bearer ${token}`
    }
  }).then(res=>{
    console.log(res)
    setLoading(false)
    setdata(res.data)
  }).catch(err=>{
    setLoading(false)
    seterror(err)
  })

},[token])

if (loading) {
  return (
    <div style={{ backgroundColor: 'lightblue', textAlign: 'center', height:'100vh', width:'100vw'}}>
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
  return (
    <div style={{backgroundColor:'white'}}>
       <LoadingSpinnerComponent
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {error && <h1>"erorr occured"</h1>}
   <CreatePost/>
   {data.map(data=><Showfeed key={data._id} image={data.Image} description={data.Description} name={data.Username} like={data.Like} postid={data._id}/>)}
    </div>
  )
}
export default Socialmiddle;
