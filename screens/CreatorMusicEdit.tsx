import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
  StatusBar,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  Audio,
  AVPlaybackStatus,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av';

import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import SVG and PNG icons
import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.png';
import SplitIcon from '../assets/icons/Split.svg';
import CopyIcon from '../assets/icons/Duplicate.svg';
import DeleteIcon from '../assets/icons/Delete.svg';
import FadeIcon from '../assets/icons/Fade.svg';
import VolumeIcon from '../assets/icons/volume.svg';
import SpeedIcon from '../assets/icons/Speed.svg';
import NoiseReductionIcon from '../assets/icons/Cleanup Noise.svg';
import AddTrackIcon from '../assets/icons/addmusic.svg';
import CloseIcon from '../assets/icons/Close.svg';
import UndoIcon from '../assets/icons/Redo.png';
import RedoIcon from '../assets/icons/undo-2.svg';
import VoiceIcon from '../assets/icons/Voice.svg';
import MuteIcon from '../assets/icons/Mute.svg';
import AddAudioIcon from '../assets/icons/addsong.svg';
import { BASE_URL } from '@/utils/apis';

const { width } = Dimensions.get('window');
const TRACK_HEIGHT = 60;
const TRACK_GAP = 10;
const TOTAL_TRACK_HEIGHT = TRACK_HEIGHT + TRACK_GAP;
const WAVEFORM_HEIGHT = 30;
const MAGNET_THRESHOLD = 15;
const MIN_SCALE = 20;
const MAX_SCALE = 200;
const DEFAULT_SCALE = 50;
const MUTE_BUTTON_WIDTH = 50;
const LEFT_PADDING = MUTE_BUTTON_WIDTH;

// 添加常量定义
const WAVEFORM_COLOR = '#4A90E2';
const TIMELINE_HEIGHT = 40;
const TRACK_HEADER_WIDTH = 22; // 减小左侧轨道头部宽度
const TIMELINE_OFFSET = TRACK_HEADER_WIDTH; // 相应减小时间轴
const MIN_CLIP_WIDTH = 10;
const ZOOM_SENSITIVITY = 0.05;

// 修改常量定义
const MAX_CLIP_DURATION = 30; // 限制最大时长为30秒
const PIXELS_PER_SECOND = 20; // 每秒对应的像素宽度

