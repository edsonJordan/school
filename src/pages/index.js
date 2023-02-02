import React, { useContext, useState, useEffect }  from "react"
import { StaticImage } from "gatsby-plugin-image"

import Seo from "../components/seo"

import GlobalContextProvider from "../context/GlobalContextProvider"
import {FindSchool} from "../components/sections"

import { useStaticQuery, graphql } from "gatsby"

/* Carousel */
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import {Header, Footer} from "../components"
import { Link } from "gatsby"

// const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`


/* const taxonomiesGroup = await graphql(`
    {
        allWpColegio {
          edges {
            node{
              stateSchools {
                nodes {
                  slug
                  name
                  description
                }
              }
              typeSchools {
                nodes {
                  slug
                  name
                  description
                }
              }
              levelsSchools{
                nodes {
                  slug
                  name
                  description
                }
              }
            }
          }
        }
      }    
    `) */


const IndexPage = () => {

  
  const {allWpTypeSchool, allWpLevelsSchool, allWpStateSchool, allWpColegio}= useStaticQuery(graphql`
  {   
    allWpColegio{
      nodes{
        title
        terms{
          nodes{
            termTaxonomyId
          }
        }
      }
    } 
    allWpTypeSchool {
      nodes {
        name
        databaseId          
        description
        slug
        taxonomyName  
      }
    }
    allWpLevelsSchool{
      nodes{
        name
        databaseId     
        description
        slug
        taxonomyName   
      }
    }
    allWpStateSchool{    
      nodes{
        name
        databaseId     
        description
        slug
        taxonomyName    
      }
    }  
  }
`);
  const [ubicationUser, setUbicationUser]=useState(null);
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  function success(pos) {
    const crd = pos.coords;
    // console.log('Your current position is:');
    // setUbicationUser({lat:crd.latitude,long:crd.longitude})
  }
  const changeNameFromObject = (object)=>{
    const result = object.nodes.map(element=>{ return {...element, name:element.name+"s", slug:element.slug+"s", description:""}})    
    return {
      nodes: result
    }
  }
  
  useEffect(() => {



    // console.log(allWpTypeSchool.nodes.map(element=>{ return {...element, name:element.name+"s", description:""}}));
    // console.log(allWpTypeSchool);
    /* const allWpTypesWithChangeName= changeNameFromObject(allWpTypeSchool)
    
    const taxonomies = [allWpTypesWithChangeName, allWpLevelsSchool, allWpStateSchool];
    const groupSizes = [1, 2, 3];

    const getCombinations = (size, index, currentCombination, combinations) => {
      if (currentCombination.length === size) {
          combinations.push([...currentCombination]);
          return;
      }
      for (let i = index; i < taxonomies.length; i++) {
          for (let j = 0; j < taxonomies[i].nodes.length; j++) {
              const newCombination = [...currentCombination, taxonomies[i].nodes[j]];
              getCombinations(size, i + 1, newCombination, combinations);
          }
        }
      }

    const groupedTaxonomies = groupSizes.map(size => {
        let combinations = []
        getCombinations(size, 0, [], combinations)
        return {[`group${size}`]: combinations};
    }); */
    
    // console.log(groupedTaxonomies);

    // console.log(groupedTaxonomies[1].group2.map(({ slug, name }) => ({ slug, name })));
    // console.log(groupedTaxonomies[1].group2.map(element=>element.map(({ slug, name, description }) => ({ slug, name, description }))));
      // console.log(groupedTaxonomies[1].group2);
    // console.log(groupedTaxonomies[1].group2.map(element=>({slug:element[0].slug+"-"+element[1].description+"-"+element[1].slug})));

    // console.log(allWpColegio.nodes.map(element=>{
    //   element.terms === null ? {...element, taxonomies:[]} 
    //   : 
    //   {...element, taxonomies:element.terms.nodes.reduce((acc,element)=> {  
    //     return element.termTaxonomyId}, 
    //     []) }
    // }));



  //  console.log(allWpColegio.nodes.map(element=>{
  //   return {title:element.title, 
  //     slug: element.terms === null ? null : 
  //     element.terms.nodes.map(element=>element.slug),
  //     taxonomiesList:element.terms === null ? []
  //     :
  //     element.terms.nodes.reduce((acc, element)=>
  //     {return [...acc, element.termTaxonomyId]},[])
  //    }
  //  }));

    // console.log(navigator.permissions.query({name: 'geolocation'}));
    // navigator.geolocation.getCurrentPosition(success, error, options);
    navigator.permissions && navigator.permissions.query({name: 'geolocation'})
    .then(function(PermissionStatus) {
        if (PermissionStatus.state === 'granted') {
              // console.log("Aceptado");
              navigator.geolocation.getCurrentPosition(success, error, options);
        } else if (PermissionStatus.state === 'prompt') {
              // prompt - not yet grated or denied
              navigator.geolocation.getCurrentPosition(success, error, options);
        } else {
            // Permission denegated
        }
    })

},[])


  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 7
    },
    desktop: {
      breakpoint: { max: 3000, min: 1281 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1280, min: 421 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 420, min: 0 },
      items: 3
    }
  };

  return (
      <main className="main">       
        <GlobalContextProvider>
          <Header/>
        </GlobalContextProvider>        
          <FindSchool/>        
        <section className="section section--testimonial">
          <div className="content--block">
              <StaticImage className="image--block" src="../static/images/image-martha.jpg" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
              {/* <StaticImage className="image--block" src="https://picsum.photos/seed/picsum/360/222" alt="A dinosaur" placeholder="blurred" layout="fixed"/> */}
              <div className="flex flex-col content__text " >                
                <StaticImage className="image--quote" src="../static/svg/quote.svg" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
                <h3 className="title--h6 section">
                  Martha Marcano
                </h3>
                <p className="text--primary">
                  Contadora y madre
                </p>
                <p className="text--body" >
                  Me ayudaron a conseguir rapidamente el colegio ideal para mis hijos. Estoy realmente feliz
                </p>
              </div>
          </div>
          <div className="content--block" >
            <h2 className="title--h6 title-carousel section" >
              Las mejores instituciones estan  aquí
            </h2>
            <Carousel className="carousel" centerMode={true} responsive={responsive} >
              <div className="flex flex-row item">
              <StaticImage className="image--quote" src="../static/images/clients/image1.png" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
                {/* <img className='img--clients'  src="https://picsum.photos/seed/picsum/209/105"></img>  */}
              </div>
              <div className="flex flex-row item">
                {/* <img className='img--clients'  src="https://picsum.photos/seed/picsum/209/105"></img>  */}
                <StaticImage className="image--quote" src="../static/images/clients/image2.png" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
              </div>
              <div className="flex flex-row item">
                {/* <img className='img--clients'  src="https://picsum.photos/seed/picsum/209/105"></img>  */}
                <StaticImage className="image--quote" src="../static/images/clients/image3.png" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
              </div>
              <div className="flex flex-row item">
                {/* <img className='img--clients'  src="https://picsum.photos/seed/picsum/209/105"></img>  */}
                <StaticImage className="image--quote" src="../static/images/clients/image4.png" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
              </div>
              <div className="flex flex-row item">
                {/* <img className='img--clients'  src="https://picsum.photos/seed/picsum/209/105"></img>  */}
                <StaticImage className="image--quote" src="../static/images/clients/image5.png" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
              </div>
              <div className="flex flex-row item">
                {/* <img className='img--clients'  src="https://picsum.photos/seed/picsum/209/105"></img>  */}
                <StaticImage className="image--quote" src="../static/images/clients/image1.png" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
              </div>
            </Carousel>
          </div>
          <div className="content--block-family">
            <div className="content--block__content">
              <StaticImage className="image--block" src="../static/images/image-family.jpg" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
              {/* <StaticImage className="image--block" src="https://picsum.photos/seed/picsum/360/222" alt="A dinosaur" placeholder="blurred" layout="fixed"/> */}
              <div className="content__text">
              <h3 className="title--h6 title section">
              Unete a la familia 
              </h3>
              <p className="text--body" >
              Si eres miembro de algun instituto, padre de familia o alguien que simplemente conoce de algun instituto que considera deba de ser reconocido, agregalo a nuestro listado y deja que sea descubierto
              </p>
              <Link to="/" className="btn btn--normal btn--primary" >
                Comenzar
              </Link>
              </div>
            
            </div>            
          </div>        
        </section>
        <section className="section">
          <div className="section__image--portada-two" >
              <h2 className='title--h5'>Encontremos juntos el colegio que buscas</h2>
              <Link to="/" className="btn btn--normal btn--primary" >
                  Buscar instituto
              </Link>
          </div>
        </section>
        <Footer/>
      </main>
      )
}

export default IndexPage
// export const Head = () => <Seo title="Home" />
