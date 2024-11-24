import React from 'react';
import { EyeIcon, EyeOffIcon, LockIcon } from '@/assets/svgs';
import { Colors } from '@/constants/Colors';
import { fonts } from '@/hooks/useCacheResources';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

const PasswordField = ({ value, onChangeText, secureTextEntry = true, toggleEye = () => {} }: any) => {
  return (
    <View style={styles.wrap}>
      <LockIcon width={20} height={20} />
      <TextInput
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter your password"
        placeholderTextColor={Colors.light.inputFieldTextColor}
      />
      <Pressable onPress={toggleEye}>
        {secureTextEntry ? <EyeIcon width={20} height={20} /> : <EyeOffIcon width={20} height={20} />}
      </Pressable>
    </View>
  );
};

export default PasswordField;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.light.inputFieldBg,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 10,
    height: '100%',
    letterSpacing: 1,
    color: Colors.light.inputFieldTextColor,
    fontFamily: fonts.Poppins.regular,
  },
});
