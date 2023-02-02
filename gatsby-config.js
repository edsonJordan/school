require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

module.exports = {
  /* flags: {
    DEV_SSR: true
  }, */
  
  siteMetadata: {
    title: `Colegio Ideal`,
    description: `Encuentra tu Colegio Ideal`,
    author: `@gatsbyjs`,
    siteUrl: `https://encuentra.tucolegioideal.com/`,
  },
  plugins: [
    'gatsby-plugin-postcss',  
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Roboto\:100,300,400,500,700,900`,
          `Montserrat\:100,200,300,400,500,600,700,800,900`,  
          `Inter\:100,300,400,500,600,700,800,900`,           
        ],
        display: 'swap'
      }
    },
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        // includedRoutes: [
        //   "**/posts",
        //   "**/categories",
        //   "**/taxonomies",
        //   "**/users"
        // ],
          hostingWPCOM: false,
          useACF: false,
          
          includedRoutes: [
            "**/posts",
            "**/categories",
            "**/taxonomies",
            "**/Colegios",
            "**/users"
          ], 
          customPostTypes: [
            {
              type: "Colegios", // Utiliza el nombre correcto del custom post type
              base: "Colegios",
              restApiRoutePrefix: "Colegios"
            }
          ],      
          
        url:
        // allows a fallback url if WPGRAPHQL_URL is not set in the env, this may be a local or remote WP instance.
          process.env.WPGRAPHQL_URL,
        /* schema: {
          //Prefixes all WP Types with "Wp" so "Post and allPost" become "WpPost and allWpPost".
          typePrefix: `Wp`,
        }, */
        /* develop: {
          //caches media files outside of Gatsby's default cache an thus allows them to persist through a cache reset.
          hardCacheMediaFiles: true,
        }, */
        type: {
          Post: {
            limit:
              process.env.NODE_ENV === `development`
                ? // Lets just pull 50 posts in development to make it easy on ourselves (aka. faster).
                  50
                : // and we don't actually need more than 5000 in production for this particular site
                  5000,
          },
        },
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      /* options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `dominantColor`,
          quality: 50,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        }
      } */
    },
    // `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
