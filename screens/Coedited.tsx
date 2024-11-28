import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import BackIcon from '../assets/icons/back.svg'; // 导入 back.svg
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { BASE_URL } from '@/utils/apis';

interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

interface MusicInfo {
  title: string;
  cover_url: string;
  duration: number;
  created_at: string;
}

interface DraftItem {
  draft_list_id: string;
  is_creator: boolean;
  creator: Creator;
  music_info: MusicInfo;
}

export default function CoeditedScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const navigation = useNavigation();
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // 获取草稿列表数据
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('userId'); // 确保你已经存储了用户ID
        if (!userId || !friendId) return;

        const response = await fetch(
          `${BASE_URL}/users/${userId}/friend-drafts/${friendId}`
        );
        const data = await response.json();

        if (data.status === 'success') {
          setDrafts(data.data.drafts);
        }
      } catch (error) {
        console.error('获取草稿列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrafts();
  }, [friendId]);

  const toggleSelectMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedItems([]); // 清空已选项目
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderDraftItem = ({ item }: { item: DraftItem }) => {
    const handlePress = async () => {
      if (isSelecting) {
        handleSelectItem(item.draft_list_id);
        return;
      }

      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        // 判断当前用户是否是创建者
        if (item.creator.id === userId) {
          // 如果是创建者，跳转到 CreatorMusicEdit
          router.push({
            pathname: '/creatormusicedit',
            params: {
              draft_list_id: item.draft_list_id,
              friend_id: friendId,
            },
          });
        } else {
          // 如果不是创建者，跳转到 FriendsMusicEdit
          router.push({
            pathname: '/friendsmusicedit',
            params: {
              draft_list_id: item.draft_list_id,
              friend_id: friendId,
            },
          });
        }
      } catch (error) {
        console.error('跳转失败:', error);
      }
    };

    return (
      <TouchableOpacity
        style={styles.draftItem}
        onPress={handlePress}
        activeOpacity={isSelecting ? 0.7 : 1}
      >
        <Image
          source={{ uri: item.music_info.cover_url }}
          style={styles.draftImage}
        />
        <Text style={styles.draftTitle}>{item.music_info.title}</Text>

        {/* 创建者头像 */}
        <Image
          source={{ uri: item.creator.avatar_url }}
          style={styles.creatorAvatar}
        />

        {isSelecting && (
          <View style={styles.selectCircle}>
            {selectedItems.includes(item.draft_list_id) && (
              <View style={styles.selectedIndicator} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            isSelecting
              ? setSelectedItems(drafts.map((item) => item.draft_list_id))
              : navigation.goBack()
          }
        >
          <BackIcon width={24} height={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Co-Edited Library</Text>
        <TouchableOpacity
          onPress={toggleSelectMode}
          style={styles.selectButton}
        >
          <Text style={styles.selectButtonText}>
            {isSelecting ? 'Cancel' : 'Select'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Collaborate with your friend to edit and perfect the music.
      </Text>

      {/* Drafts Grid */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <FlatList
          data={drafts}
          renderItem={renderDraftItem}
          keyExtractor={(item) => item.draft_list_id}
          numColumns={3}
          contentContainerStyle={styles.draftsGrid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No co-edited music yet</Text>
          )}
        />
      )}

      {/* Bottom Action Bar */}
      {isSelecting && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedItems.length === 0 && styles.disabledButton,
            ]}
            disabled={selectedItems.length === 0}
            onPress={() => alert(`Delete (${selectedItems.length}) items`)}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={selectedItems.length > 0 ? '#ff3b30' : '#ccc'}
            />
            <Text
              style={[
                styles.actionText,
                { color: selectedItems.length > 0 ? '#ff3b30' : '#ccc' },
              ]}
            >
              Delete ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backIcon: {
    marginLeft: 8, // 左边距，确保back图标不贴边
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  selectButton: {
    marginRight: 8, // 右边距，确保按钮不贴边
  },
  selectButtonText: {
    fontSize: 16,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginVertical: 10,
  },
  draftsGrid: {
    paddingBottom: 10,
  },
  draftItem: {
    flex: 1,
    margin: 4,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  draftImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  draftTitle: {
    position: 'absolute',
    top: 8,
    left: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectCircle: {
    position: 'absolute',
    top: 8,
    right: 48, // 移到头像左侧
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff3b30',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  creatorAvatar: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
