import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faFlask } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

export default function UploadTextCoverScreen() {
  const {
    category,
    title,
    prompt,
    description,
    selectedTags,
    duration,
    playlistId,
  } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setCurrentUserId(userId);
        }
      } catch (error) {
        console.log('Error getting userId from AsyncStorage:', error);
      }
    };

    getCurrentUserId();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'Please allow access to photos to select a cover image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', currentUserId);
      formData.append('title', title as string);
      formData.append('prompt', prompt as string);
      formData.append('description', description?.toString() || '');
      formData.append(
        'category',
        Array.isArray(category) ? category[0] : category?.toString() || ''
      );
      formData.append(
        'functional_tags',
        Array.isArray(selectedTags)
          ? selectedTags.join(',')
          : selectedTags?.toString() || ''
      );
      formData.append('duration', duration?.toString() || '');

      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        formData.append('cover_image', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: `cover_${Date.now()}.jpg`,
        } as any);
      }

      const response = await fetch(`${BASE_URL}/generate-music-from-text`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', 'Music generated successfully!');
        router.push({
          pathname: '/musicedit',
          params: {
            draft_list_id: data.data.draft_list_id,
            category,
            title,
            prompt,
            description,
            selectedTags,
            duration,
            playlistId: playlistId ? playlistId.toString() : '',
          },
        });
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Failed to generate music');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload or AI Generate Cover</Text>
      </View>

      <View style={styles.uploadContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              selectedImage
                ? { uri: selectedImage }
                : require('../assets/images/cover.png')
            }
            style={styles.coverImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createCoverButton}>
          <FontAwesomeIcon icon={faFlask} size={20} color="#fff" />
          <Text style={styles.createCoverButtonText}>Create Cover with AI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
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
