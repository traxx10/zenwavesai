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
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import ArrowBackIcon from '@/assets/icons/back.svg';
import { TopSpace } from '@/components/TopSpace';
import { style } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

export const EmailLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Function to handle the Continue button click
  const handleContinue = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(`Sending email: ${email}`);
      const formattedEmail = encodeURIComponent(email.trim());
      const url = `${BASE_URL}/check_email?email=${formattedEmail}`;
      console.log(`Constructed URL: ${url}`);

      // Send the request to the FastAPI server
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Ensure the response is JSON
      const result = await response.json();
      console.log('API Response:', result);

      if (result.exists) {
        if (result.userId) {
          console.log('Email exists, proceeding...');
          await AsyncStorage.setItem('userInput', email);
          await AsyncStorage.setItem('userId', result.userId.toString());
          console.log('User ID stored:', result.userId);
          setLoading(false);
          router.push('/password' as any);
        }
      } else {
        console.log('Email not found, please sign up.');
        setError(result.message || 'Email not found, please sign up.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setLoading(false);
      setError('Unable to verify email. Please try again.');
    }
  };

  return (
    <SafeAreaView style={style.innerWrap}>
      <StatusBar style="light" translucent={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={style.innerWrap}
        >
          <View>
            <TopSpace top={Platform.OS === 'ios' ? 11 : 30} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={style.welcomeBackBtn}>Welcome back</Text>
            <TopSpace top={36} />
            <Text style={style.fieldTitle}>Email</Text>
            <TopSpace top={10} />
            <TextInput
              style={style.inputField}
              keyboardType="email-address"
              placeholderTextColor={'#6A7F84'}
              placeholder="Your email address"
              value={email}
              onChangeText={setEmail}
            />
            {error ? (
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 5 }}>
                {error}
              </Text>
            ) : null}
          </View>

          <View>
            {loading && <ActivityIndicator size="large" color={'#000000'} />}
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: 'black',
                padding: 15,
                alignItems: 'center',
                borderRadius: 15,
              }}
              activeOpacity={0.8}
              onPress={!loading ? handleContinue : () => {}}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Continue
              </Text>
            </TouchableOpacity>
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EmailLogin;
