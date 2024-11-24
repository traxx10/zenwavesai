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

// 添加类型定义
interface PlaylistTrack {
  id: string;
  title: string;
  cover_url: string;
  creator_name: string;
  creator_id: string;
  music_type: string;
  order: number;
}

interface PlaylistData {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  is_public: boolean;
  creator: {
    id: string;
    name: string;
    avatar_url: string;
  };
  total_tracks: number;
  tracks: PlaylistTrack[];
}

const MusicPlaylistScreen = () => {
  const router = useRouter();
  const { playlistId } = useLocalSearchParams();

  const [songs, setSongs] = useState<PlaylistTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaylistTrack[]>([]);
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/playlists/${playlistId}/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.status === 'success') {
        setSearchResults(data.data.music_list);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  const handleShufflePress = () => {
    router.push({
      pathname: '/playlistplayer',
      params: { 
        playlistId: playlistId,
        shuffle: 'true'
      },
    });
  };

  const renderSongItem = ({ item }: { item: PlaylistTrack }) => {
    const handleNavigation = () => {
      router.push({
        pathname: '/musicplayer',
        params: { 
          id: item.id,
          title: item.title,
          coverUrl: item.cover_url,
          creatorName: item.creator_name
        },
      });
    };

    return (
      <TouchableOpacity style={styles.songItem} onPress={handleNavigation}>
        <Image
          source={{ uri: item.cover_url || 'https://via.placeholder.com/60' }}
          style={styles.songCover}
        />
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.creator_name}</Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={handleNavigation}>
          <PlayIcon width={24} height={24} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon width={30} height={40} fill="#FFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <SearchIcon width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your favorite song"
            placeholderTextColor="#C0BDBD"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.length >= 2) {
                handleSearch(text);
              }
            }}
          />
        </View>
      </View>

      <View style={styles.gradientOverlay} />
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{playlistData?.title}</Text>
          <TouchableOpacity onPress={handleShufflePress}>
            <ShuffleIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const fetchPlaylistData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/playlists/${playlistId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setPlaylistData(data.data.playlist);
        setSongs(data.data.playlist.tracks);
      }
    } catch (error) {
      console.error('获取播放列表数据失败:', error);
    }
  };

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {playlistData && (
        <>
          <Image
            source={{ uri: playlistData.cover_url }}
            style={styles.background}
          />
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <ListHeader />
            <View style={styles.songListContainer}>
              <Text style={styles.sectionTitle}>Recent Songs</Text>
              {searchResults.length > 0
                ? searchResults.map((item) => renderSongItem({ item }))
                : songs.map((item) => renderSongItem({ item }))}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default MusicPlaylistScreen;

const styles = StyleSheet.create({
  container: {
    height: '120%',
    paddingBottom: 0,
    backgroundColor: '#333',
  },
  background: {
    position: 'absolute',
    top: -70,
    left: 0,
    right: 0,
    width: '100%',
    
    aspectRatio: 1,
    resizeMode: 'cover',
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
