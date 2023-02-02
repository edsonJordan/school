import React from 'react'
import { Footer, Header } from '../../components';
import Grid from '../../components/grids/gridFavorites';
import GlobalContextProvider from '../../context/GlobalContextProvider'

export default function Favoritos() {
  // const [value, setValue] = useState(" Default Value ");
    return (
        <main className="main">       
          <GlobalContextProvider>
            <Header/>
          </GlobalContextProvider>
          {/* <CardVertical/> */}
          <GlobalContextProvider>            
            <Grid/>
          </GlobalContextProvider>
          <Footer/>
        </main>
        )
}
