import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

const adUnitId = Platform.select({
  android: 'ca-app-pub-3940256099942544/5224354917', // Android 测试 ID
  ios: 'ca-app-pub-3940256099942544/1712485313', // iOS 测试 ID
}) as string;

// const adUnitId = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

const RewardedAdScreen = () => {
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const unsubscribeLoaded = rewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setLoaded(true);
        }
      );
      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log('User earned reward of ', reward);
        }
      );

      // Start loading the rewarded ad straight away
      rewarded.load();

      // Unsubscribe from events on unmount
      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
      };
    }, [])
  );

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        title="Show Rewarded Ad"
        onPress={() => {
          rewarded.show();
        }}
      />
    </SafeAreaView>
  );
};

export default RewardedAdScreen;
