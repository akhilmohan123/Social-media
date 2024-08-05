import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';

function Mdbsignup() {
    const[value,setValue]=useState({fname:"",lname:"",email:"",password:""})
    const[image,setimage]=useState(null)
    const navigate=useNavigate()
   
    function handlechange(e){
        console.log(e.target.value)
        const{name,value}=e.target;
        setValue((prevalue)=>({...prevalue,[name]:value}))
     
    }
    function handleimage(e){
      const file = e.target.files[0];
      console.log(file)
      setimage(file);
    }
    async function handlesubmit(e){

        e.preventDefault()
        const form=new FormData();
        form.append('fname',value.fname);
        form.append('lname',value.lname)
        form.append("password",value.password)
        form.append("email",value.email)
        form.append('file',image)
        try {
          let res=await axios.post("http://localhost:3001/signup",form,{

            headers:{
             'Content-Type':'multipart/form-data',
            },   
        })
  
  
  if(res.status==200){
 alert("Account Created")
    navigate("/login")
  }else{
    alert("Something went wrong")
     navigate('/Signup')
    
  }
        } catch (error) {
           alert("Something went wrong")
        }
          
    
    }
     
    
  return (
    <MDBContainer fluid>

      <div className="p-5 bg-image" style={{backgroundImage: 'url(https://mdbootstrap.com/img/new/textures/full/171.jpg)', height: '300px'}}></div>

      <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}>
        <MDBCardBody className='p-5 text-center'>

          <h2 className="fw-bold mb-5">Sign up now</h2>

          <MDBRow>
            <MDBCol col='6'>
              <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text'name='fname' value={value.fname}onChange={handlechange}/>
            </MDBCol>

            <MDBCol col='6'>
              <MDBInput wrapperClass='mb-4' label='Last name' id='form1' type='text'name='lname'value={value.lname}onChange={handlechange}/>
            </MDBCol>
            <MDBCol col='6'>
              <MDBInput wrapperClass='mb-4' label='Image ' id='form1' type='file'name='image'value={value.image}onChange={handleimage}/>
            </MDBCol>
          </MDBRow>

          <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email'name='email' value={value.email} onChange={handlechange}/>
          <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password'name='password' value={value.password} onChange={handlechange}/>

        
          <MDBBtn className='w-100 mb-4' size='md' onClick={handlesubmit}>sign up</MDBBtn>

         
        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
  );
}

export default Mdbsignup;