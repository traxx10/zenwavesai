import { Path, Svg } from 'react-native-svg'

export const HeartIcon = (props) => {
 const { width, height, color } = props
 return (
  <Svg
   width={width || '24'}
   height={height || '24'}
   viewBox="0 0 24 24"
   fill="none"
   // xmlns="http://www.w3.org/2000/svg"
  >
   <Path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M2.87173 12.3963C1.79873 9.04626 3.05373 4.88126 6.57073 3.74926C8.42073 3.15226 10.7037 3.65026 12.0007 5.43926C13.2237 3.58426 15.5727 3.15626 17.4207 3.74926C20.9367 4.88126 22.1987 9.04626 21.1267 12.3963C19.4567 17.7063 13.6297 20.4723 12.0007 20.4723C10.3727 20.4723 4.59773 17.7683 2.87173 12.3963Z"
    fill={color || 'white'}
    stroke="white"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
   />
   <Path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M15.7384 7.51465C16.9454 7.63865 17.7004 8.59565 17.6554 9.93665L15.7384 7.51465Z"
    fill="#232631"
   />
   <Path
    d="M15.7384 7.51465C16.9454 7.63865 17.7004 8.59565 17.6554 9.93665"
    stroke="#232631"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
   />
  </Svg>
 )
}
