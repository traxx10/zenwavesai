import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackIcon from '../assets/icons/back.svg'; // Custom SVG icon
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

const API_BASE_URL = BASE_URL; // Development environment
// const API_BASE_URL = 'https://your-production-api.com'; // Production environment

interface Playlist {
  id: string;
  title: string;
  // 添加其他必要的播放列表属性
}

export default function AIGenerateMusicScreen() {
  const {
    category = '',
    title = '',
    playlist = '',
    playlistId = '',
  } = useLocalSearchParams();
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState(['White Noise']);
  const [customTag, setCustomTag] = useState('');
  const [duration, setDuration] = useState('10');
  const [tags, setTags] = useState([
    'White Noise',
    'Deep Sleep',
    'Meditation',
    'Focus',
    'Relaxation',
    'Brainwave',
    'Sound Therapy',
    'Stress Relief',
  ]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch(
          `${API_BASE_URL}/user-playlists/${userId}`
        );
        const data = await response.json();
        if (data.status === 'success') {
          setPlaylists(data.data.playlists);
        }
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    console.log('🟢 接收到的参数:', {
      category,
      title,
      playlist: playlist ? JSON.parse(playlist as string) : null,
      playlistId,
      raw: { category, title, playlist, playlistId },
    });
  }, []);

  useEffect(() => {
    const loadSavedForm = async () => {
      try {
        const savedData = await AsyncStorage.getItem('temp_music_form');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setPrompt(parsedData.prompt || '');
          setDescription(parsedData.description || '');
          setSelectedTags(parsedData.selectedTags || ['White Noise']);
          setDuration(parsedData.duration || '10');
          setNewPlaylistTitle(parsedData.newPlaylistTitle || '');
          setSelectedPlaylist(parsedData.selectedPlaylist || null);
        }
      } catch (error) {
        console.error('加载表单数据失败:', error);
      }
    };

    loadSavedForm();
  }, []);

  useEffect(() => {
    const checkNewPlaylist = async () => {
      try {
        const lastCreatedPlaylistJson = await AsyncStorage.getItem(
          'last_created_playlist'
        );
        if (lastCreatedPlaylistJson) {
          const lastCreatedPlaylist = JSON.parse(lastCreatedPlaylistJson);
          setSelectedPlaylist(lastCreatedPlaylist);
          // 使用后清除
          await AsyncStorage.removeItem('last_created_playlist');
        }
      } catch (error) {
        console.error('检查新创建的播放列表失败:', error);
      }
    };

    checkNewPlaylist();
  }, []);

  const saveFormData = async (updates = {}) => {
    try {
      const formData = {
        prompt,
        description,
        selectedTags,
        duration,
        newPlaylistTitle,
        selectedPlaylist,
        ...updates,
      };
      await AsyncStorage.setItem('temp_music_form', JSON.stringify(formData));
    } catch (error) {
      console.error('保存表单数据失败:', error);
    }
  };

  const handlePromptChange = (text: string) => {
    setPrompt(text);
    saveFormData({ prompt: text });
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    saveFormData({ description: text });
  };

  const handleDurationChange = (text: string) => {
    setDuration(text);
    saveFormData({ duration: text });
  };

  const handleNewPlaylistTitleChange = (text: string) => {
    setNewPlaylistTitle(text);
    saveFormData({ newPlaylistTitle: text });
  };

  const handleCustomTagAdd = () => {
    const trimmedInput = customTag.trim();
    if (!trimmedInput) return;

    const newTags = trimmedInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    newTags.forEach((newTag) => {
      const existingTag = tags.find(
        (tag) => tag.toLowerCase() === newTag.toLowerCase()
      );
      if (existingTag) {
        if (!selectedTags.includes(existingTag)) {
          setSelectedTags((prevSelected) => [existingTag, ...prevSelected]);
        }
        setTags((prevTags) => [
          existingTag,
          ...prevTags.filter((tag) => tag !== existingTag),
        ]);
      } else {
        setTags((prevTags) => [newTag, ...prevTags]);
        setSelectedTags((prevSelected) => [newTag, ...prevSelected]);
      }
    });

    setCustomTag('');
  };

  const toggleTagSelection = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    saveFormData({ selectedTags: newSelectedTags });
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    saveFormData({ selectedPlaylist: playlist });
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) {
      alert('Please enter playlist title');
      return;
    }

    // 跳转到创建播放列表页面并传递标题
    router.push({
      pathname: '/createplaylist',
      params: {
        title: newPlaylistTitle,
      },
    });

    // 清空输入并隐藏输入框
    setNewPlaylistTitle('');
    setShowNewPlaylistInput(false);
  };

  const handleNext = async () => {
    if (!prompt.trim()) {
      alert('请输入提示词以继续');
      return;
    }

    const params = {
      category,
      title,
      prompt,
      description,
      selectedTags: selectedTags.join(', '),
      duration,
      playlistId: selectedPlaylist?.id || '',
      playlistTitle: selectedPlaylist?.title || '',
    };

    console.log('🔵 传递到下一页的参数:', params);

    try {
      await AsyncStorage.removeItem('temp_music_form');
      router.push({
        pathname: '/uploadtextcover',
        params,
      });
    } catch (error) {
      console.error('清除表单数据失败:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BackIcon width={24} height={24} fill="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>AI Generate Music</Text>
        </View>

        {/* Prompt Input Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Enter Prompt for Music</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the kind of music you want..."
            value={prompt}
            multiline={true}
            onChangeText={handlePromptChange}
          />
        </View>

        {/* Description Input Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter a description for the music..."
            value={description}
            multiline={true}
            onChangeText={handleDescriptionChange}
          />
        </View>

        {/* Functional Tags Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Functional Tags</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.selectedTag,
                ]}
                onPress={() => toggleTagSelection(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.selectedTagText,
                  ]}
                >
                  {tag}
                </Text>
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
            <TouchableOpacity
              onPress={handleCustomTagAdd}
              style={styles.customTagButton}
            >
              <FontAwesomeIcon icon={faCirclePlus} size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration Input Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Duration (seconds)</Text>
          <TextInput
            style={styles.durationInput}
            keyboardType="numeric"
            value={duration}
            onChangeText={handleDurationChange}
          />
        </View>

        {/* Playlist Selection Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Playlist</Text>
          <View style={styles.playlistsContainer}>
            {playlists.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                style={[
                  styles.playlistItem,
                  selectedPlaylist?.id === playlist.id &&
                    styles.selectedPlaylist,
                ]}
                onPress={() => handlePlaylistSelect(playlist)}
              >
                <Text
                  style={[
                    styles.playlistTitle,
                    selectedPlaylist?.id === playlist.id &&
                      styles.selectedPlaylistText,
                  ]}
                  numberOfLines={1}
                >
                  {playlist.title}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.newPlaylistButton}
              onPress={() => setShowNewPlaylistInput(true)}
            >
              <FontAwesomeIcon icon={faPlus} size={16} color="#000" />
              <Text style={styles.newPlaylistText}>New Playlist</Text>
            </TouchableOpacity>
          </View>

          {showNewPlaylistInput && (
            <View style={styles.newPlaylistInputContainer}>
              <TextInput
                style={styles.newPlaylistInput}
                placeholder="Enter playlist title"
                value={newPlaylistTitle}
                onChangeText={handleNewPlaylistTitleChange}
              />
              <TouchableOpacity
                style={styles.createPlaylistButton}
                onPress={handleCreatePlaylist}
              >
                <Text style={styles.createPlaylistButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  inputGroup: {
    marginBottom: 20,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  tag: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
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
    paddingHorizontal: 10,
  },
  customTagInput: {
    flex: 1,
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
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 35,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playlistItem: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginBottom: 8,
  },
  selectedPlaylist: {
    backgroundColor: '#888',
  },
  playlistTitle: {
    color: '#000',
    fontSize: 14,
  },
  selectedPlaylistText: {
    color: '#fff',
  },
  newPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginBottom: 8,
  },
  newPlaylistText: {
    marginLeft: 6,
    color: '#000',
    fontSize: 14,
  },
  newPlaylistInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  newPlaylistInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  createPlaylistButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  createPlaylistButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
