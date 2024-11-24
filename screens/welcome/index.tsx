import React, { useState, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '@/hooks/useCacheResources';
import { TopSpace } from '@/components/TopSpace';
import { GoogleIcon } from '@/assets/svgs';
import { useRouter } from 'expo-router';
import { EmailLoginButton } from './components/EmailLoginButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientButton } from '@/components/GradientButton';
import { Video } from 'expo-av';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import backgroundVideo from '@/assets/images/backgroundVideo.mp4';
import { ResizeMode } from 'react-native-video'; // 添加导入语句


// Configure Google Sign-In
export const Welcome = () => {
  const router = useRouter();
  const videoRef = React.useRef<Video>(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '693233744101-37vgt9n9ng0ie5dvg7lua2d5ld936v54.apps.googleusercontent.com',
      iosClientId: '693233744101-ntrtnqf5fr2vv884ufb0se3lo4l03tb7.apps.googleusercontent.com', // 添加 iOS 客户端 ID
    });
  }, []);

  // Function to handle Google Sign-In
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResponse = await GoogleSignin.signIn();
      console.log('SignIn Response:', signInResponse);

      if (!signInResponse?.data?.user) {
        throw new Error('User info is missing from the sign-in response.');
      }

      const requestData = {
        first_name: signInResponse.data.user.givenName,
        last_name: signInResponse.data.user.familyName,
        email: signInResponse.data.user.email,
        id_token: signInResponse.data.idToken,
        avatar_url: signInResponse.data.user.photo || '',
      };

      try {
        const loginResponse = await fetch('http://127.0.0.1:8000/users/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await loginResponse.json();
        
        if (data.status === 'success' && data.user) {
          // 用户已存在，直接登录并跳转到 feed
          await AsyncStorage.clear();
          await AsyncStorage.setItem('userId', data.user.id);
          router.push('/feed' as any);
        } else if (data.status === 'pre_register') {
          // 新用户，跳转到邀请码页面
          router.push({
            pathname: '/googleinvitecode',
            params: {
              googleData: JSON.stringify({
                user: {
                  givenName: signInResponse.data.user.givenName,
                  familyName: signInResponse.data.user.familyName,
                  email: signInResponse.data.user.email,
                  id: signInResponse.data.user.id,
                  photo: signInResponse.data.user.photo
                },
                idToken: signInResponse.data.idToken
              })
            }
          } as any);
        } else {
          Alert.alert('Error', 'Login failed');
        }

      } catch (error) {
        console.error('Sign-in error:', error);
        Alert.alert(
          'Sign In Error',
          'Failed to connect to server'
        );
      }

    } catch (error: any) {
      handleSignInError(error);
    }
  };

  // Function to handle sign-in errors
  const handleSignInError = (error: any) => {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled the sign-in process.');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign-in is already in progress.');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Google Play Services are not available or are outdated.');
    } else {
      console.error('An error occurred during sign-in:', error);
    }
  };

  const handlePhone = () => {
    router.push('/login' as any);
  };

  const handleSignup = () => {
    router.push('/signup' as any);
  };

  const handleEmailLogin = () => {
    router.push('/emaillogin' as any); // 移除多余的空格
  };

  return (
    <View style={styles.flexOne}>
      <Video
        ref={videoRef}
        source={backgroundVideo as any}
        style={[StyleSheet.absoluteFillObject, styles.videoStyle]}
        shouldPlay
        isLooping
        useNativeControls={false}
        resizeMode={ResizeMode.COVER as any}
      />
      <StatusBar style="light" />
      <SafeAreaView style={{ flexGrow: 1 }}>
        <LinearGradient
          locations={[0.0, 0.2, 0.5, 1]}
          colors={['transparent', '#141416', '#141416', '#141416']}
          style={styles.bottomGradient}
        />
        <View style={styles.innerWrap}>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>Effortlessly Discover Your Ideal Soundscape</Text>
          </View>
          <TopSpace top={13} />
          <View style={styles.titleWrap}>
          <Text style={styles.description}>
  Discover curated music to boost focus, relaxation, and productivity. ZenWaves delivers the perfect soundscape for your vibe.
</Text>

          </View>
          <TopSpace top={32} />

          <TouchableOpacity activeOpacity={0.8} onPress={signIn} style={styles.socialBtn}>
            <GoogleIcon />
            <Text style={styles.loginGoogleText}>Login with Google</Text>
          </TouchableOpacity>
          <TopSpace top={14} />
          <EmailLoginButton handleClick={handleEmailLogin} />
          <TopSpace top={14} />

          <GradientButton title="Use phone number" handleClick={handlePhone} />
          <TopSpace top={18} />
          <View style={styles.rowDontHaveAccount}>
            <Text style={styles.dontHaveAccount}>Don't have an account? </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSignup}>
              <Text style={styles.signupBtnText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1 },

  videoStyle: {
    transform: [{ scale: 1.2 }],
  },

  innerWrap: {
    flexGrow: 1,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    height: '30%',

  },
  titleWrap: {
    width: '70%',
    alignSelf: 'center',
  },
  loginGoogleText: {
    marginLeft: 10,
    color: Colors.light.text,
    fontSize: 16,
    fontFamily: fonts.Poppins.medium,
  },
  socialBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '88%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 20,
    backgroundColor: Colors.light.title,
  },
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
  description: {
    textAlign: 'center',
    opacity: 0.9,
    color: Colors.light.title,
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
});

export default Welcome;
