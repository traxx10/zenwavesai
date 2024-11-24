import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const TrophyIcon = (props) => {
 const { width, height } = props
 return (
  <Svg
   //    xmlns="http://www.w3.org/2000/svg"
   //    xmlnsXlink="http://www.w3.org/1999/xlink"
   width={width || 40}
   height={height || 49}
   fill="none"
   {...props}
  >
   <Path fill="url(#a)" fillOpacity={0.48} d="M0 0h40v49H0z" />
   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="matrix(.01 0 0 .00816 0 .092)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,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"
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
