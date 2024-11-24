import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TopSpace } from '@/components/TopSpace';
import { GradientButton } from '@/components/GradientButton';
import { globalStyles } from '@/assets/styles/globalStyles';
import { ArrowBackIcon } from '@/assets/svgs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './styles';
import PasswordField from './PasswordField';

export const NewPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [contact, setContact] = useState(''); // 用于存储手机号

  // 从 AsyncStorage 中加载手机号
  useEffect(() => {
    const loadContact = async () => {
      const storedContact = await AsyncStorage.getItem('userInput');
      if (storedContact) {
        setContact(storedContact); // 设置手机号
        console.log('Current stored contact:', storedContact); // 控制台打印手机号
      }
    };

    loadContact();
  }, []);

  // 验证密码输入
  const validateInput = () => {
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your password.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return false;
    }

    return true;
  };

  const handleCreateNewPassword = async () => {
    if (!validateInput()) return; // 验证密码字段

    try {
      const verificationType = 'phone'; // 始终使用手机号进行验证

      if (!contact || !verificationType) {
        Alert.alert('Error', 'Missing contact information. Please try again.');
        return;
      }

      // 发送请求前去掉手机号中的 '+'
      const sanitizedContact = contact.replace('+', '');
      console.log('Sending the following contact for verification:', sanitizedContact); // 打印清理后的手机号

      const baseUrl = 'https://fftv.live/mobile/reset_password.php';
      const queryParams = new URLSearchParams({
        phone: sanitizedContact, // 始终使用手机号作为参数
        password: newPassword,
      });

      const url = `${baseUrl}?${queryParams.toString()}`;
      console.log('Constructed URL:', url); // 打印构造的 URL

      const response = await fetch(url);
      const result = await response.json();
      console.log('Server response:', result); // 打印服务器响应

      if (result.status === 'success') {
        Alert.alert('Success', 'Your password has been reset successfully.', [
          { text: 'OK', onPress: async () => {
            // 成功重置密码后删除 AsyncStorage 中的手机号
            await AsyncStorage.removeItem('userInput');
            router.push('/welcome' as any); // 跳转到欢迎页面
          }},
        ]);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={globalStyles.mainWrap}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={style.innerWrap}>
          <View>
            <TopSpace top={Platform.OS === 'ios' ? 11 : 30} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={style.welcomeBackBtn}>Create New Password</Text>
            <TopSpace top={36} />
            <Text style={globalStyles.fieldTitle}>New Password</Text>
            <TopSpace top={10} />
            <PasswordField
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />
            <TopSpace top={20} />
            <Text style={globalStyles.fieldTitle}>Confirm Password</Text>
            <PasswordField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View>
            <GradientButton btnWidth="100%" title="Create New Password" handleClick={handleCreateNewPassword} />
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = {
  errorText: {
    color: 'red',
    fontSize: 15,
    marginTop: 5,
    paddingHorizontal: 5,
  },
};

export default NewPassword;
