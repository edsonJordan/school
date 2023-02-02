import React, { useEffect, useState,useMemo } from 'react'
import Map, { Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import CardHorizontal from '../cards/CardHorizontal';
// import CardVertical from '../cards/CardVerticalAdmin';
import axios from 'axios';
// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function Mapa(props) {
  const [stateAuth, setStateAuth] = useState(typeof window !== "undefined" && JSON.parse(localStorage.getItem('sessionSchool')))
  const [isFavorite, setIsFavorite]=useState(false)
  
  
  const flowParentToChild =  (idPost, isFavorite)=>{
    if (stateAuth === null){
      return window.location = '/login';
    }  
    // return console.log(stateAuth);
    if(isFavorite){
      addPostFavorite(idPost, stateAuth.id_user)
    }else{            
      deletePostFavorite(idPost,stateAuth.id_user)
      // console.log(idPost,stateAuth.data.username);
    }
  }

  const addPostFavorite = (idPost, idUser)=>{
    const data = {
      "user": idUser,
      'post':idPost 
      }; 
      axios.post(`${process.env.WP_URL_REST}`+"/apischool/v1/favorites", JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${stateAuth.token}`
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
          'Authorization':`Bearer ${stateAuth.token}`
        }
      }
      )
      .then((response)=>{
          // console.log(response)
      }
        )
      .catch(({response})=>{ console.log(response)});        
  }

  useEffect(()=>{      
      // console.log(stateAuth);    
  },[stateAuth])

  
 /*  useEffect(()=>{
      props.isFavorite != undefined  && setIsFavorite(props.isFavorite);   
      // console.log(props.isFavorite);    
  },[]) */

  const [popupInfo, setPopupInfo] = useState(null);

  const pins = useMemo(
    () =>
    props.data.map((city, index) => (
      <div  key={`marker-${index}`}>      
        <Marker 
          className="maker-map"
          // key={`marker-child-${index}`}
          latitude={city.lat}
          longitude={city.long}
          anchor="right"          
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >    
        </Marker>
        <Marker 
          className="maker-map--title"
          // key={`marker2-${index}-${index}`}
          longitude={city.long}
          latitude={city.lat}
          anchor="center"
          
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >    
        <div className='bg-white-default w-fit h-fit rounded-10 p-2'>
          {city.nameSchool}
        </div>
        </Marker>
        
      </div>
      )),
    []
  );

       
  return (
    <div className='map-box' >
      <Map
          mapboxAccessToken={process.env.API_MAPBOX_TOKEN}
          initialViewState={{
            longitude: -87.637596,
            latitude: 41.940403,
            // zoom: 10,
          }}
      mapStyle="mapbox://styles/mapbox/streets-v11">
       <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
     
        {pins}

        {popupInfo && (
          <Popup
            // className='transparent'
            anchor="center"
            latitude={Number(popupInfo.lat)}
            longitude={Number(popupInfo.long)}
            onClose={() => setPopupInfo(null)}
          >          
          <div className='carousel--container'>
            <CardHorizontal key={popupInfo.id} isFavorite={popupInfo.isFavorite}  /* setValue={setValue} */ setIdPost={flowParentToChild}   school={popupInfo}/>        
          </div>  
          </Popup>
        )}
    </Map>
    </div>
  )
}
