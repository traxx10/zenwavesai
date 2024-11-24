import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, StatusBar, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SearchIcon from '../assets/icons/search.svg';
import FilterIcon from '../assets/icons/Filter.svg';
import SmallPlayIcon from '../assets/icons/smallplay.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfileScreen() {
  const router = useRouter();
  const { userId, fromScreen } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState({
    name: '',
    profileImage: '',
    following: 0,
    followers: '',
    creations: 0,
    description: '',
  });
  const [isFollowing, setIsFollowing] = useState(false); // To manage follow/unfollow status
  const [searchQuery, setSearchQuery] = useState('');
  const [creations, setCreations] = useState([]); // Stores the music list from the API

  useEffect(() => {
    if (userId) {
      console.log('Fetching user profile for userId:', userId);
      fetchUserProfile(userId as string);
      fetchUserMusic(userId as string);
      checkFollowingStatus(userId as string);
    } else {
      console.warn('userId is undefined');
    }
  }, [userId]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        if (data && data.user_info) {
          const userInfo = data.user_info;
          
          setUserProfile({
            name: `${userInfo.first_name} ${userInfo.last_name}`,
            profileImage: userInfo.avatar_url,
            following: 45, // Replace with dynamic data if available
            followers: '30M', // Replace with dynamic data if available
            creations: data.creations_count || 0, // Use dynamic creations count
            description: 'About Nagaland & Northeast. For credit or removal DM. Negativity not entertained & will be blocked.',
          });
        } else {
          console.error('User info is missing in the response:', data);
          Alert.alert("Error", "User information is missing.");
        }
      } else {
        console.error('Error fetching user profile:', data.detail);
        Alert.alert("Error", data.detail || "Failed to load user profile.");
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert("Error", "Failed to load user profile.");
    }
  };

  const fetchUserMusic = async (userId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}/music`);
      const data = await response.json();

      if (response.ok && data.status === "success") {
        const { music_list, music_count } = data.data;

        setCreations(music_list);
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          creations: music_count,
        }));
      } else {
        console.log('No music data:', data.message);
      }
    } catch (error) {
      console.log('Error fetching user music:', error);
    }
  };

  const checkFollowingStatus = async (userId: string) => {
    try {
      const currentUserId = await AsyncStorage.getItem('userId');
      if (!currentUserId) {
        console.log('No userId found in AsyncStorage');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/users/${currentUserId}/following`);
      const data = await response.json();

      if (response.ok && data.following) {
        const isUserFollowing = data.following.some((user: any) => user.id === userId);
        setIsFollowing(isUserFollowing);
      } else {
        console.log('No following data:', data);
      }
    } catch (error) {
      console.log('Error checking following status:', error);
    }
  };

  const toggleFollowStatus = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('userId');
      if (!currentUserId) {
        console.log('No userId found in AsyncStorage');
        return;
      }

      const targetUserId = userId; // 当前页面的 userId
      const url = `http://127.0.0.1:8000/users/${currentUserId}/${isFollowing ? 'unfollow' : 'follow'}/${targetUserId}`;
      const method = isFollowing ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsFollowing((prevStatus) => !prevStatus);
        console.log(`${isFollowing ? 'Unfollowed' : 'Followed'} successfully`);
      } else {
        const errorData = await response.json();
        console.error(`Error updating follow status:`, errorData);
        Alert.alert("Error", errorData.detail || `Failed to ${isFollowing ? 'unfollow' : 'follow'}.`);
      }
    } catch (error) {
      console.error('Error in toggleFollowStatus:', error);
      Alert.alert("Error", `Failed to ${isFollowing ? 'unfollow' : 'follow'}.`);
    }
  };

  const renderCreation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.creationContainer}
      onPress={() => {
        console.log('Navigating to MusicPlayer with id:', item.id);
        router.push({ pathname: '/musicplayer', params: { id: item.id } });
      }}
    >
      <Image source={{ uri: item.cover_url }} style={styles.creationImage} />
      <View style={styles.creationContent}>
        <Text style={styles.creationTitle}>{item.title}</Text>
        <View style={styles.creationPlayCount}>
          <SmallPlayIcon width={12} height={12} />
          <Text style={styles.creationPlayCountText}>{item.play_count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredCreations = creations.filter((item: any) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    if (fromScreen === 'discover') {
      router.push('/discover');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <View style={styles.gradientCircle}>
            <Image 
              source={{ uri: userProfile.profileImage || 'https://example.com/path/to/default/image.png' }} 
              style={styles.profileImage} 
            />
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileDescription}>{userProfile.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userProfile.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userProfile.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userProfile.creations}</Text>
              <Text style={styles.statLabel}>Creations</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing ? styles.unfollowButton : null]}
              onPress={toggleFollowStatus}
            >
              <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={() => router.push({ pathname: '/chat', params: { targetUserId: userId } })}
            >
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.creationsHeader}>
          <Text style={styles.creationsTitle}>All Creations ({userProfile.creations})</Text>
          <FilterIcon width={20} height={20} />
        </View>

        <View style={styles.searchContainer}>
          <SearchIcon width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredCreations}
          renderItem={renderCreation}
          keyExtractor={(item) => item.id}
          style={styles.creationsList}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  gradientCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#BABABA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  profileDescription: {
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 40,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
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
    marginTop: 15,
  },
  followButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginRight: 10,
  },
  unfollowButton: {
    backgroundColor: '#888', // Different color for unfollow state
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  messageButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  creationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  creationsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 45,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  creationsList: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  creationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
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
  creationPlayCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  creationPlayCountText: {
    color: '#555',
    fontSize: 12,
    marginLeft: 5,
  },
});
