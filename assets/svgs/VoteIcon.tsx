import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const VoteIcon = (props) => (
 <Svg
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  width={20}
  height={20}
  fill="none"
  {...props}
 >
  <Path fill="url(#a)" d="M0 0h19.298v19.298H0z" />
  <Defs>
   <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
    <Use xlinkHref="#b" transform="scale(.01)" />
   </Pattern>
   <Image
    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFPUlEQVR4nO2dS6hXRRzHf7dQC+pGtqhAV1mLKAjihhRRC8urYvgKSojK2hQGRYuiha2KoJUQhEG06IEYZQW2CIJKyAqCogeomG+jjB6bvGb6icG5cBrn/5gzZ845c87vs7785veb7z2P+Z7fzF9EURRFURRFURQlM4DlwBHgMLCsxnFXAEeBg3WO23qsELMcqnHcA4VxZ4Db6xq71eBQ47g/OUP/AVwnfadBQdYCZ5zhDwELpM80JYgBeModH/geuFT6SpOCGICXPKJ8AsyTPtICQc4H3vOIshU4T/pG04IYgIuArz2ivCh9ow2CGIArnVfhWR6TPtEWQQzAtcDvTkr/AqukL7RJEANwm10oFvkbWCx9oG2CGIB7PWuUX4FF0nXaKIgBeNbzPPkRmC9dpsWCTACveUT5rNNrlLYKYgDmAB8NWKNMSBdpsyAGYBL4xiPKc9JF2i6IAVhov524PCxdIwdBDMaaB/500jWvxzdKl8hFEAMwDZxyUj7QqTevnAQxGCvFc+vaKl0hN0EMwJseUaalC2QqyCSwz7NonCO5Y32iIhdIBgDLPFfJE5I71iMqks0DEnjfyf0X4ELJGU/3x0LJBGCRteeLbJCcAb51CrpBMgJ4x8l/p+SM57K/u4KYdwA/2M+yN1eT6cCxbnXyP5N1KxHwglPQMxV3Qx5O7c4Ceztz2wIecIrZXkHMY07MB6vJduB4LzvjvSq5Yj2iIn/Fvs8Dz3ua35LZ5cAaZ7wvJWeA/U5BSyLjXQGcoFnMrXK55Iine/CDCmJuoXlq6+avFOAmp5DTwPWRMa+xcRpFcsX20xb5IraVk3PXCLUjuQLc6ann6ciYi2kYyRnbPFDE3HLuioz5KQ0iOQNcbg069zPpisi9hI0huWOsDk8r50lgdUR/1XcN6ZG/IAbgPs8b0j/AupLx7m9Ij24IYgDu8TQUGKv7oZINbwdVkGqank953NTHS8R6UgWpAGPH29uVy6OBcS62W59rRbqIfVOa8VwpGyJNx+RIVwFWekQxt7NbAk3HmfQy9ECQIZ0ebwXGeEUFqVYUlxMhG/2p2XSUrjOg7kcCY7yrgqQV5Ku2mo7SdYbUPhUY52MVJK0gbwfGWaKCpBXktHlgB8b6PLUo0nVG1L8lMNYqFeT/C72jof9hI/78JHBV4ElAP6cUJTB/7JyslDqx3yiOJCpoW2Aum0lIifyxczNRd9d4yoKWBl6pySiZPyFXejTA+sQF7Tfu7pi5LCAhJfM3rK9qviu9TUQUtH2cNiJryycjIv/NVc75qEnYVUNBWOGHimL2o5CQiPx3VT3vgyZgbogFHlHQLNsGmY9GrNS+VkT+Zo7mptKhmNBUTQUV+c0eCXu1jTHPburZSWIi85+qQ5CNNRY0aK3i7gtMRmT+G+sQ5I0aC2qcyPxfr0OQvTUW1DiR+e9JLcZ8z1mGKQtqnMj8zVxdlvo0nXF3H63zLe7IDPGve1YDu8cMke4MFWDTmGIMPM2BzJDhd4vibuFBbEopyI4xEhjav0tmyOgmwFHsqFyIgsN7fIwEhnpQZIaMPlVoFMeTOL/GvRyzhrFMwS4AXNKY8xvg8K6RnsDZX/lpxvkNcHh353REU1nsQ31PY85viMNr3z7MA29SOgZnnxtrA8So3vkNdXiVc5ip9AAdz8EASjhTqY9WVZpyfkMdXiWx8xvq8CoJnd8yDq+S0PkdsOtJKcd0qp8OUsoR7/wCH5YcXEnh/HoOpFTKcyzFydVKefZVIcjSps4Z6RgHQprIFUVRFEVRFEVRpCb+A60j3DV0Ysu+AAAAAElFTkSuQmCC"
    id="b"
    width={100}
    height={100}
   />
  </Defs>
 </Svg>
)
