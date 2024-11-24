import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TopSpace } from '@/components/TopSpace';
import ArrowBackIcon from '@/assets/icons/back.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './styles';
import PasswordField from './PasswordField';
import { useCreatePasswordProps } from './useCreatePasswordProps';

export const CreatePassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { toggleHidePassword, toggleHideConfirmPassword, hidePassword, hideConfirmPassword } = useCreatePasswordProps();

  useEffect(() => {
    setError('');
  }, [password, confirmPassword]);

  const handleCreateAccount = async () => {
    if (!password || !confirmPassword) {
      setError('Please enter and confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    try {
      const firstName = await AsyncStorage.getItem('firstName');
      const lastName = await AsyncStorage.getItem('lastName');
      const email = await AsyncStorage.getItem('userInput');
      const verificationType = await AsyncStorage.getItem('verificationType');
      const googleData = await AsyncStorage.getItem('googleData');

      await AsyncStorage.setItem('password', password);

      if (googleData) {
        const parsedGoogleData = JSON.parse(googleData);
        router.push({
          pathname: '/invitecode',
          params: {
            googleData: JSON.stringify({
              ...parsedGoogleData,
              password: password
            })
          }
        } as any);
      } else {
        router.push({
          pathname: '/invitecode',
          params: {
            registrationData: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              password: password,
              ...(verificationType === 'email' ? { email } : { phone: email }),
              verificationType
            })
          }
        } as any);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={style.mainWrap}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={style.innerWrap}>
          <View>
            <TopSpace top={Platform.OS === 'ios' ? 11 : 30} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={style.welcomeBackBtn}>Create Password</Text>
            <TopSpace top={36} />
            <Text style={style.fieldTitle}>Password</Text>
            <TopSpace top={10} />
            <PasswordField
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              toggleEye={toggleHidePassword}
            />
            <TopSpace top={20} />
            <Text style={style.fieldTitle}>Confirm Password</Text>
            <PasswordField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={hideConfirmPassword}
              toggleEye={toggleHideConfirmPassword}
            />
            {error ? <Text style={style.errorText}>{error}</Text> : null}
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: 'black',
                padding: 15,
                alignItems: 'center',
                borderRadius: 15,
              }}
              activeOpacity={0.8}
              onPress={handleCreateAccount}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Create an account</Text>
            </TouchableOpacity>
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CreatePassword;
