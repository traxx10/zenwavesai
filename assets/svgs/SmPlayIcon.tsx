import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const SmPlayIcon = (props) => {
 const { width, height } = props
 return (
  <Svg
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   width={width || 9}
   height={height || 9}
   fill="none"
   {...props}
  >
   <Path fill="url(#a)" d="M0 0h9v9H0z" />
   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="scale(.01)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACDUlEQVR4nO3cvYpTQRjG8UELBRvFVvQC1MaPC1j1FsTOK1i2tbbS1sJPrGwEm0XWFW9AO3MDptbU4jZG9i8HdjCCYtzkZN6T9/9r0r6Th8k8JJNTiiRJkiRJkiRJkiRJkiRpbQFXgafAO+AxcKn1TGkBW8APfrcPPANOtp4vFeDiH8KY9Rm42XrONID7zOc1cKb1vGsPeMn8vgKbwJHWc68t4BX/76OHfqxAOt8PPu6O9zVbSgsEUn0Crrdex9pYQiC1Ir8ATrdez+AtKZDqC3C79ZoGbcmBVG+As63XNkg9BdL5BtwBjrZe46D0GEj1ATjfep2DsYJAOlbkYIFUVuRggXSsyMECqazIwQKpdqzIsQLpWJGDBVK9T1+RgwUyW5GPlYwCBjJbka+VbAIHUivyw1S7JXgg1XbJYiCBdDZKBgMK5G7JwECCGVAgGyWDgQSyXbIYQO19Yu2NYQzcKNkE3CFT4AFwomQULJBR+iuqQQLZ84ZKnB2y6w9UMT6yJt5yjHGG7HsPOM6hPk5ZZQMGMk1dZYMFMkpfZYMEsmeVjbNDdoFzh5knvSUHMrHKLsi/tK1fIGOrbIxAplbZOIGMgMt9zJPeIR6tseWjNXoE3JszjB2/lV0B4MI/Hs80AW6tYhb9CmXzLw8wew6c8o1qALgCPALeHrx6aEuSJEmSJEmSJEmSJEmSyiJ+Av0ELYJDLJLuAAAAAElFTkSuQmCC"
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
