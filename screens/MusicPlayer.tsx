import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Easing,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackIcon from '../assets/icons/backwhite.svg';
import MoreIcon from '../assets/icons/mores.svg';
import PlayIcon from '../assets/icons/play.svg';
import RepeatIcon from '../assets/icons/repeat.svg';
import PlayBackIcon from '../assets/icons/play-back.svg';
import PlayForwardIcon from '../assets/icons/next.svg';
import HeartOutlineIcon from '../assets/icons/heart-outline.svg';
import HeartFilledIcon from '../assets/icons/heart-filled.svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RocketIcon from '../assets/icons/Rocket.svg';
import { BASE_URL } from '@/utils/apis';

interface MusicDetails {
  output_url: string;
  title: string;
  description: string;
  cover_url: string;
}

export default function MusicPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [musicDetails, setMusicDetails] = useState<MusicDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showGif, setShowGif] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const lineHeight = 24; // Height of each line in the description for smooth scrolling

  const gifTranslateX = new Animated.Value(0);
  const gifOpacity = new Animated.Value(1);

  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isOwner, setIsOwner] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    const fetchMusicDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/music-details/${id}`);
        const data = await response.json();
        setMusicDetails(data);

        const userId = await AsyncStorage.getItem('userId');
        setIsOwner(userId === data.user_id);
      } catch (error) {
        console.error('Error fetching music details:', error);
      }
    };
    fetchMusicDetails();
  }, [id]);

  useEffect(() => {
    if (musicDetails?.output_url) {
      handlePlayPause(true); // Auto-play when the screen loads
    }
  }, [musicDetails]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/check-favorite/${id}?user_id=${currentUserId}`
        );
        const data = await response.json();
        if (data.status === 'success') {
          setIsFavorite(data.is_favorite);
        }
      } catch (error) {
        console.error('检查收藏状态失败:', error);
      }
    };

    if (currentUserId && id) {
      checkFavoriteStatus();
    }
  }, [currentUserId, id]);

  // Toggle play and pause
  const handlePlayPause = async (shouldPlay = !isPlaying) => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: musicDetails?.output_url || '' },
        { shouldPlay: true, isLooping: true } // Enable looping by default
      );
      newSound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
      setSound(newSound);
      setIsPlaying(true);
    } else {
      if (shouldPlay) {
        await sound.playAsync();
      } else {
        await sound.pauseAsync();
      }
      setIsPlaying(shouldPlay);
    }
  };

  // Increment play count API call
  const incrementPlayCount = async (musicId: string) => {
    try {
      console.log('Attempting to increment play count for music:', musicId);

      const response = await fetch(
        `${BASE_URL}/increment-play-count/${musicId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to increment play count:', {
          status: response.status,
          error: errorData,
        });
        return;
      }

      const data = await response.json();
      console.log('Play count incremented successfully:', data.message);
    } catch (error) {
      console.error('Error incrementing play count:', {
        error,
        musicId,
      });
    }
  };

  // Update playback status and auto-scroll description
  const updatePlaybackStatus = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);

      // 只在音乐播放完成时记录一次
      if (status.didJustFinish && id) {
        console.log('Music finished playing, recording play count');
        incrementPlayCount(id as string);
      }

      // Auto-scroll description every 2 seconds of playback
      if (status.positionMillis % 2000 === 0 && scrollRef.current) {
        const scrollPosition = (status.positionMillis / 2000) * lineHeight;
        scrollRef.current.scrollTo({ y: scrollPosition, animated: true });
      }
    }
  };

  // Format time for display
  const formatTime = (timeMillis: number) => {
    const minutes = Math.floor(timeMillis / 60000);
    const seconds = Math.floor((timeMillis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle slider change
  const onSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // PanResponder for swipe gestures with smooth easing for the GIF
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 10,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < 0) {
        // Swipe left to hide GIF
        Animated.parallel([
          Animated.timing(gifTranslateX, {
            toValue: -450,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(gifOpacity, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => setShowGif(false));
      }
    },
  });

  // PanResponder for cover image swipe to restore GIF
  const coverResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 10,
    onPanResponderRelease: () => {
      if (!showGif) {
        Animated.parallel([
          Animated.timing(gifTranslateX, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(gifOpacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => setShowGif(true));
      }
    },
  });

  // 修改跳转函数
  const handleRocketPress = () => {
    router.push({
      pathname: '/promotemusic',
      params: { musicId: id }, // 这里的 id 来自 useLocalSearchParams
    });
  };

  // 添加切换收藏状态的函数
  const toggleFavorite = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/toggle-favorite/${id}?user_id=${currentUserId}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setIsFavorite(data.is_favorite);
      }
    } catch (error) {
      console.error('切换收藏状态失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <Animated.View {...coverResponder.panHandlers}>
        <Image
          source={{ uri: musicDetails?.cover_url }}
          style={styles.topImage}
        />
      </Animated.View>

      {showGif && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            isPlaying ? styles.gifContainer : styles.staticImageContainer,
            { transform: [{ translateX: gifTranslateX }], opacity: gifOpacity },
          ]}
        >
          <Image
            source={
              isPlaying
                ? require('../assets/images/music.gif')
                : require('../assets/images/music.png')
            }
            style={styles.gifOverlay}
          />
        </Animated.View>
      )}

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <View style={styles.backButtonCircle}>
          <View style={styles.iconWrapper}>
            <BackIcon width={50} height={50} fill="#FFF" />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.moreButton}>
        <MoreIcon width={32} height={32} fill="#000" />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <BlurView intensity={50} style={styles.blurEffect}>
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 1)']}
            style={styles.gradient}
          >
            {isOwner && (
              <TouchableOpacity
                style={styles.rocketContainer}
                onPress={handleRocketPress}
              >
                <RocketIcon width={24} height={24} fill="#FFF" />
              </TouchableOpacity>
            )}
            <View style={styles.controlsContainer}>
              <Text style={styles.songTitle}>{musicDetails?.title}</Text>

              <ScrollView ref={scrollRef} style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  {musicDetails?.description}
                </Text>
              </ScrollView>

              <Slider
                style={styles.slider}
                value={position}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={onSliderValueChange}
                minimumTrackTintColor="#8A2BE2"
                maximumTrackTintColor="#FFFFFF"
                thumbTintColor="#FFFFFF"
              />

              <View style={styles.timeContainer}>
                <Text style={styles.time}>{formatTime(position)}</Text>
                <Text style={styles.time}>
                  - {formatTime(duration - position)}
                </Text>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity>
                  <RepeatIcon width={24} height={24} fill="#8A2BE2" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <PlayBackIcon width={24} height={24} fill="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePlayPause()}>
                  {isPlaying ? (
                    <Image
                      source={require('../assets/icons/pause.png')}
                      style={styles.playPauseIcon}
                    />
                  ) : (
                    <PlayIcon width={48} height={48} fill="#FFF" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity>
                  <PlayForwardIcon width={24} height={24} fill="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorite}>
                  {isFavorite ? (
                    <HeartFilledIcon
                      width={24}
                      height={24}
                      fill="#FF0000" // 红色填充
                    />
                  ) : (
                    <HeartOutlineIcon
                      width={24}
                      height={24}
                      fill="#FFFFFF" // 白色轮廓
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'cover',
    marginTop: -70,
  },
  gifContainer: {
    position: 'absolute',
    top: '5%',
    left: '50%',
    marginLeft: -230,
    zIndex: 1,
  },
  staticImageContainer: {
    position: 'absolute',
    top: '5%',
    left: '50%',
    marginLeft: -220,
    zIndex: 1,
  },
  gifOverlay: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
  },
  backButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 20,
    height: 20,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 2,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 170,
    justifyContent: 'flex-end',
    backgroundColor: '#000',
    paddingBottom: 300,
  },
  blurEffect: {
    width: '100%',
    height: 400,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    marginTop: 100,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  descriptionContainer: {
    maxHeight: 48, // Display two lines at a time
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 24, // Set line height to control scroll steps
  },
  slider: {
    width: '60%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: -10,
  },
  time: {
    color: '#FFF',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  playPauseIcon: {
    width: 48,
    height: 48,
  },
  rocketContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 2,
  },
});
