import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeartFilledIcon from '../assets/icons/heart-filled.svg';
import BackIcon from '../assets/icons/back.svg';
import SearchIcon from '../assets/icons/search.svg';
import { BASE_URL } from '@/utils/apis';

interface FavoriteMusic {
  id: string;
  title: string;
  cover_url: string;
  creator_name: string;
  creator_id: string;
  music_type: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteMusic[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteMusic[]>(
    []
  );

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  useEffect(() => {
    setFilteredFavorites(favorites);
  }, [favorites]);

  const fetchUserFavorites = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(`${BASE_URL}/user-favorites/${userId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setFavorites(data.data.favorites);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteMusic }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/musicplayer',
          params: { id: item.id },
        })
      }
      style={styles.favoriteItem}
    >
      <Image source={{ uri: item.cover_url }} style={styles.coverImage} />
      <View style={styles.musicInfo}>
        <Text style={styles.musicTitle}>{item.title}</Text>
        <Text style={styles.creatorName}>{item.creator_name}</Text>
      </View>
      <HeartFilledIcon
        width={24}
        height={24}
        fill="#FF0000"
        style={styles.heartIcon}
      />
    </TouchableOpacity>
  );

  const filterFavorites = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredFavorites(favorites);
      return;
    }

    const searchTerms = text.toLowerCase().split(' ');
    const filtered = favorites.filter((music) => {
      const title = music.title.toLowerCase();
      const creator = music.creator_name.toLowerCase();

      return searchTerms.every(
        (term) => title.includes(term) || creator.includes(term)
      );
    });

    setFilteredFavorites(filtered);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon width={20} height={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search music or artist..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={filterFavorites}
          returnKeyType="search"
        />
        {searchText ? (
          <TouchableOpacity
            onPress={() => filterFavorites('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Favorites List - 使用过滤后的列表 */}
      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchText ? 'No music found' : 'No favorites yet'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,

    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  musicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  creatorName: {
    fontSize: 14,
    color: '#666',
  },
  heartIcon: {
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
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
    height: 40,
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
});
