import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'

export const TabCinemaIcon = (props) => {
 const { width, height, color } = props
 return (
  <Svg
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   width={width || 21}
   height={height || 21}
   fill="none"
   {...props}
  >
   {/* Pattern Path */}
   <Path fill="url(#a)" fillOpacity={0.62} d="M0 0h21v21H0z" />

   {/* Overlay Color Path */}
   <Path fill={color} fillOpacity={0.5} d="M0 0h21v21H0z" />

   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="scale(.01)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACjklEQVR4nO3du2oUURyA8bUwtRF8AS/ogwgGCV6K9IoixoAWeQovi4qK77C12qloYUrxUohtmoCFWkf4ZGCUsNmws2fOzP5n9vvBVoHdM/OxObtzTjKDgSRJkiRJkiQ1CTgKXAeeASMfVDkHxbm6BiznjnEb+I1S/QI2csUYJg9D4+7VjXF531Oqrgt1gnyp/fIa9yk1xql9T6VcTqQEOZ/t5TVuJSXIGgdbq/gcxUe/vhm1df4MUo1BgjFIMAYJxiDBGCQYgwRjkGAMEkzIIKrHIMEYJJhOBnldLh2vA+/ol84FuQ8cGhvPReA7/dCpIDvA0gFjWgI2gZ90W/YgHypuA9pOGOyrCmM7BjwH/tC+7YrHXpyjXqyHjGYY4xngJe0K+T0kRJB/gLPAV9phkCqAw8AN4IdB5vwOmbDl9TGw21AY3yEpGpxfDFJHA/OLQerKPL8YJJdM84tBcgNOAy/6FGRY/nzaY6upA84BWAW+zTi+rYrHPuzLtaxRlrNd/TiL62MPWz5Gg0xTXu43SKAgNw0y2cggCzyHFIrFMOBNi8foHDJlUn/UYoxGgvixl1gfe0OthyReeOzVF8NOBsFLJzGC4MXFOEHw8nuMILhANfGkuIS7qJM6bnKIEwS3AcV4h+BGuf/cSkqsraRN2nGzdawghQf+OUKsIIW3wB3gFvCefunUr6xFYJBgDBJMp76pR7dw6yHRGSQYgwRjkGAMEoxBgjFIMAYJxiDBzC3ISosHuWjOpQQ5Oe9R99jxmYOUUT7Pe+Q99DEpRhnk0rxH30OryUHKKMVyqvK4WyvGnigb5a3flKb4D3jrWWLsibIMXAWeelNJqt5Y8wlwBTiSNYYkSZIkSZIkDcb8BeZDHgcZh6D/AAAAAElFTkSuQmCC"
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
