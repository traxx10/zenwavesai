import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import BackIcon from '../assets/icons/backwhite.svg';
import PlayIcon from '../assets/icons/playlist1.svg';
import SearchIcon from '../assets/icons/search.svg';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import ShuffleIcon from '../assets/icons/Shuffle.svg';

const backgroundImages: { [key: string]: any } = {
  'Meditation': require('../assets/images/Meditationbg.png'),
  'Psychedelic': require('../assets/images/Psychedelicbg.png'),
  'Brainwave': require('../assets/images/Brainwavebg.png'),
  'White Noise': require('../assets/images/WhiteNoisebg.png'),
  'Sleep': require('../assets/images/Sleepbg.png'),
  'Relaxation': require('../assets/images/Relaxationbg.png'),
  'Pet': require('../assets/images/Petbg.png'),
  'Baby': require('../assets/images/Babybg.png'),
  'Focus': require('../assets/images/Focusbg.png'),
};

const FunctionalMusicPlaylistScreen = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  const bgImage = backgroundImages[name as string];

  const [songs, setSongs] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/search-music/${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.status === 'success') {
        setSearchResults(data.data.music_list);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  const renderSongItem = ({ item }: { item: any }) => {
    const handleNavigation = () => {
      router.push({
        pathname: '/musicplayer',
        params: { id: item.id }
      });
    };

    return (
      <TouchableOpacity 
        style={styles.songItem}
        onPress={handleNavigation}
      >
        <Image 
          source={{ uri: item.cover_url || 'https://via.placeholder.com/60' }} 
          style={styles.songCover} 
        />
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.creator_name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={handleNavigation}
        >
          <PlayIcon width={24} height={24} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/discover')}>
          <BackIcon width={30} height={40} fill="#FFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <SearchIcon width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your favorite song"
            placeholderTextColor="#C0BDBD"
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              if (text.length >= 2) {  // 至少输入2个字符才开始搜索
                handleSearch(text);
              }
            }}
          />
        </View>
      </View>

      <View style={styles.gradientOverlay} />
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{name}</Text>
          <TouchableOpacity>
            <ShuffleIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const fetchMusicList = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/search-music/${name}`);
      const data = await response.json();
      if (data.status === 'success') {
        setSongs(data.data.music_list);
      }
    } catch (error) {
      console.error('获取音乐列表失败:', error);
    }
  };

  useEffect(() => {
    fetchMusicList();
  }, [name]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image
        source={bgImage}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ListHeader />
        <View style={styles.songListContainer}>
          <Text style={styles.sectionTitle}>Recent Song</Text>
          {searchResults.length > 0 ? searchResults.map(item => renderSongItem({ item })) 
                                   : songs.map(item => renderSongItem({ item }))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FunctionalMusicPlaylistScreen;

const styles = StyleSheet.create({
  container: {
    height: '120%',
    paddingBottom: 0,
    backgroundColor: '#333',
  },
  background: {
    position: 'absolute',
    top: -300,
    left: 0,
    right: 0,
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: StatusBar.currentHeight || 0,
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  titleContainer: {
    top: 208,
    marginTop: 20,
    paddingHorizontal: 26,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  songListContainer: {
    marginTop: 258,
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 26,
    flex: 1,
    minHeight: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  songCover: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  songArtist: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 4,
  },
  playButton: {
    padding: 10,
    borderRadius: 20,
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: 472,
    top: 208,
    backgroundColor: 'black',
    opacity: 0.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollViewContent: {
    paddingBottom: 130,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

});
