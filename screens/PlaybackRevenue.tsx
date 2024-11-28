import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import HandleIcon from '@/assets/icons/goup.svg';
import BackIcon from '../assets/icons/back.svg';
import MusicIcon from '../assets/icons/music.svg';
import { BASE_URL } from '@/utils/apis';

interface MusicEarnings {
  total_play_count: number;
  total_revenue: number;
  total_settled: number;
  total_estimated: number;
  music_list: Array<{
    music_info: {
      id: string;
      title: string;
      type: string;
      cover_url: string;
    };
    statistics: {
      play_count: number;
      total_revenue: number;
      settled_revenue: number;
      estimated_revenue: number;
    };
    play_history: Array<{
      date: string;
      revenue: number;
      is_settled: boolean;
    }>;
  }>;
}

const PlaybackRevenueScreen = () => {
  const router = useRouter();
  const [earnings, setEarnings] = useState<MusicEarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/earnings/music-details/${userId}`
      );
      const result = await response.json();

      if (response.ok) {
        setEarnings(result.data);
      } else {
        console.error('Failed to fetch earnings:', result);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playback Revenue</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Total Revenue Section */}
      <View style={styles.revenueContainer}>
        <Text style={styles.revenueTitle}>Total Estimated Daily Revenue</Text>
        <Text style={styles.revenueAmount}>
          $ {earnings?.total_estimated.toFixed(2) || '0.00'}
        </Text>
        <Text style={styles.estimateNote}>
          *Monthly settlement on the 1st of each month
        </Text>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.recentActivityContainer}>
        <View style={styles.handleContainer}>
          <HandleIcon width={22} height={22} />
        </View>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={earnings?.music_list || []}
          keyExtractor={(item) => item.music_info.id}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <View style={styles.iconContainer}>
                <MusicIcon width={24} height={24} />
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityName}>{item.music_info.title}</Text>
                <Text style={styles.activityDate}>
                  {new Date(item.play_history[0]?.date).toLocaleString()}
                </Text>
              </View>
              <Text style={[styles.activityAmount, { color: '#4CAF50' }]}>
                +${item.statistics.estimated_revenue.toFixed(2)}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
};

export default PlaybackRevenueScreen;

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
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#000',
  },
  revenueContainer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 16,
  },
  revenueTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  revenueAmount: {
    fontSize: 36,
    fontWeight: 'normal',
    color: '#000',
    marginBottom: 8,
  },
  estimateNote: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  recentActivityContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 15,
    color: '#000',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  iconContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTextContainer: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000',
  },
  activityDate: {
    fontSize: 12,
    color: '#000',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  handleContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  handleIcon: {
    width: 40,
    height: 4,
    resizeMode: 'contain',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
