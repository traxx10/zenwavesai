import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import SubrightIcon from '../assets/icons/subright.svg';
import BackIcon from '../assets/icons/back.svg';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ITEM_WIDTH = width * 0.8;
const ITEM_MARGIN = 10;

const plans = {
  monthly: [
    {
      id: '1',
      title: 'Basic Plan',
      price: '$11.99/month',
      features: [
        {
          title: 'Ad-Free Listening',
          description: 'Enjoy uninterrupted music with zero ads.'
        },
        {
          title: 'Unlimited Music Streaming',
          description: 'Access the full ZenWaves library, including meditation, sleep, focus, and relaxation tracks.'
        },
        {
          title: 'Exclusive Tracks',
          description: 'Unlock new exclusive music updated monthly.'
        }
      ],
    },
    {
      id: '2',
      title: 'Premium Plan',
      price: '$19.99/month',
      features: [
        {
          title: 'Includes all features of the Basic Plan',
        
        },
        {
          title: 'Monthly 100 PowerStones',
          description: 'Use PowerStones to generate or edit personalized music, support creators, and unlock exclusive content.'
        },
        {
          title: 'Priority Access',
          description: 'Get early access to newly released tracks and upcoming platform features.'
        },
        {
          title: 'Special Perks',
          description: 'Enjoy exclusive access to ZenWaves community events and collaborations.'
        }
      ],
    },
  ],
  annually: [
    {
      id: '1',
      title: 'Basic Plan',
      price: '$119.99/year',
      features: [
        {
            title: 'Ad-Free Listening',
            description: 'Enjoy uninterrupted music with zero ads.'
          },
          {
            title: 'Unlimited Music Streaming',
            description: 'Access the full ZenWaves library, including meditation, sleep, focus, and relaxation tracks.'
          },
          {
            title: 'Exclusive Tracks',
            description: 'Unlock new exclusive music updated monthly.'
          }
      ],
    },
    {
      id: '2',
      title: 'Premium Plan',
      price: '$199.99/year',
      features: [
        {
            title: 'Includes all features of the Basic Plan',
          
          },
          {
            title: 'Monthly 100 PowerStones',
            description: 'Use PowerStones to generate or edit personalized music, support creators, and unlock exclusive content.'
          },
          {
            title: 'Priority Access',
            description: 'Get early access to newly released tracks and upcoming platform features.'
          },
          {
            title: 'Special Perks',
            description: 'Enjoy exclusive access to ZenWaves community events and collaborations.'
          }
      ],
    },
  ],
};

type PlanType = 'monthly' | 'annually';

