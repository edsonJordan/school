import React, {useState, useEffect} from 'react'
import { StaticImage } from "gatsby-plugin-image"
import "react-multi-carousel/lib/styles.css";
import GlobalContextProvider from "../../context/GlobalContextProvider"
import Select from 'react-select'
import {SliderHorizontal} from '../sliders';
import {  State }  from 'country-state-city';
import { Link, useStaticQuery } from 'gatsby'
import { graphql } from 'gatsby'



export default function FindSchool({data}) {

    const [states, setStates] = useState([]);
    const [types, setTypes]= useState([])
    const [levels, setLevels]=useState([])
    const [linkToSeach, setLinkToSearch] = useState("/");
    const [ubicationUser, setUbicationUser]=useState(null);


    const {allWpStateSchool, allWpLevelsSchool, allWpTypeSchool}= useStaticQuery(graphql`
    query ($limit: Int = 100) {
        allWpStateSchool(limit: $limit) {
          nodes {
            databaseId
            name
            slug
            description
          }
        }
  			allWpTypeSchool(limit: $limit) {
            nodes {
              name
              slug
              databaseId
              description
            }
          }
        allWpLevelsSchool(limit: $limit) {
            nodes {
              name
              slug
              databaseId
              description
            }
          }
      }
  `);

  const optionsUbication = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  
  function errorUbication(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  function successUbication(pos) {
    const crd = pos.coords;
    setUbicationUser({lat:crd.latitude,long:crd.longitude})
  }
  useEffect(()=>{
    // console.log(ubicationUser);
  },[ubicationUser])

    const [paramsSearchSchool, setParamsSearchSchool] = 
    useState(
        {
            state:{
                value: null
            },
            level:{
                value: null
            },
            type:{
                value: null
            }
        }
        )
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

    const getUbicationFromUser =()=>{
        navigator.geolocation.getCurrentPosition(successUbication, errorUbication, optionsUbication);
    }
    useEffect(() => {
        // console.log(State.getStatesOfCountry())
        const dataStates = State.getStatesOfCountry('MX'); 
        // const states = dataStates.map(({name})=> {return {field:"state" ,value:name, label:name}})
        const typeList = allWpTypeSchool.nodes.map(element=>({field:"type", value:element.databaseId,label:element.name, name:element.slug, description:element.description})) ;
        typeList.unshift({field:"type" ,value:null, label:"Seleccione un tipo" , name:"", description:""})

        setTypes(typeList)
        // setTypes(allWpTypeSchool.nodes.map(element=>({field:"type", value:element.databaseId,label:element.name, name:element.slug, description:element.description})) )

        const levelList = allWpLevelsSchool.nodes.map(element=>({field:"level", value:element.databaseId,label:element.name, name:element.slug, description:element.description}));
        levelList.unshift({field:"level" ,value:null, label:"Seleccione un tipo" , name:"", description:""})
        setLevels(levelList)
        // setLevels(allWpLevelsSchool.nodes.map(element=>({field:"level", value:element.databaseId,label:element.name, name:element.slug, description:element.description})) )
        /* setStates(allWpStateSchool.nodes
            .map((school)=> 
            { 
                return {field:"state" ,value:school.databaseId, label:school.name, name:school.slug, description:school.description}} 
                )
            );   */
            
        const statesList = allWpStateSchool.nodes.map((school)=>  {return {field:"state" ,value:school.databaseId, label:school.name, name:school.slug, description:school.description}})
        statesList.unshift({field:"state" ,value:null, label:"Seleccione el estado" , name:"", description:""})
        setStates(statesList)



        inititalParamsSearchLocalStorage();
        getUbicationFromUser()


        // console.log(allWpLevelsSchool);
    },[])
    const inititalParamsSearchLocalStorage = () =>{
        const paramsLocalStorage = typeof window !== "undefined" && JSON.parse(localStorage.getItem('searchSchool'))
        paramsLocalStorage === null && localStorage.setItem('searchSchool', JSON.stringify({isSearching:false, state:{value: null},level:{value: null},type:{value: null}} ))
        paramsLocalStorage === null ? setParamsSearchSchool(({isSearching:false, state:{value: null},level:{value: null},type:{value: null}} )):setParamsSearchSchool(paramsLocalStorage);
        
    }

    const handleParamToSeach=(params)=>{
        // console.log(params);
        setParamsSearchSchool({
            ...paramsSearchSchool, 
            [params.field]:{
                value:params.value,
                label:params.label,
                description:params.description,
                name:params.name
            },
            isSearching:true        

        })
    }

    useEffect(()=>{
        typeof window !== "undefined" && localStorage.setItem('searchSchool', JSON.stringify(paramsSearchSchool))
    },[paramsSearchSchool])
    /* 
    const dataStates = State.getStatesOfCountry(data.id);        
        const states = dataStates.map(({name})=> {return {value:name, label:name}})
    */
   /*  const handleFormSearch=(e)=>{
        e.preventDefault() 
        if (typeof window !== `undefined`){              
            window.location = '/colegio/busqueda';
      }
    } */

  return (
    <section className='section section--findSchool' >
        <div className="section__image--portada" >
            <h1 className='title--h5'>Encuentra rapidamente a tu colegio ideal</h1>
        </div>
        <div className='section__blockSeach' >
            <div /* onSubmit={(e)=>{handleFormSearch(e)}} */  className='blockSearch__content' >
                <div className='form__group'>
                    <label htmlFor='group__label--type' className='group__label'>Tipo</label>
                    <Select onChange={(data)=>{handleParamToSeach(data)}} className="create-select" options={types} />
                </div>
                <div className='form__group'>
                    <label htmlFor='group__label--level' className='group__label'>Nivel</label>
                    <Select onChange={(data)=>{handleParamToSeach(data)}} className="create-select" options={levels} />
                </div>
                <div className='form__group'>
                    <label htmlFor='group__label--ubication'  className='group__label'>Estado</label>
                    <Select onChange={(data)=>{handleParamToSeach(data)}} className="create-select" options={states} />
                </div>
                <div className='form__group'>
                    { paramsSearchSchool !== null  && 
                        (
                            <>
                                <Link type='submit' to={`/mejores-escuelas`} className='submit--desktop  btn btn--normal btn--primary  '>
                                    Buscar
                                </Link>
                                <Link type='submit' to={`/mejores-escuelas`} className='submit--mobile submit btn--primary' >
                                    <StaticImage
                                    src="../../static/svg/search.svg"
                                    alt="A dinosaur"
                                    placeholder="blurred"
                                    layout="fixed"
                                    width={18}
                                    height={18}
                                    />
                                </Link>
                            </>
                        )                    
                    }                                            
                </div>
            </div>
        </div>
        <div className='grid--cards' >
            <div className='card'>
                <div className='card__header'>
                    <div  className='icon--secondary' >
                        <StaticImage
                        src="../../static/svg/search-white.svg"
                        alt="A dinosaur"
                        placeholder="blurred"
                        layout="fixed"
                        width={18}
                        height={18}
                        />
                    </div>
                    <h6 className='title--h6'>
                        Busca
                    </h6>
                </div>
                <div className='card__body'>
                    <p className='paragraph' >
                        Busca entre cientos de opciones disponibles
                    </p>
                </div>
            </div>
            <div className='card'>
                <div className='card__header'>
                    <div  className='icon--secondary' >
                        <StaticImage
                        src="../../static/svg/paper-white.svg"
                        alt="A dinosaur"
                        placeholder="blurred"
                        layout="fixed"
                        width={18.64}
                        height={24}  
                        />
                    </div>
                    <h6 className='title--h6'>
                        Compara
                    </h6>
                </div>
                <div className='card__body'>
                    <p className='paragraph' >
                        Aplica facilmente filtros, y compara los resultados
                    </p>
                </div>
            </div>
            <div className='card'>
                <div className='card__header'>
                    <div  className='icon--secondary' >
                        <StaticImage
                        src="../../static/svg/check-white.svg"
                        alt="A dinosaur"
                        placeholder="blurred"
                        layout="fixed"
                        width={24}
                        height={24}
                        />
                    </div>
                    <h6 className='title--h6'>
                        Elije
                    </h6>
                </div>
                <div className='card__body'>
                    <p className='paragraph' >
                        Elije y lee los detalles sobre el colegio, contactalos
                    </p>
                </div>
            </div>
        </div>
        <div className='section__carousel ' >
        <GlobalContextProvider>            
            <SliderHorizontal type={"/apischool/v1/ranking/stars"} method={"get"} title={"Colegios populares en México"} />            
            {
                ubicationUser !== null && <SliderHorizontal paramFetch={{lat:ubicationUser.lat, long:ubicationUser.long}} method={"post"} type={"/apischool/v1/ranking/near"} title={"Cerca de ti"} />
            }            
            {/* <SliderHorizontal title={"Cerca de tí"} /> */}
        </GlobalContextProvider>
        </div>
    </section>
  )
}
