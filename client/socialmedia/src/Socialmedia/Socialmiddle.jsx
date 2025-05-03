import React, { useEffect, useState } from 'react'
import CreatePost from './Createpost'
import Showfeed from './Showfeed'
import axios from 'axios'
import LoadingSpinnerComponent from 'react-spinners-components';
import { useNavigate } from 'react-router-dom';
import SocialmediaLCP from './SocialmediaCP/SocialmediaLCP/SocialmediaLCP';
import SocialmediaRCP from './SocialmediaCP/SocialmediaRCP/SocialmediaRCP';
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
    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#e3dede',
    minHeight: '100vh',
  }}
>
  {/* Left Sidebar */}
  <div style={{ width: '250px' }}>
    <SocialmediaLCP />
  </div>

  {/* Middle Feed */}
  <div style={{ flex: 1, margin: '0 20px' }}>
    <CreatePost />
    {data.map((item) => (
      <Showfeed
        key={item._id}
        image={item.Image}
        description={item.Description}
        name={item.Username}
        like={item.Like}
        postid={item._id}
      />
    ))}
  </div>

  {/* Right Sidebar */}
  <div style={{ width: '250px' }}>
    <SocialmediaRCP />
  </div>
</div>

  )
}
export default Socialmiddle;
