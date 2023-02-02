import React, {useEffect, useState, useContext} from 'react'
import GlobalContextProvider, {
    GlobalDispatchContext,
    GlobalStateContext,
  } from "../../context/GlobalContextProvider"
import GridSearch from '../grids/gridSearch';

export default function   HandleSearch(schools) {
    const dispatch = useContext(GlobalDispatchContext)
    const stateAuth = useContext(GlobalStateContext)
    const [favoritesSchools, setFavoritesSchools]=useState([]);
    
    useEffect(()=>{
        // getSchoolsFavorites();
        // console.log(schools.schools);
    },[])

  return (
    <div className='container__cards'>  
            <GlobalContextProvider>           
                <GridSearch data={schools}/>
            </GlobalContextProvider>
    </div>
  )
}
