import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
export const ShareIcon = (props) => {
 const { width, height, color } = props
 return (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width || 24} height={height || 24} fill="none" {...props}>
   <Path
    fill={color || '#fff'}
    stroke={color || '#fff'}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
   />
   <Path
    fill={color || '#fff'}
    stroke={color || '#fff'}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"
   />
  </Svg>
 )
}
