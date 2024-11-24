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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import ArrowBackIcon from '@/assets/icons/back.svg';
import { TopSpace } from '@/components/TopSpace';
import { style } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabaseClient';

export const Signup = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const validateInput = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;

    const isPhone = phoneRegex.test(input);
    const isEmail = emailRegex.test(input);

    if (isPhone || isEmail) {
      await AsyncStorage.setItem('userInput', input);
      await AsyncStorage.setItem('verificationType', isPhone ? 'phone' : 'email');

      const { error } = await supabase.auth.signInWithOtp({
        [isPhone ? 'phone' : 'email']: input,
        options: { type: isPhone ? 'sms' : 'email', otp_length: 6 },
      });

      if (error) {
        setError('Failed to send verification code. Please check your input and try again.');
      } else {
        router.push({ pathname: '/otpverification', params: { type: 'signup' } });
      }
    } else {
      setError('Please enter a valid phone number (e.g., +1234567890) or email address.');
    }
  };

  return (
    <SafeAreaView style={style.innerWrap}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={style.innerWrap}>
          <View>
            <TopSpace top={Platform.OS === 'ios' ? 11 : 30} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={style.welcomeBackBtn}>Create an account</Text>
            <TopSpace top={36} />
            <Text style={style.fieldTitle}>Phone number or email</Text>
            <TopSpace top={10} />
            <TextInput
              style={[
                style.inputField,
                error ? { borderColor: 'red' } : {},
              ]}
              keyboardType="default"
              placeholderTextColor={'#6A7F84'}
              placeholder="Enter phone number (e.g., +1234567890) or email"
              value={input}
              onChangeText={setInput}
              onFocus={() => setError('')}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#000000',
                padding: 15,
                alignItems: 'center',
                borderRadius: 15,
              }}
              onPress={validateInput}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#FFFFFF' }}>Continue</Text>
            </TouchableOpacity>
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = {
  errorText: {
    color: 'red',
    fontSize: 15,
    marginTop: 5,
    paddingHorizontal: 5,
  },
};

export default Signup;
