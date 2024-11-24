import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const CrownIcon = (props) => {
 return (
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
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFR0lEQVR4nO2dv48bRRTHFxAEaKCCiiB+CvH7x78Qfkggan6IItAhChQKykRCItACHSkSGoSbgM8788ZOZNGkOPY9W1GQIAp0nE4QQaBIFCAseraL08X27uy8Xc867yONFJ0uue+8z8zszuyekySKoiiKoiiKoiiKoiiKsub03OhJANxvAN8HwHcA6Fljzu5pMsOJE6fvNA5fsQ4PcOM/Oze+o8kM3GfuO9dgVov9APREIz88z/PrAOg1C/ijdZTPaX8awA8Hg+y2OnOkg+wx47BnHV65OgNeMY42nBs/WmeG48PR7dbhYevwr3m1MA5/4AHCNaslQLeb3WocfbVAxO52zhh6uI4cxtFb1uHl4gx42QC+WUcGa0ePWKCfStUC6MvOqVO3iAY4eDC/3jj8uqSM6QgB3AbYvEsyh7X4hk+GaY7R65IZBoNsL/fNLwce5xqKheD10bcQs2k7lMrQ6+HdBuiSdw6gi1xEqRwW6NtqtaC3RQIMh8ObrcNfq4SYtH72vEQOC3ikagYD+LlEBgB8ISDDNtcyvBB9fLmyjMkIxaOhGbIsu9EC/lG9GHSh0zlzU2gO4+iLoFrY0YuhGRID9HFQCEfnQjM4h88EZsjNYPxUaI7SF/KFDQ+HZkisw2NhM4QuhmYAyF4KFSIxOrkvgUKOScyQzwJD/B6cwY2eCxdC+wRqcSFoljr6VGKGHAgMkYVm6PfpgVAhxmT3BdcCcBSUAbJ3RXbFK183Ex6d+PMqr2Oh11MD+J/YZrnyvTfQ37x/kMgAQO+tdGRObi7G9xigfyrlADqZSGEMPl7lgmaAPpDLcHaPBTpdYYZ+L3L/P2N6fuVdh0vWZk8nkvAp5vzDvAUhHG3w/kE2Q/aQz7GFcbSVDsYPSmbg/YwFTD2E/MtHPkkd8K7bAJ0vWiuto0/qOooHwPst0HclZsZmb7B5bx0ZuG989znr67Jl6jc+mk/qxDo8tGBanuedrMQGrIhOp3PD9DEAneTr1M5rFn/N9ulV/p6kZrivkz4vHKR4qO4Mi4U4spJrdRl4OTJAv+yYndt8NJ40CC9hBuib6IQ0LSXdJWMVUpbLiEBIU1LSBTKalFIsIxIhdUtJC2Q0IaWcjIiE1CUlLSmjTinlZUQmRFpK6imjDil+MiIUIiUlrShDUoq/jEiFhEpJA2VISKkmI2IhkwZofKWkQjJCpExkeL5x0w4hnlJSYRlVpITJaIOQiRTqFr1wAHyI6GirdJEdbXDz+P4t/hnFh4jUDRsAbRBSMFNS35kx+7d8R/OymRI+M9omZIGUtKKMqoWcJ0VORtuE7CpoqAwJKbIyIhHCHfRZ/3md5ieSvteMzpLr0LSwfteU2VPRrtffKXxYFoMQh2d8L8qTp2pCMqpK8cwwuSngvrZCSG23reC3l5FfgmYrwOztkVYJEZcC/htLaSk7ZbRSiJgUqCZDUspuGa0VEiwF0Ei8MBEiZZ6MVgupLAVkZIRIWSSj9UK8pYCsjCpSlslYCyGlpUA9MnykFMlYGyGFUqBeGWWklJGxVkIWSoFmZCyTUlbG2gm5SkrDMuZJ8ZGxlkIYPoLg37CV+KXMwBeojxQ9I7kmhLQZo0LiQoVEhgqJDBUSGSokMlRIZKiQyFAhkaFCIkOFRIYKiQwVEhkqJDJUSGSokMhQIZGhQiJDhUSGCokMFRIZKiQyVEhktEIIf3opf3jytdBs4Se1xiBEW65CXKwDQWdIvnoJKiRffeFVSL76YquQfPUFViH56osauxBL+6yjj7RRcQ0E/lcfRVEURVEURVEURVEURUki5X+bHTZ42oa1tAAAAABJRU5ErkJggg=="
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
