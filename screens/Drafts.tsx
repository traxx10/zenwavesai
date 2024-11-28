import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BackIcon from '../assets/icons/back.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

interface DraftItem {
  id: string;
  draft_list_id: string;
  title: string;
  cover_url: string;
  created_at: string;
}

export default function DraftsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    returnScreen?: string;
    draft_list_id?: string;
  }>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);

  // 获取草稿数据
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(
          `${BASE_URL}/users/${userId}/active-drafts/count`
        );
        const data = await response.json();

        if (data.status === 'success') {
          const formattedDrafts = data.data.active_drafts.map((draft: any) => ({
            id: draft.draft_info.id,
            draft_list_id: draft.draft_info.draft_list_id,
            title: draft.music_library_info.title,
            cover_url: draft.music_library_info.cover_url,
            created_at: draft.draft_info.created_at,
          }));
          setDrafts(formattedDrafts);
        }
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };

    fetchDrafts();
  }, []);

  // 计算时间差
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    // 确保时间差不为负数
    if (diffInSeconds <= 0) return '1min';

    // 小于1分钟的显示为1分钟
    if (diffInSeconds < 60) return '1min';

    // 小于1小时显示分钟
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}min`;
    }

    // 小于1天显示小时
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    }

    // 小于30天显示天数
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }

    // 超过30天显示月份
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}mo`;
  };

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

  const renderDraftItem = ({ item }: { item: DraftItem }) => (
    <TouchableOpacity
      style={styles.draftItem}
      onPress={() => {
        if (isSelecting) {
          handleSelectItem(item.id);
        } else {
          router.push({
            pathname: '/musicedit',
            params: { draft_list_id: item.draft_list_id },
          });
        }
      }}
      activeOpacity={isSelecting ? 0.7 : 1}
    >
      <Image
        source={{ uri: item.cover_url }}
        style={styles.draftImage}
        defaultSource={require('../assets/images/Drafts1.png')} // 默认图片
      />
      <Text style={styles.draftTitle}>{getTimeAgo(item.created_at)}</Text>
      {isSelecting && (
        <View style={styles.selectCircle}>
          {selectedItems.includes(item.id) && (
            <View style={styles.selectedIndicator} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  // 添加删除草稿的函数
  const handleDeleteDrafts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId || selectedItems.length === 0) return;

      // 获取选中项目的 draft_list_id
      const selectedDrafts = drafts.filter((draft) =>
        selectedItems.includes(draft.id)
      );
      const draftListIds = selectedDrafts
        .map((draft) => draft.draft_list_id)
        .join(',');

      const response = await fetch(
        `${BASE_URL}/users/${userId}/drafts?draft_list_ids=${draftListIds}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.status === 'success') {
        // 从本地状态中移除已删���的草稿
        setDrafts((prevDrafts) =>
          prevDrafts.filter((draft) => !selectedItems.includes(draft.id))
        );
        setSelectedItems([]); // 清空选择
        setIsSelecting(false); // 退出选择模式
      } else {
        Alert.alert('Error', 'Failed to delete drafts');
      }
    } catch (error) {
      console.error('Error deleting drafts:', error);
      Alert.alert('Error', 'Failed to delete drafts');
    }
  };

  // 添加返回处理函数
  const handleBack = () => {
    if (params.returnScreen === 'musicedit' && params.draft_list_id) {
      router.push({
        pathname: '/musicedit',
        params: {
          draft_list_id: params.draft_list_id,
        },
      });
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={24} height={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drafts</Text>
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
        Only you can see drafts. Uninstalling ZenWaves will discard all drafts.
      </Text>

      {/* Drafts Grid */}
      <FlatList
        data={drafts}
        renderItem={renderDraftItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.draftsGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Action Bar */}
      {isSelecting && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedItems.length !== 1 && styles.disabledButton,
            ]}
            disabled={selectedItems.length !== 1}
            onPress={() => alert('Invite Friend to Edit Music')}
          >
            <Ionicons
              name="share-outline"
              size={18}
              color={selectedItems.length === 1 ? '#000' : '#ccc'}
            />
            <Text
              style={[
                styles.actionText,
                { color: selectedItems.length === 1 ? '#000' : '#ccc' },
              ]}
            >
              Invite Friends to Edit Music
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedItems.length === 0 && styles.disabledButton,
            ]}
            disabled={selectedItems.length === 0}
            onPress={handleDeleteDrafts}
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
    right: 8,
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
});
