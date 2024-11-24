import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { style } from './styles'; // Corrected import statement
import { useRouter, useLocalSearchParams } from 'expo-router';
import ArrowBackIcon from '@/assets/icons/back.svg';
import { TopSpace } from '@/components/TopSpace';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabaseClient';

import { StatusBar } from 'expo-status-bar';

const CELL_COUNT = 6;

const OtpVerification = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { type } = useLocalSearchParams();
  const router = useRouter(); // Initialized router
  console.log('OTP type:', type);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // Automatically verify OTP when 6 digits are entered
  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleVerify();
    }
  }, [value]);

  // Function to handle OTP verification
  const handleVerify = async () => {
    if (!value || value.length !== CELL_COUNT) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
  
    console.log('Verifying OTP:', value);
  
    try {
      const input = await AsyncStorage.getItem('userInput');
      const verificationType = await AsyncStorage.getItem('verificationType');
  
      if (!input || !verificationType) {
        throw new Error('Verification details not found.');
      }
  
      // Construct the payload object first to avoid issues with dynamic keys
      const payload: { type: string; token: string; [key: string]: string } = {
        type: verificationType === 'phone' ? 'sms' : 'email',
        token: value,
      };
  
      // Dynamically assign phone or email based on the verification type
      if (verificationType === 'phone') {
        payload.phone = input;
      } else {
        payload.email = input;
      }
  
      // Now pass the constructed payload object to the Supabase verification function
      const { error: verifyError } = await supabase.auth.verifyOtp(payload as any);
  
      if (verifyError) {
        console.error('OTP verification failed:', verifyError.message);
        setError('Invalid verification code. Please try again.');
      } else {
        console.log('OTP verified successfully.');
        setError('');
  
        // Store the verification status in AsyncStorage
        await AsyncStorage.setItem('verificationStatus', 'verified');
  
        // Navigate to the next step if OTP is verified successfully
        if (type === 'signup') {
          router.push('/nameinput');
        }
      }
    } catch (err) {
      console.error('Unexpected error during OTP verification:', err);
      setError('An error occurred during verification. Please try again.');
    }
  };
  

  // Function to handle OTP resend
  const handleResendCode = async () => {
    try {
      const input = await AsyncStorage.getItem('userInput');
      const verificationType = await AsyncStorage.getItem('verificationType');

      if (!input || !verificationType) {
        throw new Error('Verification details not found.');
      }

      console.log('Resending OTP to:', input);

      const { error: resendError } = await supabase.auth.signInWithOtp({
        [verificationType === 'phone' ? 'phone' : 'email']: input,
        options: {
          channel: verificationType === 'phone' ? 'sms' : undefined,
          otp_length: 6,
        },
      } as any);

      if (resendError) {
        console.error('Error resending OTP:', resendError.message);
        if (resendError.message.includes('For security purposes')) {
          setError('For security purposes, you can only request this after 1 second.');
        } else {
          setError('Failed to resend the code. Please try again.');
        }
      } else {
        console.log('OTP resent successfully.');
        setError('');
      }
    } catch (err) {
      console.error('Error during OTP resend:', err);
      setError('Unable to resend code. Check your network connection.');
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
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={style.welcomeBackBtn}>Enter 6 digit code</Text>
            <TopSpace top={40} />

            <View style={{ paddingHorizontal: 20 }}>
              <CodeField
                ref={ref}
                {...props}
                textContentType="oneTimeCode"
                InputComponent={TextInput}
                value={value}
                onChangeText={(code: string) => {
                  setValue(code);
                  setError('');
                }}
                cellCount={CELL_COUNT}
                rootStyle={style.codeFieldRoot}
                keyboardType="number-pad"
                autoComplete={
                  Platform.select({
                    android: 'sms-otp',
                    ios: 'one-time-code',
                  }) as 'sms-otp' | 'one-time-code'
                }
                testID="my-code-input"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[style.cell, isFocused && style.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            {error ? <Text style={errorStyles.errorText}>{error}</Text> : null}
          </View>

          <View>
            <View style={style.rowDontHaveAccount}>
              <Text style={style.dontHaveAccount}>Didn't receive the code? </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={handleResendCode}>
                <Text style={style.signupBtnText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
            <TopSpace top={58} />
            <TouchableOpacity
              style={{
                backgroundColor: '#000000', // 纯黑色背景
                padding: 15,
                alignItems: 'center',
                borderRadius: 15,
              }}
              onPress={handleVerify}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#FFFFFF' }}>Verify</Text>
            </TouchableOpacity>
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const errorStyles = {
  errorText: {
    color: 'red',
    fontSize: 15,
    marginTop: 5,
    paddingHorizontal: 5,
  },
};

export default OtpVerification;
