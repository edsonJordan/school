import React, {useEffect, useState } from 'react';
import Select from 'react-select';
import Footer from '../../components/footer'
import Header from '../../components/header'
import GlobalContextProvider from "../../context/GlobalContextProvider"



import Mapa from '../../components/mapas/Mapa';
import CardVertical from '../../components/cards/CardVertical';
import axios from 'axios';


/* export function ShowCardList({data}){
    return(
        <>
          <div className='container__cards'>  
            <GlobalContextProvider>
            </GlobalContextProvider>           
           <p className='btn btn--normal btn--secondary' >
                    Cargar mas
            </p>
        </div>
        </>)
} */



export default function States({pageContext}) {
    const {school} = pageContext;
    const [stateAuth, setStateAuth] = useState(typeof window !== "undefined" && JSON.parse(localStorage.getItem('sessionSchool')))
    
    /* Values from params from search */
    const [schools, setSchools]= useState(pageContext.school.colegios.nodes)
    const [typeSearch, setTypeSearch] = useState("grid");
    const [orderFilter,setOrderFilter] = useState("")
    const [typeFilter,setTypeFilter] = useState("")
    const [levelFilter,setLevelFilter]= useState("")

    const [typeOptions, setTypeOptions] = 
    useState(pageContext.levelAndSchool.data.allWpTypeSchool.nodes
        .map(element=>{
            return {value:element.name, label:element.name, name:"typeFilter"}}
            )
        );
    const [levelOptions, setLevelOptions] = useState(pageContext.levelAndSchool.data.allWpLevelsSchool.nodes
        .map(element=>{return {value:element.name, label:element.name, name:"levelFilter"}}));
    

    const [paramsSearch, setParamsSearch]= useState({typeSearch,orderFilter,typeFilter,levelFilter});
    const [countSearchEvent, setCountSearchEvent]=useState(0)

    /* values from Schools */
    const [favorites, setFavorites]=useState([]);
    const [dataIsReady, setDataIsReady ]=useState([])

    const optionsOrderData= [
        { value: '', name:"orderFilter", label: 'Todos los registros' },
        { value: 'punctuation', name:"orderFilter", label: 'Mejor Puntuación' },
        { value: 'favorites', name:"orderFilter", label: 'favoritos' },
    ];

    /* const showSchoolsWithParamts=()=>{
    } */
    
    const resultRanking=(listNodesFromComments)=>{
        if(listNodesFromComments.length===0)  return 3.5;
        const numValuesFromStars =  listNodesFromComments.reduce((acumulator,currentValue)=>{
              if(currentValue.stars === 1) acumulator[0][1]++
              if(currentValue.stars === 2) acumulator[1][2]++
              if(currentValue.stars === 3) acumulator[2][3]++
              if(currentValue.stars === 4) acumulator[3][4]++
              if(currentValue.stars === 5) acumulator[4][5]++
              return acumulator},[{1:0},{2:0},{3:0},{4:0},{5:0}])
      .map((element, index, array)=>{  return  element[(index+1)]*(index+1)})
          return ((numValuesFromStars[0]+numValuesFromStars[1]+numValuesFromStars[2]+numValuesFromStars[3]+numValuesFromStars[4])/listNodesFromComments.length).toFixed(1);
      }

  
    useEffect(()=>{         
        getSchoolsFavorite()    
            setSchools(schools.map((element)=>{
                    return {
                        id_post: element.databaseId,       
                        levels: element.levelsSchools.nodes.length > 0 ? element.levelsSchools.nodes.map(levelNode=>levelNode.name) : [],
                        nameSchool:element.title,
                        opinion:"buen trato economico",
                        phone:element.customFieldColegio.phone,
                        price: element.customFieldColegio.price,
                        slug:element.slug,
                        // stars:"3.6",
                        stars:resultRanking(element.comments.nodes),
                        typeSchool:element.typeSchools.nodes.length > 0 ? element.typeSchools.nodes.map(typeNode=>typeNode.name) : [],
                        ubication:null,
                        web:element.customFieldColegio.web,
                        whatsapp:element.customFieldColegio.whatsapp,
                        lat:element.customFieldColegio.latitude,
                        long:element.customFieldColegio.longitude,
                        isFavorite:false
                    }
                }))
            
            console.log(schools.map((element)=>{
                return {
                    id_post: element.databaseId,       
                    levels: element.levelsSchools.nodes.length > 0 ? element.levelsSchools.nodes.map(levelNode=>levelNode.name) : [],
                    nameSchool:element.title,
                    opinion:"buen trato economico",
                    phone:element.customFieldColegio.phone,
                    price: element.customFieldColegio.price,
                    slug:element.slug,
                    // stars:"3.6",
                    stars:resultRanking(element.comments.nodes),
                    typeSchool:element.typeSchools.nodes.length > 0 ? element.typeSchools.nodes.map(typeNode=>typeNode.name) : [],
                    ubication:null,
                    web:element.customFieldColegio.web,
                    whatsapp:element.customFieldColegio.whatsapp,
                    lat:element.customFieldColegio.latitude,
                    long:element.customFieldColegio.longitude,
                    isFavorite:false
                }
            }));
            setTypeOptions([{ value: "", name:"typeFilter", label: 'Todos los registros' }, ...typeOptions])
            setLevelOptions([ { value: "", name:"levelFilter", label: 'Todos los registros' },...levelOptions])
            // console.log(pageContext.school.colegios.nodes);
    },[])
    const getSchoolsFavorite = ()=>{
        if (stateAuth === null) return setFavorites([]);
        // console.log(stateAuth);  
        fetch(`${process.env.WP_URL_REST}/apischool/v1/favorites/${stateAuth.id_user}`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${stateAuth.token}`
          }
        })
        .then(response => response.json())
        .then(
          (data) => {
            setFavorites(data.map((element)=> {return [element.id_post]}).reduce((acc, id_post)=>{ return acc.concat(parseInt(id_post)) },[]));    
            // console.log(data);
          } 
        )
        .catch((error)=>console.log(error));  
    }

    const hiddenCard= (idPost)=>{
        if(idPost !== undefined){
            let post = document.getElementById(idPost);
            post.classList.remove('none')
        }
    }
    const hiddenGroup= (groupCards)=>{
       groupCards.forEach(({id_post}) => {
        let post = document.getElementById(id_post);
            post.classList.add('none');
       });
    }
    const filtersSchools=(arrayToFilter, {typeSearch, levelFilter, typeFilter, orderFilter}, countEvent)=>{
        let schoolsFiltered =[...arrayToFilter]
        
        if(typeFilter !== ""){
            schoolsFiltered = schoolsFiltered.filter((element)=> element.typeSchool.includes(typeFilter)) 
        }
        if(levelFilter !== ""){
            schoolsFiltered = schoolsFiltered.filter(element=> element.levels.includes(levelFilter)) 
        }
        if(orderFilter === "punctuation"){           
            schoolsFiltered = schoolsFiltered.filter((element)=> element.stars>3.3) 
        }
        // punctuation
        if(orderFilter === "favorites"){           
            schoolsFiltered = schoolsFiltered.filter((element)=> element.isFavorite) 
        }
        if(typeSearch === "grid"){
            if(countEvent>0) hiddenGroup(arrayToFilter)
            schoolsFiltered.map(element=> hiddenCard(element.id_post))
        }
        /* if(countEvent>0) hiddenGroup(arrayToFilter)
        schoolsFiltered.map(element=> hiddenCard(element.id_post)) */
    }
/* 
    useEffect(()=>{
        // console.log(school);
    },[school]) */

    useEffect(()=>{
        // console.log(paramsSearch);
        setCountSearchEvent(countSearchEvent + 1)
        filtersSchools(dataIsReady,paramsSearch, countSearchEvent)
    },[paramsSearch])
   
    useEffect(()=>{
        setDataIsReady(schools.map((element)=>{ return favorites.includes(element.id_post)? {...element, isFavorite:true}:{...element}})     )
    },[favorites])


    /* Functions events favorites Schools */
    const addPostFavorite = (idPost, user_name)=>{
        const data = {
          "user": user_name,
          'post':idPost 
          }; 
          axios.post(`${process.env.WP_URL_REST}/apischool/v1/favorites`, JSON.stringify(data),
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${stateAuth.token}`
                }
            }
          )
          .then((response)=>{
            setDataIsReady(dataIsReady.map(element=>{return element.id_post === idPost ? {...element, isFavorite:true} : {...element}}))
            console.log(dataIsReady.map(element=>{return element.id_post === idPost ? {...element, isFavorite:true} : {...element}}));
            })
          .catch(({response})=>{ console.log(response)});      
      }
    const deletePostFavorite =(idPost, user_name)=>{
        const data = {
          "user": user_name,
          'post':idPost 
          }; 
          axios.post(`${process.env.WP_URL_REST}/apischool/v1/favorites/delete`, JSON.stringify(data),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${stateAuth.token}`
            }
          }
          )
          .then((response)=>{
            setDataIsReady(dataIsReady.map(element=>{return element.id_post === idPost ? {...element, isFavorite:false} : {...element}}))
            // console.log(dataIsReady)
        })
          .catch(({response})=>{ console.log(response)});        
    }


    const setIdPost =  (idPost, isFavorite)=>{
        if(isFavorite){
         stateAuth === null ? (window.location= '/login'): addPostFavorite(idPost, stateAuth.id_user);          
        }else{
          deletePostFavorite(idPost,stateAuth.id_user)
          // console.log(idPost,stateAuth.data.username);
        }
    }
    const handleEventTypeSearch=(event)=>{
        // console.log(event.target.name);
        setParamsSearch ({...paramsSearch, [event.target.name]:event.target.value})
    }
    
    const  handleEventSearch = async (event) => {
         setParamsSearch ({...paramsSearch, [event.name]:event.value})
         
    }
  return (
    <main className='main'>
        <GlobalContextProvider>
            <Header/>
        </GlobalContextProvider>
        <section className='section section--search-school'>
            <h1 className='title--h4'>
                Las mejores escuelas en {school.name}
            </h1>
            <form className='form-search'>
                <div className='form__block'>
                    <input type="radio" defaultChecked name='typeSearch' onClick={handleEventTypeSearch} id="resultados"  value="grid"/>
                    <label htmlFor="resultados" >Resultados</label>
                </div>
                <div className='form__block'>
                    <input type="radio" name='typeSearch' id="mapa" onClick={handleEventTypeSearch}  value="mapa"/>
                    <label htmlFor="mapa" >Mapa</label>
                </div>
            </form>           
                { 
                    paramsSearch.typeSearch === "grid"
                    ? 
                    <>
                     <form className='form-paramts' >
                            <div className='form-paramats__content' >
                                <div className='form__block' >
                                    <label htmlFor="selectOrder" >Ordenado por</label>
                                    <Select
                                       
                                        options={optionsOrderData}
                                        onChange={handleEventSearch}
                                    />
                                </div>
                                <div className='form__block' >
                                    <label htmlFor="selectType" >Tipo</label>
                                        <Select 
                                        onChange={handleEventSearch}
                                        name="typeFilter"
                                        id='selectType'
                                        options={typeOptions} />
                                </div>
                                
                                <div className='form__block' >
                                    <label htmlFor="selectLevel" >Nivel</label>                        
                                    <Select
                                            options={levelOptions}
                                            name="levelFilter" 
                                            onChange={handleEventSearch}  
                                            id='selectLevel'  
                                            aria-label="Default select example"
                                        />
                                </div>
                            </div>
                        </form>
                        
                        <div className='grid  sm:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4	carousel--container' >
                            {dataIsReady.map((element,index) =>{   
                                return element.isFavorite !== undefined && <CardVertical  key={index}  isFavorite={element.isFavorite} setIdPost={setIdPost} school={element}/>; 
                                })}
                        </div>
                    </>
                    
                    :
                    <Mapa data={dataIsReady} />
                }
                                 
                
                
        </section>
        <Footer/>
    </main>
  )    
}
