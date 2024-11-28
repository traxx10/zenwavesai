import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import MoreIcon from '../assets/icons/more.svg';
import SearchIcon from '../assets/icons/search.svg';
import PlayIcon from '../assets/icons/ic-play.svg';
import { BASE_URL } from '@/utils/apis';

interface MusicItem {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  duration: string;
  plays: string;
}

const MusicRankingScreen = () => {
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMusicRanking = async (
    pageNum: number,
    refresh: boolean = false
  ) => {
    console.log(`开始获取音乐排行榜数据 - 页码: ${pageNum}, 刷新: ${refresh}`);
    try {
      const url = `${BASE_URL}/music-ranking?page=${pageNum}&page_size=20`;
      console.log('请求URL:', url);

      const response = await fetch(url);
      console.log('响应状态:', response.status);

      const data = await response.json();
      console.log('响应数据:', data);

      if (data.status === 'success') {
        const newList = data.data.music_list;
        console.log(`获取到 ${newList.length} 条音乐数据`);
        setMusicList(refresh ? newList : [...musicList, ...newList]);
        setHasMore(pageNum < data.data.total_pages);
      } else {
        console.error('API返回错误:', data);
        setError('Failed to load music ranking');
      }
    } catch (err: any) {
      console.error('网络请求错误:', err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMusicRanking(1);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchMusicRanking(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchMusicRanking(1, true);
  };

  const renderMusicItem = ({ item }: { item: MusicItem }) => (
    <View style={styles.musicItem}>
      <Image source={{ uri: item.cover_url }} style={styles.coverImage} />
      <View style={styles.musicDetails}>
        <Text style={styles.musicTitle}>{item.title}</Text>
        <Text style={styles.musicAuthor}>{item.author}</Text>
      </View>
      <Text style={styles.musicPlays}>{item.plays} plays</Text>
      <Text style={styles.musicDuration}>{item.duration}</Text>
      <TouchableOpacity style={styles.playButton}>
        <PlayIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchMusicRanking(1, true)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Music Ranking</Text>
        <TouchableOpacity onPress={() => setShowMoreMenu(true)}>
          <MoreIcon width={16} height={16} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon width={20} height={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search music..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Music List */}
      <FlatList
        data={musicList}
        keyExtractor={(item) => item.id}
        renderItem={renderMusicItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={() =>
          loading && !refreshing ? (
            <ActivityIndicator style={styles.loader} color="#000" />
          ) : null
        }
      />

      {/* More Menu Modal */}
      <Modal
        visible={showMoreMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMoreMenu(false)}
        >
          <View style={styles.moreMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Sort by plays
                setShowMoreMenu(false);
              }}
            >
              <Text style={styles.menuText}>Sort by Plays</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Sort by duration
                setShowMoreMenu(false);
              }}
            >
              <Text style={styles.menuText}>Sort by Duration</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Filter favorites
                setShowMoreMenu(false);
              }}
            >
              <Text style={styles.menuText}>Show Favorites Only</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MusicRankingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
    color: '#888',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  listContainer: {
    paddingBottom: 20,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  musicDetails: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  musicAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  musicPlays: {
    fontSize: 12,
    color: '#999',
    marginRight: 10,
  },
  musicDuration: {
    fontSize: 12,
    color: '#999',
  },
  playButton: {
    padding: 8,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  moreMenu: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  retryText: {
    fontSize: 16,
    color: '#FFF',
  },
  loader: {
    marginTop: 10,
  },
});
