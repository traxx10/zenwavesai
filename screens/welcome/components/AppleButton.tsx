import { AppleIcon } from '@/assets/svgs'
import { Colors } from '@/constants/Colors'
import { fonts } from '@/hooks/useCacheResources'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'

const AppleButton = () => {
 return (
  <TouchableOpacity activeOpacity={0.8} style={styles.appleBtn}>
   <LinearGradient
    style={styles.appleGradient}
    colors={['#5F5F5F', '#BEBEBE']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
   >
    <AppleIcon />
    <Text
     style={[
      styles.loginGoogleText,
      {
       color: Colors.light.title,
      },
     ]}
    >
     Login with Apple
    </Text>
   </LinearGradient>
  </TouchableOpacity>
 )
}
export default AppleButton

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
 title: {
  fontSize: 24,
  fontFamily: fonts.Jakarta.bold,
  color: Colors.dark.title,
  textAlign: 'center',
 },
 loginGoogleText: {
  marginLeft: 10,
  color: Colors.light.text,
  fontSize: 16,
  fontFamily: fonts.Poppins.medium,
 },
})
