import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import PromoteImage from '../assets/images/promote.png'; 

const PromoteMusicScreen = () => {
  const router = useRouter();
  const { musicId } = useLocalSearchParams();
  
  console.log('PromoteMusic received musicId:', musicId);

  const handleGetStarted = () => {
    console.log('Navigating to goals with musicId:', musicId);
    router.push({
      pathname: '/promotiongoals',
      params: { musicId }  // 确保传递 musicId
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promote Your Music</Text>
        <View style={{ width: 24 }} /> 
      </View>


      <View style={styles.imageContainer}>
        <Image source={PromoteImage} style={styles.promoteImage} resizeMode="contain" />
      </View>


      <View style={styles.textContainer}>
        <Text style={styles.title}>Promote Your Music</Text>
        <Text style={styles.description}>
          Maximize engagement, expand your audience reach, and showcase your music to the world.
        </Text>
      </View>


      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGetStarted}  // 使用新的处理函数
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PromoteMusicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  promoteImage: {
    width: '100%',
    height: 180,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
