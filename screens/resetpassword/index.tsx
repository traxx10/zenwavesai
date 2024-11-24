import React, { useState } from 'react';
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
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import ArrowBackIcon from '@/assets/icons/back.svg';
import { TopSpace } from '@/components/TopSpace';
import { style } from './Styles';
import { GradientButton } from '@/components/GradientButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabaseClient'; // Correct import path

export const ResetPassword = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Function to validate input as email or phone number
  const validateInput = async () => {
    console.log('Validating input:', input);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{1,14}$/; // Regex pattern for E.164 format required by Supabase/Twilio
    let contactType = ''; // Variable to store contact type

    try {
      // Determine if input is phone number or email
      const isPhone = phoneRegex.test(input);
      const isEmail = emailRegex.test(input);

      if (isPhone || isEmail) {
        // Store the user's contact and type in AsyncStorage
        await AsyncStorage.setItem('userInput', input);
        contactType = isPhone ? 'phone' : 'email'; // Set contact type based on input

        // Handle email case
        if (isEmail) {
          const { error } = await supabase.auth.resetPasswordForEmail(input, {
            redirectTo: `https://zenwaves.ai/new-password?email=${encodeURIComponent(input)}`, // Include email in URL
          });

          if (error) {
            console.error('Error sending reset password email:', error.message);
            setError('Failed to send reset link. Please check your input and try again.');
          } else {
            console.log(`Reset link sent successfully to: ${input}`);
            // Redirect to the welcome page
            router.push('/welcome'); // Change to the appropriate welcome page
          }
        } else if (isPhone) {
          // Send OTP for phone verification
          const { error } = await supabase.auth.signInWithOtp({
            phone: input,
            options: {
              // Custom message can be added here
              // This assumes you have a Twilio account configured with Supabase for SMS
            },
          });

          if (error) {
            console.error('Error sending SMS verification:', error.message);
            setError('Failed to send verification code. Please check your phone number and try again.');
          } else {
            console.log(`Verification code sent successfully to: ${input}`);
            // Redirect to the OTP verification page for phone
            router.push(`/otpverification?contact=${encodeURIComponent(input)}&type=phone` as any); // Redirect with contact and type
          }
        }
      } else {
        console.warn('Invalid input format detected:', input);
        setError('Please enter a valid phone number in E.164 format (e.g., +1234567890) or email address.');
      }
    } catch (err) {
      console.error('Unexpected error while sending reset link:', err);
      setError('Error processing your request. Please try again.');
    }
  };

  // Function to handle button click
  const handleContinue = () => {
    console.log('Continue button clicked.');
    setError(''); // Clear previous error
    validateInput(); // Validate the input
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
            <Text style={style.welcomeBackBtn}>Reset Password</Text>
            <TopSpace top={36} />
            <Text style={style.fieldTitle}>Phone number or email</Text>
            <TopSpace top={10} />
            <TextInput
              style={[
                style.inputField,
                error ? { borderColor: 'red' } : {}, // Highlight input field on error
              ]}
              keyboardType="email-address"
              placeholderTextColor="#000"
              placeholder="Enter your email or phone number"
              value={input}
              onChangeText={setInput}
              onFocus={() => setError('')} // Clear error when user starts typing
            />
            {error ? <Text style={style.errorText}>{error}</Text> : null}
          </View>

          <View>
            <GradientButton btnWidth="100%" title={'Continue'} handleClick={handleContinue} />
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};



export default ResetPassword;
