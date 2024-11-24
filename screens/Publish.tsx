import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

const API_URL = 'http://127.0.0.1:8000';

interface PublishParams {
  cover_url: string;
  description: string;
  draft_list_id: string;
  playlist?: string;
  playlistId?: string;
  title?: string;
  userId: string;
}

export default function PublishScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as unknown as PublishParams;
  
  console.log('🟣 Publish页面接收到的原始参数:', params);
  
  const [processedParams, setProcessedParams] = useState<PublishParams>({
    cover_url: params.cover_url || '',
    description: params.description || '',
    draft_list_id: params.draft_list_id,
    playlistId: params.playlistId || '',
    title: params.title || '',
    userId: params.userId || '',
  });
  
  console.log('🟣 Publish页面处理后的参数:', processedParams);
  
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleMergeAndPublish = async () => {
    if (!params.userId || !params.draft_list_id) {
      Alert.alert('错误', '缺少必要参数');
      return;
    }

    try {
      setIsLoading(true);
      const mergeResponse = await fetch(
        `${API_URL}/merge-draft-music/${params.draft_list_id}/${params.userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!mergeResponse.ok) {
        throw new Error('合并音乐失败');
      }

      const mergeResult = await mergeResponse.json();
      
      if (mergeResult.status === 'success') {
        setDownloadUrl(mergeResult.data.output_url);
        
        if (params.playlistId) {
          const playlistResponse = await fetch(
            `${API_URL}/playlist-items/${params.playlistId}/${params.draft_list_id}/text`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );

          if (!playlistResponse.ok) {
            console.error('添加到播放列表失败');
          }
        }

        Alert.alert('成功', '音频合成完成！', [
          {
            text: '确定',
            onPress: () => router.push('/profile')
          }
        ]);
      } else {
        throw new Error(mergeResult.message || '合并音乐失败');
      }

    } catch (error) {
      console.error('发布失败:', error);
      Alert.alert('错误', '发布失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!downloadUrl) {
        setIsLoading(true);
        console.log('正在合成音频...');
        
        if (!params.draft_list_id || !params.userId) {
          throw new Error('缺少必要参数：draft_list_id 或 userId');
        }

        const response = await fetch(
          `${API_URL}/merge-draft-music/${params.draft_list_id}/${params.userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error(`合成请求失败: ${response.status}`);
        }

        const result = await response.json();
        console.log('合成结果:', result);

        if (result.status === 'success' && result.data?.output_url) {
          setDownloadUrl(result.data.output_url);
          console.log('获取到下载链接:', result.data.output_url);
          
          const musicDir = `${FileSystem.documentDirectory}Music/`;
          await FileSystem.makeDirectoryAsync(musicDir, { intermediates: true });
          
          const filename = `zenwave_${Date.now()}.mp3`;
          const downloadPath = `${musicDir}${filename}`;
          
          console.log('下载路径:', downloadPath);

          const downloadResult = await FileSystem.downloadAsync(
            result.data.output_url,
            downloadPath
          );

          if (downloadResult.status === 200) {
            Alert.alert('成功', '音乐已保存到应用目录\n路径: Music/' + filename, [
              {
                text: '确定',
                onPress: () => router.push('/profile')
              }
            ]);
          } else {
            throw new Error(`下载失败: status ${downloadResult.status}`);
          }
        } else {
          throw new Error('未获取到有效的下载链接');
        }
      } else {
        const musicDir = `${FileSystem.documentDirectory}Music/`;
        await FileSystem.makeDirectoryAsync(musicDir, { intermediates: true });
        
        const filename = `zenwave_${Date.now()}.mp3`;
        const downloadPath = `${musicDir}${filename}`;
        
        console.log('使用现有下载链接:', downloadUrl);
        console.log('下载路径:', downloadPath);

        const downloadResult = await FileSystem.downloadAsync(
          downloadUrl,
          downloadPath
        );

        if (downloadResult.status === 200) {
          Alert.alert('成功', '音乐已保存到应用目录\n路径: Music/' + filename, [
            {
              text: '确定',
              onPress: () => router.push('/profile')
            }
          ]);
        } else {
          throw new Error(`下载失败: status ${downloadResult.status}`);
        }
      }
    } catch (error) {
      console.error('详细错误信息:', error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.publishButton, isLoading && styles.disabledButton]}
          onPress={handleMergeAndPublish}
          disabled={isLoading}
        >
          <Text style={styles.publishText}>
            {isLoading ? 'Processing...' : 'Publish'}
          </Text>
        </TouchableOpacity>
        
        <Image
          source={{ uri: params.cover_url }}
          style={styles.image}
          defaultSource={require('../assets/images/cover.png')}
        />
        
        <Text style={styles.description}>{params.description}</Text>
        
        <TouchableOpacity 
          style={[styles.downloadButton, isLoading && styles.disabledButton]}
          onPress={handleDownload}
          disabled={isLoading}
        >
          <Text style={styles.downloadText}>
            {isLoading ? 'Processing...' : 'Download'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.draftsButton}
          onPress={() => router.push({
            pathname: '/collaboratefriends',
            params: { draft_list_id: params.draft_list_id }
          })}
        >
          <Text style={styles.draftsText}>Invite Friends to Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSpacer} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -70,
    
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#fff',
  },
  publishButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 234,
    height: 310,
    borderRadius: 10,
    marginTop: 80,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 20,
  },
  draftsButton: {
    width: '80%',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  draftsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    position: 'absolute',
    bottom: -10,
    width: '100%',
    height: 50, // Adjust the height of the bottom spacer as needed
    backgroundColor: '#000',
  },
  disabledButton: {
    opacity: 0.5,
  },
  downloadButton: {
    width: '80%',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  downloadText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
