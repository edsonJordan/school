import React, { Children, useContext, useEffect, useState } from 'react'
import "react-multi-carousel/lib/styles.css";
import useResizeObserver from 'use-resize-observer';
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider"

import CardVertical from '../cards/CardVertical';
import axios from 'axios';

export default function Grid() {
  
  const dispatch = useContext(GlobalDispatchContext)
  const stateAuth = useContext(GlobalStateContext)

  const [favorites, setFavorites]=useState([]);

  const [paginateTotalSchool, setPaginateTotalSchool]=useState(0)
  const [loadGetFavorite, setLoadGetFavorite]=useState(false)

  const [statePaginate, setStatePaginate]=useState(1)
  // const [schools, setSchools]=useState([])


  const getSchoolsFavorite = (firstLoad=false, paginateNumber)=>{
    // console.log(`${process.env.WP_URL_REST}/apischool/v1/favorites/${stateAuth.data.id_user}?paginateNumber=${paginateNumber}&per_page=1`);
    setLoadGetFavorite(true)
      axios(`${process.env.WP_URL_REST}/apischool/v1/favorites/${stateAuth.data.id_user}?page=${paginateNumber}&per_page=8`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${stateAuth.data.token}`
        }
      })
      // .then(response => response.json())
      .then(
        (response) => {

          setLoadGetFavorite(false)
          firstLoad && setPaginateTotalSchool(parseInt( response.headers['x-wp-totalpages']));           
          setFavorites(response.data.map((element)=>{     
            return {
            id_post:element.id_post,
            isFavorite:true,
            nameSchool:element.post.post_title, 
            // typeSchool:element.fields.type.split(":")[1].trim(), 
            typeSchool:element.typeSchool ? element.typeSchool.map(element=>element.name): [], 
            levels:element.levels ? element.levels.map(item=>item.name) : [],            
            ubication: "Ubicacion",
            opinion:"buen trato economico",
            price:element.fields.price,
            phone:element.fields.phone,
            whatsapp: element.fields.whatsapp,
            web: element.fields.web,
            stars: "3.6",
            slug:element.post.post_name
          }
        }));
          // console.log(response.data);
        } 
      )
      .catch((error)=>console.log(error));  
  }
  // console.log( )
 


  useEffect(()=>{
    // console.log(stateAuth.data.token);
    if (!stateAuth.isLogin) {            
        return window.location = '/login';     
    }
    getSchoolsFavorite(true, statePaginate)
    // console.log(stateAuth.data.token);
    // console.log(process.env.WP_URL_REST);
  },[])


  useEffect(()=>{
    getSchoolsFavorite(false, statePaginate);
  },[statePaginate])


  const { ref, width = 1, height = 1 } = useResizeObserver();

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
        .then((response)=>{
            // console.log(response)
        }
          )
        .catch(({response})=>{ console.log(response)});        
    }
    const handlePaginate=(event)=>{
      setStatePaginate(parseInt(event.target.value))
    }
  

    const setIdPost =  (idPost, isFavorite)=>{
      // getSchoolsFavorite(false, statePaginate);
      if(isFavorite){
        addPostFavorite(idPost, stateAuth.data.id_user)
      }else{      
        
        deletePostFavorite(idPost,stateAuth.data.id_user)
        // console.log(idPost,stateAuth.data.username);
      }
    }
 return (
 <>
      <h1 ref={ref} className='title--h6 section' >
        Favoritos
      </h1>
      <div className='grid  sm:grid-cols-1 pb-4 pr-4 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4	carousel--container' >
        {
          loadGetFavorite ? "" :favorites.map((element,index) => (
            <CardVertical onChange={()=>{}} key={index}  isFavorite={true} setIdPost={setIdPost} school={element}/>                   
          ))
        }
      </div>  
      <div className='flex flex-row gap-x-2 justify-center py-8'>
            {[...Array(paginateTotalSchool)].map((elementInArray, index) => ( 
                <div key={`item-paginate-${index}`} >                
                    <input type="radio" defaultChecked={index+1 === statePaginate && "checked" }   onChange={(event)=>{handlePaginate(event)}} className="radio-paginate" name='typeSearch' id={`radio-paginate-${index+1}`}  value={index+1} />
                    <label className='btn btn--normal btn--secondary-ghost' htmlFor={`radio-paginate-${index+1}`} >{index+1}</label>
                </div>
                ) 
            )} 
      </div> 
 </>)
}
