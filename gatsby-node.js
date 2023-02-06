
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /\bmapbox-gl-csp-worker.js\b/i,
            use: { loader: 'worker-loader' },
          },
          {
            test: /mapbox-gl/,
            use: loaders.null(),
          }
        ],
      },
    })
  }
}

const path = require("path")


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const queryResults = await graphql(`
  {
    allWpColegio {
      nodes {
        seo{
					canonical
          cornerstone
          metaDesc
          metaKeywords
          opengraphTitle
          title
          opengraphImage{
          gatsbyImage
          }
          twitterTitle
          twitterDescription
          twitterImage{
          gatsbyImage
          }        
        }
        databaseId
        title
        slug
        uri
        id
        customFieldColegio {
          activities
          approach
          description
          email
          facebook
          fieldGroupName
          instagram
          lenguages          
          direction
          phone
          whatsapp
          web
          proposal
          price
          photos1 {
            altText
            localFile{
              childImageSharp{                
                gatsbyImageData(
                  width: 1000
                  height: 360
                  quality: 100
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            gatsbyImage(
              breakpoints: 10
              placeholder: DOMINANT_COLOR
              height: 10
              width: 10
              formats: JPG
            )
          }
          photos2 {
            altText
            localFile{
              childImageSharp{                
                gatsbyImageData(
                  width: 1000
                  height: 200
                  
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            gatsbyImage(
              breakpoints: 10
              placeholder: DOMINANT_COLOR
              height: 200
              width: 10
              formats: JPG
            )
          }
          photos3 {
            altText
            localFile{
              childImageSharp{                
                gatsbyImageData(
                  width: 1000
                  height:200
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            gatsbyImage(
              breakpoints: 10
              placeholder: DOMINANT_COLOR
              height: 200
              width: 10
              formats: JPG
            )
          }
          photos4 {
            altText
              localFile{
              childImageSharp{                
                gatsbyImageData(
                  width: 1000
                  height:200
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            gatsbyImage(
              breakpoints: 10
              placeholder: DOMINANT_COLOR
              height: 200
              width: 10
              formats: JPG
            )
          }
        }
        typeSchools {
          nodes {
            name
            databaseId
            slug
          }
        }
        stateSchools {
          nodes {
            name
            databaseId
            slug
          }
        }
        levelsSchools {
          nodes {
            name
            databaseId
            slug
          }
        }
        comments {
          nodes {
            databaseId
            content
            author {
              node {
                ... on WpCommentAuthor {
                  name
                  databaseId
                  avatar {
                    default
                    url
                  }
                }
              }
            }
            customFieldsComentarios {
              feeling
              feelingchildren
              fieldGroupName
              humanwarmth
              level
              price
              qualityeducative
            }
          }
        }
        content
      }
      totalCount
    }
  }
  
  `)

  

 

  
    


    const queryResultsTaxonomies = await graphql(`
    {
      allWpStateSchool {
        nodes {
          name
          slug
          colegios {
            nodes {
              databaseId
              slug
              title
              status
              customFieldColegio {
                activities
                approach
                description
                approach
                lenguages
                email
                facebook
                price
                phone
                proposal
                whatsapp
                web
                latitude
                longitude
              }
              levelsSchools {
                nodes {
                  name
                  databaseId
                }
              }
              stateSchools {
                nodes {
                  databaseId
                  name
                }
              }
              typeSchools {
                nodes {
                  name
                  databaseId
                }
              }
              comments{
								nodes{
									databaseId
                  content
                  stars
                }
              }
            }
          }
        }
      }
    }
    `);

  const queryResultsLevelsAndTypeSchools = await graphql(`
    query ($limit: Int = 100) {
      allWpLevelsSchool(limit: $limit) {
        nodes {
          name
          slug
          databaseId
        }
      }
      allWpTypeSchool(limit: $limit) {
        nodes {
          databaseId
          slug
          name
        }
      }
      allWpStateSchool(limit: $limit) {
        nodes {
          databaseId
          name
          slug
          description
        }
      }
    }
  `);


    const schoolTemplate = path.resolve(`src/templates/customPosts/schools.js`)
    queryResults.data.allWpColegio.nodes.forEach(node => {
      createPage({
        path: `${node.uri}`,
        component: schoolTemplate,
        context: {
          school: node,
          levelAndSchool:queryResultsLevelsAndTypeSchools
        },
      })
    })
    
    
  
  const schoolTemplateTaxonomies = path.resolve(`src/templates/taxonomies/states.js`)
  queryResultsTaxonomies.data.allWpStateSchool.nodes.forEach(node => {
    createPage({
      path: `mejores-escuelas/${node.slug}`,
      component: schoolTemplateTaxonomies,
      context: {
        school: node,
        levelAndSchool:queryResultsLevelsAndTypeSchools
      },
    })
  }) 

  /* const bestSchoolesTemplate = path.resolve(`src/templates/filtersSchool/mejores-escuelas.js`)
  createPage({
    path:`mejores`,
    component:bestSchoolesTemplate,
    context:{
      taxomiesSchool:[],
    }
  }) */
  /* exports.onCreatePage = ({ page, actions }) => {
    const { createPage, deletePage } = actions
    if (page.path.match(/^\/mejores-escuelas/)) {
      page.matchPath = `/mejores-escuelas*`
      createPage(page)
    }
  } */

/* 
*** Prueba
query MyQuery {
  allWpColegio
  (filter: {terms: {nodes: {elemMatch: 
    {termTaxonomyId: {eq: 2418}    
    } 
  	}}}
  	) {
    nodes {
              databaseId
              slug
              title
              status
              customFieldColegio {
                activities
                approach
                description
                approach
                lenguages
                email
                facebook
                price
                phone
                proposal
                whatsapp
                web
                latitude
                longitude
              }
              levelsSchools {
                nodes {
                  name
                  databaseId
                }
              }
              stateSchools {
                nodes {
                  databaseId
                  name
                }
              }
              typeSchools {
                nodes {
                  name
                  databaseId
                }
              }
              comments{
								nodes{
									databaseId
                  content
                  stars
                }
              }
            }
    totalCount
  }
}
*/
  



  /* const schoolTemplateUsers = path.resolve(`src/templates/users/user.js`)
  queryResultsUsers.data.allWpUser.nodes.forEach(node => {
    createPage({
      path: `${node.slug}`,
      component: schoolTemplateUsers,
      context: {
        school: node,
      },
    })
  }) */
  
}
