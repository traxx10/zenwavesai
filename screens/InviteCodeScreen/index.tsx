import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './styles';
import BackIcon from '../../assets/icons/back.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';
const InviteCodeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [inviteCode, setInviteCode] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const registrationData = params.registrationData
    ? JSON.parse(params.registrationData as string)
    : null;

  const completeRegistration = async (skipInviteCode: boolean = false) => {
    try {
      setIsLoading(true);

      // Validate invite code if provided and not in skip mode
      if (inviteCode && !skipInviteCode) {
        const validateResponse = await fetch(`${BASE_URL}/auth/pre-register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invite_code: inviteCode }),
        });

        const validateData = await validateResponse.json();
        if (validateData.status === 'invalid_code') {
          Alert.alert('Invalid Code', 'Please enter a valid invitation code');
          return;
        }

        if (validateData.status === 'valid_code') {
          setReferrerName(validateData.data.referrer_name);
        }
      }

      // Send registration request
      const requestData = {
        first_name: registrationData.first_name,
        last_name: registrationData.last_name,
        password: registrationData.password,
        ...(registrationData.verificationType === 'email'
          ? { email: registrationData.email }
          : { phone: registrationData.phone }),
        invite_code: skipInviteCode ? undefined : inviteCode,
        skip_invite_code: skipInviteCode,
        verificationType: registrationData.verificationType,
      };

      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('userId', data.data.user_id);
        router.push('/feed');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Input Invitation Code</Text>
      </View>

      <Text style={styles.description}>
        Please enter the invitation code shared by your friend to unlock
        exclusive features and benefits.
      </Text>

      <Text style={styles.label}>Invitation Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your friend's invitation code"
        placeholderTextColor="#888"
        value={inviteCode}
        onChangeText={setInviteCode}
        editable={!isLoading}
      />

      {referrerName && (
        <Text style={styles.referrerText}>Inviter: {referrerName}</Text>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => completeRegistration(false)}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => completeRegistration(true)}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default InviteCodeScreen;
