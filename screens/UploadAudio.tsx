import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPlusCircle, faFlask } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';
import BackIcon from '../assets/icons/back.svg'; // You can remove this line if not using the SVG icon anymore

export default function UploadAudioScreen() {
  const [selectedTag, setSelectedTag] = useState('White Noise');
  const [customTag, setCustomTag] = useState('');
  const [duration, setDuration] = useState('130');
  const [description, setDescription] = useState('Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
  const router = useRouter();

  const tags = [
    'White Noise',
    'Deep Sleep',
    'Meditation',
    'Focus',
    'Relaxation',
    'Brainwave',
    'Sound Therapy',
    'Stress Relief',
  ];

  const handleCustomTagAdd = () => {
    if (customTag) {
      setSelectedTag(customTag);
      setCustomTag('');
    }
  };

  const handleNext = () => {
    router.push('/uploading');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
   
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" /> 
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload Audio</Text>
      </View>

      
      <View style={styles.uploadContainer}>
        <Image
          source={require('../assets/images/uploadvoice.png')}
          style={styles.uploadImage}
        />
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Audio</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          multiline={true}
          onChangeText={(text) => setDescription(text)}
        />
      </View>

   
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Functional Tags</Text>
        <View style={styles.tagsContainer}>
          <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tag, selectedTag === tag && styles.selectedTag]}
                onPress={() => setSelectedTag(tag)}
              >
                <Text style={[styles.tagText, selectedTag === tag && styles.selectedTagText]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.customTagContainer}>
            <TextInput
              style={styles.customTagInput}
              placeholder="Enter custom tag"
              value={customTag}
              onChangeText={setCustomTag}
            />
            <TouchableOpacity onPress={handleCustomTagAdd} style={styles.customTagButton}>
              <FontAwesomeIcon icon={faPlusCircle} size={24} color="#000" /> 
            </TouchableOpacity>
          </View>
        </View>
      </View>


      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Duration (seconds)</Text>
        <TextInput
          style={styles.durationInput}
          keyboardType="numeric"
          value={duration}
          onChangeText={(text) => setDuration(text)}
        />
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.enhanceButton}>
          <FontAwesomeIcon icon={faFlask} size={20} color="#fff" /> 
          <Text style={styles.enhanceButtonText}>Enhance with AI</Text>
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
    paddingHorizontal: 40,
    paddingBottom: 30,
    paddingTop: 0, // Ensures no safe area padding
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: -20,
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
    backgroundColor: '#f1f1f1',
    paddingVertical: 30,
    borderRadius: 15,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  textArea: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    textAlignVertical: 'top',
    height: 100,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'column',
  },
  tagsScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedTag: {
    backgroundColor: '#888',
  },
  tagText: {
    color: '#000',
  },
  selectedTagText: {
    color: '#fff',
  },
  customTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  customTagInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 14,
  },
  customTagButton: {
    alignItems: 'center',
  },
  durationInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  enhanceButton: {
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
  enhanceButtonText: {
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
