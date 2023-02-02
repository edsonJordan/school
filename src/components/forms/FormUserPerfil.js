import React,{ useEffect,useState } from 'react'
import { useContext } from 'react'
import {  GlobalStateContext } from '../../context/GlobalContextProvider'
import { StaticImage } from "gatsby-plugin-image"
import axios from 'axios'


export default function FormUserPerfil() {
    // const setLogin = useContext(GlobalDispatchContext)
    const stateAuth = useContext(GlobalStateContext)
    const [countSchoolsFavorites, setCountSchoolsFavorites]= useState(0);

    const getCountFavorites=(user_name)=>{
        const data = {
            "user": user_name,
            }; 
            return axios.post(`${process.env.WP_URL_REST}/apischool/v1/favorites/${user_name}`, JSON.stringify(data),
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${stateAuth.data.token}`
              }
            }
            )
            .then((response)=>{
                setCountSchoolsFavorites(response.data.length)
            })
            .catch(({response})=>{ console.log(response)}); 
    }

    useEffect(()=>{
        // console.log(stateAuth.data.token);
        // console.log(countSchoolsFavorites);
      },[countSchoolsFavorites])
    useEffect(()=>{
        if(!stateAuth.isLogin)  window.location = '/login'
        stateAuth.isLogin  && getCountFavorites(stateAuth.data.username)
      },[stateAuth])
    

  return (
    <section className='section section--perfil' >
        <div className='thumbnail-user'>
            <StaticImage className='image--perfil' src="https://picsum.photos/seed/picsum/168/168" alt="A dinosaur" placeholder="blurred" layout="fixed" />
            <div className='icon--edit cursor-pointer'>
                <StaticImage className='image--edit' /* width={16} height={16} */ src="../../static/svg/pencil.svg" alt="A dinosaur" placeholder="blurred" layout="fixed" />
            </div>
        </div>
        <h1 className='title--user'>
            {stateAuth.data !== null &&  stateAuth.data.username}
        </h1>
        <p className='title--user-name'>
            {`@${stateAuth.data !== null && stateAuth.data.username}`}
        </p>
        <p className='title--user-email'>
            {stateAuth.data !== null && stateAuth.data.user_email}
        </p>
        <ul className='dashboard--user' >
            <li className='block-dashboard' >
                <p className='block-dashboard__count'>
                    {countSchoolsFavorites}
                </p>
                <p className='block-dashboard__title'>
                     Favoritos
                </p>
            </li>
            <li className='block-dashboard' >
                <p className='block-dashboard__count'>
                    20
                </p>
                <p className='block-dashboard__title'>
                    Colegios
                </p>
            </li>
            <li className='block-dashboard' >
                <p className='block-dashboard__count'>
                    20
                </p>
                <p className='block-dashboard__title'>
                    Opiniones
                </p>
            </li>
        </ul>
    </section>
  )
}
