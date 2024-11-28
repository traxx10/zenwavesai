import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackIcon from '../assets/icons/back.svg';
import { BASE_URL } from '@/utils/apis';
interface Playlist {
  id: string;
  title: string;
  cover_url: string;
  total_tracks: number;
}

const PlaylistsAllScreen = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${BASE_URL}/playlists/all`);
      const data = await response.json();
      if (data.status === 'success') {
        setPlaylists(data.data.playlists);
      } else {
        setError('Failed to load playlists');
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() =>
        router.push({
          pathname: '/playlistplayer',
          params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.cover_url }} style={styles.playlistImage} />
      <View style={styles.playlistDetails}>
        <Text style={styles.playlistTitle}>{item.title}</Text>
        <Text style={styles.playlistSongs}>{item.total_tracks} Songs</Text>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPlaylists}>
          <Text style={styles.retryText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>播放列表</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Playlists Grid */}
      <FlatList
        data={playlists}
        renderItem={renderPlaylist}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() =>
          loading ? (
            <ActivityIndicator style={styles.loader} color="#000" />
          ) : (
            <Text style={styles.emptyText}>暂无播放列表</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  listContainer: {
    paddingBottom: 20,
  },
  playlistItem: {
    flex: 1,
    margin: 8,
    maxWidth: '47%',
  },
  playlistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 15,
    marginBottom: 8,
  },
  playlistDetails: {
    paddingHorizontal: 4,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  playlistSongs: {
    fontSize: 14,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  retryText: {
    fontSize: 16,
    color: '#FFF',
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default PlaylistsAllScreen;
