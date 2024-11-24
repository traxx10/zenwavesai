import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Button, View, StyleSheet, Alert, Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const adUnitId = Platform.select({
  android: 'ca-app-pub-3940256099942544/5224354917', // Android 测试 ID
  ios: 'ca-app-pub-3940256099942544/1712485313', // iOS 测试 ID
}) as string;

// const rewarded = RewardedAd.createForAdRequest(adUnitId as string);
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

export default function RewardedAdScreen() {
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const unsubscribeLoaded = rewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setLoaded(true);
          console.log('广告加载完成');
        }
      );

      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log('获得奖励:', reward);
          Alert.alert('恭喜', '你获得了奖励!', [
            {
              text: '确定',
              onPress: () => {
                router.back();
              },
            },
          ]);
          // Alert.alert('恭喜', '你获得了奖励!');
        }
      );

      // 直接开始加载广告
      rewarded.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        setLoaded(false);
      };
    }, [])
  );

  // 如果广告未加载完成，不显示按钮
  if (!loaded) {
    return (
      <View style={styles.container}>
        <Button title="广告加载中..." disabled={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="观看广告"
        onPress={() => {
          rewarded.show();
        }}
      />

      {/* <Button
        title="Show Rewarded Ad"
        onPress={() => {
          rewarded.show().catch((error) => {
            console.log('Rewarded ad failed to show: ', error);
          });
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
