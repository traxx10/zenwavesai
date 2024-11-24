import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BackIcon from '../assets/icons/back.svg';

const API_BASE_URL = 'http://127.0.0.1:8000'; // 替换为您的生产环境 URL

export default function CreatePlaylistScreen() {
  const { title } = useLocalSearchParams();
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSavedForm = async () => {
      try {
        const savedDescription = await AsyncStorage.getItem('temp_playlist_description');
        const savedImage = await AsyncStorage.getItem('temp_playlist_image');
        
        if (savedDescription) setDescription(savedDescription);
        if (savedImage) setSelectedImage(savedImage);
      } catch (error) {
        console.error('加载表单数据失败:', error);
      }
    };
    
    loadSavedForm();
  }, []);

  const handleDescriptionChange = async (text: string) => {
    setDescription(text);
    try {
      await AsyncStorage.setItem('temp_playlist_description', text);
    } catch (error) {
      console.error('保存描述失败:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow access to photos to select a cover image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // 方形比例
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      try {
        await AsyncStorage.setItem('temp_playlist_image', imageUri);
      } catch (error) {
        console.error('保存图片失败:', error);
      }
    }
  };

  const handleCreatePlaylist = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for the playlist.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Error', 'Please upload a playlist cover image.');
      return;
    }

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title as string);
      formData.append('description', description);
      
      // 添加图片文件
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      formData.append('cover_image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: `playlist_cover_${Date.now()}.jpg`,
      } as any);

      // 修改为正确的 API 端点
      const responseAPI = await fetch(`${API_BASE_URL}/users/${userId}/playlists`, {
        method: 'POST',
        body: formData,
      });

      if (responseAPI.ok) {
        const newPlaylist = await responseAPI.json();
        
        // 清除临时表单数据
        await AsyncStorage.multiRemove([
          'temp_playlist_description',
          'temp_playlist_image'
        ]);

        // 保存新创建的播放列表信息
        await AsyncStorage.setItem('last_created_playlist', JSON.stringify({
          id: newPlaylist.id,
          title: title,
          // 其他需要的播放列表信息...
        }));

        Alert.alert('Success', '播放列表创建成功！');
        router.back();
      } else {
        const errorData = await responseAPI.json();
        Alert.alert('Error', errorData.detail || '创建播放列表失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', '上传数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Playlist</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Playlist Title</Text>
          <Text style={styles.readOnlyText}>{title}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Playlist Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a description for the playlist..."
            value={description}
            onChangeText={handleDescriptionChange}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.uploadContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={selectedImage ? { uri: selectedImage } : require('../assets/images/cover.png')}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.uploadText}>Tap to upload a cover image</Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={handleCreatePlaylist}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Playlist</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 28,
    
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    
    marginBottom: 10,
  },
  readOnlyText: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 20,
    fontSize: 14,
    color: '#000',
  },
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  uploadContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 20,
  },
  image: {
    width: 240,
    height: 240,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  uploadText: {
    marginTop: 16,
    color: '#666',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 35,
    marginTop: 32,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderRadius: 20,
  },
});
