import axios from 'axios';
import { graphql, useStaticQuery } from 'gatsby';
import React, {useEffect, useState } from 'react';
import Select from 'react-select';
import Footer from '../components/footer'
import Header from '../components/header'
import CardVertical from '../components/cards/CardVertical';
import GlobalContextProvider from '../context/GlobalContextProvider';
import Mapa from '../components/mapas/Mapa';


export default function MejoresEscuelas() {

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
//   const school = [];
  const [stateAuth, setStateAuth] = useState(typeof window !== "undefined" && JSON.parse(localStorage.getItem('sessionSchool')))
  
  
//   /* Values from params from search */
  const [schools, setSchools]= useState([])
  const [tileFilters, setTitleFilters]=useState("")
  const [urlWithFilters, setUrlWithFilters]=useState("")
  const [typeSearch, setTypeSearch] = useState("grid");
  const [orderFilter,setOrderFilter] = useState("")
  const [typeFilter,setTypeFilter] = useState("")
  const [levelFilter,setLevelFilter]= useState("")
  const [paramsSearchSchool, setParamsSearchSchool]=useState("")



  useEffect(()=>{
        // console.log(allWpStateSchool);
      
  }, [])
  const [typeOptions, setTypeOptions] = 
  useState(allWpTypeSchool.nodes
      .map(element=>{
          return {value:element.name, label:element.name, name:"typeFilter"}}
          )
      );
  const [levelOptions, setLevelOptions] = useState(allWpLevelsSchool.nodes
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
       console.log(favorites);
      } 
    )
    .catch((error)=>console.log(error));  
  }

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

    const getSchoolWithFilter= async (filterProp)=>{      
        
        // return console.log(`${process.env.WP_URL_REST}/wp/v2/colegio${props.type}`);
          fetch(`${process.env.WP_URL_REST}/wp/v2/colegio?${filterProp}&_embed`,{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',              
            }           
          })
          .then(response=>response.json())
          .then((data)=>{
            // console.log(favoritesData);
           
            setDataIsReady(data.map((element)=>{
              return {
                  id_post: element.id,       
                  levels:element['_embedded']['wp:term'][1].length !== 0 ? element['_embedded']['wp:term'][1].map(element=>element.name): [],
                  nameSchool:element.title.rendered,
                  opinion:"buen trato economico",
                  phone:element.acf.phone,
                  price: element.acf.price,
                  slug:element.slug,
                  typeSchool:element['_embedded']['wp:term'][2].length !== 0 ? element['_embedded']['wp:term'][2].map(element=>element.name): [],
                  stars:"3.6",          
                 // stars:resultRanking(element.comments.nodes),
                  ubication:null,
                  web:element.acf.web,
                  whatsapp:element.acf.whatsapp,
                  lat:element.acf.latitude,
                  long:element.acf.longitude,
                  isFavorite:false
              }
            }))


            // console.log("Cargo datos"); 
          })
          .catch((error)=>console.log(error));
      }



    const getLocalParamsSearch =()=>{
        const paramsLocalStorage =localStorage.getItem('searchSchool');
        if(paramsLocalStorage === null){
            if (typeof window !== `undefined`){      
                window.location = '/'
               }
        }
        const localSearch =JSON.parse(paramsLocalStorage);
        if(!localSearch.isSearching){
            if (typeof window !== `undefined`){      
                window.location = '/'
               }
        }
        let filterds = [];
        let paramUrltoSearch=""
        let urlToSearch=""
        let levelsSchool= "";
        let statesSchool="";
        let typeSchools="";

        if(localSearch.level.value !== null){
          levelsSchool="levels="+ localSearch.level.value
              filterds.push(levelsSchool)
              paramUrltoSearch+=` ${localSearch.level.description}  ${localSearch.level.label}`
              urlToSearch+=`${localSearch.level.description}-${localSearch.level.name}-`;
        }
        
        if(localSearch.type.value !== null){
          typeSchools="typeSchool="+localSearch.type.value
            filterds.push(typeSchools)
            paramUrltoSearch+=` ${localSearch.type.label}s`
            urlToSearch+=`${localSearch.type.label}s-`
        }
        if(localSearch.state.value !== null){
          statesSchool="states="+localSearch.state.value
            filterds.push(statesSchool)
            paramUrltoSearch+=` ${localSearch.state.description}  ${localSearch.state.label}`
            urlToSearch+=`${localSearch.state.description}-${localSearch.state.name}`
        }
        // console.log(urlToSearch);
        setTitleFilters(paramUrltoSearch)
        // window.history.replaceState({}, `${urlToSearch}`, `${process.env.SCHOOL_URL}mejores-escuelas-${urlToSearch}`);

        
        // setParamsSearchSchool(filterds.join('&'))
        // console.log(filterds.join('&'));
        return filterds.join('&');
    } 
    


  useEffect( ()=>{        
    getSchoolsFavorite() 
      async function fetchFavorites() {
        if (stateAuth === null) return setFavorites([]);
    // console.log(stateAuth);  
          const favoritesSchool = await fetch(`${process.env.WP_URL_REST}/apischool/v1/favorites/${stateAuth.id_user}`,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${stateAuth.token}`
            }
          })
          const data = await favoritesSchool.json();
          /* .then(response => response.json())
          .then(
            (data) => {
              setFavorites(data.map((element)=> {return [element.id_post]}).reduce((acc, id_post)=>{ return acc.concat(parseInt(id_post)) },[]));    
            console.log(favorites);
            } 
          )
          .catch((error)=>console.log(error));     */      
          return data.map((element)=> {return [element.id_post]}).reduce((acc, id_post)=>{ return acc.concat(parseInt(id_post)) },[]);
          // setFavorites(favoritesSchool);
      }
      // const favoritesData =  fetchFavorites();
      
      

      async function getSchoolsWithFilters(filterProp){
        const schools = await fetch(`${process.env.WP_URL_REST}/wp/v2/colegio?${filterProp}&_embed`,{
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',              
          }           
        })
        const data = await schools.json();
        return data.map((element)=>{
          return {
              id_post: element.id,       
              levels:element['_embedded']['wp:term'][1].length !== 0 ? element['_embedded']['wp:term'][1].map(element=>element.name): [],
              nameSchool:element.title.rendered,
              opinion:"buen trato economico",
              phone:element.acf.phone,
              price: element.acf.price,
              slug:element.slug,
              typeSchool:element['_embedded']['wp:term'][2].length !== 0 ? element['_embedded']['wp:term'][2].map(element=>element.name): [],
              stars:"3.6",          
             // stars:resultRanking(element.comments.nodes),
              ubication:null,
              web:element.acf.web,
              whatsapp:element.acf.whatsapp,
              lat:element.acf.latitude,
              long:element.acf.longitude,
              isFavorite:false
          }
        })

      }


      const filters = getLocalParamsSearch();

       getSchoolWithFilter(filters)
      // const schoolsData =  getSchoolsWithFilters(filters);
      // setSchools(schools.map((element)=>{
      //             return {
      //                 id_post: element.databaseId,       
      //                 levels: element.levelsSchools.nodes.length > 0 ? element.levelsSchools.nodes.map(levelNode=>levelNode.name) : [],
      //                 nameSchool:element.title,
      //                 opinion:"buen trato economico",
      //                 phone:element.customFieldColegio.phone,
      //                 price: element.customFieldColegio.price,
      //                 slug:element.slug,
      //                 // stars:"3.6",
      //                 stars:resultRanking(element.comments.nodes),
      //                 typeSchool:element.typeSchools.nodes.length > 0 ? element.typeSchools.nodes.map(typeNode=>typeNode.name) : [],
      //                 ubication:null,
      //                 web:element.customFieldColegio.web,
      //                 whatsapp:element.customFieldColegio.whatsapp,
      //                 lat:element.customFieldColegio.latitude,
      //                 long:element.customFieldColegio.longitude,
      //                 isFavorite:false
      //             }
      //         }))
          setTypeOptions([{ value: "", name:"typeFilter", label: 'Todos los registros' }, ...typeOptions])
          setLevelOptions([ { value: "", name:"levelFilter", label: 'Todos los registros' },...levelOptions])
         
  },[])
 

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

  useEffect(()=>{
      // console.log(paramsSearch);
      setCountSearchEvent(countSearchEvent + 1)
      filtersSchools(dataIsReady,paramsSearch, countSearchEvent)
  },[paramsSearch])

  useEffect(()=>{
      // console.log(dataIsReady);
    // if(dataIsReady.length > 0 && favorites.length>0){
    //   // setDataIsReady()
    //   setDataIsReady(dataIsReady.map((element)=>{ return favorites.includes(element.id_post)? {...element, isFavorite:true}:{...element}})     )
    // }
  },[dataIsReady])
 
  useEffect(()=>{
    // console.log(favorites);
    // if(dataIsReady.length>0 && favorites.length>0){
    //   // setDataIsReady()
    //   console.log(dataIsReady);
    //   console.log("cambio");
    //   setDataIsReady(dataIsReady.map((element)=>{ return favorites.includes(element.id_post)? {...element, isFavorite:true}:{...element}})     )
    // }
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
              Las mejores escuelas {tileFilters !== "" && tileFilters}
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
