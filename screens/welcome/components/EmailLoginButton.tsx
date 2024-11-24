import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { fonts } from '@/hooks/useCacheResources';
import EmailIcon from '@/assets/icons/Email.svg';  // 确保 EmailIcon 是一个有效的 React 组件

interface EmailLoginButtonProps {
  handleClick: () => void;
}

export const EmailLoginButton: React.FC<EmailLoginButtonProps> = ({ handleClick }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleClick} style={styles.emailBtn}>
      <LinearGradient
        colors={['#5F5F5F', '#BEBEBE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.emailGradient}
      >
        <View style={styles.iconTextWrapper}>
          {/* 确保 EmailIcon 不包含任何文本元素 */}
          <EmailIcon width={20} height={20} />
          {/* 将文本放入 <Text> 组件中 */}
          <Text style={styles.emailLoginText}>Login with Email</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  emailBtn: {
    width: '88%',
    alignSelf: 'center',
  },
  emailGradient: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: 'center',
  },
  iconTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailLoginText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fonts.Poppins.medium,
  },
});
