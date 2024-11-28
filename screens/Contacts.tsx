// ContactsScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router'; // Use useRouter for navigation
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import BackIcon from '../assets/icons/back.svg'; // Import custom back icon
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

const contactsOptions = [
  {
    id: '1',
    icon: require('../assets/images/chat-icon.png'),
    title: 'Chat with contacts',
    subtitle: 'Find and chat with them',
  },
  {
    id: '2',
    icon: require('../assets/images/qr-icon.png'),
    title: 'Scan the QR code',
    subtitle: 'Scan to add nearby friends instantly',
  },
  {
    id: '3',
    icon: require('../assets/images/follower-icon.png'),
    title: 'New followers',
    subtitle: 'Aubss started following you',
  },
  {
    id: '4',
    icon: require('../assets/images/activity-icon.png'),
    title: 'Activity',
    subtitle: 'Patrica Jackson, sergiorlandosanc',
  },
];

interface MutualFollower {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export default function ContactsScreen() {
  const router = useRouter();
  const [mutualFollowers, setMutualFollowers] = useState<MutualFollower[]>([]);
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

  useEffect(() => {
    if (!currentUserId) return;

    fetch(`${BASE_URL}/users/${currentUserId}/mutual-followers`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setMutualFollowers(data.mutual_followers);
        }
      })
      .catch((error) => console.log('Error fetching mutual followers:', error));
  }, [currentUserId]);

  const renderContactOption = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => {
        if (item.id === '1') {
          router.push('/searchfriends');
        } else if (item.id === '2') {
          router.push('/qrcodescanner');
        } else if (item.id === '3') {
          router.push('/friendrequests');
        }
      }}
    >
      <Image source={item.icon} style={styles.optionIcon} />
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{item.title}</Text>
        <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMutualFollower = ({ item }: { item: MutualFollower }) => (
    <TouchableOpacity
      style={styles.followerContainer}
      onPress={() => navigateToChat(item.id)}
    >
      <Image source={{ uri: item.avatar_url }} style={styles.followerImage} />
      <View style={styles.followerTextContainer}>
        <Text
          style={styles.followerName}
        >{`${item.first_name} ${item.last_name}`}</Text>
      </View>
    </TouchableOpacity>
  );

  const navigateToChat = (userId: string) => {
    router.push(`/chat?targetUserId=${userId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon width={24} height={24} fill="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity>
          <FontAwesomeIcon icon={faSearch} size={26} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={contactsOptions}
          renderItem={renderContactOption}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.optionsList}
          scrollEnabled={false} // Disable scrolling for inner list
        />

        {/* Mutual Followers Section */}
        <Text style={styles.sectionTitle}>Followers</Text>
        <FlatList
          data={mutualFollowers}
          renderItem={renderMutualFollower}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.followersList}
          scrollEnabled={false} // Disable scrolling for inner list
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  optionsList: {
    paddingHorizontal: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIcon: {
    width: 50, // Slightly larger icons
    height: 50,
    borderRadius: 22.5,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  followersList: {
    paddingHorizontal: 16,
  },
  followerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Reduced padding for compact spacing
  },
  followerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  followerTextContainer: {
    flex: 1,
  },
  followerName: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  followerStatus: {
    fontSize: 14,
    color: '#888',
  },
});
