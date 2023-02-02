/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,jsx,ts,tsx}",
      "./src/components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      /* borderRadius: {
        10:"10px",
      }, */
      /* fontSize: {
        "34":"2.125rem",
      }, */
      colors:{
        white:{
          "default":"#fff"
        },
        global:{
          primary:{
            500:"#F8BF20",
            700:"#C08D02"
          },
          secondary:{
            100:"#D2F0F9",
            300:"#9FD0DF",
            500:"#19A0C7",
            900:"#0D5064"
          },
          third:{
            500:"#4F2C0D"
          },
          danger:{
            500:"#B91C1C",
          },
          gray:{
            100:"#E0E0E0",
            200:"#A1A1AA",
            300:"#D4D4D4",
            400:"#52525B",
            500:"#27272A",
            600:"#404040",
            650:"#171717",
            700:"#18181B"
          },
          blue:{
            50:"#EDF9FD"
          }
          
        }
      },
      screens: {
        'mobile': '360px',
        // => @media (min-width: 360px) { ... }
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      extend: {
        borderRadius: {
          10:"10px",
        },  
        fontFamily:{
          'roboto':['Roboto'],
          'montserrat': ['Montserrat', 'sans-serif'],
          'inter': ['Inter', 'sans-serif'],
        },
        lineHeight: {
          '14px': '14px',
          11:"2.75rem",
          12:"3rem",
          13:"3.25rem",
          14:"3.5rem",
          15:"3.75",
          16:"4rem"
        }

      },
    },
    plugins: [],
  }