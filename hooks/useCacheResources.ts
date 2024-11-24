import { FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen'

export const fontAssets = [
 {
  interBlack: require('../assets/fonts/Inter-Black.otf'),
 },
 {
  interBlackItalic: require('../assets/fonts/Inter-BlackItalic.otf'),
 },
 {
  interBold: require('../assets/fonts/Inter-Bold.otf'),
 },
 {
  interBoldItalic: require('../assets/fonts/Inter-BoldItalic.otf'),
 },
 {
  interItalic: require('../assets/fonts/Inter-Italic.otf'),
 },
 {
  interLight: require('../assets/fonts/Inter-Light-BETA.otf'),
 },
 {
  interLightItalic: require('../assets/fonts/Inter-LightItalic-BETA.otf'),
 },
 {
  interMedium: require('../assets/fonts/Inter-Medium.otf'),
 },
 {
  interMediumItalic: require('../assets/fonts/Inter-MediumItalic.otf'),
 },
 {
  interRegular: require('../assets/fonts/Inter-Regular.otf'),
 },
 {
  interSemiBold: require('../assets/fonts/Inter-SemiBold.otf'),
 },
 {
  interSemiBoldItalic: require('../assets/fonts/Inter-SemiBoldItalic.otf'),
 },
 {
  black: require('../assets/fonts/Poppins-Black.ttf'),
 },
 {
  blackItalic: require('../assets/fonts/Poppins-BlackItalic.ttf'),
 },
 {
  bold: require('../assets/fonts/Poppins-Bold.ttf'),
 },
 {
  boldItalic: require('../assets/fonts/Poppins-BoldItalic.ttf'),
 },
 {
  extraBold: require('../assets/fonts/Poppins-ExtraBold.ttf'),
 },
 {
  extraBoldItalic: require('../assets/fonts/Poppins-ExtraBoldItalic.ttf'),
 },
 {
  light: require('../assets/fonts/Poppins-Light.ttf'),
 },
 {
  lightItalic: require('../assets/fonts/Poppins-LightItalic.ttf'),
 },
 {
  medium: require('../assets/fonts/Poppins-Medium.ttf'),
 },
 {
  mediumItalic: require('../assets/fonts/Poppins-MediumItalic.ttf'),
 },
 {
  regular: require('../assets/fonts/Poppins-Regular.ttf'),
 },
 {
  semiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
 },
 {
  semiBoldItalic: require('../assets/fonts/Poppins-SemiBoldItalic.ttf'),
 },
 {
  thin: require('../assets/fonts/Poppins-Thin.ttf'),
 },
 {
  thinItalic: require('../assets/fonts/Poppins-ThinItalic.ttf'),
 },

 {
  jakartaBold: require('../assets/fonts/PlusJakartaDisplay-Bold.otf'),
 },
 {
  jakartaBoldItalic: require('../assets/fonts/PlusJakartaDisplay-BoldItalic.otf'),
 },
 {
  jakartaItalic: require('../assets/fonts/PlusJakartaDisplay-Italic.otf'),
 },
 {
  jakartaLight: require('../assets/fonts/PlusJakartaDisplay-Light.otf'),
 },
 {
  jakartaLightItalic: require('../assets/fonts/PlusJakartaDisplay-LightItalic.otf'),
 },
 {
  jakartaRegular: require('../assets/fonts/PlusJakartaDisplay-Regular.otf'),
 },
].map((x: any) => Font.loadAsync(x))

export const fonts = {
 Poppins: {
  black: 'black',
  blackItalic: 'blackItalic',
  bold: 'bold',
  boldItalic: 'boldItalic',
  regular: 'regular',
  semibold: 'semiBold',
  semiBoldItalic: 'semiBoldItalic',
  extraBold: 'extraBold',
  extraBoldItalic: 'extraBoldItalic',
  light: 'light',
  lightItalic: 'lightItalic',
  medium: 'medium',
  mediumItalic: 'mediumItalic',
  thin: 'thin',
  thinItalic: 'thinItalic',
 },
 Jakarta: {
  bold: 'jakartaBold',
  boldItalic: 'jakartaBoldItalic',
  italic: 'jakartaItalic',
  medium: 'balooMedium',
  light: 'jakartaLight',
  lightItalic: 'jakartaLightItalic',
  regular: 'jakartaRegular',
 },
 Inter: {
  black: 'interBlack',
  blackItalic: 'interBlackItalic',
  bold: 'interBold',
  boldItalic: 'interBoldItalic',
  italic: 'interItalic',
  light: 'interLight',
  lightItalic: 'interLightItalic',
  medium: 'interMedium',
  mediumItalic: 'interMediumItalic',
  regular: 'interRegular',
  semibold: 'interSemiBold',
  semiboldItalic: 'interSemiBoldItalic',
 },
}

export default function useCachedResources() {
 const [isLoadingComplete, setLoadingComplete] = useState(false)

 async function loadResourcesAndDataAsync() {
  try {
   SplashScreen.preventAutoHideAsync()
   // Load fonts

   // await Font.loadAsync(fontAssets);
   await Promise.all([...fontAssets])
  } catch (e) {
   // We might want to provide this error information to an error reporting service
   console.warn(e)
  } finally {
   setLoadingComplete(true)
   //  setTimeout(SplashScreen.hideAsync, 10000);
   SplashScreen.hideAsync()
  }
 }
 // Load any resources or data that we need prior to rendering the app
 useEffect(() => {
  loadResourcesAndDataAsync()
 }, [])

 return { isLoadingComplete, setLoadingComplete }
}
