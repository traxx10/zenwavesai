import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import BackIcon from '../assets/icons/back.svg'; // Import your custom back icon
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

export default function FriendRequestsScreen() {
  const router = useRouter(); // Use router for navigation
  const [currentUserID, setCurrentUserID] = useState<string>('');
  const [friendRequests, setFriendRequests] = useState<
    { id: string; name: string; image: { uri: string } }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch followers list
  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/${currentUserID}/followers`
      );
      if (response.data.followers) {
        const followersData = response.data.followers.map(
          (follower: {
            id: string;
            first_name: string;
            last_name: string;
            avatar_url: string;
          }) => ({
            id: follower.id,
            name: `${follower.first_name} ${follower.last_name}`,
            image: { uri: follower.avatar_url },
          })
        );
        setFriendRequests(followersData);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setCurrentUserID(userId);
        }
      } catch (error) {
        console.log('Error getting userId from AsyncStorage:', error);
      }
    };

    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserID) {
      fetchFollowers();
    }
  }, [currentUserID]);

  // Function to handle following a user
  const handleFollowUser = async (targetId: string) => {
    try {
      const url = `${BASE_URL}/users/${currentUserID}/follow/${targetId}`;
      console.log('Follow User URL:', url); // Output URL for debugging
      await axios.post(url);
      // Update state to reflect that the user has been followed
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== targetId)
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  // Function to handle rejecting a follow request
  const handleRejectFollowRequest = async (followerId: string) => {
    try {
      await axios.post(
        `${BASE_URL}/users/${currentUserID}/reject-follow-request/${followerId}`
      );
      // Update state to reflect that the request has been rejected
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== followerId)
      );
    } catch (error) {
      console.error('Error rejecting follow request:', error);
    }
  };

  const renderFriendRequest = ({
    item,
  }: {
    item: { id: string; name: string; image: { uri: string } };
  }) => (
    <View style={styles.friendContainer}>
      <Image source={item.image} style={styles.friendImage} />
      <Text style={styles.friendName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.followButton}
        onPress={() => handleFollowUser(item.id)}
      >
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRejectFollowRequest(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon width={24} height={24} fill="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follower Requests</Text>
      </View>

      {/* Loading Indicator */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        /* Friend Requests List */
        <FlatList
          data={friendRequests}
          renderItem={renderFriendRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.requestsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
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
  requestsList: {
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
    marginRight: 10,
  },
  followButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    borderColor: '#FFA500',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});
