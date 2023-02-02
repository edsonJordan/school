import React from 'react'
import { StaticImage } from "gatsby-plugin-image"
import log_bg from '../static/images/log-bg.png';

export default function Footer() {
  return (
    <footer className="footer" >
          <div className="footer__content">
            <StaticImage className="image--logo " src="../static/images/logo-normal.png" alt="A dinosaur" placeholder="blurred" layout="fixed"/>
            <p className="paragraph" >¿Tienes alguna duda?<a className="btn__ghost--secondary" >Dejanos un mensaje</a>
            </p>
            <div className="list__paragraph--icon" > 
              <StaticImage
                src="../static/svg/map_point.svg"
                alt="A dinosaur"
                placeholder="blurred"
                layout="fixed" />
                Ciudad de Mexico, Mexico
            </div>
            <div className="icons--social" >
              <ul className="list--icons" >
                <li>
                  <StaticImage
                  src="../static/svg/facebook.svg"
                  alt="A dinosaur"
                  placeholder="blurred"
                  layout="fixed" />
                </li>
                <li>
                  <StaticImage
                  src="../static/svg/instagram.svg"
                  alt="A dinosaur"
                  placeholder="blurred"
                  layout="fixed" />
                </li>
                <li>
                  <StaticImage
                  src="../static/svg/Linkendin.png"
                  alt="A dinosaur"
                  placeholder="blurred"
                  layout="fixed" />
                </li>
              </ul>       
            </div>
          </div>
          <p className="copyright" >
            Todos los derechos reservados Tu colegio ideal © Copyright 2021
          </p>
          <img className="bg-logo"
                  src={log_bg}
                  alt="A dinosaur"
                  placeholder="blurred"
                  layout="fixed" />
        </footer>
  )
}
