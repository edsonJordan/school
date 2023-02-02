import React, { useState,useEffect, useRef, useContext }  from "react"
import Select from 'react-select'
import { Country }  from 'country-state-city';
import axios from "axios";
import {
    GlobalStateContext,
  } from "../../context/GlobalContextProvider"
import marker_map from "../../static/svg/marker_map.svg"
import Map, { Marker,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl } from "react-map-gl";
    import "mapbox-gl/dist/mapbox-gl.css";

const  FormRegisterSchool = ()=> {
    /* Status Global */
    const stateAuth =  useContext(GlobalStateContext)

    // const [schoolToUpdate, setSchoolToUpdate]=useState(null);

    /* States of inputs */
    const [nameSchool, setNameSchool] = useState("");   
    const [typeSchool, setTypeSchool] = useState({value:null, error:false, message:"", name:""});
    
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
    
    
    
    // Items from Post to Update
    const [postToUpdate, setPostToUpdate] =useState(0)
    const [listLevelsChecked, setListLevelsChecked]=useState([])
    const [listLanguageSchool, setListLanguageSchool]=useState([])
    const [listApproachSchool, setListApproachSchool]=useState([])
    const [listActivitiesSchool, setListActivitiesSchool]=useState([])
    
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


    const languagesDefaultSchool= 
    [
        {value:"espanol: Español",id:"espanol", name:"Español", checked:false}, 
        {value:"ingles: Inglés",id:"ingles", name:"Inglés", checked:false}, 
        {value:"frances: Francés",id:"frances", name:"Francés", checked:false}, 
        {value:"aleman: Alemán",id:"aleman", name:"Alemán", checked:false}, 
        {value:"otros: Otros",id:"otros", name:"Otros", checked:false}
    ]
    const approachDefaultSchool = [
        {value:"constructivista: Contructivista",id:"constructivista: Contructivista", name:"Contructivista", checked:false}, 
        {value:"montesori: Montesori",id:"montesori", name:"Montesori", checked:false}, 
        {value:"envalores: En Valores",id:"envalores", name:"En Valores", checked:false}, 
        {value:"tecnologia: Tecnología",id:"tecnologia", name:"Tecnología", checked:false}, 
        {value:"niveleducativo: Nivel Educativo",id:"niveleducativo", name:"Nivel Educativo", checked:false}
    ]

    const activitiesDefaultSchool = [
        {value:"deporte: Deporte",id:"deporte", name:"Deporte", checked:false}, 
        {value:"baile: Baile",id:"baile", name:"Baile", checked:false}, 
        {value:"arte: Arte",id:"arte", name:"Arte", checked:false}, 
        {value:"programacion/robotica: Programación/Robotica",id:"programacion/robotica", name:"Programación/Robotica", checked:false}
    ]


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
                const levelsSchools = data.map(({id, name})=> {return {value:id, selected:false, nameSchool:name}})
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

    const getSchoolWithId =(School)=>{
        axios(`${process.env.WP_URL_REST}/wp/v2/colegio/${School}?_embed`, {
            headers:{
              'Authorization':`Bearer ${stateAuth.data.token}`,   
              "Accept": "application/json",   
            }
          })
          .then((response)=>{
            const school = response.data;
            setNameSchool(school.title.rendered)


            // Id Post To Update
            setPostToUpdate(school.id)

            school['_embedded']['wp:term'][2].length !== 0 
            ? setTypeSchool({value:school['_embedded']['wp:term'][2][0]['id'],name:school['_embedded']['wp:term'][2][0]['name'], error:false, message:""})
            : setTypeSchool({value:"",name:"", error:false, message:""})

            // Levels ARRAY
            const levelsSchool = school['_embedded']['wp:term'][1].reduce((acc,item)=>  [...acc, item.id]  ,[]);
             setListLevelsChecked(levelsSchool);
             setLevelSchool(levelsSchool)
            // Price 
            const prices = school.acf.price.split('-');
            if(prices.length === 2 
                && !Number.isNaN(parseInt(prices[0])) 
                && !Number.isNaN(parseInt(prices[1])) 
                && parseInt(prices[0]) <= (parseInt(prices[1])-200)){
                    priceMinRef.current.value =parseInt(prices[0]);
                    priceMaxRef.current.value =parseInt(prices[1]);
                };
            // Desription School
            setDescriptionSchool(school.acf.description)
            // Propuesta
            setProposalSchool(school.acf.proposal)
            // Language
            school.acf.lenguages.reduce((acc,element)=>{return [...acc, element]},[]).length > 0 
            && 
            setListLanguageSchool(school.acf.lenguages.reduce((acc,element)=>{return [...acc, element]},[]))
            setLanguagesSchool(school.acf.lenguages.reduce((acc,element)=>{return [...acc, element]},[]))
            // Approach
            setListApproachSchool(school.acf.approach)
            setApproachSchool(school.acf.approach)
            // Activities
            setListActivitiesSchool(school.acf.activities)
            setActivitiesSchool(school.acf.activities)
            // State
            // phone
            setPhone(school.acf.phone)
            // WhatsApp
            setWhatsapp(school.acf.whatsapp)
            // Email
            setMail(school.acf.Email)
            // Site Web
            setWeb(school.acf.web)
            // Facebook
            setFacebook(school.acf.web)
            // Instagram            
            setInstagram(school.acf.Instagram)


          })
          .catch((error)=>{
            console.log(error);
          })
    }
    useEffect(()=>{
        // optionLevelsSchools
        // setOptionLevelsSchool(optionLevelsSchools.map(element=>{return levelsSchool.includes(element.value) ? {...element, selected: true}: {...element}}))
        // console.log(optionLevelsSchools.map(element=>{return listLevelsChecked.includes(element.value) ? {...element, selected: true}: {...element}}));
        // console.log(listLevelsChecked);
        // console.log(optionLevelsSchools);
    },[listLevelsChecked])

    useEffect(()=>{
        // console.log(approachSchool);
    },[approachSchool])
    /* useEffect(()=>{
        console.log(typeSchool);
    },[typeSchool]) */
    useEffect(() => {
        
        // params.get("school")
        const params = new URLSearchParams(document.location.search);
        // params.get("school") !== null && setSchoolToUpdate( params.get("school"));
        getSchoolWithId(params.get("school"));

        const dataCountries = Country.getAllCountries();
        const countries = dataCountries.map(({isoCode, name})=> { return {id: isoCode , value:name, label:name}})      
        setCountries(countries.filter((element)=> element.value === "Mexico"));
        // const element = ref.rangeRef;     
        getStates() 
        getLevelsSchool();
        getTypeSchool()
        handleRanges()


       

    },[])

    useEffect(()=>{
        // console.log(activitiesSchool);
    },[activitiesSchool])


      
      
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
                "photos3": idFacadeImage, 
                "photos4": idOthersImage,               
          }
        };
          
        return axios.post(`${process.env.WP_URL_REST}/wp/v2/colegio/${postToUpdate}`, 
                JSON.stringify(data),{headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${stateAuth.data.token}` 
                    }
                }).then((response)=>{
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
    /* const clearSelectStates = () => {
        stateRef.current.setValue("")
    }; */
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
                        {
                            typeSchool.value !== null && <Select defaultValue={{value:typeSchool.value, label:typeSchool.name}} className="create-select" onChange={(data)=>setTypeSchool({value:data.value, error:false, message:""})} 
                            options={optionTypeSchools}/>     
                        }                            
                        {
                            typeSchool.error && <p>{typeSchool.message}</p>
                        }           
                    </div>
                    <div className="form__block form__block--checkboxs">  
                        <label className="form-block__title" htmlFor="name" >Niveles</label> 
                        {
                            optionLevelsSchools.length !== 0 && listLevelsChecked.length !== 0  ? 
                            optionLevelsSchools
                            .map(element=> {
                                return listLevelsChecked.includes(element.value) ? {...element, selected: true}: {...element}
                            })
                            .map((element,index)=>{                                
                                return (
                                    <div key={index} className="block__checkbox">
                                        <input type="checkbox" defaultChecked={element.selected} className="input__check" id={index} value={element.value}  onChange={levelItems}/>                              
                                        <label htmlFor={index} className="check__label" >{element.nameSchool} </label>  
                                    </div>
                                )
                            }):
                            "cargando"
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
                        {
                            // list
                            listLanguageSchool.length > 0 ?
                            languagesDefaultSchool.map((element)=>{
                                return listLanguageSchool.includes(element.value) ? {...element, checked:true}:{...element}
                            }).map((element, index)=>{
                                return (
                                    <div key={index+"language"} className="block__checkbox"> 
                                        <input 
                                        type="checkbox"  
                                        defaultChecked={element.checked} 
                                        className="input__check" 
                                        id={element.id} 
                                        value={element.value} 
                                        onClick={lenguagesItems}/>                            
                                        <label className="check__label" htmlFor={element.id} >{element.name}</label> 
                                    </div>
                                )
                            })
                            :
                            languagesDefaultSchool.map((element, index)=>{
                                return (
                                    <div key={index+"language"} className="block__checkbox"> 
                                        <input type="checkbox" 
                                        className="input__check" 
                                        id={element.id} 
                                        value={element.value} 
                                        onClick={lenguagesItems}/>                            
                                        <label className="check__label" htmlFor={element.id} >{element.name}</label> 
                                    </div>
                                )
                            })
                        }                        
                    </div>
                    <div className="form__block form__block--checkboxs">
                        <p className="form-block__title">Enfoque</p>
                        {
                            listApproachSchool.length > 0 ?
                            approachDefaultSchool.map((element)=>{
                                return listApproachSchool.includes(element.value) ? {...element, checked:true}:{...element}
                            }).map((element, index)=>{
                                return (
                                    <div key={index+"-enfoque"} className="block__checkbox"> 
                                        <input 
                                        type="checkbox"                                          
                                        name="approach[]"
                                        defaultChecked={element.checked} 
                                        className="input__check" 
                                        id={element.id} 
                                        value={element.value} 
                                        onClick={approachItems}/>                            
                                        <label className="check__label" htmlFor={element.id} >{element.name}</label> 
                                    </div>
                                )
                            })
                            :
                            approachDefaultSchool.map((element, index)=>{
                                return (
                                    <div key={index+"-enfoque"} className="block__checkbox"> 
                                        <input 
                                        type="checkbox"  
                                        name="approach[]"
                                        className="input__check" 
                                        id={element.id} 
                                        value={element.value} 
                                        onClick={approachItems}/>                            
                                        <label className="check__label" htmlFor={element.id} >{element.name}</label> 
                                    </div>
                                )
                            })
                        }
                                       
                    </div>
                    <div className="form__block form__block--checkboxs">
                        <p className="form-block__title"> Actividades extras </p>
                        {
                            listActivitiesSchool.length > 0 ?
                            activitiesDefaultSchool.map((element)=>{
                                return listActivitiesSchool.includes(element.value) ? {...element, checked:true}:{...element}
                            }).map((element, index)=>{
                                return (
                                    <div key={index+"-activities"} className="block__checkbox"> 
                                        <input 
                                        type="checkbox"   
                                        defaultChecked={element.checked} 
                                        className="input__check" 
                                        id={element.id} 
                                        value={element.value} 
                                        onClick={activitesItems}/>                            
                                        <label className="check__label" htmlFor={element.id} >{element.name}</label> 
                                    </div>
                                )
                            })
                            :
                            activitiesDefaultSchool.map((element, index)=>{
                                return (
                                    <div key={index+"-activities"} className="block__checkbox"> 
                                        <input 
                                        type="checkbox"  
                                        className="input__check" 
                                        id={element.id} 
                                        value={element.value} 
                                        onClick={activitesItems}/>                            
                                        <label className="check__label" htmlFor={element.id} >{element.name}</label> 
                                    </div>
                                )
                            })
                        }

                       {/*  <div className="block__checkbox">
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
                        </div> */}
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
                            pickState.error && <p>{pickState.message}</p>
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
                                <img alt="" src={marker_map}>
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
                              <img alt="" className=" object-contain" src={ imagesForm.thumbnail.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                      
                        </label>
                        <input ref={thumbnailUpload}  type="file"   className="input__thumbnail" name="thumbnail" id="thumbnail"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.thumbnail.error && <p>{imagesForm.thumbnail.message}</p>
                        }
                    </div>
                    <div className="form__block">
                        <p className="form-block__title"> Fachada</p>
                        <label className="block__thumbnail overflow-hidden" htmlFor="facade">
                        {
                              imagesForm.facade.path !== null ?
                              <img alt="" className=" object-contain" src={ imagesForm.facade.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                              
                        </label>
                        <input ref={facadeUpload} type="file" className="input__thumbnail" name="facade" id="facade"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.facade.error && <p>{imagesForm.facade.message}</p>
                        }
                    </div>
                    <div className="form__block">
                        <p className="form-block__title"> Instalaciones</p>
                        <label className="block__thumbnail overflow-hidden" htmlFor="instalation">
                            {
                              imagesForm.instalation.path !== null ?
                              <img alt="" className=" object-contain" src={ imagesForm.instalation.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                             
                        </label>
                        <input ref={instalationUpload}  type="file" className="input__thumbnail" name="instalation" id="instalation"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.instalation.error && <p>{imagesForm.instalation.message}</p>
                        }
                    </div>
                    <div className="form__block">
                        <p className="form-block__title"> Otros</p>
                        <label className="block__thumbnail overflow-hidden" htmlFor="others">
                            {
                              imagesForm.others.path !== null ?
                              <img alt="" className=" object-contain" src={ imagesForm.others.path} />  
                              :
                              <>
                                <p className="title__thumbnail">Cargar fotos</p>
                                <p className="body__thumbnail">Solo formatos JPG o PNG</p>                             
                              </>
                            }                            
                        </label>
                        <input ref={othersUpload} type="file" className="input__thumbnail" name="others" id="others"  accept="image/*"onChange={handleImagesForm}  />
                        {
                            imagesForm.others.error  && <p>{imagesForm.others.message}</p>
                        }
                    </div>
                </div>
                <div className="content__blocks-form  pt-6">
                    <div className="form__block--btn">
                        <input className="btn rounded-md btn--primary max-w-fit h-9" type="submit" value="Editar Colegio" />
                        <a className=" btn rounded-md btn__ghost--primary-two max-w-fit h-9 ">Cancelar</a>
                    </div>
                </div>     
            </form>
        </section>
  )
}
export default FormRegisterSchool

