import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // 立即跳转到 feed 页面
    navigation.navigate('onboarding' as never);
  }, [navigation]);

  return <View />; // 不显示任何内容
}
