import React from 'react'
import { Footer, Header } from '../../components';
import { GridMeSchools } from '../../components/grids';
import GlobalContextProvider from '../../context/GlobalContextProvider'

export default function MisColegios() {
  return (
    <main className="main">       
          <GlobalContextProvider>
            <Header/>
          </GlobalContextProvider>
          {/* <CardVertical/> */}
          <GlobalContextProvider>            
            <GridMeSchools/>
          </GlobalContextProvider>
          <Footer/>
    </main>
  )
}
