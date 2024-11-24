import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const TabHomeIcon = (props) => (
 <Svg
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  width={21}
  height={21}
  fill="none"
  {...props}
 >
  <Path fill="url(#a)" fillOpacity={0.62} d="M0 0h21v21H0z" />
  <Defs>
   <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
    <Use xlinkHref="#b" transform="scale(.01)" />
   </Pattern>
   <Image
    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADV0lEQVR4nO3dW4gPUQDH8WPXnYgkJCW8SLmU3JYHtUV5UEou5UVJUrIvilZbUlK0FFoPRPEwL4snJSlRpJSUvChJsiJR67q7X51MabX/3f9/58w5Z+b/+9T/bS/nzLc5uzs7/znGiIiIiIiISE2AJuB8+mqq7bPFGaAROAH00V8HMEqH2iNgGnCHyu4DMxTFT4xlwGuG9hZYqSj5xtgFfKN6P4ADiuI+xBjgIsN3FRinMG5izAYekd1TYK6iZIuxDniPOx+BZkWpPcQIu/YDv3CvB2iz30NhqosxEUjI301gsqIMHmMB8Bx/XgILFWXgGJuAz/j3FdiiKP1/XhwCegmnL70M01jXYYCpwG3icQ+YbuoRsAR4RXzeAMtNPQF2At3E6zuw25QdMDJdq4uiAxhtygiYBTykeJ4Ac0yZAGuAdxTXB2C9KQNgD/CT4vttfz03RQWMBS5RPteBCaZI7Jqbrr1l9QyYZ4oA2Ah8ovy+AJtNrCK5BBLqkkuDiQkwHuikft2wx8DEwP5PAXgc+ohEwP6beVIMNx/YC3Ly192gf9kDp9KByD8nQ8VYVWc/wKvVG+QGvYJel/Llge8Ya71NrbhW+wxyJfRsC+CyrxgNQFfo2RbkCnH+fzACi0LPtEDyv8UI2BZ6lgWy1UeQg6FnWSD5vxUCaA09ywJp9RHE3qgs1WlTkLgoSGQUJDIKEhkFiYyCREZBIqMgkVGQyChIZBQkMgoSGQWJjIJERkEiU/ogPekzSo6md9oP9rIfcyvwzXylDtI1nPePAyvSO0BCKHWQ5gxj3hBozKUN8sLBuO2Tf3wrbZBOB+O2b6rxrbRBEgfj9vFQtP8pSCUK4lZiMlIQBbG0ZFWiM8StxGSkIApiacmqRGeIW4nJSEEUxNKSVYnOELcSk5GCKIilJasSnSFuJSYjBVEQS0tWJTpD3EpMRmUOciTAxK45GLd93q5vh90c9cEntiPAxI45GPfxAOPe7uaoD70Ji90myOejWBc7GPfSATYyzvu5vlPcHPWhJ7ff48TOORz3BY/j3udq3LU8hKaWfWmHc9voabvniOP9S86kXzsv3cH23wVmAnuB9nTzExevs0ALMD/n7fla0u/latzt6bHQtuEiIiIiIiIipiz+ACN3wuvEOHf0AAAAAElFTkSuQmCC"
    id="b"
    width={100}
    height={100}
   />
  </Defs>
 </Svg>
)
