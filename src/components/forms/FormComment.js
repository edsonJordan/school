import React, { useContext, useState, useEffect }  from "react"
import {Footer} from '../../components'
import {Header} from '../../components'
import GlobalContextProvider, { GlobalDispatchContext, GlobalStateContext } from '../../context/GlobalContextProvider'
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { StaticImage } from "gatsby-plugin-image"
import { SliderHorizontal } from "../../components/sliders";
import Select from 'react-select'
import axios from "axios";

export default function FormComment(props) {

    const stateAuth =  useContext(GlobalStateContext)
    const dispatch =  useContext(GlobalDispatchContext)

    

  /*  Form Components Comment*/
  const [opinionSchool, setOpinionSchool]= useState("")
  const [levelsOptionsList, setLevelOptionsList]=useState(props.levels.nodes.map(element=>{return {field:element.name, value:element.name, label:element.name}}))

//   { field:"level" , value: 'kínder: Kínder', label: 'Kínder' }
  const [typeSchool, setTypeSchool] = useState({value:null,error:false, message:""})
  const [clasificationSchool, setClasificactionSchool] = useState(3)
  const [calidezSchool, setCalidezSchool] = useState({icon:null,value:null,text:null, error:false, message:""})
  const [qualitySchool, setQualitySchool] = useState({icon:null,value:null,text:null, error:false, message:""})
  const [priceSchool, setPriceSchool]     = useState({icon:null,value:null,text:null, error:false, message:""})
  const [feelingSchool, setFeelingSchool] = useState({icon:null,value:null,text:null, error:false, message:""})
  const [feelingChildren, setFeelingChildrenSchool]= useState({icon:null,value:null,text:null, error:false, message:""})



  // console.log(school.databaseId);

  useEffect(()=>{
    // console.log(props.post);
   
    // console.log(stateAuth.data.user_email);
    // console.log();
  }, [])
  
  const updateStarsFromComment =(idComment,stars)=>{
        const content ={
            stars:stars
        }
    return axios.post(`${process.env.WP_URL_REST}/apischool/v1/comment/stars/${idComment}`, 
    JSON.stringify(content),{headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stateAuth.data.token}` 
        }
    }).then((response)=>{
        // console.log("Comentario guardado exitosamente");
    }).catch((error)=>{
        console.log(error);
    });   
  }

  const handleSubmitComment=(e)=>{
    e.preventDefault()
    // console.log();
  if(typeSchool.value ===null) setTypeSchool({...typeSchool,error:true,message:"Ingrese este campo"})
  if(calidezSchool.value ===null) setCalidezSchool({...calidezSchool,error:true,message:"Ingrese este campo"})
  if(qualitySchool.value ===null) setQualitySchool({...qualitySchool,error:true,message:"Ingrese este campo"})
  if(priceSchool.value ===null) setPriceSchool({...priceSchool,error:true,message:"Ingrese este campo"})
  if(feelingSchool.value ===null) setFeelingSchool({...feelingSchool,error:true,message:"Ingrese este campo"})
  if(feelingChildren.value ===null) setFeelingChildrenSchool({...feelingChildren,error:true,message:"Ingrese este campo"})

  if(typeSchool.value === null || calidezSchool.value ===null || qualitySchool.value ===null || priceSchool.value ===null || feelingSchool.value ===null || feelingChildren.value ===null) return 

//   return console.log(stateAuth.data.user_email);
  const data = {
    "post": props.post,
    'author':stateAuth.data.id_user,
    "author_name": stateAuth.data.username,
    "author_email": stateAuth.data.user_email,
    "content": opinionSchool,
    // "meta":{
    //     "stars":clasificationSchool, 
    // },
    "acf":{
        "level":typeSchool.value,
        "humanWarmth":calidezSchool.value,
        "qualityEducative":qualitySchool.value,
        "price":priceSchool.value,
        "feeling":feelingSchool.value,
        "feelingChildren":feelingChildren.value
    }
  };
//   return console.log(data);
//   console.log(data);
//   return

    return axios.post(`${process.env.WP_URL_REST}/wp/v2/comments`, 
    JSON.stringify(data),{headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${stateAuth.data.token}`  
        }
        }).then((response)=>{
            // console.log(response);
            if(response.status === 201){
                updateStarsFromComment(response.data.id, clasificationSchool)
                props.handleStateModal(false)
                console.log("Comentario agregado id: "+response.data.id);
            }else{
                console.log("Error de envio de comentario");
            }

            // 
        }).catch((error)=>{
            console.log(error);
        });       
  }
 

  return (
    <div className="modal__comment">
        <div className="card--modal-comment">
            <div onClick={()=>{props.handleStateModal(false)}} className="icon__modal-close">            
            <StaticImage
                src="../../static/svg/close.svg"
                alt="A dinosaur"
                placeholder="blurred"
                layout="fixed" />
            </div>
            <h1  className="title--h4">Escribir mi opinión</h1>
            <form onSubmit={handleSubmitComment}  className="section__form-school form" > 
                <div className="content__blocks-form">
                    <div className="form__block">         
                    <label className="form-block__title"  htmlFor="opinión" >Opinión</label>    
                    <textarea id="opinión" onChange={(e)=>setOpinionSchool(e.target.value)} value={opinionSchool}/> 
                        {opinionSchool.error ? opinionSchool.message:""}
                    </div>   
                    <div className="form__block">
                    <label className="form-block__title" htmlFor="name" >Tipo</label>
                    <Select onChange={(component)=>{setTypeSchool({...typeSchool,value:component.value, error:false})}} className="create-select" options={levelsOptionsList} />
                    {typeSchool.error ? typeSchool.message:""}
                    </div>
                    <div className="form__block">         
                    <label className="form-block__title" htmlFor="clasification" >Clasificación</label>    
                    <div className="block__checkbox--star">  
                        <input type="radio" name="star" onChange={()=>{setClasificactionSchool(5)}}   className="input__check--star star-5" id="five" value='5'  />                             
                        <label className="check__label--star" htmlFor="five" >★</label>  

                        <input type="radio" name="star" onChange={()=>{setClasificactionSchool(4)}}  className="input__check--star star-4" id="fourth" value='4'  />                             
                        <label className="check__label--star" htmlFor="fourth" >★</label>  

                        <input type="radio" name="star" onChange={()=>{setClasificactionSchool(3)}}  defaultChecked className="input__check--star star-3" id="three" value='3'  />                             
                        <label className="check__label--star" htmlFor="three" >★</label>  

                        <input type="radio" name="star" onChange={()=>{setClasificactionSchool(2)}}  className="input__check--star star-2" id="two" value='2'  />                             
                        <label className="check__label--star" htmlFor="two" >★</label>  

                        <input type="radio" name="star" onChange={()=>{setClasificactionSchool(1)}}   className="input__check--star star-1" id="one" value='1'  />                             
                        <label className="check__label--star" htmlFor="one" >★</label>  
                    </div>                        
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="clasification" >Calidez humana</label>  
                        <div className="form__block--options-calidez">
                            <div className="block__checkbox calidez">
                            <input name="radio-calidez" type="radio" onChange={()=>{setCalidezSchool({icon:"💛", value:"💛Mala", text:"Mala"}) }} className="input__check--calidez" id="mala"  />                             
                            <label className="check__label--calidez" htmlFor="mala" >
                                <p>💛</p>
                                <p>Mala</p>
                            </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-calidez" type="radio" onChange={()=>{setCalidezSchool({icon:"💖",value:"💖Buena",text:"Buena"})}} className="input__check--calidez" id="buena"  />                             
                                <label className="check__label--calidez" htmlFor="buena" >
                                <p>💖</p>
                                <p>Buena</p>
                                </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-calidez" type="radio" onChange={()=>{setCalidezSchool({icon:"💕",value:"💕Excelente",text:"Excelente"})}} className="input__check--calidez" id="excelente"  />                             
                                <label className="check__label--calidez" htmlFor="excelente" >
                                <p>💕</p>
                                <p>Excelente</p>
                                </label>  
                            </div>
                        </div>
                        {calidezSchool.error ? calidezSchool.message:""}
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="clasification" >Calidad educativa</label>  
                        <div className="form__block--options-calidez">
                            <div className="block__checkbox calidez">
                            <input name="radio-calidad" type="radio" onChange={()=>{setQualitySchool({icon:"📖",value:"📖Mala",text:"Mala"})}} className="input__check--calidez" id="calidad-mala"  />                             
                            <label className="check__label--calidez" htmlFor="calidad-mala" >
                                <p>📖</p>
                                <p>Mala</p>
                            </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-calidad" type="radio"  onChange={()=>{setQualitySchool({icon:"📗",value:"📗Buena",text:"Buena"})}} className="input__check--calidez" id="calidad-buena"  />                             
                                <label className="check__label--calidez" htmlFor="calidad-buena" >
                                <p>📗</p>
                                <p>Buena</p>
                                </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-calidad" type="radio" onChange={()=>{setQualitySchool({icon:"🤓",value:"🤓Excelente",text:"Excelente"})}} className="input__check--calidez" id="calidad-excelente" />                             
                                <label className="check__label--calidez" htmlFor="calidad-excelente" >
                                <p>🤓</p>
                                <p>Excelente</p>
                                </label>  
                            </div>
                        </div>
                        {qualitySchool.error ? qualitySchool.message:""}
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="clasification" >Precio</label>  
                        <div className="form__block--options-calidez">
                            <div className="block__checkbox calidez">
                            <input name="radio-precio" type="radio" onChange={()=>{setPriceSchool({icon:"💸",value:"💸Costoso",text:"Costoso"})}} className="input__check--calidez" id="precio-costoso"  />                             
                            <label className="check__label--calidez" htmlFor="precio-costoso" >
                                <p>💸</p>
                                <p>Costoso</p>
                            </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-precio" type="radio" onChange={()=>{setPriceSchool({icon:"💰",value:"💰Barato",text:"Barato"})}} className="input__check--calidez" id="precio-barato"  />                             
                                <label className="check__label--calidez" htmlFor="precio-barato" >
                                <p>💰</p>
                                <p>Barato</p>
                                </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-precio" type="radio"  onChange={()=>{setPriceSchool({icon:"💲",value:"💲Económico",text:"Económico"})}} className="input__check--calidez" id="precio-economico"  />                             
                                <label className="check__label--calidez" htmlFor="precio-economico" >
                                <p>💲</p>
                                <p>Económico</p>
                                </label>  
                            </div>
                        </div>
                        {priceSchool.error ? priceSchool.message:""}
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="clasification" >Como te sentiste respecto al colegio</label>  
                        <div className="form__block--options-calidez">
                            <div className="block__checkbox calidez">
                            <input name="radio-sentir" type="radio" onChange={()=>{setFeelingSchool({icon:"😤",value:"😤Muy mal",text:"Muy mal"})}} className="input__check--calidez" id="sentir-muymal"  />                             
                            <label className="check__label--calidez" htmlFor="sentir-muymal" >
                                <p>😤</p>
                                <p>Muy mal</p>
                            </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-sentir" type="radio" onChange={()=>{setFeelingSchool({icon:"😔",value:"😔Mal",text:"Mal"})}}  className="input__check--calidez" id="sentir-mal"  />                             
                                <label className="check__label--calidez" htmlFor="sentir-mal" >
                                <p>😔</p>
                                <p>Mal</p>
                                </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-sentir" type="radio" onChange={()=>{setFeelingSchool({icon:"😄",value:"😄Bien",text:"Bien"})}}  className="input__check--calidez" id="sentir-bien"  />                             
                                <label className="check__label--calidez" htmlFor="sentir-bien" >
                                <p>😄</p>
                                <p>Bien</p>
                                </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-sentir" type="radio" onChange={()=>{setFeelingSchool({icon:"😎",value:"😎Muy bien",text:"Muy bien"})}} className="input__check--calidez" id="sentir-muybien"  />                             
                                <label className="check__label--calidez" htmlFor="sentir-muybien" >
                                <p>😎</p>
                                <p>Muy bien</p>
                                </label>  
                            </div>
                        </div>
                        <p>
                        {feelingSchool.error ? feelingSchool.message:""}
                        </p>
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="clasification" >Como se siente tu hijo/a en el colegio</label>  
                        <div className="form__block--options-calidez">
                            <div className="block__checkbox calidez">
                            <input name="radio-sentirhijo" type="radio" onChange={()=>{setFeelingChildrenSchool({icon:"😤",value:"😤Muy mal",text:"Muy mal", error:false})}} className="input__check--calidez" id="sentirHijo-muymal"  />                             
                            <label className="check__label--calidez" htmlFor="sentirHijo-muymal" >
                                <p>😤</p>
                                <p>Muy mal</p>
                            </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-sentirhijo" type="radio" onChange={()=>{setFeelingChildrenSchool({icon:"😔",value:"😔Mal",text:"Mal", error:false})}}  className="input__check--calidez" id="sentirHijo-mal"  />                             
                                <label className="check__label--calidez" htmlFor="sentirHijo-mal" >
                                <p>😔</p>
                                <p>Mal</p>
                                </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-sentirhijo" type="radio" onChange={()=>{setFeelingChildrenSchool({icon:"😄",value:"😄Bien",text:"Bien", error:false})}} className="input__check--calidez" id="sentirHijo-bien"  />                             
                                <label className="check__label--calidez" htmlFor="sentirHijo-bien" >
                                <p>😄</p>
                                <p>Bien</p>
                                </label>  
                            </div>
                            <div className="block__checkbox calidez">
                                <input name="radio-sentirhijo" type="radio" onChange={()=>{setFeelingChildrenSchool({icon:"😎",value:"😎Muy bien",text:"Muy bien", error:false})}} className="input__check--calidez" id="sentirHijo-muybien"  />                             
                                <label className="check__label--calidez" htmlFor="sentirHijo-muybien" >
                                <p>😎</p>
                                <p>Muy bien</p>
                                </label>  
                            </div>
                        </div>
                        <p>
                        {feelingChildren.error ? feelingChildren.message:""}
                        </p>
                    </div>
                    <div className="content__blocks-form  pt-6">
                    <div className="form__block--btn">
                        <input className="btn rounded-md btn--primary max-w-fit h-9" type="submit" value="Publicar" />
                        <a className=" btn rounded-md btn__ghost--primary-two max-w-fit h-9">Cancelar</a>
                    </div>
                </div> 
                </div> 
            </form>
        </div>
    </div>
  )
}
