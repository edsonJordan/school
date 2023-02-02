import React from 'react'
import Footer from '../../components/footer'
import FormUserPerfil from '../../components/forms/FormUserPerfil'
import Header from '../../components/header'
import GlobalContextProvider from '../../context/GlobalContextProvider'

export default function Perfil() {
  
  return (
    <main className='main'>
        <GlobalContextProvider>
            <Header/>
            <FormUserPerfil/>
        </GlobalContextProvider>
        <Footer/>
    </main>
  )
}
