import React from "react"
import GlobalContextProvider from "../../context/GlobalContextProvider";
import { Footer, Header } from "../../components";
import FormUpdateSchool from "../../components/forms/FormUpdateSchool";
const  Editar = ()=> {



      
  return (
    <main className="main">       
        <GlobalContextProvider>
          <Header/>
        </GlobalContextProvider>  
        {/* <a onClick={submitRest} >Enviar rest</a> */}
        <section>
            <div className="section__image--portada agregar">
                <h1 className="title--h5">Editar colegio</h1>
            </div>
        </section>
        <GlobalContextProvider>
            <FormUpdateSchool/>
        </GlobalContextProvider>        
    <Footer/>
    </main>
  )
}
export default Editar

