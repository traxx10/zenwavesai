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

const NameInput = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  // Function to handle the continue button click
  const handleContinue = async () => {
    console.log('Continue button clicked.');
    setError('');

    if (!firstName || !lastName) {
      setError('Please enter both your first and last names.');
      return;
    }

    try {
      // Store the names in AsyncStorage for future use
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);

      // Redirect to the next step or perform the next action
      router.push('/createpassword' as any); // Replace with the actual path you need
    } catch (err) {
      console.error('Error storing names:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={style.innerWrap}>
          <View>
            <TopSpace top={Platform.OS === 'ios' ? 11 : 30} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>Enter Your Name</Text>
            <TopSpace top={36} />
            <Text style={{ fontSize: 16, color: 'black' }}>First Name</Text>
            <TopSpace top={10} />
            <TextInput
              style={{
                height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 15,
              }}
              placeholderTextColor="#6A7F84"
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setError('')}
            />
            <TopSpace top={20} />
            <Text style={{ fontSize: 16, color: 'black' }}>Last Name</Text>
            <TopSpace top={10} />
            <TextInput
              style={{
                height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
                paddingHorizontal: 10,
                borderRadius: 15,
              }}
              placeholderTextColor="#6A7F84"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setError('')}
            />
            {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}
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
              onPress={handleContinue}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default NameInput;
