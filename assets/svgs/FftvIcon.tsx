import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image, SvgProps } from 'react-native-svg'

export const FftvIcon = (
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
  <Svg
   //    xmlns="http://www.w3.org/2000/svg"
   //    xmlnsXlink="http://www.w3.org/1999/xlink"
   width={width || 86}
   height={height || 34}
   fill="none"
   {...props}
  >
   <Path fill="url(#a)" d="M0 0h86v34H0z" />
   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="matrix(.0014 0 0 .00353 0 .06)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAs0AAAD5CAYAAADcOwgTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAiUaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0OCA3OS4xNjQwMzYsIDIwMTkvMDgvMTMtMDE6MDY6NTcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgcGhvdG9zaG9wOkxlZ2FjeUlQVENEaWdlc3Q9IkI0NDQ3MjJBRjM1QkUyNTlBNjhBQzg3OUVDNkZCMjA5IiBwaG90b3Nob3A6RGF0ZUNyZWF0ZWQ9IjIwMjQtMDUtMjNUMTg6NDM6NDEuMDY3LTA3OjAwIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIyMDI0LTA1LTIzVDIxOjM1OjQ4LTA3OjAwJiN4OTvmlofku7YgMjA1NkMzNzQtRUZDRS00RDM4LTgzNTctQUQyMDEyODJGMTI5LmpwZyDlt7LmiZPlvIAmI3hBOzIwMjQtMDUtMjNUMjI6MDc6MjgtMDc6MDAmI3g5O+aWh+S7tiBGRlRWKy5wbmcg5bey5a2Y5YKoJiN4QTsiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTA1LTIzVDIyOjA3OjI4LTA3OjAwIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wNS0yM1QxODo0Mzo0MSIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0yM1QyMjowNzoyOC0wNzowMCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjliZDU4OTA4LTk2MTktOGE0Yi1hZTM5LTk2M2JjMTdjMGUyNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxOGJjNTE2ZS0zZDJiLTRkMGEtYWNmZi01M2MxMzFiNDQwZWUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iMkRBRTczQjcyNjQ3NjAwRDRCODYyNjVDRTkyNUM4OTQiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWFmNjgzZjUtZDMwMC00NTBmLWE2ZGYtZTYxOWZmMjU5MDAzIiBzdEV2dDp3aGVuPSIyMDI0LTA1LTIzVDIyOjA3OjI4LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2pwZWcgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxp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"
     id="b"
     width={717}
     height={249}
    />
   </Defs>
  </Svg>
 )
}