interface Clip {
  id: string;
  title: string;
  length: number;
  startTime: number;
  trackIndex: number;
  output_url: string;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

interface Track {
  index: number;
  isMuted: boolean;
  volume: number; // 添加音量控制
  solo: boolean; // 添加独奏功能
}

// 在文件顶部添加新的接口定义
interface InviterInfo {
  avatar_url: string;
  nickname: string;
}

// 修改接口定义
interface CreatorInfo {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

// Helper function to render icons
function renderIcon(
  icon: React.FC<SvgProps> | ImageSourcePropType,
  size: number,
  color: string
) {
  if (typeof icon === 'function') {
    return React.createElement(icon, {
      width: size,
      height: size,
      fill: color,
    });
  } else {
    return (
      <Image
        source={icon}
        style={{ width: size, height: size, tintColor: color }}
      />
    );
  }
}

// AudioClip component
const AudioClip = React.memo(
  ({
    clip,
    scaleFactorShared,
    onClipPress,
    selectedClipId,
    clips,
    isMuted,
    tracks,
    playheadPosition,
    setAudioPosition,
    isCurrentlyPlaying,
  }: {
    clip: Clip;
    scaleFactorShared: Animated.SharedValue<number>;
    onClipPress: (clipId: string, startTime: number) => void;
    selectedClipId: string | null;
    clips: Clip[];
    isMuted: boolean;
    tracks: Track[];
    playheadPosition: Animated.SharedValue<number>;
    setAudioPosition: (time: number) => void;
    isCurrentlyPlaying: boolean;
  }) => {
    const clipWidth = useMemo(() => {
      // 根据时长和像素比例计算宽度
      return Math.max(MIN_CLIP_WIDTH, clip.length * PIXELS_PER_SECOND);
    }, [clip.length]);

    // 修改波形生成逻辑
    const [waveforms] = useState(() => {
      const count = Math.max(10, Math.floor(clipWidth / 3));
      return Array(count)
        .fill(0)
        .map(() => ({
          height: Math.max(10, Math.random() * WAVEFORM_HEIGHT),
          opacity: 0.6 + Math.random() * 0.4,
        }));
    });

    // 创建 Tap 手势
    const tapGesture = Gesture.Tap().onEnd(() => {
      'worklet';
      const clipPosition =
        clip.startTime * scaleFactorShared.value + TRACK_HEADER_WIDTH;
      playheadPosition.value = clipPosition;
      runOnJS(setAudioPosition)(clip.startTime);
      runOnJS(onClipPress)(clip.id, clip.startTime);
    });

    const animatedStyle = useAnimatedStyle(() => {
      // 计算 X 位置，使片段紧接着前一个片段
      const xPosition = TRACK_HEADER_WIDTH + clip.startTime * PIXELS_PER_SECOND;

      return {
        transform: [
          { translateX: xPosition },
          { translateY: clip.trackIndex * TOTAL_TRACK_HEIGHT },
        ],
        width: clipWidth,
        opacity: isMuted ? 0.5 : 1,
        borderColor: selectedClipId === clip.id ? '#fff' : 'transparent',
        backgroundColor: isCurrentlyPlaying ? '#666' : '#555',
      };
    }, [
      selectedClipId,
      isMuted,
      clipWidth,
      isCurrentlyPlaying,
      clip.startTime,
    ]);

    return (
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={[styles.audioClip, animatedStyle]}>
          <View style={styles.waveformContainer}>
            {waveforms.map((wave, index) => (
              <View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    height: isCurrentlyPlaying
                      ? wave.height *
                        (1 + Math.sin(Date.now() / 200 + index) * 0.2)
                      : wave.height,
                    backgroundColor: `rgba(255, 255, 255, ${wave.opacity})`,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.clipTitle} numberOfLines={1}>
            {clip.title}
          </Text>
        </Animated.View>
      </GestureDetector>
    );
  }
);

// ControlButton component
const ControlButton = ({
  icon,
  label,
  onPress,
}: {
  icon: React.FC<SvgProps> | ImageSourcePropType;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.controlButton}>
      {renderIcon(icon, 24, '#fff')}
      <Text style={styles.controlButtonText}>{label}</Text>
    </View>
  </TouchableOpacity>
);

// 在组件外部声明一个认值
const DEFAULT_DURATION = 1000;

// 添加自动缩放计算函数
const calculateInitialScale = (totalDuration: number): number => {
  const availableWidth = width - TRACK_HEADER_WIDTH - 100; // 预留边距
  const suggestedScale = availableWidth / totalDuration;
  return Math.min(Math.max(suggestedScale, MIN_SCALE), DEFAULT_SCALE);
};

const API_URL = BASE_URL;

// 添接口定义
interface MusicLibrary {
  id: string;
  title: string;
  duration: number;
  output_url: string;
  cover_url: string;
  // ... 其他字段
}

interface Draft {
  draft_id: string;
  order: number;
  music_library: MusicLibrary;
}

interface DraftListResponse {
  status: string;
  message: string;
  data: {
    draft_list_id: string;
    user_id: string;
    drafts: Draft[];
  };
}

type NavigationProps = {
  library: { draft_list_id: string };
};

// 在组件外部定义接口
interface DebugInfo {
  currentStatus: string;
  lastError: string;
  audioProgress: string;
  currentAudioInfo: string;
}

// 添加类型定义
interface PlaybackStatus {
  isLoaded: boolean;
  isPlaying?: boolean;
  positionMillis: number;
  didJustFinish?: boolean;
  durationMillis?: number;
}

// 在文件顶部添加导航类型定义
type RootStackParamList = {
  publish: {
    userId: string;
    draft_list_id: string;
    title: string;
    cover_url: string;
    description: string;
  };
  creatorlibrary: {
    draft_list_id: string;
    returnScreen: string;
    userId: string;
    friend_id: string;
  };
  creatorMusicEdit: undefined;
};

// 添加路由路径类型定义
type AppRoutes = {
  drafts: undefined;
  creatorMusicEdit: undefined;
  creatorlibrary: undefined;
  publish: undefined;
};

const CreatorMusicEditScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    draft_list_id: string;
    friend_id: string;
  }>();
  const { draft_list_id, friend_id } = params;
  const [userId, setUserId] = useState<string | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [draftData, setDraftData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [inviter, setInviter] = useState<InviterInfo | null>(null);
  const [creator, setCreator] = useState<CreatorInfo | null>(null);

  // 添加缺失的状态
  const [tracks, setTracks] = useState<Track[]>([
    { index: 0, isMuted: false, volume: 1, solo: false },
  ]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  // 添加缺失的共享值
  const scaleFactorShared = useSharedValue(DEFAULT_SCALE);
  const playheadPosition = useSharedValue(TRACK_HEADER_WIDTH);

  // 添加缺失的引用
  const trackScrollViewRef = useRef<ScrollView>(null);

  // 计算总宽度
  const totalWidth = useMemo(() => {
    const maxEndTime = clips.reduce(
      (max, clip) => Math.max(max, clip.startTime + clip.length),
      0
    );
    return (
      Math.max(width, maxEndTime * scaleFactorShared.value) +
      TRACK_HEADER_WIDTH +
      100
    );
  }, [clips, scaleFactorShared.value]);

  // 修改返回处理函数
  const handleBack = () => {
    // 导航到 profile 页面
    router.push('/profile');
  };

  // 修改 handleAddAudio 函数
  const handleAddAudio = useCallback(() => {
    console.log('handleAddAudio - 导航参数:', {
      draft_list_id,
      friend_id,
      returnScreen: 'creatorMusicedit',
    });

    if (!friend_id) {
      console.error('缺少 friend_id');
      Alert.alert('错误', '无法获取好友信息');
      return;
    }

    router.push({
      pathname: '/creatorlibrary',
      params: {
        draft_list_id,
        returnScreen: 'creatorMusicedit',
        userId: friend_id,
        friend_id: friend_id,
      },
    });
  }, [draft_list_id, friend_id]);

  // 修改 Drafts 按钮点击处理
  const handleDraftsPress = () => {
    router.push({
      pathname: '/drafts',
      params: {
        returnScreen: 'creatorMusicedit',
        draft_list_id,
      },
    });
  };

  const addTrack = useCallback(() => {
    setTracks((prev) => [
      ...prev,
      {
        index: prev.length,
        isMuted: false,
        volume: 1,
        solo: false,
      },
    ]);
  }, []);

  const onTrackScrollWithOffset = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // 处理滚动事件
      console.log('滚动位置:', event.nativeEvent.contentOffset);
    },
    []
  );

  // 更新音频位置的函数
  const setAudioPosition = useCallback(
    (time: number) => {
      if (sound) {
        // 找到当前播放的片段
        const currentClip = clips[currentAudioIndex];
        if (currentClip) {
          // 计算相对于当前片段的时间
          const clipRelativeTime = time - currentClip.startTime;
          // 确保时间在当前片段范围内
          if (clipRelativeTime >= 0 && clipRelativeTime <= currentClip.length) {
            sound.setPositionAsync(clipRelativeTime * 1000);
            setCurrentTime(time);
          }
        }
      }
    },
    [sound, clips, currentAudioIndex]
  );

  // 初始化音频模块
  useEffect(() => {
    const initAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
      });
    };
    initAudio();
  }, []);

  // 获取 userId
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('从 AsyncStorage 获取的 userId:', storedUserId);
        setUserId(storedUserId);
      } catch (error) {
        console.error('获取 userId 失败:', error);
      }
    };
    getUserId();
  }, []);

  // 加载草稿列表
  useEffect(() => {
    console.log('useEffect 依赖值:', {
      friend_id,
      userId,
      draft_list_id,
    });

    const fetchDraftList = async () => {
      if (!userId || !draft_list_id || !friend_id) {
        console.log('fetchDraftList - 缺少参数:', {
          userId,
          draft_list_id,
          friend_id,
          params: params, // 再次输出完整参数
        });
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `${BASE_URL}/friend-draft-list/${draft_list_id}/${friend_id}`
        );
        const data = await response.json();

        if (data.status === 'success') {
          // 获取第一个草稿的封面图片
          const firstDraft = data.data.drafts[0];
          console.log('首个草稿:', firstDraft);

          // 只处理不同的草稿
          const uniqueDrafts = Array.from(
            new Set(data.data.drafts.map((d: Draft) => d.draft_id))
          )
            .map((id) => data.data.drafts.find((d: Draft) => d.draft_id === id))
            .filter(Boolean);

          console.log('去重后的草稿数量:', uniqueDrafts.length);

          // 计算每个片段的起始时间和长度
          const newClips = uniqueDrafts.map((draft: Draft, index: number) => {
            const clipDuration = Math.min(
              draft.music_library.duration,
              MAX_CLIP_DURATION
            );
            const previousClipsDuration =
              index > 0
                ? uniqueDrafts
                    .slice(0, index)
                    .reduce(
                      (sum: number, prev: Draft) =>
                        sum +
                        Math.min(
                          prev.music_library.duration,
                          MAX_CLIP_DURATION
                        ),
                      0
                    )
                : 0;

            return {
              id: draft.draft_id,
              title: draft.music_library.title,
              length: clipDuration,
              startTime: previousClipsDuration,
              trackIndex: index,
              output_url: draft.music_library.output_url,
              volume: 1,
              fadeIn: 0,
              fadeOut: 0,
            };
          });

          setClips(newClips);
          setTracks(
            newClips.map((_: Clip, index: number) => ({
              index,
              isMuted: false,
              volume: 1,
              solo: false,
            }))
          );

          const totalDuration = newClips.reduce(
            (sum: number, clip: Clip) => sum + clip.length,
            0
          );
          setDraftData({
            ...data.data,
            duration: totalDuration,
            cover_url: firstDraft?.music_library.cover_url,
          });

          // 设置邀请者信息
          if (data.data.inviter) {
            setInviter({
              avatar_url: data.data.inviter.avatar_url,
              nickname: data.data.inviter.nickname,
            });
          }

          // 设置创建者信息
          if (data.data.creator) {
            setCreator(data.data.creator);
          }
        }
      } catch (error) {
        console.error('获取草稿列表失败:', error);
        Alert.alert('错误', '获取草稿列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDraftList();
  }, [draft_list_id, userId, friend_id]);

  // 修改音频播放逻辑
  const loadAndPlayAudio = useCallback(
    async (clip: Clip, index: number) => {
      if (!clip.output_url) return;
      try {
        // 先停止并卸载当前音频
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }

        // 创建新的音频实例
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: clip.output_url },
          {
            shouldPlay: true,
            positionMillis: 0,
            progressUpdateIntervalMillis: 50,
          },
          (status) => {
            if (!status.isLoaded) return;

            // 更准确地计算当前播放时间
            const currentPositionInSeconds = Math.floor(
              status.positionMillis / 1000
            );
            const totalPreviousTime = clip.startTime;
            setCurrentTime(totalPreviousTime + currentPositionInSeconds);

            // 处理播放完成
            if (status.didJustFinish) {
              const nextIndex = index + 1;
              if (nextIndex < clips.length) {
                loadAndPlayAudio(clips[nextIndex], nextIndex);
              } else {
                // 播放完成后重置所有状态
                setIsPlaying(false);
                setCurrentTime(draftData?.duration || 0);
                setCurrentAudioIndex(0);
                setSound(null);
              }
            }
          }
        );

        await newSound.setVolumeAsync(1.0);
        setSound(newSound);
        setIsPlaying(true);
        setCurrentAudioIndex(index);
        setCurrentTime(clip.startTime);
      } catch (error) {
        console.error('加载音频失败:', error);
        setSound(null);
        setIsPlaying(false);
        setCurrentAudioIndex(0);
        Alert.alert('错误', '加载音频失败');
      }
    },
    [clips, draftData?.duration]
  );

  // 修改播放/暂停处理函
  const handlePlayPause = useCallback(async () => {
    try {
      if (sound) {
        const status = (await sound.getStatusAsync()) as PlaybackStatus;
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      } else if (clips.length > 0) {
        // 检查是否已播放完成（当前时间等于总时长）
        if (currentTime >= (draftData?.duration || 0)) {
          // 从头开始播放
          setCurrentTime(0);
          await loadAndPlayAudio(clips[0], 0);
        } else {
          // 从当前时间对应的片段开始播放
          const clipIndex = clips.findIndex(
            (clip) =>
              currentTime >= clip.startTime &&
              currentTime < clip.startTime + clip.length
          );
          const startIndex = clipIndex >= 0 ? clipIndex : 0;
          await loadAndPlayAudio(clips[startIndex], startIndex);
        }
      }
    } catch (error) {
      console.error('播放控制失败:', error);
      Alert.alert('错误', '播放控制失败');
    }
  }, [sound, clips, currentTime, draftData?.duration, loadAndPlayAudio]);

  const resetPlayback = useCallback(() => {
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
    }
    setSound(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentAudioIndex(0);
  }, [sound]);

  const toggleMuteTrack = (trackIndex: number) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.index === trackIndex
          ? { ...track, isMuted: !track.isMuted }
          : track
      )
    );
  };

  // 格式化时间显示函数
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 修改点击片段时的处理
  const onClipPress = useCallback(
    (clipId: string, startTime: number) => {
      setSelectedClipId(clipId);
      setCurrentTime(startTime);
      const index = clips.findIndex((c) => c.id === clipId);
      if (index !== -1) {
        loadAndPlayAudio(clips[index], index);
      }
    },
    [clips, loadAndPlayAudio]
  );

  // 修改 handleExport 函数
  const handleExport = useCallback(() => {
    console.log('handleExport - friend_id:', friend_id);
    if (!userId || !draft_list_id || !draftData) {
      Alert.alert('错误', '缺少必要参数');
      return;
    }

    // 导航到 Publish 页面，并传递必要数据
    router.push({
      pathname: '/creatorpublish',
      params: {
        userId,
        draft_list_id,
        title: draftData.title,
        cover_url: draftData.cover_url,
        description: draftData.description || '',
      },
    });
  }, [userId, draft_list_id, draftData]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack}>
                <CloseIcon width={24} height={24} fill="#fff" />
              </TouchableOpacity>

              {/* 显示创建者头像和名字 */}
              {creator && (
                <View style={styles.creatorContainer}>
                  <Image
                    source={{ uri: creator.avatar_url }}
                    style={styles.creatorAvatar}
                  />
                  <Text style={styles.creatorName} numberOfLines={1}>
                    {`${creator.first_name} ${creator.last_name}`}
                  </Text>
                </View>
              )}

              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={handleExport}
                  disabled={isLoading}
                >
                  <Text style={styles.exportButtonText}>
                    {isLoading ? '加载中...' : 'Publish'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cover Image */}
            <View style={styles.imageContainer}>
              {draftData?.cover_url ? (
                <Image
                  source={{ uri: draftData.cover_url }}
                  style={styles.coverImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Cover Image</Text>
                </View>
              )}
            </View>

            {/* Title */}
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {draftData ? draftData.title : 'Title'}
              </Text>
            </View>

            {/* Play Control */}
            <View style={styles.playControl}>
              <TouchableOpacity onPress={handlePlayPause}>
                {isPlaying ? (
                  <Image
                    source={PauseIcon}
                    style={{ width: 30, height: 30, tintColor: '#fff' }}
                  />
                ) : (
                  <PlayIcon width={30} height={30} fill="#fff" />
                )}
              </TouchableOpacity>
            </View>

            {/* Time Display with Undo and Redo */}
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} /{' '}
                {formatTime(draftData?.duration || 0)}
              </Text>
              <View style={styles.timeIcons}>
                <TouchableOpacity onPress={() => {}}>
                  {renderIcon(UndoIcon, 24, '#fff')}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}} style={{ marginLeft: 10 }}>
                  {renderIcon(RedoIcon, 24, '#fff')}
                </TouchableOpacity>
              </View>
            </View>

            {/* Main Content */}
            <View style={{ flex: 1, position: 'relative' }}>
              <ScrollView style={styles.trackScrollView} bounces={false}>
                <View style={styles.trackContainerWrapper}>
                  {/* 静音按钮器 */}
                  <View style={styles.muteButtonContainer}>
                    {tracks.map((track) => (
                      <TouchableOpacity
                        key={track.index}
                        style={[
                          styles.muteButton,
                          { top: track.index * TOTAL_TRACK_HEIGHT },
                        ]}
                        onPress={() => toggleMuteTrack(track.index)}
                      >
                        {renderIcon(
                          track.isMuted ? MuteIcon : VoiceIcon,
                          24,
                          '#fff'
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* 修改内层 ScrollView */}
                  <ScrollView
                    style={styles.trackContainer}
                    contentContainerStyle={{
                      width: totalWidth,
                      flexDirection: 'column',
                    }}
                    horizontal={true}
                    ref={trackScrollViewRef}
                    onScroll={onTrackScrollWithOffset}
                    scrollEventThrottle={16}
                    bounces={false}
                    scrollEnabled={true}
                    directionalLockEnabled={true}
                    nestedScrollEnabled={true}
                  >
                    {/* 轨道背景 */}
                    {tracks.map((track) => (
                      <View key={track.index} style={styles.track} />
                    ))}

                    {/* 音频段 */}
                    {clips.map((clip) => (
                      <AudioClip
                        key={clip.id}
                        clip={clip}
                        scaleFactorShared={scaleFactorShared}
                        onClipPress={(clipId, startTime) => {
                          onClipPress(clipId, startTime);
                        }}
                        selectedClipId={selectedClipId}
                        clips={clips}
                        isMuted={tracks[clip.trackIndex]?.isMuted || false}
                        tracks={tracks}
                        playheadPosition={playheadPosition}
                        setAudioPosition={setAudioPosition}
                        isCurrentlyPlaying={
                          currentAudioIndex === clips.indexOf(clip) && isPlaying
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Controls Container */}
      <View style={styles.controlsContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.controlsScroll}
          showsHorizontalScrollIndicator={false}
        >
          <ControlButton
            icon={AddAudioIcon}
            label="Audio"
            onPress={handleAddAudio}
          />
          <ControlButton icon={AddTrackIcon} label="Track" onPress={addTrack} />
          <ControlButton icon={SplitIcon} label="Split" onPress={() => {}} />
          <ControlButton icon={CopyIcon} label="Copy" onPress={() => {}} />
          <ControlButton icon={DeleteIcon} label="Delete" onPress={() => {}} />
          <ControlButton icon={FadeIcon} label="Fade" onPress={() => {}} />
          <ControlButton icon={VolumeIcon} label="Volume" onPress={() => {}} />
          <ControlButton icon={SpeedIcon} label="Speed" onPress={() => {}} />
          <ControlButton
            icon={NoiseReductionIcon}
            label="Noise Reduction"
            onPress={() => {}}
          />
        </ScrollView>
      </View>

      {/* 添加调试信息显示 */}
      {__DEV__ && debugInfo && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            当前音频: {debugInfo?.currentAudioInfo || '无'}
          </Text>
          <Text style={styles.debugText}>
            播放进度: {debugInfo?.audioProgress || '0s'}
          </Text>
          <Text style={styles.debugText}>
            最后错误: {debugInfo?.lastError || '无'}
          </Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default CreatorMusicEditScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: -70,
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15, // 增加水平内边距以适应更长的文本
    marginRight: 10,
  },
  exportButtonText: {
    color: '#000',
    fontSize: 14, // 稍微减小字体大小
    fontWeight: 'normal',
  },
  imageContainer: {
    height: 312,
    width: 235,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  imagePlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
  addAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginVertical: 10,
  },
  addAudioText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  playControl: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 5,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  timeIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineContainer: {
    height: 40,
    backgroundColor: '#1C1C1C',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: -1,
    paddingBottom: 0,
    marginLeft: -10,
  },
  timelineBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  timelineScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  markerContainer: {
    position: 'relative',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-start',
  },
  markerText: {
    color: '#999',
    fontSize: 10,
    marginBottom: 4,
  },
  markerLine: {
    width: 1,
    backgroundColor: '#666',
    height: 10,
    marginTop: 2,
  },
  playhead: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'transparent',
    height: '100%',
    transform: [{ translateX: -30 }],
    zIndex: 1000,
  },
  trackContainerWrapper: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    position: 'relative',
    flexDirection: 'row',
    marginTop: 1,
  },
  trackContainer: {
    flex: 1,
    overflow: 'hidden',
    paddingLeft: TRACK_HEADER_WIDTH,
    paddingRight: 50, // 添加右侧边距
  },
  trackContainerContent: {
    flexDirection: 'column',
    minWidth: width * 2, // 确保最小宽度是屏幕宽度的倍
  },
  track: {
    height: TRACK_HEIGHT,
    marginBottom: TRACK_GAP,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    width: '100%',
    backgroundColor: '#1C1C1C',
    position: 'relative',
  },
  muteButtonContainer: {
    width: TRACK_HEADER_WIDTH,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
  },
  muteButton: {
    position: 'absolute',
    left: 2,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    top: (TOTAL_TRACK_HEIGHT - 20) / 2,
  },
  audioClip: {
    position: 'absolute',
    height: TRACK_HEIGHT - 4,
    backgroundColor: '#555',
    borderRadius: 4,
    overflow: 'hidden',
    minWidth: MIN_CLIP_WIDTH,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: WAVEFORM_HEIGHT,
    overflow: 'hidden',
    paddingHorizontal: 2,
    flex: 1,
  },
  waveBar: {
    width: 2,
    marginHorizontal: 1,
    backgroundColor: '#fff',
    minHeight: 4, // 添加最小高度
  },
  clipTitle: {
    color: '#fff',
    fontSize: 10, // 减小字体大小
    position: 'absolute',
    bottom: 2,
    left: 4,
    right: 4,
  },
  controlsContainer: {
    paddingVertical: 10,
    backgroundColor: '#111',
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1000,
  },
  controlsScroll: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  controlButton: {
    alignItems: 'center',
    width: 60,
    marginHorizontal: 5,
    marginTop: -50,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  trimHandleLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: '#888',
    zIndex: 1,
  },
  trimHandleRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: '#888',
    zIndex: 1,
  },
  trackScrollView: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    position: 'relative',
    flexDirection: 'row',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // 可选：设置背景颜色
  },
  timelineRuler: {
    height: 40,
    backgroundColor: '#1C1C1C',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },

  trackControls: {
    width: TRACK_HEADER_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
    backgroundColor: '#1C1C1C',
  },
  volumeSlider: {
    width: 80,
    transform: [{ rotate: '-90deg' }],
  },
  clipContainer: {
    flex: 1,
    position: 'relative',
  },
  mutedButton: {
    opacity: 0.5,
  },
  trackHeader: {
    position: 'absolute',
    left: 0,
    width: TRACK_HEADER_WIDTH,
    height: '100%',
    backgroundColor: '#1C1C1C',
    zIndex: 2,
  },
  timelineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: width * 2, // 确保最小宽度是屏幕宽度的倍
    height: TIMELINE_HEIGHT,
  },
  timelineMarker: {
    position: 'absolute',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    pointerEvents: 'none',
  },
  majorTickMark: {
    width: 1,
    height: 12,
    backgroundColor: '#666',
    marginTop: 2,
  },
  minorTickMark: {
    width: 1,
    height: 6,
    backgroundColor: '#444',
    marginTop: 14,
  },
  timelineText: {
    color: '#999',
    fontSize: 10,
    marginBottom: 2,
  },
  debugContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  inviterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },

  inviterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333', // 占位背景色
  },

  inviterName: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },

  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },

  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
  },

  creatorName: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});
