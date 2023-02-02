import React from "react"

export const GlobalStateContext = React.createContext()
export const GlobalDispatchContext = React.createContext()

const getDataUser = () =>{
    // const response = window !== 'undefined' ? JSON.parse(localStorage.getItem('sessionSchool')): null;
    // const response =async ()=>{
    //   return await typeof window !== 'undefined' && localStorage.getItem('sessionSchool');
    // } 
    const response = typeof window !== "undefined" && JSON.parse(localStorage.getItem('sessionSchool'))
    if(response)  return response
    return null
} 

const initialState = {
    isLogin: getDataUser() !== null ? true : false ,
    data: getDataUser()
}

function setStateLogin(state, dataUser) {
  // typeof window !== 'undefined' && localStorage.getItem('sessionSchool')
    // const istLoggin = typeof window !== 'undefined' ? : null;
    typeof window !== "undefined" && localStorage.setItem('sessionSchool', JSON.stringify(dataUser))
    return {
        isLogin: true,
        data: dataUser
    }
  }

const GlobalContextProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(setStateLogin, initialState)
    return (
      <GlobalStateContext.Provider value={state}>
        <GlobalDispatchContext.Provider value={dispatch}>
          {children}
        </GlobalDispatchContext.Provider>
      </GlobalStateContext.Provider>
    )
  }
export default GlobalContextProvider