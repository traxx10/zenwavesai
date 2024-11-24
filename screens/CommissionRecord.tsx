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

interface CommissionRecord {
  id: string;
  subscription: {
    id: string;
    type: string;
    amount: number;
  };
  amount: number;
  commission_type: string;
  commission_rate: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

interface CommissionSummary {
  total_commission: number;
  pending_commission: number;
  paid_commission: number;
}

const CommissionRecordScreen = () => {
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [summary, setSummary] = useState<CommissionSummary>({
    total_commission: 0,
    pending_commission: 0,
    paid_commission: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCommissionRecords = async (pageNum: number = 1, refresh: boolean = false) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/users/${userId}/commission-records?page=${pageNum}&page_size=20`
      );
      const data = await response.json();

      if (data.status === 'success') {
        if (refresh) {
          setRecords(data.data.records);
        } else {
          setRecords(prev => [...prev, ...data.data.records]);
        }
        setSummary(data.data.summary);
        setHasMore(pageNum < data.data.pagination.total_pages);
      }
    } catch (error) {
      console.error('Error fetching commission records:', error);
      Alert.alert('Error', 'Failed to load commission records');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchCommissionRecords(1, true);
  };

  const loadMore = () => {
    if (hasMore && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCommissionRecords(nextPage);
    }
  };

  useEffect(() => {
    fetchCommissionRecords();
  }, []);

  const renderCommissionItem = ({ item }: { item: CommissionRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordType}>
          {item.commission_type === 'direct' ? 'Direct Commission' : 'Team Commission'}
        </Text>
        <Text style={[
          styles.recordStatus,
          { color: item.status === 'paid' ? '#4CAF50' : '#FF9800' }
        ]}>
          {item.status === 'paid' ? 'Paid' : 'Pending'}
        </Text>
      </View>
      
      <View style={styles.recordDetails}>
        <Text style={styles.recordAmount}>$ {item.amount.toFixed(2)}</Text>
        <Text style={styles.recordDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.recordInfo}>
        <Text style={styles.recordInfoText}>
          Rate: {(item.commission_rate * 100).toFixed(1)}%
        </Text>
        <Text style={styles.recordInfoText}>
          Base Amount: $ {item.subscription.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commission Records</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Commission</Text>
          <Text style={styles.summaryValue}>$ {summary.total_commission.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summaryValue}>$ {summary.pending_commission.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Paid</Text>
          <Text style={styles.summaryValue}>$ {summary.paid_commission.toFixed(2)}</Text>
        </View>
      </View>

      {/* Records List */}
      <FlatList
        data={records}
        renderItem={renderCommissionItem}
        keyExtractor={item => item.id}
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
export default CommissionRecordScreen;

