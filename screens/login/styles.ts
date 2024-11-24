import { fonts } from '@/hooks/useCacheResources'
import { StyleSheet } from 'react-native'

export const style = StyleSheet.create({
 welcomeBackBtn: {
  textAlign: 'center',
  fontSize: 25,
  fontFamily: fonts.Poppins.semibold,
  color: 'black',
 },
 innerWrap: {
  flexGrow: 1,
  paddingTop: 20,
  justifyContent: 'space-between',
  paddingHorizontal: 20,
 },
 fieldTitle: {
  color: 'black',
  fontSize: 14,
  fontFamily: fonts.Poppins.medium,
 },
 inputField: {
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 15,
  },

})
