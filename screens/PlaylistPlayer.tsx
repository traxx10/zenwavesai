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
import ShuffleIcon from '../assets/icons/Shuffle.svg';
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
  id: string;
  output_url: string;
  title: string;
  description: string;
  cover_url: string;
  user_id: string;
}

export default function PlaylistPlayerScreen() {
  const router = useRouter();
  const { playlistId } = useLocalSearchParams();
  const [playlist, setPlaylist] = useState<MusicDetails[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [musicDetails, setMusicDetails] = useState<MusicDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showGif, setShowGif] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
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
    const fetchPlaylistDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/playlist-details/${playlistId}`
        );
        const data = await response.json();
        setPlaylist(data);

        if (data.length > 0) {
          setCurrentTrackIndex(0);
          setMusicDetails(data[0]);

          const userId = await AsyncStorage.getItem('userId');
          setIsOwner(userId === data[0].user_id);
        }
      } catch (error) {
        console.error('Error fetching playlist details:', error);
      }
    };
    fetchPlaylistDetails();
  }, [playlistId]);

  useEffect(() => {
    const loadSound = async () => {
      if (sound) {
        await sound.unloadAsync();
      }
      if (musicDetails?.output_url) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: musicDetails.output_url },
          { shouldPlay: true, isLooping: false }
        );
        newSound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
        setSound(newSound);
        setIsPlaying(true);
      }
    };

    loadSound();
  }, [musicDetails]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/check-favorite/${musicDetails?.id}?user_id=${currentUserId}`
        );
        const data = await response.json();
        if (data.status === 'success') {
          setIsFavorite(data.is_favorite);
        }
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };

    if (currentUserId && musicDetails?.id) {
      checkFavoriteStatus();
    }
  }, [currentUserId, musicDetails]);

  const handlePlayPause = async (shouldPlay = !isPlaying) => {
    if (sound) {
      if (shouldPlay) {
        await sound.playAsync();
      } else {
        await sound.pauseAsync();
      }
      setIsPlaying(shouldPlay);
    }
  };

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

  const updatePlaybackStatus = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);

      // Only record play count once when music finishes
      if (status.didJustFinish) {
        console.log('Music finished playing');
        if (musicDetails && musicDetails.id) {
          incrementPlayCount(musicDetails.id);
        }
        playNextTrack();
      }

      // Auto-scroll description every 2 seconds of playback
      if (status.positionMillis % 2000 === 0 && scrollRef.current) {
        const scrollPosition = (status.positionMillis / 2000) * lineHeight;
        scrollRef.current.scrollTo({ y: scrollPosition, animated: true });
      }
    }
  };

  const formatTime = (timeMillis: number) => {
    const minutes = Math.floor(timeMillis / 60000);
    const seconds = Math.floor((timeMillis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const onSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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

  const handleRocketPress = () => {
    router.push({
      pathname: '/promotemusic',
      params: { musicId: musicDetails?.id },
    });
  };

  const toggleFavorite = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/toggle-favorite/${musicDetails?.id}?user_id=${currentUserId}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setIsFavorite(data.is_favorite);
      }
    } catch (error) {
      console.error('Failed to toggle favorite status:', error);
    }
  };

  const playNextTrack = async () => {
    let nextIndex;
    if (isShuffle) {
      // Get a random index
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      // Move to the next index
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }

    setCurrentTrackIndex(nextIndex);
    const nextMusicDetails = playlist[nextIndex];
    setMusicDetails(nextMusicDetails);

    // Unload the current sound and load the new one
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: nextMusicDetails.output_url },
      { shouldPlay: true, isLooping: false }
    );
    newSound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
    setSound(newSound);
    setIsPlaying(true);
  };

  const playPreviousTrack = async () => {
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }

    setCurrentTrackIndex(prevIndex);
    const prevMusicDetails = playlist[prevIndex];
    setMusicDetails(prevMusicDetails);

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: prevMusicDetails.output_url },
      { shouldPlay: true, isLooping: false }
    );
    newSound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
    setSound(newSound);
    setIsPlaying(true);
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
                <TouchableOpacity onPress={() => setIsShuffle(!isShuffle)}>
                  {isShuffle ? (
                    <ShuffleIcon width={24} height={24} fill="#8A2BE2" />
                  ) : (
                    <RepeatIcon width={24} height={24} fill="#8A2BE2" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={playPreviousTrack}>
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
                <TouchableOpacity onPress={playNextTrack}>
                  <PlayForwardIcon width={24} height={24} fill="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorite}>
                  {isFavorite ? (
                    <HeartFilledIcon width={24} height={24} fill="#FF0000" />
                  ) : (
                    <HeartOutlineIcon width={24} height={24} fill="#FFFFFF" />
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
