import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import PlaybackIcon from '../assets/icons/playback.svg';
import AdRevenueIcon from '../assets/icons/ad_revenue.svg';
import ReferralIcon from '../assets/icons/referral.svg';
import EngagementIcon from '../assets/icons/engagement.svg';
import BackIcon from '../assets/icons/back.svg';
import NotificationIcon from '../assets/icons/notification.svg';
import Svg, { Line, Circle } from 'react-native-svg';
import MusicIcon from '../assets/icons/mingcute_music-line.svg';
import MastercardIcon from '../assets/icons/mastercard.svg';
import PowerstoneIcon from '../assets/icons/powerstone.svg';
import BuyStonesIcon from '../assets/icons/buystones.svg';
import CashOutIcon from '../assets/icons/cashout.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

const screenWidth = Dimensions.get('window').width;

interface UserData {
  first_name: string;
  last_name: string;
  avatar_url: string;
  balance: number;
  powerstone_balance: number;
}

interface DailyActivity {
  date: string;
  total_revenue: number;
  music_info: {
    id: string;
    title: string;
    type: string;
    cover_url: string;
  };
  is_settled: boolean;
}

const EarningsScreen = () => {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [recentActivities, setRecentActivities] = React.useState<
    DailyActivity[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // 获取用户数据
          const profileResponse = await fetch(
            `${BASE_URL}/users/${userId}/profile`
          );
          const profileData = await profileResponse.json();
          setUserData(profileData.data);

          // 获取音乐收益数据
          const earningsResponse = await fetch(
            `${BASE_URL}/earnings/music-details/${userId}`
          );
          const earningsData = await earningsResponse.json();

          // 处理并按日期合并活动数据
          const dailyActivities = new Map<string, DailyActivity>();

          earningsData.data.music_list.forEach((music: any) => {
            music.play_history.forEach((history: any) => {
              const dateKey = new Date(history.date).toDateString();
              const revenue =
                typeof history.revenue === 'number' ? history.revenue : 0;

              if (!dailyActivities.has(dateKey)) {
                dailyActivities.set(dateKey, {
                  date: history.date,
                  total_revenue: revenue,
                  music_info: music.music_info,
                  is_settled: history.is_settled || false,
                });
              } else {
                const existing = dailyActivities.get(dateKey)!;
                existing.total_revenue =
                  (existing.total_revenue || 0) + revenue;
                existing.is_settled =
                  (existing.is_settled && history.is_settled) || false;
              }
            });
          });

          // 转换为数组并按日期排序
          const activities = Array.from(dailyActivities.values())
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5); // 只取最近5天

          setRecentActivities(activities);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRecentActivities([]); // 发生错误时设置空数组
      }
    };

    fetchData();
  }, []);

  const getCurrentMonth = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[new Date().getMonth()];
  };

  const getChartData = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = new Date().getMonth();
    const labels = [];

    // 修改标签顺序：从当前月份的前一个月开始
    for (let i = -1; i <= 4; i++) {
      const monthIndex = (currentMonth + i + 12) % 12;
      labels.push(months[monthIndex]);
    }

    // 示例数据 - 你可以根据需要修改或从API获取实际数据
    const data = [40, 80, 60, 100, 75, 95];

    return { labels, data };
  };

  const chartData = getChartData();

  const renderDashboardItems = () => (
    <View style={styles.dashboard}>
      <TouchableOpacity
        style={styles.dashboardItem}
        onPress={() => router.push('/playbackrevenue')}
      >
        <PlaybackIcon width={30} height={30} style={styles.dashboardIcon} />
        <View style={styles.dashboardTextContainer}>
          <Text style={styles.dashboardTitle}>Playback Revenue</Text>
          <Text style={styles.dashboardSubtitle}>
            Get paid for every track play
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dashboardItem}
        onPress={() => router.push('/adrevenue')}
      >
        <AdRevenueIcon width={30} height={30} style={styles.dashboardIcon} />
        <View style={styles.dashboardTextContainer}>
          <Text style={styles.dashboardTitle}>Ad Revenue Share</Text>
          <Text style={styles.dashboardSubtitle}>
            Revenue from ads on your music
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dashboardItem}
        onPress={() => router.push('/commissionrecord')}
      >
        <ReferralIcon width={30} height={30} style={styles.dashboardIcon} />
        <View style={styles.dashboardTextContainer}>
          <Text style={styles.dashboardTitle}>Referral Commission</Text>
          <Text style={styles.dashboardSubtitle}>
            Invite friends, earn commissions
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dashboardItem}
        onPress={() => router.push('/promotionrecords')}
      >
        <EngagementIcon width={30} height={30} style={styles.dashboardIcon} />
        <View style={styles.dashboardTextContainer}>
          <Text style={styles.dashboardTitle}>Drive Engagement</Text>
          <Text style={styles.dashboardSubtitle}>
            Boost reach with targeted ads
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderActivityItem = ({ item }: { item: DailyActivity }) => {
    const amount =
      typeof item.total_revenue === 'number'
        ? item.total_revenue.toFixed(2)
        : '0.00';

    const formattedDate = new Date(item.date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <View style={styles.activityItem}>
        <View style={styles.iconContainer}>
          <MusicIcon width={24} height={24} color="#FFF" />
        </View>
        <View style={styles.activityText}>
          <Text style={styles.activityName}>{item.music_info.title}</Text>
          <Text style={styles.activityDate}>{formattedDate}</Text>
        </View>
        <Text
          style={[
            styles.activityAmount,
            { color: item.is_settled ? '#000' : '#666' },
          ]}
        >
          {item.is_settled ? '' : '~'} ${amount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={recentActivities}
        keyExtractor={(item, index) => `${item.music_info.id}-${index}`}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push('/profile')}>
                <BackIcon width={24} height={24} />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Image
                  source={
                    userData?.avatar_url
                      ? { uri: userData.avatar_url }
                      : require('../assets/images/chat3.png')
                  }
                  style={styles.userAvatar}
                />
                <View>
                  <Text style={styles.greeting}>Hello!</Text>
                  <Text style={styles.userName}>
                    {userData
                      ? `${userData.first_name} ${userData.last_name}`
                      : 'User'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <NotificationIcon width={24} height={24} />
              </TouchableOpacity>
            </View>

            {/* Balance Section */}
            <View style={styles.balanceContainer}>
              <View style={styles.balanceContent}>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceTitle}>Total Balance</Text>
                  <Text style={styles.balanceAmount}>
                    ${' '}
                    {userData?.balance?.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || '0.00'}
                  </Text>
                </View>
                <View style={styles.powerstoneContainer}>
                  <Text style={styles.powerstoneText}>Powerstone</Text>
                  <View style={styles.powerstoneAmountContainer}>
                    <PowerstoneIcon width={20} height={20} />
                    <Text style={styles.powerstoneAmount}>
                      {userData?.powerstone_balance?.toLocaleString('en-US') ||
                        0}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardIconContainer}>
                <MastercardIcon width={40} height={40} />
              </View>
            </View>

            {/* Action Buttons and Earnings Overview */}
            <View style={styles.overviewContainer}>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.button, styles.buyButton]}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Buy Stones</Text>
                    <BuyStonesIcon width={20} height={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cashOutButton]}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Cash Out</Text>
                    <CashOutIcon width={20} height={20} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Earnings Overview Chart */}
              <TouchableOpacity
                style={[styles.earningsOverview]}
                onPress={() => router.push('/earningsoverview')}
              >
                <View style={styles.chartTitleContainer}>
                  <Text style={styles.chartSubtitle}>Earnings Overview</Text>
                  <Text style={styles.chartTitle}>{getCurrentMonth()}</Text>
                </View>
                <LineChart
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        data: chartData.data,
                        color: (opacity = 1) =>
                          `rgba(118, 118, 118, ${opacity})`,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth * 0.5}
                  height={90}
                  chartConfig={{
                    backgroundColor: '#EDEDED',
                    backgroundGradientFrom: '#EDEDED',
                    backgroundGradientTo: '#EDEDED',
                    fillShadowGradient: '#E0E0E0',
                    fillShadowGradientOpacity: 1,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(118, 118, 118, ${opacity})`,
                    labelColor: () => '#969696',
                    propsForDots: {
                      r: '0',
                    },
                    propsForLabels: {
                      fontSize: 12,
                    },
                  }}
                  withVerticalLines={false}
                  withHorizontalLines={false}
                  withVerticalLabels={true}
                  withHorizontalLabels={false}
                  renderDotContent={({ x, y, index }) =>
                    index === 1 ? (
                      <Svg>
                        <Circle cx={x} cy={y} r={4} fill="black" />
                        <Line
                          x1={x}
                          y1={y}
                          x2={x}
                          y2={92}
                          stroke="black"
                          strokeWidth="1"
                        />
                      </Svg>
                    ) : null
                  }
                  bezier
                  style={{
                    borderRadius: 30,
                    backgroundColor: '#EDEDED',
                    paddingTop: 25,
                    paddingBottom: 30,
                    marginTop: -15,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Dashboard */}
            <Text style={styles.sectionTitle}>Earnings Dashboard</Text>
            {renderDashboardItems()}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => router.push('/recentactivity')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={renderActivityItem}
      />
    </View>
  );
};

export default EarningsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginRight: 150 },
  userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  greeting: { fontSize: 16, color: '#000' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  balanceContainer: {
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    height: 183,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIconContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  balanceInfo: { flex: 1, marginTop: 20 },
  balanceTitle: { color: '#FFF', fontSize: 14 },
  balanceAmount: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  powerstoneContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  powerstoneText: {
    color: '#FFF',
    fontSize: 14,
  },
  powerstoneAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  powerstoneAmount: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 5,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButtons: { flexDirection: 'column', marginRight: 20 },
  button: {
    backgroundColor: '#E0E0E0',
    height: 80,
    width: 150,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: '#E0E0E0',
  },
  cashOutButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 7,
  },
  earningsOverview: {
    flex: 1,
    alignItems: 'center',

    borderRadius: 30,
    padding: 15,
    paddingHorizontal: -20,
    position: 'relative',
  },
  chartTitleContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  dashboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dashboardItem: {
    width: '48%',
    backgroundColor: '#F3F3F3',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  dashboardIcon: {
    marginBottom: 10,
  },
  dashboardTextContainer: {
    width: '100%',
  },
  dashboardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  dashboardSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#EDEDED',
    borderRadius: 30,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B3B3B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityText: {
    flex: 1,
    marginLeft: 15,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: '#000000',
  },
});
