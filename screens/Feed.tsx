import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import HeartIcon from '../assets/icons/Heart.svg';
import ChatIcon from '../assets/icons/Chat.svg';
import BookmarkIcon from '../assets/icons/Bookmark.svg';
import SearchIcon from '../assets/icons/search.svg';
import EyeIcon from '../assets/icons/Eye.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MusicItem {
  id: string;
  title: string;
  description: string;
  creator_name: string;
  creator_avatar: string;
  creator_id: string;
  cover_url: string;
  created_at: string;
  play_count: number;
  likes: number;
  comments: number;
  shares: number;
  functional_tags: string;
  source: string;
  friend_playing_avatar?: string;
  friend_playing_name?: string;
  friend_playing_user_id?: string;
}

const FeedScreen = () => {
  const router = useRouter();
  const [feedData, setFeedData] = useState<MusicItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error getting userId from AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    console.log('Fetching music data for userId:', userId);
    const fetchMusicData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/all-music/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setFeedData(data.music || []);
        } else {
          console.log('No music data available');
        }
      } catch (error) {
        console.log('Error fetching music data:', error);
      }
    };

    fetchMusicData();
  }, [userId]);

  useEffect(() => {
    const startSpringAnimation = () => {
      borderAnimation.setValue(0);
      Animated.loop(
        Animated.timing(borderAnimation, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startSpringAnimation();
  }, [borderAnimation]);

  const rotate = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const filteredData = feedData
    .filter((item) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.creator_name.toLowerCase().includes(query) ||
        item.functional_tags.toLowerCase().includes(query)
      );
    })
    .filter((item) => {
      if (selectedFriend) {
        return (
          item.creator_name === selectedFriend ||
          item.friend_playing_name === selectedFriend
        );
      }
      return true;
    })
    .filter((item) => {
      if (selectedTag) {
        return item.functional_tags
          .toLowerCase()
          .includes(selectedTag.toLowerCase());
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const renderFeedItem = ({ item }: { item: MusicItem }) => {
    return (
      <View style={styles.feedItem}>
        <View style={styles.header}>
          {item.source === 'friend' ? (
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() =>
                router.push({
                  pathname: '/userprofile',
                  params: { userId: item.creator_id },
                })
              }
            >
              <Animated.View
                style={[styles.gradientBorder, { transform: [{ rotate }] }]}
              >
                <LinearGradient
                  colors={[
                    '#FF0000',
                    '#FF7F00',
                    '#FFFF00',
                    '#00FF00',
                    '#0000FF',
                    '#4B0082',
                    '#8B00FF',
                  ]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.outerCircleGradient}
                />
              </Animated.View>
              <View style={styles.innerCircle}>
                <Image
                  source={{ uri: item.creator_avatar }}
                  style={styles.creatorImage}
                />
              </View>
            </TouchableOpacity>
          ) : item.source === 'friend_playing' ? (
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => {
                if (item.friend_playing_user_id) {
                  console.log(
                    'Navigating with userId:',
                    item.friend_playing_user_id
                  );
                  router.push({
                    pathname: '/userprofile',
                    params: { userId: item.friend_playing_user_id },
                  });
                } else {
                  console.warn('friend_playing_user_id is undefined');
                }
              }}
            >
              <Animated.View
                style={[styles.dashedBorder, { transform: [{ rotate }] }]}
              />
              <View style={styles.innerCircle}>
                <Image
                  source={{ uri: item.friend_playing_avatar }}
                  style={styles.creatorImage}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => {
                console.log('Navigating with userId:', item.creator_id);
                router.push({
                  pathname: '/userprofile',
                  params: { userId: item.creator_id },
                });
              }}
            >
              <View style={styles.blackBorder}>
                <View style={styles.innerCircle}>
                  <Image
                    source={{
                      uri:
                        item.creator_avatar ||
                        'https://example.com/path/to/default/image.png',
                    }}
                    style={styles.creatorImage}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>
              {item.source === 'all'
                ? 'Suggested'
                : item.source === 'friend_playing'
                ? `Listening by ${item.friend_playing_name}`
                : `Created by friend ${item.creator_name}`}
            </Text>
            <Text style={styles.daysAgo}>
              {new Date(item.created_at).toDateString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreOptions}>
            <Text>...</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          {item.description.length > 100
            ? `${item.description.slice(0, 100)}...`
            : item.description}
        </Text>

        <View style={styles.feedImageContainer}>
          <TouchableOpacity
            onPress={() => router.push(`/musicplayer?id=${item.id}`)}
          >
            <Image source={{ uri: item.cover_url }} style={styles.feedImage} />
            <Image
              source={require('../assets/images/play.png')}
              style={styles.playIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.creatorLabel}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/userprofile',
                params: { userId: item.creator_id },
              })
            }
            style={styles.creatorLabelOuterCircle}
          >
            <Image
              source={{ uri: item.creator_avatar }}
              style={styles.creatorLabelImage}
            />
          </TouchableOpacity>
          <Text style={styles.creatorLabelText}>
            Created by {item.creator_name}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {item.functional_tags.split(',').map((tag: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryContainer}
              onPress={() => {
                setSearchQuery(tag.trim());
                setSelectedTag(tag.trim());
              }}
            >
              <Text style={styles.category}>{tag.trim()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* <View style={styles.actions}>
          <EyeIcon width={24} height={24} />
          <Text style={styles.actionText}>{item.play_count}</Text>
          <HeartIcon width={25} height={25} style={styles.actionIcon} />
          <Text style={styles.actionText}>{item.likes}</Text>
          <ChatIcon width={20} height={20} style={styles.actionIcon} />
          <Text style={styles.actionText}>{item.comments}</Text>
          <BookmarkIcon width={20} height={20} style={styles.actionIcon} />
          <Text style={styles.actionText}>{item.shares}</Text>
        </View> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <TouchableOpacity
        style={{
          padding: 24,
          backgroundColor: 'aqua',
          borderRadius: 12,
          margin: 12,
        }}
        onPress={() => router.push('/rewardedad')}
      >
        <Text>Open Rewarded Ads</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredData}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        style={styles.feedList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <>
            {/* <View style={styles.topSpacer} /> */}

            <View style={styles.feedHeaderContainer}>
              <Text style={styles.feedHeader}>Feed</Text>
              <TouchableOpacity
                onPress={() => router.push('/rewardedads' as any)}
              >
                <Image
                  source={require('../assets/images/heart.png')}
                  style={styles.heartIcon}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.friendsMusicContainer}
            >
              {[
                ...new Map(
                  feedData
                    .filter((item) => item.source === 'friend')
                    .map((item) => [item.creator_name, item])
                ).values(),
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.friendItem}
                  onPress={() =>
                    setSelectedFriend(
                      selectedFriend === item.creator_name
                        ? null
                        : item.creator_name
                    )
                  }
                >
                  <View style={styles.friendAvatarBorder}>
                    <Image
                      source={{ uri: item.creator_avatar }}
                      style={styles.friendAvatar}
                    />
                  </View>
                  <Text style={styles.friendName} numberOfLines={1}>
                    {item.creator_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.searchContainer}>
              <SearchIcon width={20} height={20} style={styles.searchIcon} />
              <TextInput
                style={styles.searchBox}
                placeholder="Search"
                placeholderTextColor="#999"
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (!text) setSelectedTag(null);
                }}
                value={searchQuery}
              />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // topSpacer: {
  //   height: 80,
  // },
  feedHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  feedHeader: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  heartIcon: {
    width: 50,
    height: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginHorizontal: 5,
    paddingHorizontal: 12,
    height: 45,
    marginTop: -10,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 8,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 4,
  },
  feedList: {
    paddingHorizontal: 16,
  },
  feedItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackBorder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BABABA',
  },
  outerCircleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  innerCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
  },
  daysAgo: {
    color: '#bbb',
    fontSize: 12,
  },
  moreOptions: {
    paddingHorizontal: 8,
  },
  description: {
    fontSize: 14,
    marginVertical: 8,
  },
  feedImageContainer: {
    position: 'relative',
  },
  feedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  playIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
  },
  creatorLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  creatorLabelImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  creatorLabelText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  categoryContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  category: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 8,
  },
  actionIcon: {
    marginLeft: 8,
  },
  actionText: {
    marginLeft: 4,
    marginRight: 16,
    fontSize: 14,
    color: '#333',
  },
  creatorLabelOuterCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BABABA',
    overflow: 'hidden',
  },
  friendsMusicContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 30,
    marginBottom: 20,
  },
  friendItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
    marginTop: -50,
  },
  friendAvatarBorder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: '#BABABA',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  friendName: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    width: 70,
    marginBottom: -20,
  },
  dashedBorder: {
    width: 48,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BABABA',
    borderStyle: 'dashed',
    position: 'absolute',
  },
});

export default FeedScreen;
