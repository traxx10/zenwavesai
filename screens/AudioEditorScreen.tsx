import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Player, Recorder } from '@react-native-community/audio-toolkit';

export default function AudioEditorScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<Recorder | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  const startRecording = () => {
    const newRecorder = new Recorder('test.mp4').prepare((err, fsPath) => {
      if (err) {
        console.error('录音准备失败:', err);
        return;
      }
      
      newRecorder.record((err) => {
        if (err) {
          console.error('录音失败:', err);
        } else {
          setIsRecording(true);
          setRecorder(newRecorder);
        }
      });
    });
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop((err) => {
        if (err) {
          console.error('停止录音失败:', err);
        } else {
          setIsRecording(false);
          Alert.alert('成功', '录音已完成');
        }
      });
    }
  };

  const playRecording = () => {
    const newPlayer = new Player('test.mp4').prepare((err) => {
      if (err) {
        console.error('播放准备失败:', err);
        return;
      }
      
      newPlayer.play((err) => {
        if (err) {
          console.error('播放失败:', err);
        }
      });
      
      setPlayer(newPlayer);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? '停止录音' : '开始录音'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { marginTop: 20 }]}
        onPress={playRecording}
      >
        <Text style={styles.buttonText}>播放录音</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});