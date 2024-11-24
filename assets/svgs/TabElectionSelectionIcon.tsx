import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const TabElectionSelectionIcon = (props) => (
 <Svg
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  width={21}
  height={21}
  fill="none"
  {...props}
 >
  <Path fill="url(#a)" d="M0 0h21v21H0z" />
  <Defs>
   <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
    <Use xlinkHref="#b" transform="scale(.01)" />
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
