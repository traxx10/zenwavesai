import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import { Tabs, useRouter } from 'expo-router';

// Import SVG Icons
import FeedIcon from '../../assets/icons/feed.svg';
import FeedIconClick from '../../assets/icons/feed_click.svg';
import ConnectIcon from '../../assets/icons/connect.svg';
import ConnectIconClick from '../../assets/icons/connect_click.svg';
import DiscoverIcon from '../../assets/icons/discover.svg';
import DiscoverIconClick from '../../assets/icons/discover_click.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import ProfileIconClick from '../../assets/icons/profile_click.svg';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export default function AppLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'transparent',
            height: isSmallDevice ? 80 : 90,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 25,
            paddingVertical: isSmallDevice ? 10 : 15,
            elevation: 10,
          },
          tabBarBackground: () => (
            <ImageBackground
              source={require('../../assets/images/bar.png')}
              style={styles.tabBarBackground}
            />
          ),
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            marginTop: 5,
            fontSize: isSmallDevice ? 12 : 14,
            marginBottom: -10,
          },
          tabBarIconStyle: {
            marginBottom: -10,
          },
          tabBarIcon: ({ focused }) => {
            let IconComponent;
            switch (route.name) {
              case 'feed':
                IconComponent = focused ? (
                  <FeedIconClick width={26} height={26} />
                ) : (
                  <FeedIcon width={26} height={26} />
                );
                break;
              case 'connect':
                IconComponent = focused ? (
                  <ConnectIconClick width={26} height={26} />
                ) : (
                  <ConnectIcon width={26} height={26} />
                );
                break;
              case 'discover':
                IconComponent = focused ? (
                  <DiscoverIconClick width={26} height={26} />
                ) : (
                  <DiscoverIcon width={26} height={26} />
                );
                break;
              case 'profile':
                IconComponent = focused ? (
                  <ProfileIconClick width={26} height={26} />
                ) : (
                  <ProfileIcon width={26} height={26} />
                );
                break;
              default:
                IconComponent = null;
            }
            return IconComponent;
          },
        })}
      >
        <Tabs.Screen
          name="feed"
          options={{
            tabBarLabel: 'Feed',
            tabBarItemStyle: { marginLeft: -25 }, // Adjusted to move left
          }}
        />
        <Tabs.Screen
          name="connect"
          options={{
            tabBarLabel: 'Connect',
            tabBarItemStyle: { marginLeft: -45 }, // Adjusted to move left
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            tabBarLabel: 'Discover',
            tabBarItemStyle: { marginRight: -45 }, // Adjusted to move right
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: 'Profile',
            tabBarItemStyle: { marginRight: -25 }, // Adjusted to move right
          }}
        />
      </Tabs>
      <CustomCenterButton />
    </View>
  );
}

// Custom Center Button
function CustomCenterButton() {
  const router = useRouter();

  return (
    <View style={styles.centerButtonContainer}>
      <TouchableOpacity onPress={() => router.push('/upload')}>
        <Image
          source={require('../../assets/images/upload.png')}
          style={styles.centerButtonIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: -65,
  },
  tabBarBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  centerButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 60,
    alignSelf: 'center',
    zIndex: 10,
  },
  centerButtonIcon: {
    width: isSmallDevice ? 55 : 65,
    height: isSmallDevice ? 55 : 65,
  },
});
