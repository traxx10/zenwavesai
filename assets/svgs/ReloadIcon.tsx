import { Path, Svg } from 'react-native-svg'

export const ReloadIcon = (props: { width: any; height: any }) => {
 const { width, height } = props
 return (
  <Svg
   width={width || '18'}
   height={height || '18'}
   viewBox="0 0 18 18"
   fill="none"
   //   xmlns="http://www.w3.org/2000/svg"
  >
   <Path
    d="M16.2499 3.198V7.549H11.8989"
    stroke="white"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
   />
   <Path
    d="M14.43 11.171C13.9586 12.5052 13.0664 13.6499 11.8877 14.4329C10.7091 15.2158 9.30798 15.5945 7.89543 15.5118C6.48288 15.4291 5.13547 14.8896 4.05624 13.9745C2.97701 13.0594 2.22443 11.8184 1.91191 10.4384C1.59938 9.05833 1.74385 7.61412 2.32354 6.32336C2.90323 5.03259 3.88673 3.96519 5.12584 3.28202C6.36495 2.59884 7.79254 2.3369 9.19347 2.53566C10.5944 2.73443 11.8928 3.38313 12.893 4.38402L16.245 7.54802"
    stroke="white"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
   />
  </Svg>
 )
}
