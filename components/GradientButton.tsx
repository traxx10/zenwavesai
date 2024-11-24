import { Colors } from '@/constants/Colors'
import { fonts } from '@/hooks/useCacheResources'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, Text, StyleSheet, DimensionValue } from 'react-native'

export const GradientButton = ({
 btnWidth = '88%',
 title = '',
 handleClick = () => {},
 paddingVertical = 17,
 borderRadius = 20,
}) => {
 return (
  <TouchableOpacity
   activeOpacity={0.8}
   onPress={handleClick}
   style={[
    styles.appleBtn,
    {
     width: btnWidth as DimensionValue,
    },
   ]}
  >
   <LinearGradient
    style={[styles.appleGradient, { paddingVertical: paddingVertical, borderRadius: borderRadius }]}
    colors={['#000000', '#000000']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
   >
    <Text style={[styles.btnText, {}]}>{title}</Text>
   </LinearGradient>
  </TouchableOpacity>
 )
}

const styles = StyleSheet.create({
 appleBtn: {
  width: '88%',
  alignSelf: 'center',
 },
 appleGradient: {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  paddingVertical: 17,
  borderRadius: 20,
  alignItems: 'center',
 },
 btnText: {
  //   marginLeft: 10,
  color: Colors.light.title,
  fontSize: 16,
  fontFamily: fonts.Poppins.medium,
 },
})
