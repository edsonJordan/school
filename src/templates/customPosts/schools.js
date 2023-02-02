import React, { useContext, useState, useEffect }  from "react"
import {Footer} from '../../components'
import {Header} from '../../components'
import GlobalContextProvider from '../../context/GlobalContextProvider'
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { StaticImage } from "gatsby-plugin-image"
import { SliderHorizontalSchoolFilter } from "../../components/sliders";

import { GatsbyImage } from "gatsby-plugin-image"
// import Img from "gatsby-image"
import FormComment from "../../components/forms/FormComment";
import { Seo } from "../../components/seo"

export default function Post({pageContext}) {
  const {school} = pageContext;
  const {customFieldColegio}= school; 

  const [commentActive, setCommentActiveModal] = useState(false);
  const [commentsFromPost, setCommentsFromPost]=useState([]);
  const [commentsPost, setCommentsPost]=useState([]);

  const [schoolsFiltereds, setSchoolsFiltereds]=useState("");

  const [countQualityEducative, setCountQualityEducative]=useState(40)
  const[countPrice, setCountPrice]=useState(40)
  const [countHumanWarmth, setCountHumanWarmth]=useState(40)

  const sortOldComments=(objectComments)=>{
      return objectComments.sort((a,b)=>{
        return  new Date(a.date) - new Date(b.date);
      })
  }
  const sortNewComments=(objectComments)=>{
    return objectComments.sort((a,b)=>{
      return  new Date(b.date) - new Date(a.date) ;
    })
  }
  const sortBetterComments=(objectComments)=>{
    return objectComments.sort((a,b)=>{
      return b.meta.stars - a.meta.stars ;
    })
  }


  const handleFilterComments=({target})=>{
    if(target.value==="newComments") return setCommentsFromPost(sortNewComments([...commentsPost]))
    if(target.value==="oldComments") return setCommentsFromPost(sortOldComments([...commentsPost]))
    if(target.value==="betterCommets") return setCommentsFromPost(sortBetterComments([...commentsPost]))
    // setCommentsFromPost([...commentsPost])

    
  }
  const handleStateModal=(state)=>{
      if(!state) return setCommentActiveModal(false)
  }


  const getCommentsFromPost=()=>{
      return fetch(`${process.env.WP_URL_REST}/wp/v2/comments?post=${school.databaseId}`)
      .then(res=>res.json())
      .then((data)=>{
        setCommentsPost(data);
        setCommentsFromPost(data)       
        if(data.length === 0) return ;

        let humanWarmth = 0
        let qualityEducative = 0
        let price = 0
        
        data.forEach(element => {
          element.acf.humanWarmth === "💕Excelente" && humanWarmth++
          element.acf.qualityEducative === "🤓Excelente" && qualityEducative++
          element.acf.price === "💲Económico" && price++
        });


        // Math.trunc((countHumanWarmth*100)/commentsPost.length)
        setCountHumanWarmth(Math.trunc((humanWarmth*100)/data.length))
        setCountQualityEducative(Math.trunc((qualityEducative*100)/data.length))
        setCountPrice(Math.trunc((price*100)/data.length))

    }).catch((error)=>{
        console.log(error);
    });  
  }

  
  const lenguages = customFieldColegio.lenguages.map(element=>element.split(":")).map(element=>element[1]).map(element=>element.trim()).join(", ")
  const activities = customFieldColegio.activities.map(element=>element.split(":")).map(element=>element[1]).map(element=>element.trim()).join(", ")
  const approach = customFieldColegio.approach.map(element=>element.split(":")).map(element=>element[1]).map(element=>element.trim()).join(", ")
  const levels= school.levelsSchools.nodes.map(element=>element.name).join(", ")
  const types= school.typeSchools.nodes.map(element=>element.name)[0]
  // console.log(school.databaseId);

  useEffect(()=>{
    getCommentsFromPost()
    // schoolsFiltereds
    console.log(school.customFieldColegio.photos1);
    let filterds = [];
    let levelsSchool= "";
    let statesSchool="";
    let typeSchools="";
    if(school.levelsSchools.nodes.length>0){
      levelsSchool="levels="+school.levelsSchools.nodes.reduce((acc,element,index)=> { 
        acc[index]=element.databaseId 
          return acc}, []).join(',');
          filterds.push(levelsSchool)
    }
    if(school.stateSchools.nodes.length>0){
      statesSchool="states="+school.stateSchools.nodes.reduce((acc,element,index)=> { 
        acc[index]=element.databaseId 
          return acc}, []).join(',');
        filterds.push(statesSchool)
    }
    if(school.typeSchools.nodes.length>0){
      typeSchools="typeSchool="+school.typeSchools.nodes.reduce((acc,element,index)=> { 
        acc[index]=element.databaseId 
          return acc}, []).join(',');
        filterds.push(typeSchools)
    }
    setSchoolsFiltereds(filterds.join('&'))
  }, [])
  useEffect(()=>{
  },[commentsFromPost])
  return (
    <div className=" container ">
      <main  className='main'>
      <GlobalContextProvider>
            <Header/>
      </GlobalContextProvider>
        <section className='section section--school'>
          <div className='content__school'>
              <div  className='block__left'>
                <div className='block--school header'>
                      <h1 className='title--h4'>
                        {school.title}
                      </h1>
                    <div className='items'>
                      <label className='text--ext-sm text--secondary text-label'>
                      {types}
                      </label>
                      <p className='item__stars' >
                      4.5
                      </p>
                    </div>
                </div>                
                <div   className='block--school-images'>
                  {/* <div className='w-full'> */}
                  {
                    school.customFieldColegio.photos1 !== null ? 
                    <GatsbyImage className='image' image={school.customFieldColegio.photos1.localFile.childImageSharp.gatsbyImageData}  alt={``}/>
                    // <Img fluid={{...school.customFieldColegio.photos1.localFile.childImageSharp.fluid, media: `(min-width: 768px)`}}/>                    
                    :
                    <StaticImage className='image'
                            src="../../static/images/school-portada.jpg"
                            alt="A dinosaur"
                            // width={100} 
                            
                            // maxWidth={300}
                            placeholder="blurred"
                            layout="fixed"
                            />
                    }                      
                  {/* </div> */}
                  <div className='content__images--thumbnails'>
                    <div data-title="portada" className='thumbnail'>
                      {
                      school.customFieldColegio.photos1 !== null ? 
                      <GatsbyImage className='image--thumbnail' image={school.customFieldColegio.photos2.localFile.childImageSharp.gatsbyImageData}  alt={``}/>
                      // <Img fluid={{...school.customFieldColegio.photos1.localFile.childImageSharp.fluid, media: `(min-width: 768px)`}}/>                    
                      :
                      <StaticImage className='image--thumbnail'
                              src="../../static/images/school-portada.jpg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                      }                      
                    </div>
                    <div data-title="Instalaciones" className='thumbnail'>
                    {
                      school.customFieldColegio.photos1 !== null ? 
                      <GatsbyImage className='image--thumbnail' image={school.customFieldColegio.photos3.localFile.childImageSharp.gatsbyImageData}  alt={``}/>
                      // <Img fluid={{...school.customFieldColegio.photos1.localFile.childImageSharp.fluid, media: `(min-width: 768px)`}}/>                    
                      :
                      <StaticImage className='image--thumbnail'
                              src="../../static/images/school-portada.jpg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                      } 
                    </div>
                    <div data-title="Otras" className='thumbnail'>
                      {/* <StaticImage  className='image--thumbnail'
                            src="../../static/images/school-otros.jpg"                            
                            alt="A dinosaur"
                            placeholder="blurred"
                            layout="fixed"
                            /> */}
                      {
                      school.customFieldColegio.photos4 !== null ? 
                      <GatsbyImage className='image--thumbnail' image={school.customFieldColegio.photos4.localFile.childImageSharp.gatsbyImageData}  alt={``}/>
                      // <Img fluid={{...school.customFieldColegio.photos1.localFile.childImageSharp.fluid, media: `(min-width: 768px)`}}/>                    
                      :
                      <StaticImage className='image--thumbnail'
                              src="../../static/images/school-portada.jpg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                      }
                    </div>                
                  </div>  
                </div>
                <div className='block--info section-left'>
                    <ul className='list' >
                        <li className='list__paragraph--icon'>
                            <div className='icon'>
                            <StaticImage className='icon--list'
                            src="../../static/svg/gratuation__cap.svg"
                            alt="A dinosaur"
                            placeholder="blurred"
                            layout="fixed"/>
                            </div>                        
                            <p>
                              {levels}
                            </p>
                        </li>
                        <li className='list__paragraph--icon'>
                            <div className='icon'>
                              <StaticImage className='icon--list'
                              src="../../static/svg/map_point.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                            </div>                       
                            <p>

                            </p>
                        </li>
                        <li className="list__paragraph--icon price">$800</li>
                    </ul>
                </div>
                <div className='block--others'>
                    <ul className='list buttons'>
                      <li className=''>
                          <a className="btn ">
                            <StaticImage 
                              src="../../static/svg/phone.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                              llamar
                          </a>
                      </li>
                      <li className=''>
                          <a className="btn" href={"mailto:"+customFieldColegio.email}>
                            <StaticImage 
                              src="../../static/svg/email-send.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                              Enviar email
                          </a>
                      </li>
                      <li className=''>
                          <a className="btn" href={customFieldColegio.web}>
                            <StaticImage 
                              src="../../static/svg/world.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                              Visitar web
                          </a>
                      </li>
                    </ul>
                    <ul className='list links'>
                        <li className=''>
                          <a href={customFieldColegio.instagram} className='btn__ghost--secondary btn--ext-sm'>
                              Instagram
                          </a>
                        </li>
                        <li className=''>
                          <a href={customFieldColegio.facebook} className='btn__ghost--secondary btn--ext-sm'>
                              Facebook
                          </a>
                        </li>
                        <li className=''>
                          <a href={customFieldColegio.whatsapp} className='btn__ghost--secondary btn--ext-sm'>
                              Whatsapp
                          </a>
                        </li>
                    </ul>
                    <div className='others__texts'>
                        <div className='text lenguages'>                            
                            <span>
                              <b>
                              Idiomas: &nbsp;
                              </b>
                              {/* Ingles */}
                              {lenguages}
                            </span>
                        </div>
                        <div className='text approaches'>                            
                            <span>
                              <b>
                              Enfoques: &nbsp;
                              </b>
                              {approach}
                            </span>
                        </div> 
                        <div className='text activities'>                            
                            <span>
                              <b>Actividades extras: </b>&nbsp;
                              {activities}
                            </span>
                        </div>  
                        <div className='text description'>
                            <p className='title'>
                              Descripción
                            </p>
                            <span className='paragraph'>
                              {customFieldColegio.description}
                            </span>
                        </div>
                        <div className='text proposal'>
                            <p className='title'>
                              Propuesta
                            </p>
                            <span className='paragraph'>
                            {customFieldColegio.proposal}
                            </span>
                        </div>
                        <div className='text opinion'>
                            <p className='title'>
                              Opiniones
                            </p>
                            <span className='paragraph'>
                              46 calificaciones
                            </span>
                        </div>                                
                        <div className='text text--loading'>
                          <p className='title'>
                            Populares
                          </p>
                          <div className='block--load-bar'>
                            <p className='title--load-bar' >
                              Calidez Humana
                            </p>
                            <div className='load-bar' >
                                <div style={{width:`${countHumanWarmth<36 ? 40 : countHumanWarmth}%`}} data-indice={countHumanWarmth<36 ? 40 : countHumanWarmth} className='load-bar__content'>
                                💕Excelente
                                </div>
                            </div>
                          </div>
                          <div className='block--load-bar'>
                            <p className='title--load-bar' >
                              Calidad educativa
                            </p>
                            <div  className='load-bar' >
                                <div style={{width:`${countQualityEducative<36 ? 40 : countQualityEducative}%`}} data-indice={countQualityEducative<36 ? 40 : countQualityEducative} className='load-bar__content'>
                                🤓Excelente
                                </div>
                            </div>
                          </div>
                          <div className='block--load-bar'>
                            <p className='title--load-bar' >
                              Precio
                            </p>
                            <div  className='load-bar' >
                                <div style={{width:`${countPrice<36 ? 40 : countPrice}%`}} data-indice={countPrice<36 ? 40 : countPrice} className='load-bar__content'>
                                💸Ecónomico
                                </div>
                            </div>
                          </div>
                        </div>     
                    </div>
                </div>                
                <div className='block--comments'>
                    <p className='title'>
                      Ordenar por
                    </p>                    
                    <div className='form--buttons-comments'>
                        <div className='container--select'>
                          <select onChange={(event)=>{handleFilterComments(event)}} className='input--select' >
                                <option value="newComments" >
                                  Mas recientes
                                </option>
                                <option value="oldComments" >
                                  Mas antiguos                                  
                                </option>
                                <option value="betterCommets" >
                                  Mejores puntuaciones
                                </option>
                          </select>
                        </div>


                        
                        <a onClick={()=>{
                          setCommentActiveModal(true)
                          }} 
                            className="btn btn--normal btn--primary">Escribir opinion
                        </a>  

                    </div>            
                </div>
                <div className='container__comment' >
                    <div className='content__coments'>
                      

                        {
                          commentsFromPost.length>0 ? commentsFromPost.map((element, index)=>{
                            let date = new Date(element.date_gmt)
                            const formatDate = {year: 'numeric', month: 'long', day: 'numeric' };
                            
                            return(
                              <div key={index} className='card--comment'>
                                <div className='card__header'>
                                  {/* <StaticImage className='avatar--comment' src={"https://picsum.photos/seed/picsum/40/40"} alt="A dinosaur" placeholder="blurred" layout="fixed" /> */}
                                  <img className='avatar--comment' src={element.author_avatar_urls['48']}/>                                  
                                </div>
                                <div className='card__body'>
                                    <div className='comment' >
                                        <h3 className='title'>
                                        {element.author_name}
                                        </h3>
                                        <div className='block--stars-with-date'>
                                          <p className='paragraph-stars'>
                                            {
                                              [...Array(element.meta.stars)].map((element)=>{
                                                  return ("★")
                                              })
                                            }
                                          </p>
                                          <p className='paragraph-date' >
                                            {date.toLocaleDateString('es-ES', formatDate)}
                                            {/* 21 sep, 2021 */}
                                          </p>
                                        </div>
                                        <span  dangerouslySetInnerHTML={{__html:element.content.rendered}}>
                                        </span>
                                    </div>
                                    <details>
                                      <summary>Detalles</summary>
                                      <div className='content__comment-details'>
                                        <div className='block__details'>
                                            <div className='content__details'>
                                                <div className='detail'>
                                                  <p className='title--detail'>
                                                    Calidez humana
                                                  </p>
                                                  <div className='description'>
                                                    {element.acf.humanWarmth.substr(0,2)}
                                                    <p>
                                                    {element.acf.humanWarmth.substr(2)}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className='detail'>
                                                  <p className='title--detail'>
                                                    Calidad educativa
                                                  </p>
                                                  <div className='description'>
                                                  {element.acf.qualityEducative.substr(0,2)}
                                                    <p>
                                                  {element.acf.qualityEducative.substr(2)}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className='detail'>
                                                  <p className='title--detail'>
                                                    Precio
                                                  </p>
                                                  <div className='description'>
                                                  {element.acf.price.substr(0,2)}
                                                    <p>
                                                  {element.acf.price.substr(2)}
                                                    </p>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='block__details'>
                                            <div className='content__details'>
                                                <div className='detail'>
                                                  <p className='title--detail'>
                                                  Impresion de padres
                                                  </p>
                                                  <div className='description'>
                                                    {element.acf.feeling.substr(0,2)}
                                                    <p>
                                                    {element.acf.feeling.substr(2)}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className='detail'>
                                                  <p className='title--detail'>
                                                    Imprensión de hijos
                                                  </p>
                                                  <div className='description'>
                                                    {element.acf.feelingChildren.substr(0,2)}
                                                    <p>
                                                    {element.acf.feelingChildren.substr(2)}
                                                    </p>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                      </div>
                                    </details>
                                </div>
                              </div>                              
                            )
                          }) : ""

                        }




                    </div>
                </div>
              </div>
              <aside className='aside-school' >
                <div className='block--school header'>
                      <h1 className='title--h4'>
                      {school.title}
                      </h1>
                    <div className='items'>
                      <label className='text--ext-sm text--secondary text-label'>
                      {types}
                      </label>
                      <p className='item__stars' >
                      4.5
                      </p>
                    </div>
                </div>
                <div className='block--info'>
                    <ul className='list' >
                        <li className='list__paragraph--icon'>
                            <div className='icon'>
                            <StaticImage className='icon--list'
                            src="../../static/svg/gratuation__cap.svg"
                            alt="A dinosaur"
                            placeholder="blurred"
                            layout="fixed"/>
                            </div>                        
                            <p>
                              {levels}
                            </p>
                        </li>
                        <li className='list__paragraph--icon'>
                            <div className='icon'>
                              <StaticImage className='icon--list'
                              src="../../static/svg/map_point.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                            </div>                       
                            <p>
                                {customFieldColegio.direction}                            
                            </p>
                        </li>
                        <li className="list__paragraph--icon price">$800</li>
                    </ul>
                </div>
                <div className='block--others'>
                    <ul className='list buttons'>
                      <li className=''>
                          <a href={"tel:"+customFieldColegio.phone} className="btn">
                            <StaticImage 
                              src="../../static/svg/phone.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                              llamar
                          </a>
                      </li>
                      <li className=''>
                          <a className="btn" href={"mailto:"+customFieldColegio.email}>
                            <StaticImage 
                              src="../../static/svg/email-send.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                              Enviar email
                          </a>
                      </li>
                      <li className=''>
                          <a className="btn" href={customFieldColegio.web}>
                            <StaticImage 
                              src="../../static/svg/world.svg"
                              alt="A dinosaur"
                              placeholder="blurred"
                              layout="fixed"
                              />
                              Visitar web
                          </a>
                      </li>
                    </ul>                    
                    <div className='others__texts'>
                        <div className='text lenguages'>                            
                            <span>
                              <b>
                              Idiomas: &nbsp;
                              </b>
                              {/* Ingles */}
                              {lenguages}
                            </span>
                        </div>
                        <div className='text approaches'>                            
                            <span>
                              <b>
                              Enfoques: &nbsp;
                              </b>
                              {approach}
                            </span>
                        </div> 
                        <div className='text activities'>                            
                            <span>
                              <b>Actividades extras: </b>&nbsp;
                              {activities}
                            </span>
                        </div> 
                    </div>
                    <ul className='list links'>
                        <li className=''>
                          <a href={customFieldColegio.instagram} className='btn__ghost--secondary btn--ext-sm'>
                              Instagram
                          </a>
                        </li>
                        <li className=''>
                          <a href={customFieldColegio.facebook} className='btn__ghost--secondary btn--ext-sm'>
                              Facebook
                          </a>
                        </li>
                        <li className=''>
                          <a href={customFieldColegio.whatsapp} className='btn__ghost--secondary btn--ext-sm'>
                              Whatsapp
                          </a>
                        </li>
                    </ul>
                </div> 
              </aside>
          </div>
          {/* Opiniones - Comentarios */}    
        <GlobalContextProvider>
            {schoolsFiltereds !== ""&& 
                <SliderHorizontalSchoolFilter  method={"get"} type={`${schoolsFiltereds}`} title={"Colegios similares"} />
            }
            {/* <SliderHorizontal title={"Cerca de tí"} /> */}
        </GlobalContextProvider>
        </section>
        <Footer/>
      </main>
      {commentActive && 
       <GlobalContextProvider>
         <FormComment handleStateModal={handleStateModal}  levels={pageContext.levelAndSchool.data.allWpLevelsSchool}  post={school.databaseId}/>
       </GlobalContextProvider>
      }    
    </div>
  );
}

export const Head = ({pageContext}) => {
  const {school} = pageContext;
    return(
      <Seo data={school.seo} >
         <script type="application/ld+json">{JSON.stringify({})}</script>
      </Seo>
    )
  }