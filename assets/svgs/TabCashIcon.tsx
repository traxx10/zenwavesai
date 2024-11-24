import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image, Rect } from 'react-native-svg'
export const TabCashIcon = (props) => {
 const { width, height } = props
 return (
  <Svg
   width={width || '21'}
   height={height || '21'}
   viewBox="0 0 21 21"
   fill="none"
   //    xmlns="http://www.w3.org/2000/svg"
   //    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
   <Rect width="21" height="21" fill="url(#pattern0_1_1241)" fillOpacity="0.62" />
   <Defs>
    <Pattern id="pattern0_1_1241" patternContentUnits="objectBoundingBox" width="1" height="1">
     <Use xlinkHref="#image0_1_1241" transform="scale(0.01)" />
    </Pattern>
    <Image
     id="image0_1_1241"
     width="100"
     height="100"
     xlinkHref="data:image/png;base64,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"
    />
   </Defs>
  </Svg>
 )
}
