import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import SearchIcon from '../assets/icons/search.svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

// 添加防抖函数
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function CollaborateFriendsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [originalResults, setOriginalResults] = useState<any[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { draft_list_id } = useLocalSearchParams();

  // 获取当前用户ID
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

  // 获取所有好友列表
  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const url = `${BASE_URL}/users/${currentUserId}/mutual-friends`;
      const response = await axios.get(url);

      const results = response.data.data.mutual_friends.filter(
        (friend: any) => friend.id !== currentUserId
      );

      setOriginalResults(results);
      setSearchResults(results);
    } catch (error) {
      console.error('获取好友列表失败:', error);
      setOriginalResults([]);
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  // 智能搜索函数
  const smartSearch = (query: string, data: any[]) => {
    if (!query.trim()) return data;

    const searchTerms = query
      .toLowerCase()
      .split(' ')
      .filter((term) => term);

    return data
      .filter((friend) => {
        const searchableFields = [
          `${friend.first_name} ${friend.last_name}`, // Full name
          friend.first_name, // First name
          friend.last_name, // Last name
        ].map((field) => (field || '').toLowerCase());

        // All search terms must match at least one field
        return searchTerms.every((term) =>
          searchableFields.some((field) => {
            // Exact match
            if (field.includes(term)) return true;

            // Fuzzy match (allowing slight spelling mistakes)
            const maxDistance = Math.floor(term.length / 3);
            return searchableFields.some(
              (field) => levenshteinDistance(field, term) <= maxDistance
            );
          })
        );
      })
      .sort((a, b) => {
        // Priority sorting: Exact match > Partial match > Fuzzy match
        const aFullName = `${a.first_name} ${a.last_name}`.toLowerCase();
        const bFullName = `${b.first_name} ${b.last_name}`.toLowerCase();

        const aExactMatch = aFullName.includes(query.toLowerCase());
        const bExactMatch = bFullName.includes(query.toLowerCase());

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        return 0;
      });
  };

  // 使用防抖的搜索词进行搜索
  useEffect(() => {
    const results = smartSearch(debouncedSearchQuery, originalResults);
    setSearchResults(results);
  }, [debouncedSearchQuery, originalResults]);

  // 初始加载
  useEffect(() => {
    if (currentUserId) {
      fetchFriends();
    }
  }, [currentUserId]);

  // 编辑距离计算（用于模糊匹配）
  const levenshteinDistance = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    return track[str2.length][str1.length];
  };

  const handleSelectFriend = async (friendId: string) => {
    try {
      setIsLoading(true);

      // 调用发送草稿消息的 API
      const response = await axios.post(
        `${BASE_URL}/users/${currentUserId}/send-draft/${friendId}`,
        null, // 不需要请求体
        {
          params: {
            draft_list_id: draft_list_id,
          },
        }
      );

      if (response.data.status === 'success') {
        // 发送成功后导航到聊天页面
        router.push({
          pathname: '/chat',
          params: { targetUserId: friendId },
        });
      }
    } catch (error) {
      console.error('Error sending draft:', error);
      Alert.alert('Error', 'Failed to send draft. Please try again.');
    } finally {
      setIsLoading(false);
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
        <Text style={styles.headerTitle}>Select a Friend to Collaborate</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon width={20} height={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Loading Indicator */}
      {isLoading && <ActivityIndicator size="large" color="#FFA500" />}

      {/* Search Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendContainer}>
            <Image
              source={{ uri: item.avatar_url }}
              style={styles.friendImage}
            />
            <Text
              style={styles.friendName}
            >{`${item.first_name} ${item.last_name}`}</Text>
            <TouchableOpacity
              style={[styles.selectButton, isLoading && styles.disabledButton]}
              onPress={() => handleSelectFriend(item.id)}
              disabled={isLoading}
            >
              <Text style={styles.selectButtonText}>
                {isLoading ? 'Sending...' : 'Select'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          !isLoading && searchQuery ? (
            <Text style={styles.noResultsText}>
              No users found with this name.
            </Text>
          ) : !isLoading && searchResults.length === 0 ? (
            <Text style={styles.noResultsText}>No mutual friends yet.</Text>
          ) : null
        }
      />
    </View>
  );
}

export default CollaborateFriendsScreen;

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
    height: 40,
    paddingHorizontal: 10,
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
  selectButton: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  selectButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  highlightText: {
    backgroundColor: '#FFF3E0',
  },
});
