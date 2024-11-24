import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import BackIcon from '../assets/icons/back.svg'; // 引入自定义SVG图标

const categories = [
  { id: '1', name: 'Meditation', image: require('../assets/images/meditation.png') },
  { id: '2', name: 'Psychedelic', image: require('../assets/images/psychedelic.png') },
  { id: '3', name: 'Brainwave', image: require('../assets/images/brainwave.png') },
  { id: '4', name: 'White Noise', image: require('../assets/images/white_noise.png') },
  { id: '5', name: 'Sleep', image: require('../assets/images/sleep.png') },
  { id: '6', name: 'Relaxation', image: require('../assets/images/relaxation.png') },
  { id: '7', name: 'Pet', image: require('../assets/images/pet.png') },
  { id: '8', name: 'Baby', image: require('../assets/images/baby.png') },
  { id: '9', name: 'Focus', image: require('../assets/images/focus.png') },
  { id: '10', name: 'Custom', image: require('../assets/images/custom.png') },
];

export default function UploadScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={styles.categoryContainer}
      onPress={() => router.push({
        pathname: "/aicreateorupload",
        params: { category: item.name }
      })}
    >
      <Image source={item.image} style={styles.categoryImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button and Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} fill="#000" /> 
        </TouchableOpacity>
        <Text style={styles.header}>Create Your Functional Music</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
    zIndex: 1, // 确保按钮在顶部
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    flex: 1,
    marginLeft: -24,
  },
  row: {
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: 150,
  },
  categoryContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    resizeMode: 'cover',
  },
});
