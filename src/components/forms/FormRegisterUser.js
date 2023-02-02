import React, {  useContext,  useState }  from "react"
import axios from "axios"
import { StaticImage } from "gatsby-plugin-image"

import {  GlobalDispatchContext,  GlobalStateContext,} from "../../context/GlobalContextProvider"
import { useRef } from "react"
import { Link } from "gatsby"
const  FormRegisterUser = () => {  
    const setLogin = useContext(GlobalDispatchContext)
    
    const [userName, setUserName] = useState({value:"", error:false, message:""});
    const [userEmail, setUserEmail] = useState({value:"", error:false, message:""});
    const [password, setPassword] = useState({value:"", error:false, message:""});

    const stateRefPassword = useRef();
    const [passwordIsActive, setPasswordIsActive] = useState(true);
    
    // state
   /*  useEffect(() => {
      // console.log(State.getStatesOfCountry())
     console.log(passwordIsActive);    
    },[passwordIsActive]) */
    const fetchToken  = (userName, password) => {
      const data = {
        "username":userName.value ,
        'password':password.value 
      };                 
      return axios.post(`${process.env.WP_URL_REST}/jwt-auth/v1/token`, JSON.stringify(data),{headers: {
        'Content-Type': 'application/json',}
        }).then((response)=>{ return response}).catch(({response})=>{return response});
    }

    const createUser = (userName, email, password)=>{
      const data = {
        "username":userName,
        'email':email,
        'password':password 
      };   
      return axios.post(`${process.env.WP_URL_REST}`+"/apischool/v1/students", JSON.stringify(data),{headers: {
        'Content-Type': 'application/json',}
        })
        .then((response)=> response)
        .catch(({response})=>{return response});              
    }

    const checkTokken= (fetchLogin)=>{
      switch (fetchLogin.status) {
        case 200:
          // console.log("Loggin exitoso"); 
          setLogin({isLogin:true ,data:{token:fetchLogin.data.token, username:fetchLogin.data.user_display_name, user_email:fetchLogin.data.user_email}})
          break;
        
        default:
          console.log("Error comuniquese con el equipo de desarrollo");
          break;
      }
    }
    const handleSubmit = async (e) =>{        
      e.preventDefault()
      userName.value.length < 1 && setUserName({...userName, error:true, message:"Ingrese este campo"})
      userEmail.value.length < 1 && setUserEmail({...userEmail, error:true, message:"Ingrese este campo"})
      password.value.length < 1 && setPassword({...password, error:true, message:"Ingrese este campo"})
      if(  userName.value.length < 1 || userEmail.value.length <1 || password.value.length <1) return console.log("Campo vacio"); 
      const userCreated = await createUser(userName.value, userEmail.value, password.value);
          // console.log(userCreated);
      console.log(userCreated);
      if (userCreated.data.success){
            const username = userName;
            const pass_user = password;
            // const fetchLogin = await fetchToken(username, pass_user)
            // checkTokken(fetchLogin)
            if (typeof window !== `undefined`){                
              window.location = '/login';
            }
      }else{
        // console.log(userCreated.data.message);
          if(userCreated.data.message.search("User") !== -1) return setUserName({...userName,error:true, message:[userCreated.data.message] })
          if(userCreated.data.message.search("Email") !== -1) return setUserEmail({...userEmail,error:true, message:[userCreated.data.message] })
        }       
      }
      const handlePassword=()=>{
        if(passwordIsActive){
          setPasswordIsActive(false)
        }else{
          setPasswordIsActive(true)
        }
      }

    return (    
    <main className="section section--login">
      <Link to="/">
        <StaticImage src="../../static/images/logo-normal.png" alt="A dinosaur" placeholder="blurred" layout="fixed" />
      </Link>
      <p className="subtitle" >Comienza gratis</p>
      <h1 className="title--h3 text-global-gray-650">Crear Cuenta</h1>
      <form className="form" onSubmit={(e)=>{handleSubmit(e)}} >
          <div className='form__block'>
            <label htmlFor="userName" >Usuario</label>
            <input type="text"  onChange={(e)=>setUserName({...userName, value:e.target.value, error:false})} id="userName" value={userName.value} placeholder='Ingrese su cuenta' />
            {
                          userName.error && <p>{userName.message}</p>
            }
          </div>

          <div className="form__block">
          <label htmlFor="password" >Correo</label>   
            <input type="text"  onChange={(e)=>setUserEmail({...userEmail, value:e.target.value, error:false})} value={userEmail.value} placeholder='Ingrese su cuenta' />
            {
                          userEmail.error && <p>{userEmail.message}</p>
            }
          </div>  

          <div className='form__block'>
            <label htmlFor="password" >Contraseña</label>            
            <input ref={stateRefPassword} onChange={(e)=>setPassword({...password, value:e.target.value,error:false})} id="password" value={password.value} type={passwordIsActive ? "password":"text"}  />
            <div onClick={handlePassword} >
            
              <StaticImage className="password--hiden btn" src="../../static/svg/eye.svg" alt="A dinosaur" placeholder="blurred" layout="fixed" />            
            
            </div>
          </div>  
          {/* <div className='form__block'>
          <div dangerouslySetInnerHTML={{__html: messageLoggin}} ></div>
          </div>   */}
          <div className="form__block">
          <input type="submit" className="w-full btn btn--normal btn--primary "  value="Crear cuenta" />
            <Link to="/login" className="btn btn--normal btn--secondary" >Iniciar Sesión </Link>
          </div>  
            
            
        </form> 
    </main>
      )
  
}
export default FormRegisterUser