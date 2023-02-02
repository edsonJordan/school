import React from 'react'
import { useEffect,useState,useContext } from 'react';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import useResizeObserver from 'use-resize-observer';
import CardVertical from '../cards/CardVertical';
import axios from 'axios';
import {    
    GlobalStateContext,
  } from "../../context/GlobalContextProvider"

export default function SliderHorizontal(props) {
    const { ref, width = 1/* , height = 1  */} = useResizeObserver();
    const [schools, setSchools]=useState([]); 
    const [favoritesSchools, setFavoritesSchools]=useState([]);

    const stateAuth = useContext(GlobalStateContext)

    const addPostFavorite = (idPost, user_name)=>{
        const data = {
          "user": user_name,
          'post':idPost 
          }; 
          axios.post(`${process.env.WP_URL_REST}/apischool/v1/favorites`, JSON.stringify(data),
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
          .catch(({response})=>{ 
            // console.log(response)
          });      
      }

      const resultRanking=(listNodesFromComments)=>{        
        if(listNodesFromComments.length===0)  return 3.5;
        const numValuesFromStars =  listNodesFromComments
          .map(element=>parseInt(element.comment_fields.stars[0]))
          .reduce((acumulator,currentValue)=>{
              if(currentValue === 1) acumulator[0][1]++
              if(currentValue === 2) acumulator[1][2]++
              if(currentValue === 3) acumulator[2][3]++
              if(currentValue === 4) acumulator[3][4]++
              if(currentValue === 5) acumulator[4][5]++
              return acumulator},[{1:0},{2:0},{3:0},{4:0},{5:0}])
      .map((element, index, array)=>{  return  element[(index+1)]*(index+1)})
      return ((numValuesFromStars[0]+numValuesFromStars[1]+numValuesFromStars[2]+numValuesFromStars[3]+numValuesFromStars[4])/listNodesFromComments.length).toFixed(1);
      }

      const deletePostFavorite =(idPost, user_name)=>{
        const data = {
          "user": user_name,
          'post':idPost 
          }; 
          axios.post(`${process.env.WP_URL_REST}/apischool/v1/favorites/delete`, JSON.stringify(data),
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

      const getRankingSchools=()=>{      
          fetch(`${process.env.WP_URL_REST}${props.type}`,{
            method:props.method,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',              
            },
            body:JSON.stringify(props.paramFetch)            
          })
          .then(response=>response.json())
          .then((data)=>{
            setSchools(data.map(element=>{return {
              id_post:element.post.ID,
              isFavorite:false,
              levels:element.levels.length > 0 ? element.levels.map(element=>element.name): [],
              nameSchool:element.post.post_title,
              phone:element.post_fields.phone,
              price:element.post_fields.price,
              slug:element.post.post_name,
              stars:resultRanking(element.comments),
              typeSchool: element.type.length > 0 ? element.type.map(levelNode=>levelNode.name) : [],
              ubication:element.post_fields.direction,
              web:element.post_fields.web,
              whatsapp:element.post_fields.whatsapp
                }}
              )
              .sort((a,b)=>{
                return  b.stars - a.stars;
              })
              );
            // console.log(schools);
          })
          .catch((error)=>console.log(error));
      }

      const getSchools = ()=>{
            fetch(`${process.env.WP_URL_REST}/wp/v2/colegio?_embed`,{
              headers: {
                'Content-Type': 'application/json',
              }
            })
            .then(response => response.json())
            .then(
              (data) => {
                setSchools(data.map((element)=>{             
                  return {
                  id_post:element.id,
                  nameSchool:element.title.rendered, 
                  typeSchool:element['_embedded']['wp:term'][2].length !== 0 ? element['_embedded']['wp:term'][2].map(element=>element.name) : [], 
                  // levels: element.acf.level.map(element=>element.split(":")).map(element=>element[1]).map(element=>element.trim()),
                  levels:element['_embedded']['wp:term'][1].length !== 0 ? element['_embedded']['wp:term'][1].map(element=>element.name): [],
                  ubication: element.acf.direction,
                  opinion:"buen trato economico",
                  price:element.acf.price,
                  phone:element.acf.phone,
                  whatsapp: element.acf.whatsapp,
                  web: element.acf.web,
                  stars: "3.6",
                  isFavorite:false,
                  slug:element.slug
                }}))
              } 
            )
            .catch((error)=>console.log(error));
        }
      const getSchoolsFavorites = ()=>{
            if (!stateAuth.isLogin) return false;
            // console.log(stateAuth.data.id_user);
            axios(`${process.env.WP_URL_REST}/apischool/v1/favorites/${stateAuth.data.id_user}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${stateAuth.data.token}`
              }
            })
            .then(
              (response) => {
                // console.log(response);
                setFavoritesSchools(response.data.map((element)=> {return [element.id_post]}).reduce((acc, element)=>{ return acc.concat(parseInt(element)) },[]));
               } 
            )
            .catch((error)=>console.log(error));
        }
        
        const responsive = {
            superLargeDesktop: {
              // the naming can be any, depends on you.
              breakpoint: { max: 4000, min: 3000 },
              items: 5
            },
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 3
            },
            tablet: {
              breakpoint: { max: 1024, min: 424 },
              items: 3
            },
            mobile: {
              breakpoint: { max: 424, min: 0 },
              items:0.5,     
              slidesToSlide: 1,
              centerMode:true     
              /* items: 1.25,
              slidesToSlide: 0.75 */
            }
          };
          const [value, setValue] = useState(0);
          useEffect(() => {
            // widthScreen < 425 ? setIsMobile(true) :setIsMobile(false)
            // getSchools();
            getSchoolsFavorites();
            getRankingSchools();
          },[])
          
      
        
        const flowParentToChild = (idPost, isFavorite)=>{
            if (!stateAuth.isLogin){
              if (typeof window !== `undefined`){ 
                 
                return window.location = '/login';
              }
            }  
            // alert("Hola");
            if(isFavorite){
              addPostFavorite(idPost, stateAuth.data.id_user)
            }else{
              deletePostFavorite(idPost,stateAuth.data.id_user)
            }
        }

    return (
        <>
             <h2 ref={ref} className='title--h6 section' >
                 {props.title}
             </h2>
             <Carousel  itemClass="carousel-item--card" containerClass='carousel--container' centerMode={width<410 ? true : false}   responsive={responsive}>
             {
                  favoritesSchools.length > 0  ?
                  schools
                  .map((element)=>{ return favoritesSchools.includes(element.id_post)? {...element, isFavorite:true}:{...element}})
                  .map((element,index) => {
                   return <CardVertical key={index} isFavorite={element.isFavorite}  setValue={setValue} setIdPost={flowParentToChild} school={element}/>         
                  }                   
                ):
                schools                  
                  .map((element,index) => {
                   return <CardVertical key={index} isFavorite={element.isFavorite}  setValue={setValue} setIdPost={flowParentToChild} school={element}/>         
                  }                   
                )
             }                
             </Carousel>
            
    </>)
}
