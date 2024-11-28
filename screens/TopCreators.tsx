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
import { BASE_URL } from '@/utils/apis';

interface CreatorItem {
  id: string;
  name: string;
  avatar_url: string;
  total_songs: string;
  total_plays: string;
  raw_plays: number;
}

const TopCreatorsScreen = () => {
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [creatorList, setCreatorList] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredCreatorList, setFilteredCreatorList] = useState<CreatorItem[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCreators = async (pageNum: number, refresh: boolean = false) => {
    try {
      const url = `${BASE_URL}/top-creators?page=${pageNum}&page_size=20`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'success') {
        const newList = data.data.creators;
        setCreatorList(refresh ? newList : [...creatorList, ...newList]);
        setHasMore(newList.length === 20);
      } else {
        setError('Failed to load creators');
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCreators(1);
  }, []);

  useEffect(() => {
    setFilteredCreatorList(creatorList);
  }, [creatorList]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchCreators(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchCreators(1, true);
  };

  const filterCreators = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredCreatorList(creatorList);
      return;
    }

    const searchTerms = text.toLowerCase().split(' ');
    const filtered = creatorList.filter((creator) => {
      const name = creator.name.toLowerCase();
      return searchTerms.every((term) => name.includes(term));
    });

    setFilteredCreatorList(filtered);
  };

  const renderCreatorItem = ({ item }: { item: CreatorItem }) => (
    <View style={styles.creatorItem}>
      <Image source={{ uri: item.avatar_url }} style={styles.avatarImage} />
      <View style={styles.creatorDetails}>
        <Text style={styles.creatorName}>{item.name}</Text>
        <Text style={styles.creatorFollowers}>{item.total_songs}</Text>
      </View>
      <Text style={styles.creatorPlays}>{item.total_plays} plays</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchCreators(1, true)}
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
        <TouchableOpacity onPress={() => router.push('/discover')}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Creators</Text>
        <TouchableOpacity onPress={() => setShowMoreMenu(true)}>
          <MoreIcon width={16} height={16} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon width={20} height={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search creators..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={filterCreators}
          returnKeyType="search"
        />
      </View>

      {/* Creator List */}
      <FlatList
        data={filteredCreatorList}
        keyExtractor={(item) => item.id}
        renderItem={renderCreatorItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchText ? 'No creators found' : 'No creators available'}
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          loading && !refreshing ? (
            <ActivityIndicator style={styles.loader} color="#000" />
          ) : null
        }
      />
    </View>
  );
};

export default TopCreatorsScreen;

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
  creatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  creatorFollowers: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  creatorPlays: {
    fontSize: 12,
    color: '#999',
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});
