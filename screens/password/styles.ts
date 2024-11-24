
import { fonts } from '@/hooks/useCacheResources'
import { StyleSheet } from 'react-native'

export const style = StyleSheet.create({
 welcomeBackBtn: {
  textAlign: 'center',
  fontSize: 25,
  fontFamily: fonts.Poppins.semibold,
  color: '#000',
 },
 innerWrap: {
  flexGrow: 1,
  paddingTop: 20,
  justifyContent: 'space-between',
  paddingHorizontal: 20,
 },
 fieldTitle: {
  color: '#000',
  fontSize: 14,
  fontFamily: fonts.Poppins.medium,
 },
 rowDontHaveAccount: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
 },
 dontHaveAccount: {
  color: '#000',
  fontSize: 14,
  fontFamily: fonts.Poppins.regular,
 },
 signupBtnText: {
  fontSize: 14,
  color: '#000',
  fontFamily: fonts.Poppins.medium,
 },
 forgotPassword: {
  fontSize: 14,
  color: '#000',
  fontFamily: fonts.Poppins.semibold,
 },
 mainWrap: {
  flex: 1,
  backgroundColor: '#fff',
 },
})
