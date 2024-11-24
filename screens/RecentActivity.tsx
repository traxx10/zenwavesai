import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import HandleIcon from '@/assets/icons/goup.svg';

const RecentActivityScreen = () => {
  const router = useRouter();

  const recentActivities = [
    { id: '1', name: 'Track Earnings', date: 'Today, 4:30 PM', amount: '+$15.00' },
    { id: '2', name: 'Your Track', date: 'Today, 4:30 PM', amount: '+$32.00' },
    { id: '3', name: 'Track Revenue', date: 'Today, 4:30 PM', amount: '+$120.00' },
    { id: '4', name: 'Music Royalties', date: 'Today, 4:30 PM', amount: '+$300.00' },
    { id: '5', name: 'Stream Income', date: 'Today, 4:30 PM', amount: '+$10.00' },
    { id: '6', name: 'Salary January', date: 'Today, 4:30 PM', amount: '+$250.00' },
    { id: '7', name: 'Top Up', date: 'Today, 4:30 PM', amount: '+$250.00' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Total Revenue Section */}
      <View style={styles.revenueContainer}>
        <Text style={styles.revenueTitle}>Total Balance</Text>
        <Text style={styles.revenueAmount}>$ 650.00</Text>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.recentActivityContainer}>
        <View style={styles.handleContainer}>
          <HandleIcon width={22} height={22} />
        </View>
        <Text style={styles.sectionTitle}>Recent Transaction</Text>
        <FlatList
          data={recentActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="musical-notes-outline" size={24} color="#000" />
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.activityDate}>{item.date}</Text>
              </View>
              <Text style={styles.activityAmount}>{item.amount}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
};

export default RecentActivityScreen;

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
    color: '#000',
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
});
