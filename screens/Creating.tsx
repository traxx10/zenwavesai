import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';

export default function CreatingScreen() {
  const [progress, setProgress] = useState(0.35); // Initial example progress at 35%
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 1 ? prev + 0.05 : 1));
    }, 1000);

    // Automatically navigate when progress reaches 100%
    if (progress >= 1) {
      clearInterval(interval);
      router.push('/uploadcover'); // Adjust path if necessary
    }

    return () => clearInterval(interval);
  }, [progress, router]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Creating Audio</Text>
      </View>

      {/* Creating Animation */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/uploading.png')} // Replace with your actual image path for creating animation
          style={styles.image}
        />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>

      {/* Status Message */}
      <Text style={styles.statusText}>
        Your audio is currently being created.
      </Text>
      <Text style={styles.statusText}>
        Please wait a moment.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  image: {
    width: 300, // Adjust to match design
    height: 300,
    resizeMode: 'contain',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000', // Adjust color to match the design
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
});
