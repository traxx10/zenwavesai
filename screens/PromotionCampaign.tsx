import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/apis';

// 添加类型定义
type DurationKey = '7 Days' | '30 Days' | '90 Days' | '180 Days' | '365 Days';
type PlayEstimates = {
  [key: number]: {
    [K in DurationKey]?: number;
  };
};

const PromotionCampaignScreen: React.FC = () => {
  const router = useRouter();
  const { goal, musicId } = useLocalSearchParams();

  console.log('PromotionCampaign received params:', { goal, musicId });

  // 可选金额列表
  const amounts = [20, 50, 100, 300, 900, 2700];
  const durations = ['7 Days', '30 Days', '90 Days', '180 Days', '365 Days'];
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);

  // 定义每个价格可用的天数配置
  const priceAvailableDays = {
    20: ['7 Days', '30 Days'],
    50: ['30 Days', '90 Days'],
    100: ['30 Days', '90 Days', '180 Days', '365 Days'],
    300: ['30 Days', '90 Days', '180 Days', '365 Days'],
    900: ['30 Days', '90 Days', '180 Days', '365 Days'],
    2700: ['30 Days', '90 Days', '180 Days', '365 Days'],
  };

  // 修改 playEstimates 的类型声明
  const playEstimates: PlayEstimates = {
    20: {
      '7 Days': 4083,
      '30 Days': 22500,
    },
    50: {
      '30 Days': 22500,
      '90 Days': 120000,
    },
    100: {
      '30 Days': 40000,
      '90 Days': 300000,
      '180 Days': 1200000,
      '365 Days': 3650000,
    },
    300: {
      '30 Days': 85700,
      '90 Days': 900000,
      '180 Days': 3510000,
      '365 Days': 10512000,
    },
    900: {
      '30 Days': 225000,
      '90 Days': 2880000,
      '180 Days': 9720000,
      '365 Days': 29565000,
    },
    2700: {
      '30 Days': 720000,
      '90 Days': 2880000,
      '180 Days': 9720000,
      '365 Days': 29565000,
    },
  };

  // 获取当前选中金额可用的天数
  const getAvailableDurations = () => {
    return (
      priceAvailableDays[selectedAmount as keyof typeof priceAvailableDays] ||
      []
    );
  };

  // 获取当前选择的预期播放量
  const getEstimatedPlays = () => {
    const availableDurations = getAvailableDurations();
    const selectedDurationText = availableDurations[
      selectedDuration
    ] as DurationKey;
    return playEstimates[selectedAmount]?.[selectedDurationText] || 0;
  };

  // 格式化数字显示
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setSelectedDuration(0);
  };

  const handleNext = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      const availableDurations = getAvailableDurations();
      const selectedDurationText = availableDurations[selectedDuration];
      const estimatedPlays = getEstimatedPlays();

      if (!musicId) {
        console.error('musicId is missing');
        Alert.alert('Error', 'Missing music ID');
        return;
      }

      const requestBody = {
        musicId: musicId,
        goal: goal,
        amount: selectedAmount,
        duration: selectedDurationText,
        estimated_plays: estimatedPlays,
        status: 'pending',
      };

      console.log('发送请求体:', requestBody);

      const response = await fetch(
        `${BASE_URL}/create-promotion-campaign/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log('API响应:', data);

      if (response.ok) {
        console.log(
          '准备导航到 promotioncomplete, campaignId:',
          data.data.campaign_id
        );
        router.replace({
          pathname: '/promotioncomplete' as any,
          params: {
            campaignId: data.data.campaign_id,
          },
        });
      } else {
        console.error('API错误响应:', data.detail);
        Alert.alert(
          'Error',
          data.detail || 'Failed to create promotion campaign'
        );
      }
    } catch (error) {
      console.error('完整错误信息:', error);
      console.error(
        '错误堆栈:',
        error instanceof Error ? error.stack : '无堆栈信息'
      );
      Alert.alert('Error', 'Failed to create promotion campaign');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
          <Text style={styles.headerTitle}>Promotion Campaign</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 金额选择 */}
        <Text style={styles.question}>How much would you like to spend?</Text>
        <FlatList
          key="three-column-list"
          data={amounts}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.amountList}
          columnWrapperStyle={styles.amountRow}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.amountButton,
                selectedAmount === item && styles.selectedAmountButton,
              ]}
              onPress={() => handleAmountSelect(item)}
            >
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === item && styles.selectedAmountText,
                ]}
              >
                ${item.toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* 时长选择 */}
        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>
            Select your promotion duration
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={getAvailableDurations().length - 1}
            step={1}
            value={selectedDuration}
            onValueChange={(value: number) => setSelectedDuration(value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#E5E5E5"
            thumbTintColor="#000"
          />
          <View style={styles.durationLabels}>
            {getAvailableDurations().map((duration, index) => (
              <Text key={index} style={styles.durationText}>
                {duration}
              </Text>
            ))}
          </View>
        </View>

        {/* 修改提示信息 */}
        <Text style={styles.infoText}>
          Typically, this can generate around{' '}
          {formatNumber(getEstimatedPlays())} plays.
        </Text>

        {/* 总金额和下一步按钮 */}
        <View style={styles.footer}>
          <Text style={styles.totalText}>
            Total : ${selectedAmount.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default PromotionCampaignScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    marginTop: 10,
  },
  amountList: {
    paddingVertical: 10,
  },
  amountRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  amountButton: {
    width: '30%',
    aspectRatio: 2.5,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAmountButton: {
    backgroundColor: '#000',
  },
  amountText: {
    color: '#000',
    fontSize: 16,
  },
  selectedAmountText: {
    color: '#FFF',
  },
  durationContainer: {
    marginBottom: 20,
    alignItems: 'center',
    position: 'absolute',
    top: 320,
    left: 40,
    right: 40,
    bottom: 0,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  slider: {
    width: '100%',
    height: 40,
    marginHorizontal: -10,
  },
  durationLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -5,
    paddingHorizontal: 5,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    position: 'relative',
    top: -240,
  },
  footer: {
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
