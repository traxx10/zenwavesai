import React from 'react'
import { Path, Svg } from 'react-native-svg'

export const RoundedChevronForwardIcon = (props) => {
 const { width, height } = props
 return (
  <Svg width={width || '13'} height={height || '13'} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
   <Path
    d="M6.25898 1.5647C3.66647 1.5647 1.56483 3.66634 1.56483 6.25885C1.56483 8.85135 3.66647 10.953 6.25898 10.953C8.85148 10.953 10.9531 8.85135 10.9531 6.25885C10.9531 3.66634 8.85148 1.5647 6.25898 1.5647ZM5.75322 4.02635L7.98572 6.25885L5.75322 8.49135L5.20001 7.93814L6.87899 6.25885L5.20001 4.57956L5.75322 4.02635Z"
    fill="white"
   />
  </Svg>
 )
}
