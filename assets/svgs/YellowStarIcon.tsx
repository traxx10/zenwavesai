import { View, Text } from 'react-native'
import React from 'react'
import { Path, Svg } from 'react-native-svg'

const YellowStarIcon = (props) => {
  const { height, width } = props;
  return (
    <Svg width={width || "10"} height={height || '10'} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M5.10308 0.886733L6.18774 3.08471C6.25608 3.2225 6.38725 3.3184 6.54047 3.34045L8.96553 3.69318C9.34913 3.7494 9.50235 4.22118 9.22457 4.49124L7.46971 6.20201C7.35948 6.31004 7.30878 6.46436 7.33523 6.61647L7.74969 9.03161C7.81473 9.4141 7.41349 9.70511 7.07068 9.52544L4.90136 8.38456C4.76467 8.31291 4.60153 8.31291 4.46595 8.38456L2.29552 9.52544C1.95161 9.70621 1.55037 9.4141 1.61651 9.03161L2.03097 6.61647C2.05743 6.46436 2.00672 6.31004 1.89649 6.20201L0.141634 4.49124C-0.136145 4.22008 0.0170747 3.7483 0.400674 3.69318L2.82573 3.34045C2.97785 3.3184 3.11012 3.2225 3.17847 3.08471L4.26313 0.886733C4.43508 0.538407 4.93112 0.538407 5.10308 0.886733Z" fill="#FFB800" />
    </Svg>

  )
}

export default YellowStarIcon