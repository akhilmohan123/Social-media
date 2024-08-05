import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Detailprofile from './Detailprofile';

function Viewprofile() {
    const[data,Setdata]=useState(null)
    const token=localStorage.getItem("token")
    useEffect(()=>{
        try {
           axios.get("http://localhost:3001/user-post",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        
           ).then(res=>{
            Setdata(res.data)
           })
        } catch (error) {
            console.log(error)
        }
    },[data])
    
  return (
    <div>
    
       {data? data.map(data=><Detailprofile key={data._id} image={data.Image} description={data.Description} name={data.Username} like={data.Like} postid={data._id}/>):""}
    </div>
  )
}

export default Viewprofile
