// app/index.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';
import { PURCHASES_API_KEY } from '@/utils/apis';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        await Purchases.logIn(userId);
        // router.push('/feed'); // 如果存在 userId，跳转到 feed 页面
        router.push('/(tabs)/feed');
      }
    };

    checkUserId();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Image
        source={require('../assets/images/onboarding.png')}
        style={styles.onboardingImage}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Unlock Functional Music with Zenwaves</Text>
        <Text style={styles.subtitle}>
          Use AI to create and explore sound. Join the community to innovate and
          earn with functional music.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/welcome' as any)}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Set background to transparent
  },
  onboardingImage: {
    width: '100%',
    height: width * 1.2,
    resizeMode: 'cover',
    marginTop: -70,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
