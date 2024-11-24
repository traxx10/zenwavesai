import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for Expo Router navigation
import BackIcon from '../assets/icons/back.svg'; // Import your back icon
import SearchIcon from '../assets/icons/search.svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchFriendsScreen() {
  const router = useRouter(); // Use useRouter for navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ id?: string; relationship_status?: string; first_name?: string; last_name?: string; avatar_url?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setCurrentUserId(userId);
        }
      } catch (error) {
        console.log('Error getting userId from AsyncStorage:', error);
      }
    };

    getCurrentUserId();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsLoading(true);

    try {
      const url = `http://127.0.0.1:8000/search-by-phone/${searchQuery}`;
      console.log('Search URL:', url); // 输出 URL 以进行调试
      const response = await axios.get(url);
      setSearchResult(response.data);
    } catch (error) {
      console.error("Error fetching search result:", error);
      setSearchResult(null);
    }

    setIsLoading(false);
  };

  const handleFollow = async () => {
    try {
      if (!searchResult || !currentUserId) return;
      await axios.post(`http://127.0.0.1:8000/users/${currentUserId}/follow/${searchResult.id}`);
      setSearchResult(prev => ({
        ...(prev || { relationship_status: '' }),
        relationship_status: 'accepted'
      }));
    } catch (error) {
      console.log("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      if (!searchResult || !currentUserId) return;
      await axios.post(`http://127.0.0.1:8000/users/${currentUserId}/unfollow/${searchResult.id}`);
      setSearchResult(prev => ({
        ...(prev || { relationship_status: '' }),
        relationship_status: 'not_following'
      }));
    } catch (error) {
      console.log("Error unfollowing user:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon width={24} height={24} fill="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Friends</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon width={20} height={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by phone number"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Loading Indicator */}
      {isLoading && <ActivityIndicator size="large" color="#FFA500" />}

      {/* Search Result */}
      {searchResult && (
        <View style={styles.friendContainer}>
          <Image source={{ uri: searchResult.avatar_url }} style={styles.friendImage} />
          <Text style={styles.friendName}>{`${searchResult.first_name} ${searchResult.last_name}`}</Text>
          <TouchableOpacity
            style={styles.followButton}
            onPress={searchResult.relationship_status === 'accepted' ? handleUnfollow : handleFollow}
          >
            <Text style={styles.followButtonText}>
              {searchResult.relationship_status === 'accepted' ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* No Results */}
      {!isLoading && searchQuery && !searchResult && (
        <Text style={styles.noResultsText}>No user found with this phone number.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    marginTop: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  friendsList: {
    paddingBottom: 20,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'normal',
  },
  followButton: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  followButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
