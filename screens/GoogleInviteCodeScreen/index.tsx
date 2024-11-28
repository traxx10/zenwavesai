import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackIcon from '../../assets/icons/back.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

const GoogleInviteCodeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [inviteCode, setInviteCode] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const googleData = params.googleData
    ? JSON.parse(params.googleData as string)
    : null;

  const completeGoogleRegistration = async (
    skipInviteCode: boolean = false
  ) => {
    try {
      setIsLoading(true);

      // If there is an invitation code and it's not a skip mode, verify the invitation code
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

      // Send Google registration request
      const requestData = {
        first_name: googleData.user.givenName,
        last_name: googleData.user.familyName,
        email: googleData.user.email,
        id_token: googleData.idToken,
        avatar_url: googleData.user.photo || '',
        invite_code: skipInviteCode ? undefined : inviteCode,
      };

      const response = await fetch(
        `${BASE_URL}/users/complete-google-register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('userId', data.data.user_id);
        router.push('/feed');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Google registration error:', error);
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
        <Text style={styles.title}>Enter Invite Code</Text>
      </View>

      <Text style={styles.description}>
        Please enter your friend's invitation code to unlock exclusive features
        and benefits.
      </Text>

      <Text style={styles.label}>Invite Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter friend's invite code"
        placeholderTextColor="#888"
        value={inviteCode}
        onChangeText={setInviteCode}
        editable={!isLoading}
      />

      {referrerName && (
        <Text style={styles.referrerText}>Referrer: {referrerName}</Text>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => completeGoogleRegistration(false)}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => completeGoogleRegistration(true)}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
    height: 44,
  },
  backIcon: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  disabledButton: {
    opacity: 0.5,
  },
  referrerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleInviteCodeScreen;
