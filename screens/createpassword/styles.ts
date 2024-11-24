
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
 codeFieldRoot: { marginTop: 20 },
 cell: {
  width: 56,
  height: 56,
  lineHeight: 50,
  backgroundColor: '#fff',
  borderRadius: 12,
  color: '#000',
  fontSize: 24,
  justifyContent: 'center',
  alignContent: 'center',
  textAlign: 'center',
  textAlignVertical: 'center',
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#fff',
 },
 focusCell: {
  width: 56,
  height: 56,
  color: '#000',
  textAlignVertical: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  backgroundColor: '#fff',
  borderColor: '#fff',
  //   borderCurve:
  //   borderColor: '#000',
 },
 errorText: {
    color: 'red',
    fontSize: 14,
    // 其他样式属性...
  },
  mainWrap: {
    flex: 1,
    backgroundColor: '#fff', // 你可以根据需要调整背景颜色
  },
})
