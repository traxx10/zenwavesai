import { Colors } from '@/constants/Colors'
import { fonts } from '@/hooks/useCacheResources'
import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
 mainWrap: {
  flex: 1,
  backgroundColor: Colors.light.background,
 },
 fieldTitle: {
  color: Colors.light.title,
  fontSize: 14,
  fontFamily: fonts.Poppins.medium,
 },
 inputField: {
  backgroundColor: Colors.light.inputFieldBg,
  borderRadius: 12,
  height: 56,
  color: Colors.light.inputFieldTextColor,
  justifyContent: 'center',
  fontSize: 16,
  fontFamily: fonts.Poppins.regular,
  paddingHorizontal: 20,
  letterSpacing: 1,
 },
 simpleRow: {
  flexDirection: 'row',
  alignItems: 'center',
 },
 rowJustifySpaceBetween: {
  flexDirection: 'row',
  justifyContent: 'space-between',
 },
})
