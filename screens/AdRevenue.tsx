import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import AdIcon from '@/assets/icons/ad.svg';
import HandleIcon from '@/assets/icons/goup.svg';
import BackIcon from '@/assets/icons/back.svg';
import Ionicons from '@expo/vector-icons/Ionicons';
const AdRevenueScreen = () => {
  const router = useRouter();

  // Updated list of recent activities for Ad Revenue
  const recentActivities = [
    { id: '1', name: 'Ad Playback', date: 'Today, 4:30 PM', amount: '15.00' },
    { id: '2', name: 'Ad Playback', date: 'Today, 4:30 PM', amount: '32.00' },
    { id: '6', name: 'Salary January', date: 'Today, 4:30 PM', amount: '250.00' },
    { id: '7', name: 'Top Up', date: 'Today, 4:30 PM', amount: '250.00' },
  ];

  const HeaderComponent = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ad Revenue Share</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.revenueContainer}>
        <Text style={styles.revenueTitle}>Total Ad Revenue</Text>
        <Text style={styles.revenueAmount}>$ 650.00</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <FlatList
        data={[]}
        renderItem={({ item }) => null}
        ListHeaderComponent={HeaderComponent}
        ListFooterComponent={
          <View style={styles.recentActivityContainer}>
            <View style={styles.handleContainer}>
              <HandleIcon width={22} height={22} />
            </View>
            <Text style={styles.sectionTitle}>Recent Ad Earnings</Text>
            {recentActivities.map(item => (
              <View key={item.id} style={styles.activityItem}>
                <View style={styles.iconContainer}>
                  <AdIcon width={24} height={24} />
                </View>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityName}>{item.name}</Text>
                  <Text style={styles.activityDate}>{item.date}</Text>
                </View>
                <Text style={styles.activityAmount}>
                  ${item.amount}
                </Text>
              </View>
            ))}
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AdRevenueScreen;

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
    marginVertical: 60,
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
  },
  recentActivityContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 0,
    minHeight: '100%',
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
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  iconContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
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
    color: '#888',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  handleContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  listContent: {
    flexGrow: 1,
  },
});
