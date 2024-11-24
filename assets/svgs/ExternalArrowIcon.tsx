import { View, Text } from 'react-native'
import React from 'react'
import { Path, Svg } from 'react-native-svg'

const ExternalArrowIcon = () => {
    return (
        <Svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M11.25 9.75C11.748 9.75 12.1875 10.1895 12.1875 10.6875V13.5C12.1875 14.5547 11.3379 15.375 10.3125 15.375H1.875C0.820312 15.375 0 14.5547 0 13.5V5.0625C0 4.03711 0.820312 3.1875 1.875 3.1875H4.6875C5.18555 3.1875 5.625 3.62695 5.625 4.125C5.625 4.65234 5.18555 5.0625 4.6875 5.0625H1.875V13.5H10.3125V10.6875C10.3125 10.1895 10.7227 9.75 11.25 9.75ZM14.2969 0.375C14.6777 0.375 15 0.697266 15 1.07812V5.0625C15 5.44336 14.7656 5.79492 14.4141 5.94141C14.0625 6.08789 13.6523 6 13.3887 5.73633L12.1875 4.53516L6.26953 10.4238C6.09375 10.5996 5.85938 10.6875 5.625 10.6875C5.36133 10.6875 5.12695 10.5996 4.95117 10.4238C4.57031 10.0723 4.57031 9.45703 4.95117 9.10547L10.8398 3.1875L9.63867 1.98633C9.375 1.72266 9.28711 1.3125 9.43359 0.960938C9.58008 0.609375 9.93164 0.375 10.3125 0.375H14.2969Z" fill="#FAFAFA" />
        </Svg>

    )
}

export default ExternalArrowIcon