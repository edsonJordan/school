import React, { Children, useContext, useEffect } from 'react'
import "react-multi-carousel/lib/styles.css";
import useResizeObserver from 'use-resize-observer';
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider"


import CardVertical from '../cards/CardVertical';
import { useState } from 'react';
import axios from 'axios';

export default  function GridSearch ({data}) {
  const dispatch = useContext(GlobalDispatchContext)
  const stateAuth = useContext(GlobalStateContext)

  const [favorites, setFavorites]=useState([]);
  const [schools, setSchools]=useState([]);
  const [dataIsReady, setDataIsReady ]=useState([])
  
  const getSchoolsFavorite = ()=>{
    if (!stateAuth.isLogin) return setFavorites([]);
    fetch(`${process.env.WP_URL_REST}/apischool/v1/favorites/${stateAuth.data.id_user}`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${stateAuth.data.token}`
      }
    })
    .then(response => response.json())
    .then(
      (data) => {
        setFavorites(data.map((element)=> {return [element.id_post]}).reduce((acc, id_post)=>{ return acc.concat(parseInt(id_post)) },[]));    
        // console.log(data);
      } 
    )
    .catch((error)=>console.log(error));  
  }

  useEffect(()=>{
    // console.log(JSON.stringify(dataIsReady));
  },[dataIsReady])
  
  
  useEffect(()=>{
    
    // console.log(schools);
    setDataIsReady(schools.map((element)=>{ return favorites.includes(element.id_post)? {...element, isFavorite:true}:{...element}})     )
    
  },[favorites])

 

  const getSchools=()=>{
    setSchools(data.schools.map((element)=>
    {
      return       {
        id_post: element.databaseId,       
        levels:element.customFieldColegio.level.map(element=>element.split(":")).map(element=>element[1]).map(element=>element.trim()),
        nameSchool:element.title,
        opinion:"buen trato economico",
        phone:element.customFieldColegio.phone,
        price: element.customFieldColegio.price,
        slug:element.slug,
        stars:"3.6",
        typeSchool:element.customFieldColegio.type.split(":")[1].trim(),
        ubication:null,
        web:element.customFieldColegio.web,
        whatsapp:element.customFieldColegio.whatsapp,
        isFavorite:false
         }
       }
     ))
  }

  
  useEffect(()=>{  
    getSchools()
    getSchoolsFavorite()
   
  },[])
    // const [value, setValue] = useState(0);
    const addPostFavorite = (idPost, idUser)=>{
      const data = {
        "user": idUser,
        'post':idPost 
        }; 
        axios.post(`${process.env.WP_URL_REST}`+"/apischool/v1/favorites", JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${stateAuth.data.token}`
          }
        }
        )
        .then((response)=>{console.log(response)})
        .catch(({response})=>{ console.log(response)});      
    }
    const deletePostFavorite =(idPost, idUser)=>{
      const data = {
        "user": idUser,
        'post':idPost 
        }; 
        axios.post(`${process.env.WP_URL_REST}`+"/apischool/v1/favorites/delete", JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${stateAuth.data.token}`
          }
        }
        )
        .then((response)=>{console.log(response)})
        .catch(({response})=>{ console.log(response)});        
      }
    const setIdPost =  (idPost, isFavorite)=>{
      if(isFavorite){
        !stateAuth.isLogin ? (window.location= '/login'): addPostFavorite(idPost, stateAuth.data.id_user);        
      }else{
        deletePostFavorite(idPost,stateAuth.data.id_user)
        // console.log(idPost,stateAuth.data.username);
      }
    }
 return (   
      <div className='grid sm:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4	carousel--container' >
        {           
           dataIsReady.map((element,index) => 
            {
            return <CardVertical  key={index}  isFavorite={element.isFavorite} setIdPost={setIdPost} school={element}/>}                   
          )
        }
      </div>  
 )
}
