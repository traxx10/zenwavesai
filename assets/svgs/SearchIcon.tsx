import React from 'react'
import { Path, Svg } from 'react-native-svg'

export const SearchIcon = (props) => {
 const { width, height } = props
 return (
  <Svg
   width={width || '17'}
   height={height || '17'}
   viewBox="0 0 17 17"
   fill="none"
   //   xmlns="http://www.w3.org/2000/svg"
  >
   <Path
    d="M14.395 7.61203C14.395 8.93247 14.0034 10.2232 13.2698 11.3211C12.5362 12.419 11.4935 13.2747 10.2735 13.78C9.0536 14.2852 7.71123 14.4174 6.41618 14.1597C5.12114 13.902 3.93159 13.2661 2.99797 12.3323C2.06436 11.3986 1.42861 10.2089 1.17113 8.91385C0.913645 7.61876 1.04599 6.27641 1.55144 5.05655C2.05688 3.83669 2.91272 2.79411 4.01071 2.06066C5.10871 1.32721 6.39954 0.935837 7.71997 0.936035C9.49038 0.9363 11.1882 1.63978 12.44 2.89174C13.6917 4.14371 14.395 5.84162 14.395 7.61203V7.61203Z"
    stroke="white"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
   />
   <Path
    d="M16.059 15.951L12.429 12.321"
    stroke="white"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
   />
  </Svg>
 )
}
