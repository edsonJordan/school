import React, { useState,useEffect, useRef, useContext }  from "react"
import Select from 'react-select'
import { Country, State }  from 'country-state-city';
import axios from "axios";
import {
    GlobalDispatchContext,
    GlobalStateContext,
  } from "../../context/GlobalContextProvider"
import marker_map from "../../static/svg/marker_map.svg"
import Map, { Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl } from "react-map-gl";
    import "mapbox-gl/dist/mapbox-gl.css";

const  FormRegisterSchool = ()=> {
    /* Status Global */
    const stateAuth =  useContext(GlobalStateContext)
    const dispatch =  useContext(GlobalDispatchContext)

     /* States of inputs */
     const [nameSchool, setNameSchool] = useState("");     
     const [typeSchool, setTypeSchool] = useState({value:null, error:false, message:""});
     const [stateSubmit, setStateSubmit] = useState('inicial')
     const [price, setPrice] = useState(0);
     const [levelSchool, setLevelSchool] = useState([]);
     const [descriptionSchool, setDescriptionSchool] = useState("");
     const [proposalSchool, setProposalSchool] = useState("");
     const [languagesSchool, setLanguagesSchool] = useState([]);
     const [approachSchool, setApproachSchool]= useState([]);
     const [activitiesSchool, setActivitiesSchool]=useState([]);
     const [pickContry, setPickContry] = useState("MX");
     const [phone, setPhone] = useState("");
     const [whatsapp, setWhatsapp] = useState("");
     const [mail, setMail] = useState("");
     const [web, setWeb] = useState("");
     const [facebook, setFacebook] = useState("");
     const [instagram, setInstagram] = useState("");
     const [direction, setDirection] = useState("");


    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [pickState, setPickState] = useState({value:null,error:true,message:null});
    const [ubicationMap, setUbicationMap]=useState({long:-102.29590886896455, lat:21.879754634078353})
    const [optionLevelsSchools, setOptionLevelsSchool]=useState([]);
    const [optionTypeSchools, setOptionTypeSchools]=useState([])


    /* Images */
    const [imagesForm, setImagesForm]=useState({
        thumbnail:{path:null, error:false,message:null},
        facade:{path:null, error:false,message:null},
        instalation:{path:null, error:false,message:null}, 
        others:{path:null, error:false,message:null}});
    const [imagesUpload, setImagesUpload]=useState({thumbnail:null,facade:null,instalation:null,others:null})

    const stateRef      = useRef();
    const priceMinRef   = useRef();
    const priceMaxRef   = useRef();


    const thumbnailUpload   =   useRef(null);
    const facadeUpload      =   useRef(null);
    const instalationUpload =   useRef(null);
    const othersUpload      =   useRef(null);

    const getStates = () =>{
        fetch(`${process.env.WP_URL_REST}/wp/v2/states?per_page=100`,{
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(response => response.json())
          .then(
            (data) => {
                const states = data.map(({id, name})=> {return {value:id, label:name}})
                setStates(states);
                // console.log(data);
            } 
          )
          .catch((error)=>console.log(error));
    }
    const getTypeSchool = () =>{
        fetch(`${process.env.WP_URL_REST}/wp/v2/typeschool?per_page=100`,{
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(response => response.json())
          .then(
            (data) => {
               
                setOptionTypeSchools(data.map(({id, name})=> {return {value:id, label:name}} ));
                    // público: Público", label:"Público"
            } 
          )
          .catch((error)=>console.log(error));
    }
    const getLevelsSchool =()=>{
        fetch(`${process.env.WP_URL_REST}/wp/v2/levels?per_page=100`,{
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(response => response.json())
          .then(
            (data) => {
                const levelsSchools = data.map(({id, name})=> {return {value:id, nameSchool:name}})
                setOptionLevelsSchool(levelsSchools);
                // console.log(data);
            } 
          )
          .catch((error)=>console.log(error));
    }
    const handleRanges=()=>{
        const rangeInput = document.querySelectorAll(".range-input input"),
        priceInput = document.querySelectorAll(".price-input input"),
        range = document.querySelector(".slider .progress");
        let priceGap = 200;
        priceInput.forEach(input =>{
            input.addEventListener("input", e =>{
                let minPrice = parseInt(priceInput[0].value),
                maxPrice = parseInt(priceInput[1].value);                
                if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
                    if(e.target.className === "input-min"){
                        rangeInput[0].value = minPrice;
                        range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
                    }else{
                        rangeInput[1].value = maxPrice;
                        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                    }
                }
            });
        });
        rangeInput.forEach(input =>{
            input.addEventListener("input", e =>{
                let minVal = parseInt(rangeInput[0].value),
                maxVal = parseInt(rangeInput[1].value);
                if((maxVal - minVal) < priceGap){
                    if(e.target.className === "range-min"){
                        rangeInput[0].value = maxVal - priceGap
                    }else{
                        rangeInput[1].value = minVal + priceGap;
                    }
                }else{
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
                    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                }
            });
        });
    }
    useEffect(() => {
        // console.log(State.getStatesOfCountry())
        // setStateSubmit('inicial')
        const dataCountries = Country.getAllCountries();
        const countries = dataCountries.map(({isoCode, name})=> { return {id: isoCode , value:name, label:name}})      
        setCountries(countries.filter((element)=> element.value === "Mexico"));
        // const element = ref.rangeRef;     
        getStates() 
        getLevelsSchool();
        getTypeSchool()
        handleRanges()
    },[])
    const handlePointerMap =(e)=>{
        // console.log(e.lngLat.lat);
        setUbicationMap({long:e.lngLat.lng, lat:e.lngLat.lat})
    }   
    const handleImagesForm=({target})=>{
        if(target.files[0] === undefined) {
            setImagesForm({...imagesForm, [target.name]: {path:null,message:null}})
            return false;
        }
        // console.log(e.target.files[0]);
        setImagesForm({...imagesForm, [target.name]: {path:URL.createObjectURL(target.files[0]), message:null} })
        // console.log({...imagesForm, [target.name]: URL.createObjectURL(target.files[0]) });
    }
    /* useEffect(()=>{
       console.log(ubicationMap);    
    },[ubicationMap]) */

    const uploadMedia = async (formMedia)=>{
        return await axios.post(`${process.env.WP_URL_REST}/wp/v2/media`,formMedia,
            { headers: {
                    //   'Content-Disposition':'attachment; filename="file.jpg"',
                    'Content-Disposition':'form-data; filename="file.jpg"',
                    'Authorization':`Bearer ${stateAuth.data.token}`,   
                    "Content-Type": "image/jpg",
                    "Accept": "application/json",   
                    }
            }         
                    )
                    .then(res => {
                        return res.data.id
        })
                    .catch(err => {
                        console.log(err);
        });
    }


    const handleErrorImages=(objectImages, statusImageForm)=>{
        let statusImagesForm = statusImageForm
        for (const [keyObjectImages, valueObjectImages] of Object.entries(objectImages)) {
            if(valueObjectImages.path === null){                
                statusImagesForm = {...statusImagesForm, [keyObjectImages]:{...valueObjectImages,path:null,error:true,message:"Porfavor completa este campo"}}
            }else{              
                statusImagesForm = {...statusImagesForm, [keyObjectImages]:{...valueObjectImages,path:valueObjectImages.path, error:false,message:null}}
            }          
          }
        setImagesForm(statusImagesForm)
    }
    const handleSelectState=(pickSelectState)=>{
        setPickState({value:pickSelectState.value,error:false,message:null})
    }

    const handleSubmitRest = async (e) =>{
        e.preventDefault()
        // Name     School      /  nameSchool *
        // type     School      /  typeSchool *
        // levels School        /  levelSchool *
        // Price min School     /  priceMinRef.current.value *
        // Price min School     /  priceMaxRef.current.value *
        // Description School   /  descriptionSchool *
        // proposal    School   /  proposalSchool * 
        // lenguages   School   /  languagesSchool
        // approach     School  /  approachSchool
        // activities   School  /  activitiesSchool
        // country      School  /  Country
        // state        School  /  pickState.value
        // console.log(languagesSchool);
        
        if(!stateAuth.isLogin) return false;
        if(typeSchool.value === null) setTypeSchool({...typeSchool, error:true, message:"Ingrese un tipo"})
        if(pickState.error) setPickState({value:null,error:true,message:"Debes ingresar un estado"})
        if(imagesForm.thumbnail.path === null || imagesForm.instalation.path  === null || imagesForm.facade.path  ===null || imagesForm.others.path  ===null){
            handleErrorImages(imagesForm, imagesForm)
            return false;
        }
        setStateSubmit('cargando')
       





        let formDataThumbnail = new FormData()
        let fileThumbnail = thumbnailUpload.current.files[0];
        formDataThumbnail.append( 'file', fileThumbnail );
        formDataThumbnail.append( 'title', fileThumbnail.name ); 

        
        let formInstalation = new FormData();
        let fileInstalation= instalationUpload.current.files[0];
        formInstalation.append( 'file', fileInstalation );
        formInstalation.append( 'title', fileInstalation.name );          

        let formFacade = new FormData();
        let fileFacade= facadeUpload.current.files[0];
        formFacade.append( 'file', fileFacade );
        formFacade.append( 'title', fileFacade.name );  
        
        let formOthers = new FormData();
        let fileOthers= othersUpload.current.files[0];
        formOthers.append( 'file', fileOthers );
        formOthers.append( 'title', fileOthers.name );  
        
        const idThumbnailImage = await uploadMedia(formDataThumbnail);
        const idInstalataionImage = await uploadMedia(formInstalation);
        const idFacadeImage = await uploadMedia(formFacade);
        const idOthersImage = await uploadMedia(formOthers);

        if(idThumbnailImage === null || idInstalataionImage ===null , idFacadeImage=== null, idOthersImage ===null ){
            return "Error";
        }

        const data = {
            "title": nameSchool,
            "status":"publish",
            "states": pickState.value,
            "levels":levelSchool,
            "typeSchool":typeSchool.value,
            "acf": {
                "price":20,
                "price": priceMinRef.current.value+ " "+ priceMaxRef.current.value,
                "description": descriptionSchool,
                "proporsal": proposalSchool,
                "lenguages":languagesSchool,
                "activities": activitiesSchool,
                "approach": approachSchool,
                "direction":direction,
                "longitude":String(ubicationMap.long),
                "latitude":String(ubicationMap.lat),
                "phone": phone,
                "whatsapp": whatsapp,
                "Email": mail,
                "web": web,
                "facebook": facebook,
                "Instagram": instagram,
                "photos1": idThumbnailImage,
                "photos2": idInstalataionImage,
                "photos3": idFacadeImage                
          }
        };
          
        return axios.post(`${process.env.WP_URL_REST}/wp/v2/colegio`, 
                JSON.stringify(data)
                ,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${stateAuth.data.token}` 
                    }
                }).then((response)=>{
                    setStateSubmit('terminado')
                    window.location.reload(false);
                }).catch((error)=>{
                    console.log(error);
                });                  
    }
   
    const setContry = (contry) =>{
        // const dataStates = State.getStatesOfCountry(data.id);
        setPickContry(contry.id)  
        /* const states = dataStates.map(({name})=> {return {value:name, label:name}})
        setStates(states)       
        clearSelectStates() */
    }     
    const clearSelectStates = () => {
        stateRef.current.setValue("")
    };
    const levelItems = (event)=>{
        let { value, checked } = event.target;         
        checked  ? setLevelSchool([...levelSchool, parseInt(value)]) : setLevelSchool(levelSchool.filter((element)=>element !== parseInt(value)))
    }
    const lenguagesItems = (event)=>{
        const { value, checked } = event.target;
        checked ? setLanguagesSchool([...languagesSchool, value]) : setLanguagesSchool(languagesSchool.filter((element)=>element !== value))           
    }
    const approachItems = (event)=>{
        const { value, checked } = event.target;   
        checked ?  setApproachSchool([...approachSchool, value]) : setApproachSchool(approachSchool.filter((element)=>element !== value))   
    }
    const activitesItems = (event)=>{
        const {value, checked}=event.target;
        checked ? setActivitiesSchool([...activitiesSchool, value]):setActivitiesSchool(activitiesSchool.filter((element)=>element!==value))
        
    }
    const imageItems = (e)=>{
        // const { value, checked } = ;             
        /* if(e.target.files.length > 3) { 
            e.preventDefault() 
            return 
        } */        

        // if (checked) return setApproach([...approach, value])       
        // setApproach(approach.filter((element)=>element !== value))
    }


  return (    
        <section className="section section--school-adding pb-14">
                    <h2 className="title--h6 section">
                    Información general
                    </h2>
            <form onSubmit={handleSubmitRest} className="section__form-school form" >    
                <div className="content__blocks-form">
                    <div className="form__block">         
                        <label className="form-block__title" htmlFor="name" >Nombre</label>
                        <input className="input__text" onChange={(e)=>setNameSchool(e.target.value)} value={nameSchool} type="text" id='name'/>
                    </div>        
                    <div className="form__block">   
                        <label className="form-block__title" htmlFor="name" >Tipo</label>
                        {/* 
                        privado: Privado
                        público: Público
                        */}
                        <Select className="create-select" onChange={(data)=>setTypeSchool({value:data.value, error:false, message:""})} 
                        options={optionTypeSchools}/>         
                        {
                            typeSchool.error && <p className="text-global-danger-500" >{typeSchool.message}</p>
                        }           
                    </div>
                    <div className="form__block form__block--checkboxs">  
                        <label className="form-block__title" htmlFor="name" >Niveles</label> 
                        {
                            optionLevelsSchools.map((element,index)=>{
                                return (
                                    <div key={index} className="block__checkbox">
                                        <input type="checkbox" className="input__check" id={index} value={element.value}  onChange={levelItems}/>                              
                                        <label htmlFor={index} className="check__label" >{element.nameSchool} </label>  
                                    </div>
                                )
                            })
                        }
                        {/* <div className="block__checkbox">
                            <input type="checkbox" className="input__check" id='maternal' value="maternal: Maternal"  onChange={levelItems}/>                              
                            <label htmlFor="maternal" className="check__label" >Maternal</label>  
                        </div> */}                        
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="price" >Rango de precio</label>
                        <div className="contain__slider-price">
                            <div className="price-input">
                                <div className="field">
                                    <input ref={priceMinRef} type="number" className="input-min" defaultValue="2500"/>
                                </div>                                
                            </div>
                            <div className="slider__content-price">
                                <div className="slider">
                                    <div className="progress"></div>
                                </div>
                                <div className="range-input">
                                    <input type="range" className="range-min" min="0" max="10000" defaultValue="2500" step="50"/>
                                    <input type="range" className="range-max" min="0" max="10000" defaultValue="7500" step="50"/>
                                </div>
                            </div>
                            <div className="price-input">                                
                                <div className="field">
                                <input ref={priceMaxRef} type="number" className="input-max" defaultValue="7500"/>
                                </div>
                            </div>
                        </div>          
                    </div>
                    <div className="form__block">    
                        <label className="form-block__title" htmlFor="description" >Descripción</label>    
                        <textarea id="description" onChange={(e)=>setDescriptionSchool(e.target.value)} value={descriptionSchool}/>                   
                    </div>
                    <div className="form__block">    
                        <label className="form-block__title" htmlFor="propuesta" >Propuesta</label> 
                        <textarea id="propuesta" onChange={(e)=>setProposalSchool(e.target.value)} value={proposalSchool}/>                    
                    </div>
                </div>  
                              
                <p className="title--h6 section">Información avanzada</p>
                <div className="content__blocks-form">                     
                    <p className="form-block__title">Idiomas</p>  
                    <div className="form__block form__block--checkboxs">
                    <div className="block__checkbox">                     
                            <input type="checkbox" className="input__check" id="spanish" value='espanol: Español' onChange={lenguagesItems}/>                             
                            <label className="check__label" htmlFor="spanish" >Español</label>  
                        </div>
                        <div className="block__checkbox">  
                            <input type="checkbox" className="input__check" id="ingles" value='ingles: Inglés' onChange={lenguagesItems}/>                             
                            <label className="check__label" htmlFor="ingles" >Inglés</label>  
                        </div>
                        <div className="block__checkbox">                         
                            <input id="frances" className="input__check" type="checkbox" value='frances: Francés'  onChange={lenguagesItems}/> 
                            <label className="check__label" htmlFor="frances" >Francés</label>  
                        </div>
                        <div className="block__checkbox">                         
                            <input id="aleman" className="input__check" type="checkbox" value='aleman: Alemán'  onChange={lenguagesItems}/> 
                            <label className="check__label"   htmlFor="aleman" >Alemán</label>  
                        </div>
                        <div className="block__checkbox">                         
                            <input id="otros"  className="input__check" type="checkbox" value='otros: Otros'  onChange={lenguagesItems}/> 
                            <label className="check__label"  htmlFor="otros" >Otros</label>  
                        </div>
                    </div>
                    <div className="form__block form__block--checkboxs">
                        <p className="form-block__title">Enfoque</p>
                        <div className="block__checkbox">                  
                            <input type="checkbox" className="input__check" id='constructivista' name="approach[]" value="constructivista: Contructivista" onChange={approachItems}/>
                            <label className="check__label" htmlFor="constructivista" >Constructivista</label>  
                        </div> 
                        <div className="block__checkbox">                
                            <input type="checkbox" className="input__check" id='montesori'  name="approach[]" value="montesori: Montesori" onChange={approachItems}/> 
                            <label className="check__label" htmlFor="montesori" >Montesori</label>  
                        </div>   
                        <div className="block__checkbox">             
                            <input type="checkbox" className="input__check" id='enValores'  name="approach[]" value="envalores: En Valores" onChange={approachItems}/>      
                            <label className="check__label" htmlFor="enValores" >En valores</label>  
                        </div>  
                        <div className="block__checkbox">                   
                            <input type="checkbox" className="input__check" id='tecnologia'  name="approach[]" value="tecnologia: Tecnología" onChange={approachItems}/>      
                            <label className="check__label" htmlFor="tecnologia" >Tecnología</label>  
                        </div>
                        <div className="block__checkbox">                     
                            <input type="checkbox" className="input__check" id='nivelEducativo'  name="approach[]" value="niveleducativo: Nivel Educativo" onChange={approachItems}/>      
                            <label className="check__label" htmlFor="nivelEducativo" >Nivel Educativo</label>  
                        </div>                    
                    </div>
                    <div className="form__block form__block--checkboxs">
                        <p className="form-block__title"> Actividades extras </p>
                        <div className="block__checkbox">
                            <input type="checkbox" className="input__check" id="deportes" value="deporte: Deporte" onChange={activitesItems}/>
                            <label className=" check__label" htmlFor="deportes" >Deporte</label>  
                        </div>

                        <div className="block__checkbox">
                            <input type="checkbox" className="input__check" id="baile"  value="baile: Baile"  onChange={activitesItems}/> 
                            <label className=" check__label" htmlFor="baile" >Baile</label>  
                        </div>

                        <div className="block__checkbox">
                            <input type="checkbox" className="input__check" id="arte" value="arte: Arte"  onChange={activitesItems}/>      
                            <label className=" check__label" htmlFor="arte" >Arte</label>  
                        </div>
                        <div className="block__checkbox">
                            <input type="checkbox" className="input__check" id="programacion"  value="programacion/robotica: Programación/Robotica"  onChange={activitesItems}/>       
                            <label className=" check__label" htmlFor="programacion" >Programación/Robótica</label>  
                        </div>
                    </div>
                </div>
                <p className="title--h6 section">Ubicación</p> 
                <div className="content__blocks-form">      
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="country" >Pais</label>
                        <Select id="country"  onChange={(data)=>setContry(data)} defaultValue={{ label: "Mexico", value: "MX" }}  options={countries} />
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="states" >Estado</label>
                        <Select id="states" onChange={(data)=>handleSelectState(data)} defaultValue=""  ref={stateRef} options={states}  />
                        {
                            pickState.error && <p className="text-global-danger-500" >{pickState.message}</p>
                        }
                    </div>     
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="direction" >Dirección</label>
                        <input className="input__text" onChange={(e)=>setDirection(e.target.value)} value={direction} type="text" id='direction'/>                    
                    </div>
                    <div className="form__block h-48 z-0">
                    <Map  onClick={handlePointerMap}
                            mapboxAccessToken={process.env.API_MAPBOX_TOKEN}
                            initialViewState={{
                                longitude: ubicationMap.long,
                                latitude: ubicationMap.lat,
                                zoom: 10,
                            }}
                        mapStyle="mapbox://styles/mapbox/streets-v11">
                        <GeolocateControl position="top-left" />
                            <FullscreenControl position="top-left" />
                            <NavigationControl position="top-left" />
                            <ScaleControl />
                            <Marker 
                                className="marker-map"
                                style={{backgroundImage :``, backgroundSize :'100%', width :"30px", height:"30px"}}
                                icon="../../static/svg/marker_map.svg"
                                key={`marker-ubication`}
                                longitude={ubicationMap.long}
                                latitude={ubicationMap.lat}
                                anchor="bottom"
                                >    
                                <img src={marker_map}>
                                </img>
                                
                                </Marker>
                    </Map>
                    </div>   
                </div> 
                <p className="title--h6 section">Contacto</p> 
                <div className="content__blocks-form">
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="phone" >Teléfono</label>
                        <input className="input__text" onChange={(e)=>setPhone(e.target.value)} id="phone" value={phone} type="phone" />
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="whatsapp" >Whatsapp</label>
                        <input className="input__text" id="whatsapp" onChange={(e)=>setWhatsapp(e.target.value)} value={whatsapp} type="phone" />                        
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="email" >Email</label>
                        <input  className="input__text" onChange={(e)=>setMail(e.target.value)} value={mail} id="email" type="email" />                                            
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="web" >Sitio Web</label>
                        <input className="input__text"  onChange={(e)=>setWeb(e.target.value)} id="web" value={web} type="url" />                                                               
                    </div>
                </div> 
                <p className="title--h6 section">Redes</p> 
                <div className="content__blocks-form">
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="phone" >Facebook</label>
                        <input className="input__text" onChange={(e)=>setFacebook(e.target.value)}  value={facebook} type="text" />
                       
                    </div>
                    <div className="form__block">
                        <label className="form-block__title" htmlFor="whatsapp" >Instagram</label>
                        <input className="input__text" onChange={(e)=>setInstagram(e.target.value)} value={instagram} type="text" />                                           
                    </div>
                </div>  
                <p className="title--h6 section">Multimedia</p> 
                <div className="content__blocks-form">
                    <p className="block__title">Cargar fotografias del instituto</p>                    
                    <div className="form__block">
                        <p className="form-block__title" >Thumbnail</p>
                        {/* backgroundImage:imagesForm.thumbnail */}
                        <label  className=" block__thumbnail overflow-hidden" style={{backgroundImage:imagesForm.thumbnail !== null ? "" : imagesForm.thumbnail }} htmlFor="thumbnail">
                            {
                              imagesForm.thumbnail.path !== null ?
                              <img className=" object-contain" src={ imagesForm.thumbnail.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                      
                        </label>
                        <input ref={thumbnailUpload}  type="file"   className="input__thumbnail" name="thumbnail" id="thumbnail"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.thumbnail.error && <p className="text-global-danger-500" >{imagesForm.thumbnail.message}</p>
                        }
                    </div>
                    <div className="form__block">
                        <p className="form-block__title"> Fachada</p>
                        <label className="block__thumbnail overflow-hidden" htmlFor="facade">
                        {
                              imagesForm.facade.path !== null ?
                              <img className=" object-contain" src={ imagesForm.facade.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                              
                        </label>
                        <input ref={facadeUpload} type="file" className="input__thumbnail" name="facade" id="facade"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.facade.error && <p className="text-global-danger-500" >{imagesForm.facade.message}</p>
                        }
                    </div>
                    <div className="form__block">
                        <p className="form-block__title"> Instalaciones</p>
                        <label className="block__thumbnail overflow-hidden" htmlFor="instalation">
                            {
                              imagesForm.instalation.path !== null ?
                              <img className=" object-contain" src={ imagesForm.instalation.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                             
                        </label>
                        <input ref={instalationUpload}  type="file" className="input__thumbnail" name="instalation" id="instalation"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.instalation.error && <p className="text-global-danger-500" >{imagesForm.instalation.message}</p>
                        }
                    </div>
                    <div className="form__block">
                        <p className="form-block__title"> Otros</p>
                        <label className="block__thumbnail overflow-hidden" htmlFor="others">
                            {
                              imagesForm.others.path !== null ?
                              <img className=" object-contain" src={ imagesForm.others.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                            
                        </label>
                        <input ref={othersUpload} type="file" className="input__thumbnail" name="others" id="others"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.others.error  && <p className="text-global-danger-500" >{imagesForm.others.message}</p>
                        }
                    </div>
                </div>
                <div className="content__blocks-form  pt-6">
                    <div className="form__block--btn">
                       
                    {(stateSubmit === 'inicial' || stateSubmit === 'terminado') && (
                            <>
                            <input className="btn rounded-md btn--primary max-w-fit h-9" type="submit" value="Agregar" />
                            <a className=" btn rounded-md btn__ghost--primary-two max-w-fit h-9 ">Cancelar</a>
                            </>
                        )}
                    {stateSubmit === 'cargando' && (
                            <>
                            <input disabled={true} className="btn rounded-md btn--primary max-w-fit h-9" type="submit" value="Cargando..." />
                            <a className=" btn rounded-md btn__ghost--primary-two max-w-fit h-9 ">Cancelar</a>
                            </>
                        )}
                       
                    </div>
                </div>     
            </form>
        </section>
  )
}
export default FormRegisterSchool

