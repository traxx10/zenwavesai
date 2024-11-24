import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PlayIcon from '../assets/icons/libraryplay.svg';
import PauseIcon from '../assets/icons/librarypause.svg';
import TrashIcon from '../assets/icons/librarytrash.svg';
import ShareIcon from '../assets/icons/libraryshare.svg';
import SearchIcon from '../assets/icons/searchwhite.svg';
import CloseIcon from '../assets/icons/Close.svg';
import CreateIcon from '../assets/icons/Create.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

interface AudioItem {
  id: string;
  title: string;
  duration: string;
  output_url: string;
  isPlaying: boolean;
  date: string;
  time: string;
  created_at: string;
}

const audioData = [
  { id: '1', title: 'project_meeting', date: '5 Aug 2022', time: '09:30 am', duration: '00:28:14', isPlaying: false, output_url: 'http://example.com/audio1.mp3', created_at: '2022-08-05T09:30:00' },
  { id: '2', title: 'singer_interview', date: '13 Aug 2022', time: '02:00 pm', duration: '01:58:17', isPlaying: false, output_url: 'http://example.com/audio2.mp3', created_at: '2022-08-13T14:00:00' },
  { id: '3', title: 'customer_meeting', date: '2 Aug 2022', time: '10:45 am', duration: '00:16:35', isPlaying: false, output_url: 'http://example.com/audio3.mp3', created_at: '2022-08-02T10:45:00' },
  { id: '4', title: 'team_meeting', date: '10 Aug 2022', time: '03:15 pm', duration: '00:34:26', isPlaying: false, output_url: 'http://example.com/audio4.mp3', created_at: '2022-08-10T15:15:00' },
  { id: '5', title: 'designer_interview', date: '8 Aug 2022', time: '04:30 pm', duration: '00:57:49', isPlaying: false, output_url: 'http://example.com/audio5.mp3', created_at: '2022-08-08T16:30:00' },
];
const API_URL = 'http://127.0.0.1:8000';
const generateWaveform = () => {
  const bars = [];
  for (let i = 0; i < 80; i++) {
    const height = Math.random() * 40 + 10;
    bars.push(
      <View
        key={i}
        style={{
          width: 3,
          height: height,
          backgroundColor: '#E1E1E1',
          marginRight: 2,
          borderRadius: 2,
        }}
      />
    );
  }
  return bars;
};

type RootStackParamList = {
  friendsMusicedit: {
    draft_list_id: string;
    newClips: {
      id: string;
      title: string;
      length: number;
      startTime: number;
      trackIndex: number;
      volume: number;
      fadeIn: number;
      fadeOut: number;
      output_url: string;
    }[];
  };
};

// 添加一个接口来定义分组后的数据结构
interface GroupedAudios {
  date: string;
  items: AudioItem[];
}

