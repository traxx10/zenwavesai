import { View, Text } from 'react-native'
import React from 'react'
import { Circle, Path, Svg } from 'react-native-svg'

const CircleWithTick = () => {
    return (
        <Svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Circle cx="6.74976" cy="7.5" r="6.25" stroke="white" />
            <Path d="M7.16642 11.25L2.99976 7.5266L4.45809 6.2234L7.16642 8.64362L14.0414 2.5L15.4998 3.80319L7.16642 11.25Z" fill="white" />
        </Svg>

    )
}

export default CircleWithTick