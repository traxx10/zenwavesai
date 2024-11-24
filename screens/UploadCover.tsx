import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import BackIcon from '../assets/icons/back.svg';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlask, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function UploadCoverScreen() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to the next screen
    router.push('/uploading'); // Replace '/nextscreen' with the actual path of the next screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload or AI Generate Cover</Text>
      </View>

      {/* Cover Upload Image */}
      <View style={styles.uploadContainer}>
        <Image
          source={require('../assets/images/cover.png')} // Replace with the actual path to your placeholder image
          style={styles.coverImage}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createCoverButton}>
          <FontAwesomeIcon icon={faFlask} size={20} color="#fff" />
          <Text style={styles.createCoverButtonText}>Create Cover with AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  uploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  coverImage: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  createCoverButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  createCoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
