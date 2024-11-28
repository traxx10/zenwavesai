import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import SearchIcon from '../assets/icons/search.svg';
import FilterIcon from '../assets/icons/Filter.svg';
import SmallPlayIcon from '../assets/icons/smallplay.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrownIcon from '../assets/icons/Crown.svg';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '@/utils/apis';

const profile = {
  name: 'Emmanuel Robertsen',
  profileImage: require('../assets/images/people3.png'),
  following: 45,
  followers: '30M',
};

interface UserInfo {
  first_name: string;
  last_name: string;
  avatar_url?: string;
  subscription_type?: string;
}

interface Creation {
  id: string;
  title: string;
  cover_url: string;
  play_count: number;
  created_at: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  created_at: string;
  music_count: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCreations, setFilteredCreations] = useState<Creation[]>([]);
  const [activeDraftsCount, setActiveDraftsCount] = useState(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        animatedValue.setValue(0);
        startAnimation();
      });
    };

    startAnimation();
    return () => animatedValue.stopAnimation();
  }, []);

  const gradientBorderColor = animatedValue.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      '#FF0080',
      '#FF0000',
      '#FF8C00',
      '#4B0082',
      '#8A2BE2',
      '#FF0080',
    ],
  });

  const fetchData = async (isRefresh = false) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      console.log('Fetching data... page:', isRefresh ? 1 : page);
      const response = await fetch(
        `${BASE_URL}/text-music-history/${userId}?limit=15&page=${
          isRefresh ? 1 : page
        }`
      );
      const data = await response.json();

      const sortedCreations = data.history.sort((a: any, b: any) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      if (isRefresh) {
        setCreations(sortedCreations);
      } else {
        setCreations((prev) => {
          const existingIds = new Set(prev.map((item: Creation) => item.id));
          const newItems = sortedCreations.filter(
            (item: Creation) => !existingIds.has(item.id)
          );
          return [...prev, ...newItems];
        });
      }

      setHasMore(sortedCreations.length > 0);
      setPage(isRefresh ? 2 : page + 1);

      if (data.playlists) {
        setPlaylists(data.playlists);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(`${BASE_URL}/users/${userId}/profile`);
      const data = await response.json();
      setUserInfo(data.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchActiveDraftsCount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(
        `${BASE_URL}/users/${userId}/active-drafts/count`
      );
      const data = await response.json();

      if (data.status === 'success') {
        setActiveDraftsCount(data.data.active_drafts_count);
      }
    } catch (error) {
      console.error('Error fetching drafts count:', error);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchData(true),
      fetchUserInfo(),
      fetchActiveDraftsCount(),
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshAllData();
    }, [])
  );

  const renderCreation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.creationContainer}
      onPress={() => router.push(`/musicplayer?id=${item.id}`)} // Navigating to MusicPlayer with the song id
    >
      <Image source={{ uri: item.cover_url }} style={styles.creationImage} />
      <View style={styles.creationContent}>
        <Text style={styles.creationTitle}>{item.title}</Text>
        <View style={styles.songInfo}>
          <SmallPlayIcon width={12} height={12} />
          <Text style={styles.creationSongs}>{item.play_count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/images/profile.png')}
          style={styles.profileBackgroundImage}
        />
        <TouchableOpacity
          style={styles.crownButton}
          onPress={() => router.push('/subscribe')}
        >
          <CrownIcon width={24} height={24} />
        </TouchableOpacity>
        <Animated.View
          style={[styles.gradientCircle, { borderColor: gradientBorderColor }]}
        >
          <Image
            source={{ uri: userInfo?.avatar_url || profile.profileImage }}
            style={styles.profileImage}
          />
        </Animated.View>
        <Text style={styles.profileName}>
          {userInfo
            ? `${userInfo.first_name} ${userInfo.last_name}`
            : profile.name}
        </Text>
        {userInfo?.subscription_type &&
          (userInfo.subscription_type === 'basic' ||
            userInfo.subscription_type === 'premium') && (
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionType}>
                {userInfo.subscription_type.charAt(0).toUpperCase() +
                  userInfo.subscription_type.slice(1)}{' '}
                Member
              </Text>
            </View>
          )}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{creations.length}</Text>
            <Text style={styles.statLabel}>Creations</Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/account')}
          >
            <Text style={styles.buttonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => router.push('/invitefriends')}
          >
            <Text style={styles.inviteText}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Creations</Text>
        <TouchableOpacity onPress={() => router.push('/earnings')}>
          <Text style={styles.inactiveTab}>Earnings</Text>
        </TouchableOpacity>
        <Text style={styles.inactiveTab}>Saved</Text>
      </View>
      <View style={styles.creationsHeader}>
        <Text style={styles.creationsTitle}>
          All Creations ({creations.length})
        </Text>
        <FilterIcon width={20} height={20} style={styles.filterIcon} />
      </View>
      <SearchInput />
      {activeDraftsCount > 0 && (
        <TouchableOpacity
          style={styles.draftContainer}
          onPress={() => router.push('/drafts')}
        >
          <Image
            source={{
              uri: 'https://d38pz48g69zit7.cloudfront.net/covers/df223973-db7c-4620-ab2c-cf5afd2ecfe7.jpg',
            }}
            style={styles.draftImage}
          />
          <View style={styles.draftContent}>
            <View style={styles.draftTitleContainer}>
              <Text style={styles.draftTitle}>Drafts</Text>
              <Text style={styles.draftCount}>{activeDraftsCount} drafts</Text>
            </View>
            <Text style={styles.draftLabel}>Drafts</Text>
          </View>
        </TouchableOpacity>
      )}

      {playlists.map((playlist) => (
        <TouchableOpacity
          key={playlist.id}
          style={styles.draftContainer}
          onPress={() =>
            router.push({
              pathname: '/musicplaylist',
              params: { playlistId: playlist.id },
            })
          }
        >
          <Image
            source={{
              uri:
                playlist.cover_url ||
                'https://d38pz48g69zit7.cloudfront.net/covers/default-playlist.jpg',
            }}
            style={styles.draftImage}
          />
          <View style={styles.draftContent}>
            <View style={styles.draftTitleContainer}>
              <Text style={styles.draftTitle}>{playlist.title}</Text>
              <Text style={styles.draftCount}>
                {playlist.is_public ? 'Public Playlist' : 'Private Playlist'} •{' '}
                {playlist.music_count}{' '}
                {playlist.music_count === 1 ? 'song' : 'songs'}
              </Text>
            </View>
            <Text style={styles.draftLabel}>Playlist</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );

  console.log('Current creations state:', creations.length);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasMore) {
      fetchData();
    }
  };

  const SearchInput = () => (
    <View style={styles.searchContainer}>
      <SearchIcon width={20} height={20} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => {
          const filtered = creations.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredCreations(filtered);
        }}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  return (
    <FlatList
      data={searchQuery ? filteredCreations : creations}
      renderItem={renderCreation}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.flatListContainer}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
      windowSize={5}
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexGrow: 1, // Ensures FlatList content fills available space
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 150,
  },
  // Background Image
  profileBackgroundImage: {
    position: 'absolute',
    top: -150,
    left: 0,
    right: 0,
    height: 210, // Adjust as necessary
    resizeMode: 'cover',
  },
  // Gradient Circle around the profile image
  gradientCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 25,
  },
  editButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  inviteButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inviteText: {
    color: '#000',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  activeTab: {
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  inactiveTab: {
    color: '#888',
    marginHorizontal: 10,
  },
  creationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  creationsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  filterIcon: {
    marginRight: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 0,
  },
  searchIcon: {
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 8,
    color: '#333',
  },
  creationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#fff', // Ensures each item has a white background
  },
  creationImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 15,
  },
  creationContent: {
    flex: 1,
  },
  creationTitle: {
    fontWeight: 'bold',
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creationSongs: {
    color: '#555',
    fontSize: 12,
    marginLeft: 5,
  },
  draftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  draftImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 15,
  },
  draftContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  draftTitleContainer: {
    flex: 1,
  },
  draftTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  draftCount: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  draftLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  crownButton: {
    position: 'absolute',
    top: -80,
    right: 40,
    padding: 8,
    zIndex: 1,
  },
  subscriptionBadge: {
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  subscriptionType: {
    fontSize: 14,
    color: '#FFB800',
    fontWeight: '600',
  },
});
