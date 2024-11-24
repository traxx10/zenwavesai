import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import ListenerIcon from '../assets/icons/listener.svg';
import FollowerIcon from '../assets/icons/follower.svg';

const PromotionGoalsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const musicId = params.musicId as string;
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  console.log('PromotionGoals received params:', params);
  console.log('PromotionGoals musicId:', musicId);

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleNext = () => {
    if (selectedGoal && musicId) {
      console.log('Navigating to campaign with:', { goal: selectedGoal, musicId });
      router.push({
        pathname: '/promotioncampaign',
        params: { 
          goal: selectedGoal,
          musicId: musicId
        }
      });
    } else {
      console.error('Missing required params:', { selectedGoal, musicId });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promotion Goals</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Question Section */}
      <Text style={styles.question}>What is your objective?</Text>

      {/* Goal Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedGoal === 'listeners' && styles.selectedCard,
          ]}
          onPress={() => handleSelectGoal('listeners')}
        >
          <View style={styles.iconContainer}>
            <ListenerIcon width={24} height={24} />
          </View>
          <View>
            <Text style={styles.optionTitle}>Attract more listeners</Text>
            <Text style={styles.optionSubtitle}>to increase your streams</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedGoal === 'followers' && styles.selectedCard,
          ]}
          onPress={() => handleSelectGoal('followers')}
        >
          <View style={styles.iconContainer}>
            <FollowerIcon width={24} height={24} />
          </View>
          <View>
            <Text style={styles.optionTitle}>Gain more followers</Text>
            <Text style={styles.optionSubtitle}>and expand your fanbase</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, selectedGoal ? {} : styles.disabledButton]}
        onPress={handleNext}
        disabled={!selectedGoal}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PromotionGoalsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  },
  optionsContainer: {
    flex: 1,
    marginTop: 30,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#666666',
    backgroundColor: '#F0F0F0',
  },
  iconContainer: {
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