export default function FriendsLibraryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    draft_list_id: string;
    friend_id: string;
  }>();
  const draft_list_id = params?.draft_list_id;
  const friend_id = params?.friend_id;
  
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAudios, setSelectedAudios] = useState<AudioItem[]>([]);
  const [slideAnim] = useState(new Animated.Value(300));
  const [isPanelVisible, setPanelVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [groupedAudios, setGroupedAudios] = useState<GroupedAudios[]>([]);

  // 获取音频列表
  useEffect(() => {
    const fetchAudioLibrary = async () => {
      try {
        console.log('开始获取音频库数据...');
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log('等待参数...', { userId });
          return;
        }

        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/draft-music-library/${userId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch audio library');
        }

        const data = await response.json();
        console.log('获取到的音频数据:', data);

        if (data.status === 'success') {
          const formattedAudios: AudioItem[] = data.data.music_list.map((music: any) => ({
            id: music.id,
            title: music.title,
            duration: music.duration,
            output_url: music.output_url,
            isPlaying: false,
            date: new Date(music.created_at).toLocaleDateString(),
            time: new Date(music.created_at).toLocaleTimeString(),
            created_at: music.created_at,
          }));
          
          setAudios(formattedAudios);
        }
      } catch (error) {
        console.error('获取音频库失败:', error);
        Alert.alert('错误', '获取音频库失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioLibrary();
  }, []);

  // 在获取数据后进行分组
  useEffect(() => {
    const groupAudiosByMonth = () => {
      const groups: { [key: string]: AudioItem[] } = {};
      
      audios.forEach(audio => {
        const date = new Date(audio.created_at);
        const monthYear = date.toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'long'
        });
        
        if (!groups[monthYear]) {
          groups[monthYear] = [];
        }
        groups[monthYear].push(audio);
      });

      // 转换为数组并按日期排序
      const sortedGroups = Object.entries(groups)
        .map(([date, items]) => ({ date, items }))
        .sort((a, b) => new Date(b.items[0].created_at).getTime() - new Date(a.items[0].created_at).getTime());

      console.log('音频分组数据:', {
        totalAudios: audios.length,
        groupedData: sortedGroups
      });

      setGroupedAudios(sortedGroups);
    };

    groupAudiosByMonth();
  }, [audios]);

  const handleSelectAudio = (audio: AudioItem) => {
    if (selectedAudios.find((a) => a.id === audio.id)) {
      setSelectedAudios((prev) => prev.filter((a) => a.id !== audio.id));
    } else {
      setSelectedAudios((prev) => [...prev, audio]);
    }
  };

  const handleConfirmSelection = async () => {
    let userId: string | null = null;
    
    try {
      userId = await AsyncStorage.getItem('userId');
      
      if (!userId || !friend_id || !draft_list_id) {
        console.error('缺少必要参数:', { userId, friend_id, draft_list_id });
        Alert.alert('错误', '缺少必要参数');
        return;
      }

      const musicIds = selectedAudios.map(audio => audio.id).join(',');
      
      const response = await fetch(
        `${API_URL}/users/${userId}/friend-draft-list/${draft_list_id}/friend/${friend_id}/music-library/${musicIds}/add-music`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            friend_id: friend_id,
            draft_list_id: draft_list_id,
            music_ids: musicIds
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('请求失败详情:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData?.message || 'Failed to add music to draft');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        const newClips = selectedAudios.map((audio, index) => ({
          id: audio.id,
          title: audio.title || '',
          length: Number(audio.duration) || 0,
          startTime: 0,
          trackIndex: index,
          volume: 1,
          fadeIn: 0,
          fadeOut: 0,
          output_url: audio.output_url || ''
        }));

        router.push({
          pathname: '/creatormusicedit',
          params: {
            draft_list_id: result.data.draft_list_id,
            newClips: JSON.stringify(newClips),
            friend_id
          }
        });
      } else {
        throw new Error(result.message || 'Failed to add music');
      }

    } catch (error) {
      console.error('添加音频失败:', error, {
        requestDetails: {
          userId: userId,
          friend_id,
          draft_list_id,
          selectedAudiosCount: selectedAudios.length
        }
      });
      Alert.alert('错误', '添加音频失败');
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: slideAnim }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          slideDown();
        } else {
          slideUp();
        }
      },
    })
  ).current;

  const slideUp = () => {
    setPanelVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setPanelVisible(false));
  };

  const handlePlayPause = async (id: string, output_url: string) => {
    console.log('播放/暂停音频...', {
      id,
      output_url,
      currentPlayingId
    });

    if (currentPlayingId === id && sound) {
      await sound.pauseAsync();
      setCurrentPlayingId(null);
      setAudios(
        audios.map((audio) => (audio.id === id ? { ...audio, isPlaying: false } : audio))
      );
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: output_url }, { shouldPlay: true });

      setSound(newSound);
      setCurrentPlayingId(id);
      setAudios(
        audios.map((audio) =>
          audio.id === id ? { ...audio, isPlaying: true } : { ...audio, isPlaying: false }
        )
      );
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const renderAudioItem = ({ item }: { item: AudioItem }) => (
    <TouchableOpacity
      style={[
        styles.audioItem,
        selectedAudios.find((audio) => audio.id === item.id) && styles.audioItemSelected,
      ]}
      onPress={() => handleSelectAudio(item)}
    >
      <View style={styles.audioRow}>
        <TouchableOpacity onPress={() => handlePlayPause(item.id, item.output_url)} style={styles.playButton}>
          {item.isPlaying ? <PauseIcon width={47} height={47} /> : <PlayIcon width={47} height={47} />}
        </TouchableOpacity>
        <View style={styles.audioInfo}>
          <Text style={styles.audioTitle}>{item.title}</Text>
          <Text style={styles.audioDetails}>{`${item.date}  ${item.time}`}</Text>
        </View>
        <Text style={styles.audioDuration}>{item.duration}</Text>
      </View>
      {item.isPlaying && (
        <View style={styles.controls}>
          <View style={styles.waveformContainer}>{generateWaveform()}</View>
          <View style={styles.controlIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <TrashIcon width={38} height={38} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <ShareIcon width={38} height={38} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const getFormattedDate = () => {
    if (audios.length === 0) return '';
    
    const dates = audios.map(audio => new Date(audio.date));
    const latestDate = new Date(Math.max(...dates.map(date => date.getTime())));
    const earliestDate = new Date(Math.min(...dates.map(date => date.getTime())));
    
    if (latestDate.getMonth() === earliestDate.getMonth() && 
        latestDate.getFullYear() === earliestDate.getFullYear()) {
      return latestDate.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long'
      });
    }
    
    // 否则显示日期范围
    return `${earliestDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })} - ${
      latestDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <CloseIcon width={24} height={24} fill="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Creator Library</Text>
            <TouchableOpacity onPress={slideUp}>
              <CreateIcon width={24} height={24} fill="#fff" />
            </TouchableOpacity>
          </View>

          {isPanelVisible && (
            <Animated.View
              style={[styles.slideUpPanel, { transform: [{ translateY: slideAnim }] }]}
              {...panResponder.panHandlers}
            >
              <View style={styles.panelHandle} />
              <TouchableOpacity style={styles.uploadButton} onPress={() => {}}>
                <Text style={styles.uploadButtonText}>Upload Music</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={() => {}}>
                <Text style={styles.createButtonText}>Create New Music</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchIcon style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Audio List */}
          <FlatList
            data={groupedAudios}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.dateTitle}>{item.date}</Text>
                {item.items.map((audio) => (
                  <View key={audio.id}>
                    {renderAudioItem({ item: audio })}
                  </View>
                ))}
              </View>
            )}
            contentContainerStyle={styles.audioList}
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSelection}>
              <Text style={styles.confirmButtonText}>添加选中的音频 ({selectedAudios.length})</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: -70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 50,
  },
  closeIcon: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  searchContainer: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  dateTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  audioList: {
    paddingBottom: 10,
  },
  audioItem: {
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  audioItemSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 47,
    height: 47,
    borderRadius: 20,
    backgroundColor: '#3a3a3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioInfo: {
    flex: 1,
    marginLeft: 12,
  },
  audioTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  audioDetails: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
  },
  audioDuration: {
    color: '#aaa',
    fontSize: 14,
    position: 'absolute',
    right: 16,
    top: 18,
  },
  controls: {
    flexDirection: 'column',
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#444',
    paddingTop: 10,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 50,
    paddingHorizontal: 8,
  },
  controlIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 5,
  },
  bottomSpacer: {
    height: 80,
    backgroundColor: '#1c1c1e',
    position: 'absolute',
    bottom: -40,
    left: 0,
    zIndex: -1000,
    right: 0,
  },
  slideUpPanel: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  panelHandle: {
    width: 60,
    height: 6,
    backgroundColor: '#666',
    borderRadius: 3,
    marginBottom: 15,
  },
  uploadButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1e',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
