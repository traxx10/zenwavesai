import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SearchIcon from '../assets/icons/search.svg';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeartOutlineIcon from '../assets/icons/heart-outline.svg';
import HeartFilledIcon from '../assets/icons/heart-filled.svg';
import { BASE_URL } from '@/utils/apis';

interface RecommendedMusic {
  id: string;
  title: string;
  cover_url: string;
  category: string;
  functional_tags: string;
  creator_name: string;
  creator_id: string;
  music_type: string;
}

interface FavoriteMusic {
  id: string;
  title: string;
  cover_url: string;
  creator_name: string;
  creator_id: string;
  music_type: string;
}

const mixes = [
  {
    id: '1',
    name: 'Meditation',
    image: require('../assets/images/mixes1.png'),
  },
  {
    id: '2',
    name: 'Psychedelic',
    image: require('../assets/images/mixes2.png'),
  },
  { id: '3', name: 'Brainwave', image: require('../assets/images/mixes3.png') },
  {
    id: '4',
    name: 'White Noise',
    image: require('../assets/images/mixes4.png'),
  },
  { id: '5', name: 'Sleep', image: require('../assets/images/mixes5.png') },
  {
    id: '6',
    name: 'Relaxation',
    image: require('../assets/images/mixes6.png'),
  },
  { id: '7', name: 'Pet', image: require('../assets/images/mixes7.png') },
  { id: '8', name: 'Baby', image: require('../assets/images/mixes8.png') },
  { id: '9', name: 'Focus', image: require('../assets/images/mixes9.png') },
];

const recentListening = [
  { id: '1', image: require('../assets/images/recent.png') },
  { id: '2', image: require('../assets/images/recent1.png') },
];

const playlists = [
  {
    id: '1',
    title: 'Night city vibes',
    songs: '20 Songs',
    image: require('../assets/images/playlist1.png'),
  },
  {
    id: '2',
    title: 'Psychedelic Album',
    songs: '50 Songs',
    image: require('../assets/images/playlist2.png'),
  },
];

