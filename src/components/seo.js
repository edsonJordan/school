/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import React from "react"

// import { useSiteMetadata } from "../hooks/use-site-metadata"

export const Seo = ({data, children}) => {
  // const { title: defaultTitle, description: defaultDescription, image, siteUrl, twitterUsername } = useSiteMetadata()
  // console.log(data);
  // const seo = {
  //   title: title || defaultTitle,
  //   description: description || defaultDescription,
  //   image: `${siteUrl}${image}`,
  //   url: `${siteUrl}${pathname || ``}`,
  //   usertTtwitter: twitterUsername,
  // }

  return (
    <>
      <title>{data.title}</title>
      <meta name="description" content={data.metaDesc} />
       {/* <meta name="image" content={data.image} /> */}
       <meta name="twitter:card" content="summary_large_image" />
       <meta name="twitter:title" content={data.twitterTitle} />
       {/* <meta name="twitter:url" content={seo.url} /> */}
       <meta name="twitter:description" content={data.twitterDescription} />
       {/* <meta name="twitter:image" content={data.image} /> */}
       {/* <meta name="twitter:creator" content={seo.twitterUsername} /> */}
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>👤</text></svg>" /> 
      {children}
    </>
  )
}