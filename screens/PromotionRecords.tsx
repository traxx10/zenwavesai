import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackIcon from '../assets/icons/back.svg';
import { BASE_URL } from '@/utils/apis';

interface PromotionRecord {
  id: string;
  music_id: string;
  music_title: string;
  goal: string;
  amount: number;
  duration: string;
  estimated_plays: number;
  actual_plays: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface PromotionSummary {
  total_spent: number;
  active_campaigns: number;
  total_plays: number;
  average_engagement: number;
}

const PromotionRecordScreen = () => {
  const [records, setRecords] = useState<PromotionRecord[]>([]);
  const [summary, setSummary] = useState<PromotionSummary>({
    total_spent: 0,
    active_campaigns: 0,
    total_plays: 0,
    average_engagement: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPromotionRecords = async (
    pageNum: number = 1,
    refresh: boolean = false
  ) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/users/${userId}/promotion-records?page=${pageNum}&page_size=20`
      );
      const data = await response.json();

      if (data.status === 'success') {
        if (refresh) {
          setRecords(data.data.records);
        } else {
          setRecords((prev) => [...prev, ...data.data.records]);
        }
        setSummary(data.data.summary);
        setHasMore(pageNum < data.data.pagination.total_pages);
      }
    } catch (error) {
      console.error('Error fetching promotion records:', error);
      Alert.alert('Error', 'Failed to load promotion records');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchPromotionRecords(1, true);
  };

  const loadMore = () => {
    if (hasMore && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPromotionRecords(nextPage);
    }
  };

  useEffect(() => {
    fetchPromotionRecords();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const renderPromotionItem = ({ item }: { item: PromotionRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.recordType}>
            {item.goal === 'listeners' ? 'Attract Listeners' : 'Gain Followers'}
          </Text>
          <Text style={styles.musicTitle} numberOfLines={1}>
            {item.music_title || 'Untitled'}
          </Text>
        </View>
        <Text
          style={[
            styles.recordStatus,
            {
              color:
                item.status === 'completed'
                  ? '#4CAF50'
                  : item.status === 'active'
                  ? '#2196F3'
                  : '#FF9800',
            },
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      <View style={styles.recordDetails}>
        <Text style={styles.recordAmount}>$ {item.amount.toFixed(2)}</Text>
        <Text style={styles.recordDate}>
          {new Date(item.start_date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.recordInfo}>
        <Text style={styles.recordInfoText}>Duration: {item.duration}</Text>
        <Text style={styles.recordInfoText}>
          Current Plays: {formatNumber(item.actual_plays)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promotion Records</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>
            $ {summary.total_spent.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Active</Text>
          <Text style={styles.summaryValue}>{summary.active_campaigns}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Plays</Text>
          <Text style={styles.summaryValue}>
            {formatNumber(summary.total_plays)}
          </Text>
        </View>
      </View>

      <FlatList
        data={records}
        renderItem={renderPromotionItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },
  listContainer: {
    padding: 16,
  },
  recordItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  musicTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recordType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  recordStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  recordInfo: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
    marginTop: 8,
  },
  recordInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default PromotionRecordScreen;
