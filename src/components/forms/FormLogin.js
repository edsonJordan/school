import React, {  useContext,  useEffect,  useState }  from "react"
import axios from "axios"
import { StaticImage } from "gatsby-plugin-image"
import eye_icon from '../../static/svg/eye.svg';
import {  GlobalDispatchContext} from "../../context/GlobalContextProvider"
import { Link } from "gatsby"
import { useRef } from "react"
const  FormLogin = () => {  
    const setLogin = useContext(GlobalDispatchContext)
    // const statusLogin = useContext(GlobalStateContext)
    
    const [userName, setUserName] = useState({value:"",error:false,message:""});
    // const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState({value:"",error:false,message:""});



    const stateRefPassword = useRef();
    const [passwordIsActive, setPasswordIsActive] = useState(true);
    // state

   /*  useEffect(() => {
      // console.log(State.getStatesOfCountry())
    //  console.log(statusLogin);    
    },[statusLogin]) */

    

    const fetchToken  = (userName, password) => {
      const data = {
        "username":userName.value,
        'password':password.value 
      };             
      return axios.post(`${process.env.WP_URL_REST}`+"/jwt-auth/v1/token", JSON.stringify(data),{headers: {
        'Content-Type': 'application/json',}
        })
        .then((response)=>{return response})
        .catch(({response})=>{return response});
    }
   

    const checkTokken= (fetchLogin)=>{
      switch (fetchLogin.status) {
        case 200:
          console.log("Loggin exitoso"); 
          // setLogin({isLogin:true ,data:{token:fetchLogin.data.token, id_user:fetchLogin.data.id, username:fetchLogin.data.user_display_name, user_email:fetchLogin.data.user_email}})
          setLogin({token:fetchLogin.data.token, id_user:fetchLogin.data.id, username:fetchLogin.data.user_display_name, user_email:fetchLogin.data.user_email})
          // navigate('/');
          if (typeof window !== `undefined`){              
            window.location = '/';
          }
          break;
        case 403:
          if(fetchLogin.data.code.search("invalid_username") !== -1) return setUserName({...userName,error:true, message:[fetchLogin.data.message] })
          if(fetchLogin.data.code.search("incorrect_password") !== -1) return setPassword({...password,error:true, message:[fetchLogin.data.message] })

          // const errorMessage = fetchLogin.data.message;
          // // console.log("Error");       
          // const message = errorMessage.slice(0, errorMessage.indexOf('<a'))
          // // setMessageLoggin(`${message} <a href="/lostPassword">¿Has olvidado tu contraseña?</a>`)
          // console.log(message);
            break;      
        default:
          console.log("Error comuniquese con el equipo de desarrollo");
          break;
      }
    }

    const handleSubmit = async (e) =>{        
        e.preventDefault()
        userName.value.length < 1 && setUserName({...userName,error:true, message:"Tiene que completar este campo" })
        password.value.length <1 && setPassword({...password,error:true, message:"Tiene que completar este campo" }) 
      if( userName.value.length < 1  || password.value.length <1) return true;
        const fetchLogin = await fetchToken(userName, password)   
        checkTokken(fetchLogin)     
          
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
      <h1 className="title--h3 text-global-gray-650">Iniciar Sesión</h1>
      <form className="form" onSubmit={(e)=>{handleSubmit(e)}} >
          <div className='form__block'>
            <label htmlFor="userName" >Usuario</label>
            <input type="text"  onChange={(e)=>setUserName({...userName, error:false, value:e.target.value})} id="userName" value={userName.value} placeholder='Ingrese su cuenta' />
            {
                            userName.error && <div dangerouslySetInnerHTML={{__html: userName.message}}></div>
            }
          </div>

          <div className='form__block'>
            <label htmlFor="password" >Contraseña</label>            
            <input ref={stateRefPassword} onChange={(e)=>setPassword({...password,error:false, value:e.target.value})} id="password" value={password.value} type={passwordIsActive ? "password":"text"}  />
            <div onClick={handlePassword} >
              <img className="password--hiden btn" src={eye_icon} alt="A dinosaur" placeholder="blurred" layout="fixed" />
            </div>
            {
                          password.error && <div dangerouslySetInnerHTML={{__html: password.message}}></div>
            }
          </div>  
            {/* wxi5hIIU8I4^d@Q13( */}
          <div className="form__block">
            <input type="submit" className="w-full btn btn--normal btn--primary "  value="Iniciar Sesión" />
            <Link to="/register" className="btn btn--normal btn--secondary" >   Crear Cuenta </Link>
          </div>  
            
            
        </form> 
    </main>
      )
  
}
export default FormLogin