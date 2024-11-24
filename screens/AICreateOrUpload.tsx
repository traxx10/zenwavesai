import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackIcon from '../assets/icons/back.svg'; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFlask, faCloudUpload } from '@fortawesome/free-solid-svg-icons';

export default function AICreateOrUploadScreen() {
  const { category: initialCategory, playlist: initialPlaylist } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log('页面接收到的所有参数:', {
      category: initialCategory,
      playlist: initialPlaylist ? JSON.parse(initialPlaylist as string) : null,
      raw: {
        category: initialCategory,
        playlist: initialPlaylist
      }
    });
  }, []);

  const [category, setCategory] = useState(initialCategory || '');
  const [title, setTitle] = useState('');
  const [playlist, setPlaylist] = useState(initialPlaylist ? JSON.parse(initialPlaylist as string) : null);

  const handleCreateWithAI = () => {
    const categoryString = Array.isArray(category) ? category[0] : category;
    const titleString = Array.isArray(title) ? title[0] : title;
  
    if (categoryString.trim() === '' || titleString.trim() === '') {
      Alert.alert('验证错误', '请填写类别和标题字段。');
    } else {
      const playlistData = playlist ? {
        id: playlist.id,
        title: playlist.title
      } : null;
  
      router.push({
        pathname: '/aigeneratemusic',
        params: { 
          category: categoryString, 
          title: titleString,
          playlist: playlistData ? JSON.stringify(playlistData) : '',
          playlistId: playlistData?.id || ''  // 确保 playlistId 被传递
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon width={24} height={24} fill="#000" /> 
        </TouchableOpacity>
        <Text style={styles.headerText}>AI Create or Upload Audio</Text>
      </View>

      {/* Central Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/create.png')}
          style={styles.image}
        />
      </View>

      {/* Category Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Category</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter category"
          value={category as string}
          onChangeText={(text) => setCategory(text)}
        />
      </View>

      {/* Title Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your song title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.createButton, { opacity: category && title ? 1 : 0.5 }]}
          onPress={handleCreateWithAI}
          disabled={!category || !title}
        >
          <FontAwesomeIcon icon={faFlask} size={20} color="#fff" style={styles.icon} />
          <Text style={styles.createButtonText}>Create with AI</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => router.push("/uploadaudio")}
        >
          <FontAwesomeIcon icon={faCloudUpload} size={20} color="#000" style={styles.icon} />
          <Text style={styles.uploadButtonText}>Upload Audio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  image: {
    width: 335,
    height: 252,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    width: '90%',
    alignSelf: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    width: '90%',
    alignSelf: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 8,
  },
});
