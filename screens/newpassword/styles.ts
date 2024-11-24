import { Colors } from '@/constants/Colors'
import { fonts } from '@/hooks/useCacheResources'
import { StyleSheet } from 'react-native'

export const style = StyleSheet.create({
 welcomeBackBtn: {
  textAlign: 'center',
  fontSize: 25,
  fontFamily: fonts.Poppins.semibold,
  color: Colors.light.title,
 },
 innerWrap: {
  flexGrow: 1,
  paddingTop: 20,
  justifyContent: 'space-between',
  paddingHorizontal: 20,
 },
 fieldTitle: {
  color: Colors.light.title,
  fontSize: 14,
  fontFamily: fonts.Poppins.medium,
 },
 rowDontHaveAccount: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
 },
 dontHaveAccount: {
  color: Colors.light.title,
  fontSize: 14,
  fontFamily: fonts.Poppins.regular,
 },
 signupBtnText: {
  fontSize: 14,
  color: Colors.light.purple,
  fontFamily: fonts.Poppins.medium,
 },
 codeFieldRoot: { marginTop: 20 },
 cell: {
  width: 56,
  height: 56,
  lineHeight: 50,
  backgroundColor: Colors.light.inputFieldBg,
  borderRadius: 12,
  color: Colors.light.title,
  fontSize: 24,
  justifyContent: 'center',
  alignContent: 'center',
  textAlign: 'center',
  textAlignVertical: 'center',
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: Colors.light.inputFieldBg,
 },
 focusCell: {
  width: 56,
  height: 56,
  color: Colors.light.title,
  textAlignVertical: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  backgroundColor: Colors.light.background,
  borderColor: Colors.light.focusInputBorder,
  //   borderCurve:
  //   borderColor: '#000',
 },
 errorText: {
    color: 'red',
    fontSize: 14,
    // 其他样式属性...
  },
})
