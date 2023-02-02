import React, { useContext, useState, useEffect }  from "react"

import { Link } from 'gatsby'
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../context/GlobalContextProvider"
import { StaticImage } from "gatsby-plugin-image";
import Seo from "../components/seo"
const Header= ()=>{
  const stateAuth =  useContext(GlobalStateContext)
  const dispatch =  useContext(GlobalDispatchContext)

  const [optionAvatar, setOptionAvatar] = useState(false);

  // console.log(data);

  const outSession=()=>{
   const isLogout = window !== 'undefined' && localStorage.removeItem('sessionSchool')
   if (typeof window !== `undefined`){      
    window.location = '/'
   }
    
  }
  useEffect(()=>{
    // console.log(stateAuth.data.token);
    // console.log(stateAuth);
  },[stateAuth])

  return (
    
    <header className="header">
        <Link to="/">
            <StaticImage className="avatar__icon"
                    src="../static/images/logo-desktop.png"
                    alt="A dinosaur"
                    placeholder="blurred"
                    layout="fixed"
                    />
        </Link>
        {/* <img src="https://picsum.photos/seed/picsum/100/32"  ></img> */}
        {stateAuth.isLogin? 
        <div className="avatar" >            
            <img className="avatar__icon" src="https://picsum.photos/seed/picsum/40/40"  onMouseOver={()=>setOptionAvatar(true)} ></img> 
            <div  className={"avatar__options " + (optionAvatar ? "active" : "desactivate")} onMouseLeave={()=>setOptionAvatar(false)} >
                <ul  className={"options_list " } >
                  <li className="option">
                      <Link to="/usuario/perfil" >Editar perfil</Link>
                  </li>
                  <li className="option">
                      <Link to="/colegios/favoritos">Favoritos</Link>
                  </li>
                  <li className="option">
                      <Link to="/colegios/mis-colegios">Tus colegios</Link>
                  </li>
                  <li className="option">
                      <Link to="/colegios/agregar" className="btn btn--ext-sm btn--primary">Agregar Colegio</Link>
                  </li>
                </ul>
                <a  onClick={()=>{outSession()}} className="text--danger btn__logout" >Cerrar sesión</a>
            </div>
          </div> 
        :  
        <Link className="btn btn--ext-sm btn--primary" to="/login"> Iniciar sesión</Link>}
    </header>
  )
}
export default Header
export const Head = () => (
  <Seo title="Page Two" />
)
