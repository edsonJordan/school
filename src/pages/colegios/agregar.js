import React from "react"
import GlobalContextProvider from "../../context/GlobalContextProvider";
import { Footer, Header } from "../../components";
import "mapbox-gl/dist/mapbox-gl.css";

    
import FormRegisterSchool from "../../components/forms/FormRegisterSchool";
const  Agregar = ()=> {

  return (
    <main className="main">       
        <GlobalContextProvider>
          <Header/>
        </GlobalContextProvider>  
        {/* <a onClick={submitRest} >Enviar rest</a> */}
        <section>
            <div className="section__image--portada agregar">
                <h1 className="title--h5">Agregar colegio</h1>
            </div>
        </section>
        <GlobalContextProvider>
            <FormRegisterSchool/>
        </GlobalContextProvider>        
    <Footer/>
    </main>
  )
}
export default Agregar

