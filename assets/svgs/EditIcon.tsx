import * as React from 'react'
import Svg, { Path, Defs, LinearGradient, Stop, SvgProps } from 'react-native-svg'
export const EditIcon = (
 props: React.JSX.IntrinsicAttributes &
  React.JSX.IntrinsicClassAttributes<Svg> &
  Pick<
   Readonly<SvgProps>,
   | 'width'
   | 'height'
   | 'viewBox'
   | 'color'
   | 'title'
   | 'children'
   | 'opacity'
   | 'fill'
   | 'fillOpacity'
   | 'fillRule'
   | 'stroke'
   | 'strokeWidth'
   | 'strokeOpacity'
   | 'strokeDasharray'
   | 'strokeDashoffset'
   | 'strokeLinecap'
   | 'strokeLinejoin'
   | 'strokeMiterlimit'
   | 'vectorEffect'
   | 'clipRule'
   | 'clipPath'
   | 'translate'
   | 'translateX'
   | 'translateY'
   | 'origin'
   | 'originX'
   | 'originY'
   | 'scale'
   | 'scaleX'
   | 'scaleY'
   | 'skew'
   | 'skewX'
   | 'skewY'
   | 'rotation'
   | 'x'
   | 'y'
   | 'transform'
   | 'pointerEvents'
   | 'onStartShouldSetResponder'
   | 'onMoveShouldSetResponder'
   | 'onResponderEnd'
   | 'onResponderGrant'
   | 'onResponderReject'
   | 'onResponderMove'
   | 'onResponderRelease'
   | 'onResponderStart'
   | 'onResponderTerminationRequest'
   | 'onResponderTerminate'
   | 'onStartShouldSetResponderCapture'
   | 'onMoveShouldSetResponderCapture'
   | 'disabled'
   | 'onPress'
   | 'onPressIn'
   | 'onPressOut'
   | 'onLongPress'
   | 'delayPressIn'
   | 'delayPressOut'
   | 'delayLongPress'
   | 'id'
   | 'marker'
   | 'markerStart'
   | 'markerMid'
   | 'markerEnd'
   | 'mask'
   | 'onLayout'
   | 'accessibilityLabel'
   | 'accessible'
   | 'testID'
   | 'font'
   | 'fontStyle'
   | 'fontVariant'
   | 'fontWeight'
   | 'fontStretch'
   | 'fontSize'
   | 'fontFamily'
   | 'textAnchor'
   | 'textDecoration'
   | 'letterSpacing'
   | 'wordSpacing'
   | 'kerning'
   | 'fontFeatureSettings'
   | 'fontVariantLigatures'
   | 'fontVariationSettings'
   | 'hitSlop'
   | 'needsOffscreenAlphaCompositing'
   | 'removeClippedSubviews'
   | 'style'
   | 'nativeID'
   | 'collapsable'
   | 'renderToHardwareTextureAndroid'
   | 'focusable'
   | 'tabIndex'
   | 'shouldRasterizeIOS'
   | 'isTVSelectable'
   | 'hasTVPreferredFocus'
   | 'tvParallaxProperties'
   | 'tvParallaxShiftDistanceX'
   | 'tvParallaxShiftDistanceY'
   | 'tvParallaxTiltAngle'
   | 'tvParallaxMagnification'
   | 'onTouchStart'
   | 'onTouchMove'
   | 'onTouchEnd'
   | 'onTouchCancel'
   | 'onTouchEndCapture'
   | 'onPointerEnter'
   | 'onPointerEnterCapture'
   | 'onPointerLeave'
   | 'onPointerLeaveCapture'
   | 'onPointerMove'
   | 'onPointerMoveCapture'
   | 'onPointerCancel'
   | 'onPointerCancelCapture'
   | 'onPointerDown'
   | 'onPointerDownCapture'
   | 'onPointerUp'
   | 'onPointerUpCapture'
   | 'accessibilityActions'
   | 'aria-label'
   | 'accessibilityRole'
   | 'accessibilityState'
   | 'aria-busy'
   | 'aria-checked'
   | 'aria-disabled'
   | 'aria-expanded'
   | 'aria-selected'
   | 'accessibilityHint'
   | 'accessibilityValue'
   | 'aria-valuemax'
   | 'aria-valuemin'
   | 'aria-valuenow'
   | 'aria-valuetext'
   | 'onAccessibilityAction'
   | 'importantForAccessibility'
   | 'aria-hidden'
   | 'aria-modal'
   | 'role'
   | 'accessibilityLabelledBy'
   | 'aria-labelledby'
   | 'accessibilityLiveRegion'
   | 'aria-live'
   | 'accessibilityElementsHidden'
   | 'accessibilityViewIsModal'
   | 'onAccessibilityEscape'
   | 'onAccessibilityTap'
   | 'onMagicTap'
   | 'accessibilityIgnoresInvertColors'
   | 'accessibilityLanguage'
  > & { readonly preserveAspectRatio?: string | undefined } & {},
) => {
 const { width, height } = props
 return (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width || 24} height={height || 24} fill="none" {...props}>
   <Path fill="url(#a)" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" />
   <Path
    fill="url(#b)"
    d="M12.523 7.878H8.829a1.056 1.056 0 0 0-1.056 1.056v7.389a1.056 1.056 0 0 0 1.056 1.055h7.389a1.056 1.056 0 0 0 1.055-1.056v-3.694"
   />
   <Path
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12.523 7.878H8.829a1.056 1.056 0 0 0-1.056 1.056v7.389a1.056 1.056 0 0 0 1.056 1.055h7.389a1.056 1.056 0 0 0 1.055-1.056v-3.694"
   />
   <Path
    fill="url(#c)"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M16.482 7.086a1.12 1.12 0 0 1 1.583 1.583l-5.014 5.014-2.111.528.528-2.111 5.014-5.014Z"
   />
   <Defs>
    <LinearGradient id="a" x1={-13.008} x2={43.032} y1={-19.704} y2={64.488} gradientUnits="userSpaceOnUse">
     <Stop stopColor="#000F93" />
     <Stop offset={1} stopColor="#48519F" />
    </LinearGradient>
    <LinearGradient id="b" x1={2.624} x2={24.806} y1={0.078} y2={33.404} gradientUnits="userSpaceOnUse">
     <Stop stopColor="#000F93" />
     <Stop offset={1} stopColor="#48519F" />
    </LinearGradient>
    <LinearGradient id="c" x1={6.915} x2={24.256} y1={0.687} y2={26.739} gradientUnits="userSpaceOnUse">
     <Stop stopColor="#000F93" />
     <Stop offset={1} stopColor="#48519F" />
    </LinearGradient>
   </Defs>
  </Svg>
 )
}
