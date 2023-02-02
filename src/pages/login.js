import React  from "react"
import GlobalContextProvider from "../context/GlobalContextProvider"
import FormLogin from "../components/forms/FormLogin";



const Login = ()=> {



  return (
    <GlobalContextProvider>
        <FormLogin/>
    </GlobalContextProvider>
  )
}
export default Login