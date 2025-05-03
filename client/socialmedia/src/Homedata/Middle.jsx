import React, { useState } from 'react'
import logo from './1.jpg'
import logo2 from './2.jpg'
import style from './middle.module.css'
const Middle = () => {
  const[image,setImage]=useState(false)
  const[content,setContent]=useState('')
  function handleclick(){
   setImage(!image)
   setContent(logo2)
  }
  function  handleprevclick(){
    setImage(!image)
    setContent(logo)
  }
  return (
    <div className={image? style.middlediv2:style.middlediv}>
      <div className={image? style.imagewrapper2:style.imagewrapper}>
      <button  className={image?style.back2:style.back} onClick={handleprevclick}>prev</button>
       <img className={style.imagediv}src={image? logo2:logo}></img>
       <button className={image?style.front2:style.front} onClick={handleclick}>next</button>
     </div>
    </div>
  )
}

export default Middle
