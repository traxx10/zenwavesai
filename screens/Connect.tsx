import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import SearchIcon from '../assets/icons/search.svg';
import AddIcon from '../assets/icons/add.svg';
import { formatDistanceToNow } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

const categories = [
  {
    id: '1',
    name: 'Meditation',
    image: require('../assets/images/group1.png'),
  },
  { id: '2', name: 'Pet', image: require('../assets/images/goup2.png') },
  { id: '3', name: 'Brainwave', image: require('../assets/images/goup3.png') },
  { id: '4', name: 'Relaxation', image: require('../assets/images/goup4.png') },
  { id: '5', name: 'Balance', image: require('../assets/images/goup5.png') },
];

type MutualFollower = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
};

type Category = {
  id: string;
  name: string;
  image: any;
};

export default function ConnectScreen() {
  const router = useRouter();
  const [mutualFollowers, setMutualFollowers] = useState<MutualFollower[]>([]);
  const [currentUserID, setCurrentUserID] = useState<string>('');

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
      fetchMutualFollowers();
    }
  }, [currentUserID]);

  const fetchMutualFollowers = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${currentUserID}/mutual-followers`
      );
      const data = await response.json();
      if (data.status === 'success') {
        const followers = await Promise.all(
          data.mutual_followers.map(async (follower: any) => {
            const userInfo = await fetchUserInfo(follower.id);
            const lastMessage = await fetchLastMessage(follower.id);
            return {
              ...userInfo,
              lastMessage: lastMessage.content,
              lastMessageTime: formatTimeAgo(lastMessage.time),
            };
          })
        );
        setMutualFollowers(followers);
      } else {
        setMutualFollowers([]);
      }
    } catch (error) {
      console.error('Error fetching mutual followers:', error);
      setMutualFollowers([]);
    }
  };

  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`);
      const data = await response.json();
      return {
        id: data.user_info.id,
        name: `${data.user_info.first_name} ${data.user_info.last_name}`,
        avatar: data.user_info.avatar_url,
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return {};
    }
  };

  const fetchLastMessage = async (targetUserId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/chat/${currentUserID}/history/${targetUserId}`
      );
      const data = await response.json();

      if (data.status === 'success' && data.data?.messages?.length > 0) {
        const lastMessage = data.data.messages[0];
        const isCurrentUserMessage = lastMessage.sender_id === currentUserID;

        return {
          content: lastMessage.content
            ? (isCurrentUserMessage ? 'You: ' : '') +
              (lastMessage.content.length > 30
                ? `${lastMessage.content.slice(0, 30)}...`
                : lastMessage.content)
            : 'No message content',
          time: lastMessage.timestamp || new Date().toISOString(),
        };
      }
      return {
        content: 'No messages yet',
        time: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching last message:', error);
      return {
        content: 'No messages yet',
        time: new Date().toISOString(),
      };
    }
  };

  const formatTimeAgo = (time: string) => {
    try {
      if (!time) return '';

      let formattedTime = formatDistanceToNow(new Date(time), {
        addSuffix: true,
      });
      formattedTime = formattedTime
        .replace('minutes', 'min')
        .replace('minute', 'min')
        .replace('hours', 'h')
        .replace('hour', 'h')
        .replace('days', 'd')
        .replace('day', 'd')
        .replace('weeks', 'w')
        .replace('week', 'w')
        .replace('months', 'mo')
        .replace('month', 'mo')
        .replace('years', 'y')
        .replace('year', 'y');
      return formattedTime;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryOuterContainer}>
      <View style={styles.categoryContainer}>
        <Image source={item.image} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </View>
  );

  const renderMessage = ({ item }: { item: MutualFollower }) => (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => router.push(`/chat?targetUserId=${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.messageImage} />
      <View style={styles.messageContent}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <View style={styles.messageMeta}>
        <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Community</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/contacts')}
        >
          <AddIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.categoriesList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Messages Header */}
      <View style={styles.messageHeader}>
        <Text style={styles.messageTitle}>Messages</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon width={20} height={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>
      {/* Messages List */}
      <FlatList
        data={mutualFollowers}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        scrollEnabled={false} // Disable FlatList scrolling to enable outer ScrollView to handle it
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 100,
    paddingBottom: 500,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  categoriesList: {
    paddingLeft: 16,
    paddingVertical: 10,
  },
  categoryOuterContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  categoryContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 8,
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
  messageHeader: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  messagesList: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  messageImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    color: '#555',
  },
  messageMeta: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
});
