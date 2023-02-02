import React from "react"
import GlobalContextProvider from "../context/GlobalContextProvider"
import FormRegisterUser from "../components/forms/FormRegisterUser";



const Register = ()=> {



  return (
    <GlobalContextProvider>
        <FormRegisterUser/>
   
    </GlobalContextProvider>
  )
}
export default Register