const PlanCard = React.memo(({ item, index, scrollX }: { 
  item: any; 
  index: number; 
  scrollX: any;
}) => {
  const inputRange = [
    (index - 1) * (ITEM_WIDTH + ITEM_MARGIN * 2),
    index * (ITEM_WIDTH + ITEM_MARGIN * 2),
    (index + 1) * (ITEM_WIDTH + ITEM_MARGIN * 2),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9]);
    const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.planContainer, animatedStyle]}>
      <Text style={styles.planTitle}>{item.title}</Text>
      <Text style={styles.planPrice}>{item.price}</Text>
      <View style={styles.featuresContainer}>
        {item.features.map((feature: any, idx: number) => (
          <View key={idx} style={styles.featureItem}>
            <SubrightIcon width={18} height={18} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
});

const SubscribeScreen = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleSubscribe = async (plan: any) => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Error', 'Please login first');
        router.push('/login');
        return;
      }

      const amount = parseFloat(plan.price.replace(/[^0-9.]/g, ''));
      const duration = selectedPlan === 'monthly' ? 1 : 12;
      const subscriptionType = plan.title === 'Basic Plan' ? 'basic' : 'premium';

      // 构建查询参数
      const params = new URLSearchParams({
        subscription_type: subscriptionType,
        amount: amount.toString(),
        payment_method: 'direct',
        duration_months: duration.toString()
      });

      const apiUrl = `http://127.0.0.1:8000/user-subscription/${userId}?${params.toString()}`;
      console.log('Subscribing with URL:', apiUrl); // 调试用

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert(
          'Success',
          'Your subscription has been activated successfully!',
          [{ 
            text: 'OK', 
            onPress: () => {
              // 可以在这里更新本地存储的用户订阅状态
              AsyncStorage.setItem('subscriptionType', subscriptionType);
              router.push('/profile');
            }
          }]
        );
      } else {
        // 更详细的错误处理
        const errorMessage = result.detail || 'Failed to activate subscription';
        console.error('Subscription error:', errorMessage);
        Alert.alert(
          'Subscription Failed',
          errorMessage,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while processing your subscription. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F2F2F2']}
      locations={[0, 0.5]}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <GestureHandlerRootView style={styles.content}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Subscribe Now</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Unlock immersive sound with ZenWaves. Access a vast library of relaxing music, meditation tracks, and exclusive content for seamless, unlimited streaming.
            </Text>
          </View>

          {/* Toggle Plan Type */}
          <View style={styles.toggleWrapper}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleButtonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedPlan === 'monthly' ? styles.selectedToggle : styles.unselectedToggle,
                  ]}
                  onPress={() => setSelectedPlan('monthly')}
                >
                  <Text style={selectedPlan === 'monthly' ? styles.selectedText : styles.toggleText}>
                    Monthly
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.toggleButtonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedPlan === 'annually' ? styles.selectedToggle : styles.unselectedToggle,
                  ]}
                  onPress={() => setSelectedPlan('annually')}
                >
                  <Text style={selectedPlan === 'annually' ? styles.selectedText : styles.toggleText}>
                    Annually
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Swipable Plans */}
          <Animated.FlatList
            horizontal
            pagingEnabled
            data={plans[selectedPlan]}
            renderItem={({ item, index }) => (
              <PlanCard 
                item={item} 
                index={index} 
                scrollX={scrollX}
              />
            )}
            onScroll={scrollHandler}
            onMomentumScrollEnd={(event) => {
              const contentOffset = event.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffset / (ITEM_WIDTH + ITEM_MARGIN * 2));
              setSelectedPlanIndex(index);
            }}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            scrollEventThrottle={16}
            snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 2}
            decelerationRate="fast"
            snapToAlignment="center"
          />

          {/* Bottom Subscribe Button */}
          <TouchableOpacity 
            style={[
              styles.subscribeButton,
              isLoading && styles.subscribeButtonDisabled
            ]}
            onPress={() => handleSubscribe(plans[selectedPlan][selectedPlanIndex])}
            disabled={isLoading}
          >
            <Text style={styles.subscribeButtonText}>
              {isLoading ? 'Processing...' : 'Subscribe Now'}
            </Text>
          </TouchableOpacity>
        </GestureHandlerRootView>

        {/* Bottom Image */}
        <Image 
          source={selectedPlan === 'monthly' ? require('../assets/images/month.png') : require('../assets/images/year.png')}
          style={[
            styles.bottomImage,
            selectedPlan === 'annually' && styles.yearImage
          ]}
          resizeMode="contain"
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default SubscribeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 20,
  },
  toggleWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#737272', // 灰色背景
    borderRadius: 100,
    padding: 0,
  },
  toggleButton: {
    width: 110,
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedToggle: {
    backgroundColor: '#FFFFFF',
  },
  unselectedToggle: {
    backgroundColor: 'transparent',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
  },
  toggleText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  planContainer: {
    width: ITEM_WIDTH,
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    padding: 20,
    marginHorizontal: ITEM_MARGIN,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  planPrice: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  featuresContainer: {
    width: '100%',
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    width: '100%',
  },
  featureTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    width: 'auto',
  },
  subscribeButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  subscribeButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  bottomImage: {
    width: '100%',
    height: 556,
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    zIndex: -100,
  },
  yearImage: {
    bottom: -100,
  },
  toggleButtonWrapper: {
    backgroundColor: '#737272',
    borderRadius: 100,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
