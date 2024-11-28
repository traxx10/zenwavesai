import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faGlobe,
  faFileAlt,
  faCog,
  faBell,
  faInfoCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

interface UserInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

export default function AccountScreen() {
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] =
    useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.log('Error getting userId from AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`);
      const data = await response.json();
      setUserInfo(data.user_info);
    } catch (error) {
      console.log('Error fetching user info:', error);
    }
  };

  const handleAvatarUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'You need to allow access to your photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const formData = new FormData();
      formData.append('avatar', {
        uri: result.assets[0].uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any);

      try {
        const response = await fetch(`${BASE_URL}/update-avatar/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
        const data = await response.json();

        if (data.avatar_url) {
          Alert.alert('Success', 'Avatar updated successfully!');
          fetchUserInfo();
        }
      } catch (error) {
        console.log('Error uploading avatar:', error);
        Alert.alert('Error', 'Failed to update avatar. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            router.replace('/onboarding');
          } catch (error) {
            console.log('Error during logout:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <>
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BackIcon width={24} height={24} fill="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Account</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleAvatarUpload}>
            <Image
              source={{
                uri: userInfo?.avatar_url || 'https://example.com/avatar.jpg',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.profileName}>
            {userInfo
              ? `${userInfo.first_name} ${userInfo.last_name}`
              : 'Loading...'}
          </Text>
          {userInfo?.email && (
            <Text style={styles.profileEmail}>{userInfo.email}</Text>
          )}
          {userInfo?.phone && (
            <Text style={styles.profilePhone}>Phone: {userInfo.phone}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <View style={styles.menuItem}>
            <FontAwesomeIcon icon={faUser} size={20} color="#BABABA" />
            <Text style={styles.menuText}>Personal information</Text>
          </View>
          <View style={styles.menuItem}>
            <FontAwesomeIcon icon={faGlobe} size={20} color="#BABABA" />
            <Text style={styles.menuText}>Language</Text>
            <Text style={styles.languageText}>English (US)</Text>
          </View>
          <View style={styles.menuItem}>
            <FontAwesomeIcon icon={faFileAlt} size={20} color="#BABABA" />
            <Text style={styles.menuText}>Privacy Policy</Text>
          </View>
          <View style={styles.menuItem}>
            <FontAwesomeIcon icon={faCog} size={20} color="#BABABA" />
            <Text style={styles.menuText}>Setting</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.menuItem}>
            <FontAwesomeIcon icon={faBell} size={20} color="#BABABA" />
            <Text style={styles.menuText}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              thumbColor={pushNotifications ? '#34C759' : '#f4f3f4'}
            />
          </View>
          <View style={styles.menuItem}>
            <FontAwesomeIcon icon={faBell} size={20} color="#BABABA" />
            <Text style={styles.menuText}>Promotional Notifications</Text>
            <Switch
              value={promotionalNotifications}
              onValueChange={setPromotionalNotifications}
              thumbColor={promotionalNotifications ? '#34C759' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.menuItem}>
            <FontAwesomeIcon icon={faInfoCircle} size={20} color="#BABABA" />
            <Text style={styles.menuText}>Help Center</Text>
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} size={20} color="red" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  profilePhone: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  languageText: {
    fontSize: 16,
    color: '#888',
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
  },
});
