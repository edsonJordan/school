import React, { useState,useEffect, useRef }  from "react"
import Select from 'react-select'
import { Country, State }  from 'country-state-city';
import axios from "axios";


const  Createschool = ()=> {

    

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [pickState, setpickState] = useState(null);
    const [pickType, setpickType] = useState(null);

    const stateRef = useRef();

    useEffect(() => {
        // console.log(State.getStatesOfCountry())
        const dataCountries = Country.getAllCountries();
        const countries = dataCountries.map(({isoCode, name})=> { return {id: isoCode , value:name, label:name}})      
        setCountries(countries);
       
    },[])


    /* useEffect(()=>{
       console.log(images);
    },images) */

    const submitRest = async () =>{
                const data = {
                    "title": "Post Desde gatsby 2",
                    "status":"publish",
                    "acf": {
                        "price":20,
                        "description": "Esto es creación desde gatsby",
                  }
                };
                  

                return axios.post('http://localhost/2022/ProyectoColegios/wp-json/wp/v2/colegio', 
                JSON.stringify(data),{headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0LzIwMjIvUHJveWVjdG9Db2xlZ2lvcyIsImlhdCI6MTY2NzcwODYwNywibmJmIjoxNjY3NzA4NjA3LCJleHAiOjE2NjgzMTM0MDcsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.dSSL_QKJEkzd-Dg3CICwB1PRFPPeDoGR35gAK6U2jmw'
                    }
                }).then((response)=>{
                    console.log(response);
                }).catch((error)=>{
                    console.log(error);
                });
    }
   
    const setContry = (data) =>{
        const dataStates = State.getStatesOfCountry(data.id);        
        const states = dataStates.map(({name})=> {return {value:name, label:name}})
        setStates(states)       
        clearSelectStates()
    }     
    const clearSelectStates = () => {
        stateRef.current.setValue("")
    };

    const levelItems = (e)=>{
        const { value, checked } = e.target;         
        if (checked) return setLevels([...levels, value])       
        setLevels(levels.filter((element)=>element !== value))
    }
    const lenguagesItems = (e)=>{
        const { value, checked } = e.target;         
        if (checked) return setLanguages([...languages, value])       
        setLanguages(languages.filter((element)=>element !== value))
    }
    const approachItems = (e)=>{
        const { value, checked } = e.target;             
        if (checked) return setApproach([...approach, value])       
        setApproach(approach.filter((element)=>element !== value))
    }
    const imageItems = (e)=>{
        // const { value, checked } = ;             
        if(e.target.files.length > 3) { 
            e.preventDefault() 
            return 
        }        
        setImages([...e.target.files]);
        // if (checked) return setApproach([...approach, value])       
        // setApproach(approach.filter((element)=>element !== value))
    }
    
    /* States of inputs */
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [levels, setLevels] = useState([]);
    const [description, setDescription] = useState("");
    const [proposal, setProposal] = useState("");
    const [languages, setLanguages] = useState([]);
    const [approach, setApproach]= useState([]);
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [mail, setMail] = useState("");
    const [web, setWeb] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [images, setImages] = useState([]);

  return (
    <div>
        <p onClick={submitRest} >Enviar rest</p>
        <form  >
                <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <div>            
                <label>Nombre
                    <input onChange={(e)=>setName(e.target.value)} value={name} type="text" id='name'/>
                </label>
            </div>
            <br/>           
            <div>  
                <h4>Tipo</h4>         
                <Select onChange={(data)=>setpickType(data.value)} defaultValue=""  options={[{value:"publico", label:"Público"}, {value:"privado", label:"Privado"} ]}/>                    
            </div>
            <br/>
            <div> 
                <h4>Niveles</h4>           
                <label >maternal          
                    <input type="checkbox" id='maternal' value="maternal"  onChange={levelItems}/>
                </label>      
                <br/>
                <label   >Preescolar
                    <input type="checkbox" value='preescolar' onChange={levelItems}/>  
                </label>  
                <br/>
                <label   >Primaria
                    <input type="checkbox" value='primaria' onChange={levelItems}/> 
                </label>  
                <br/>
                <label   >Secundaria
                    <input type="checkbox" value='secundaria'  onChange={levelItems}/>     
                </label>  
                <br/>
                <label   >Bachiller
                    <input type="checkbox" value='bachiller' onChange={levelItems}/>
                </label>  
                <br/>
                <label  >Licenciaturas
                    <input type="checkbox" value='licenciaturas'  onChange={levelItems}/> 
                </label>   
                <br/>
                <label   >Postgrado
                    <input type="checkbox" value='postgrado'  onChange={levelItems}/>      
                </label>    
            </div>
            <br/>
            <div>      
                <input  onChange={(e)=>setPrice(e.target.value)} value={price} type="number" id='price' name='price'/>
            </div>
            <div>            
                <label  >description
                <br/>
                <textarea onChange={(e)=>setDescription(e.target.value)} value={description}/>
                </label>
            </div>
            <div>            
                <label   >Propuesta
                <br/>
                <textarea onChange={(e)=>setProposal(e.target.value)} value={proposal}/>
                </label>
            </div>
            <h3>Información avanzada</h3>
            <div>       
                <h4>Idiomas</h4>     
                <label  >Inglés
                    <input type="checkbox" value='ingles' onChange={lenguagesItems}/>
                </label>  
                <br/>
                <label >Francés
                    <input type="checkbox" value='frances'  onChange={lenguagesItems}/> 
                </label>   
                <br/>
                <label >Alemán
                    <input type="checkbox" value='aleman'  onChange={lenguagesItems}/>      
                </label>
                <br/>   
                <label>Otros
                    <input type="checkbox" value='otros'  onChange={lenguagesItems}/>      
                </label>   
            </div>
            <div>       
                <h4>Enfoque</h4>     
                <label  >Constructivista
                    <input type="checkbox" id='constructivista' name="approach[]"/>
                </label>  
                <br/>
                <label  >Montesori
                    <input type="checkbox" id='montesori'  name="approach[]"/> 
                </label>   
                <br/>
                <label  >En valores
                    <input type="checkbox" id='enValores'  name="approach[]"/>      
                </label>
                <br/>   
                <label   >Tecnología
                    <input type="checkbox" id='tecnologia'  name="approach[]"/>      
                </label>   
                <br/>   
                <label >Nivel Educativo
                    <input type="checkbox" id='nivelEducativo'  name="approach[]"/>      
                </label>                 
            </div>
            <div>
                <h4>
                    Actividades extras
                </h4>
                <label  >Inglés
                    <input type="checkbox" value="deportes" onChange={approachItems}/>
                </label>  
                <br/>
                <label >Francés
                    <input type="checkbox"  value="baile"  onChange={approachItems}/> 
                </label>   
                <br/>
                <label >Alemán
                    <input type="checkbox" value="arte"  onChange={approachItems}/>      
                </label>
                <br/>   
                <label>Otros
                    <input type="checkbox"  value="programacion/robotica"  onChange={approachItems}/>      
                </label> 
            </div>
            <div>
                <h4>Pais</h4>
                    <Select onChange={(data)=>setContry(data)}  options={countries} />
                <br/>
                <h4>Estado</h4> 
                   <Select onChange={(data)=>setpickState(data.value)} defaultValue=""  ref={stateRef} options={states}  />
            </div>
            <br/>
            <div>
                <h4>Contacto</h4>
                <label>Teléfono
                    <input onChange={(e)=>setPhone(e.target.value)} value={phone} type="phone" />
                </label>
                {/* whatsapp */}
                <label>Whatsapp
                    <input onChange={(e)=>setWhatsapp(e.target.value)} value={whatsapp} type="phone" />
                </label>
                <label>Correo
                    <input onChange={(e)=>setMail(e.target.value)} value={mail} type="email" />
                </label>
                <label>Web
                    <input onChange={(e)=>setWeb(e.target.value)} value={web} type="url" />
                </label>
            </div>
            <br/>
            <div>
                <h4>Redes</h4>
                <label>Facebook
                    <input onChange={(e)=>setFacebook(e.target.value)} value={facebook} type="text" />
                </label>
                <label>Instagram
                    <input onChange={(e)=>setInstagram(e.target.value)} value={instagram} type="text" />
                </label>
            </div>
            <div>
                <h4>Imagen</h4>
                <input type="file" multiple accept="image/*" maxLength="3" onChange={(e)=>imageItems(e)}  />
            </div>
            
            <input type="submit" value="Enviar Formulario" />
        </form>
    </div>
  )
}
export default Createschool

