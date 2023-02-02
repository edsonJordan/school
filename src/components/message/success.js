import { StaticImage } from 'gatsby-plugin-image'
import React from 'react'

export default function Success({message}) {
  return (
    <div className='modal__message'>
        
        <div className='message__success'>
            <StaticImage 
                src='../../static/svg/success__message.svg' 
                alt="A dinosaur"
                placeholder="blurred"
                layout="fixed" />
            <p>{message}</p>
        </div>
    </div>
  )
}