const favorites = [
  {
    id: '1',
    name: 'That day with you',
    artist: 'The cru',
    image: require('../assets/images/fav1.png'),
  },
  {
    id: '2',
    name: 'That day with you',
    artist: 'The cru',
    image: require('../assets/images/fav2.png'),
  },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [topCreators, setTopCreators] = useState([]);
  const [recommendedMusic, setRecommendedMusic] = useState<RecommendedMusic[]>(
    []
  );
  const [searchText, setSearchText] = useState('');
  const [favoriteMusic, setFavoriteMusic] = useState<FavoriteMusic[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    fetchTopCreators();
    fetchRecommendedMusic();
    fetchUserFavorites();
    fetchRandomPlaylists();
  }, []);

  const fetchTopCreators = async () => {
    try {
      const response = await fetch(`${BASE_URL}/top-creators?limit=10`);
      const data = await response.json();
      if (data.status === 'success') {
        setTopCreators(data.data.creators);
      }
    } catch (error) {
      console.error('Failed to fetch top creators:', error);
    }
  };

  const fetchRecommendedMusic = async () => {
    try {
      const userId =
        (await AsyncStorage.getItem('userId')) || 'default-user-id';
      const response = await fetch(`${BASE_URL}/recommended-music/${userId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setRecommendedMusic(data.data.music_list);
      }
    } catch (error) {
      console.error('Failed to fetch recommended music:', error);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(`${BASE_URL}/user-favorites/${userId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setFavoriteMusic(data.data.favorites);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const fetchRandomPlaylists = async () => {
    try {
      const response = await fetch(`${BASE_URL}/playlists/random?limit=10`);
      const data = await response.json();
      if (data.status === 'success') {
        setPlaylists(data.data.playlists);
      }
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      try {
        const response = await fetch(
          `${BASE_URL}/search-music/${encodeURIComponent(text)}`
        );
        const data = await response.json();
        if (data.status === 'success') {
          // 处理搜索结果
          console.log('搜索结果:', data.data.music_list);
        }
      } catch (error) {
        console.error('Failed to search music:', error);
      }
    }
  };

  const renderCreator = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/userprofile',
          params: {
            userId: item.id,
            fromScreen: 'discover',
          },
        })
      }
    >
      <View style={styles.creatorContainer}>
        <Image source={{ uri: item.avatar_url }} style={styles.creatorImage} />
        <View>
          <Text style={styles.creatorName}>{item.name}</Text>
          <Text style={styles.creatorGenre}>{item.total_songs}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFavoriteItem = ({ item }: { item: FavoriteMusic }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/musicplayer',
          params: { id: item.id },
        })
      }
      style={styles.favoriteContainer}
    >
      <Image source={{ uri: item.cover_url }} style={styles.favoriteImage} />
      <View style={styles.favoriteContent}>
        <Text style={styles.favoriteName}>{item.title}</Text>
        <Text style={styles.favoriteArtist}>{item.creator_name}</Text>
      </View>
      <HeartFilledIcon
        width={24}
        height={24}
        fill="#FF0000" // 红色心形
        style={styles.heartIcon}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Browse Functional Music</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon width={20} height={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Latest Rankings - Banner Slider */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      >
        <TouchableOpacity onPress={() => router.push('/musicranking')}>
          <Image
            source={require('../assets/images/banner1.png')}
            style={styles.bannerImage}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/banner2.png')}
          style={styles.bannerImage}
        />
        <Image
          source={require('../assets/images/banner3.png')}
          style={styles.bannerImage}
        />
      </ScrollView>

      {/* Top Creators */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Creators</Text>
        <TouchableOpacity onPress={() => router.push('/topcreators')}>
          <Text style={styles.sectionViewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={topCreators}
        renderItem={renderCreator}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        style={styles.creatorsList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Your Top Mixes */}
      <Text style={styles.subHeader}>Your Top Mixes</Text>
      <FlatList
        data={mixes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.mixContainer}
            onPress={() =>
              router.push({
                pathname: '/functionalmusicplaylist',
                params: {
                  name: item.name,
                  imageUri: Image.resolveAssetSource(item.image).uri,
                },
              })
            }
          >
            <Image source={item.image} style={styles.mixImage} />
            <Text style={styles.mixName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.mixesList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Based on Your Recent Listening */}
      <Text style={styles.subHeader}>Based on your recent listening</Text>
      <FlatList
        data={recommendedMusic}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/musicplayer',
                params: { id: item.id },
              })
            }
          >
            <Image
              source={{ uri: item.cover_url }}
              style={styles.recentImage}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.recentList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Playlist */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Playlist</Text>
        <TouchableOpacity onPress={() => router.push('/playlistsall')}>
          <Text style={styles.sectionViewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={playlists}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/musicplaylist',
                params: {
                  playlistId: item.id,
                },
              })
            }
            style={styles.playlistContainer}
          >
            <Image
              source={{
                uri: item.cover_url || 'https://via.placeholder.com/215',
              }}
              style={styles.playlistImage}
            />
            <Text style={styles.playlistTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.playlistSongs}>{item.total_tracks} Songs</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.playlistsList}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>暂无播放列表</Text>
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        <TouchableOpacity onPress={() => router.push('/favorites')}>
          <Text style={styles.sectionViewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.favoritesContainer}>
        <FlatList
          data={favoriteMusic}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No favorites yet</Text>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 8,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tabItem: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 14,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  bannerImage: {
    width: 334.76,
    height: 174,
    borderRadius: 10,
    marginRight: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionViewAll: {
    fontSize: 14,
    color: '#888',
  },
  creatorsList: {
    paddingLeft: 16,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  creatorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  creatorName: {
    fontWeight: 'bold',
  },
  creatorGenre: {
    color: '#555',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 15,
  },
  mixesList: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  mixContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  mixImage: {
    width: 150,
    height: 150,
    borderRadius: 15,
  },
  mixName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  recentList: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  recentImage: {
    width: 182,
    height: 182,
    borderRadius: 15,
    marginRight: 15,
  },
  playlistsList: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  playlistContainer: {
    marginRight: 15,
  },
  playlistImage: {
    width: 215,
    height: 215,
    borderRadius: 15,
  },
  playlistTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  playlistSongs: {
    fontSize: 12,
    color: '#555',
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  favoriteImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  favoriteContent: {
    flex: 1,
    marginRight: 10, // 为心形图标留出空间
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  favoriteArtist: {
    fontSize: 14,
    color: '#555',
  },
  heartIcon: {
    marginLeft: 'auto', // 将心形图标推到右边
  },
  recommendedMusicContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  musicTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 150,
  },
  favoritesContainer: {
    paddingHorizontal: 0, // 移除水平内边距，因为列表项已经有了
    marginBottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
});
