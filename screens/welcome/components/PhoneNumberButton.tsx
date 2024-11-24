import { Colors } from '@/constants/Colors'
import { fonts } from '@/hooks/useCacheResources'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const PhoneNumberButton = () => {
 return (
  <TouchableOpacity activeOpacity={0.8} style={styles.appleBtn}>
   <LinearGradient
    style={styles.appleGradient}
    colors={['#000F93', '#5E006C']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
   >
    <Text
     style={[
      styles.loginGoogleText,
      {
       color: Colors.light.title,
      },
     ]}
    >
     Use phone number
    </Text>
   </LinearGradient>
  </TouchableOpacity>
 )
}

export default PhoneNumberButton

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
 loginGoogleText: {
  marginLeft: 10,
  color: Colors.light.text,
  fontSize: 16,
  fontFamily: fonts.Poppins.medium,
 },
})
