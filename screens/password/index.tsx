import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import ArrowBackIcon from '@/assets/icons/back.svg';
import { TopSpace } from '@/components/TopSpace';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './styles';
import { PasswordField } from '@/components/PasswordField';
import { GradientButton } from '@/components/GradientButton';
import { BASE_URL } from '@/utils/apis';

export const Password = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Retrieve the stored email
      const userEmail = await AsyncStorage.getItem('userInput');
      if (!userEmail) {
        Alert.alert('Error', 'No stored email found.');
        setLoading(false);
        return;
      }

      if (!password) {
        Alert.alert('Error', 'Please enter your password.');
        setLoading(false);
        return;
      }

      // Send login request to FastAPI
      const response = await fetch(`${BASE_URL}/email-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: password }),
      });

      const result = await response.json();
      console.log('FastAPI Response:', result);

      if (result.status === 'success') {
        await AsyncStorage.setItem('userId', result.user_id.toString());
        console.log('User ID stored:', result.user_id);
        router.push('/feed');
      } else {
        Alert.alert(
          'Error',
          result.message || 'Incorrect credentials. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error during login verification:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={style.mainWrap}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={style.innerWrap}
        >
          <View>
            <TopSpace top={Platform.OS === 'ios' ? 11 : 30} />
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={style.welcomeBackBtn}>Your Password</Text>
            <TopSpace top={36} />
            <Text style={style.fieldTitle}>Password</Text>
            <TopSpace top={10} />

            <PasswordField
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              toggleEye={toggleHidePassword}
            />

            <TopSpace top={36} />
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              onPress={() => router.push('/resetpassword')}
            >
              <Text style={style.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View>
            <GradientButton
              btnWidth="100%"
              title={'Login'}
              handleClick={handleLogin}
            />
            <TopSpace top={Platform.OS === 'ios' ? 30 : 60} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Password;
