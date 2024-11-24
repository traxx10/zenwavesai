import React from 'react';
import { EyeIcon, EyeOffIcon, LockIcon } from '@/assets/svgs';
import { fonts } from '@/hooks/useCacheResources';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

const PasswordField = ({ value, onChangeText, secureTextEntry = true, toggleEye = () => {} }: any) => {
  return (
    <View style={styles.wrap}>
      <TextInput
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter your password"
        placeholderTextColor="#6A7F84"
      />
      <View style={styles.iconContainer}>
        <LockIcon width={20} height={20} />
        <Pressable onPress={toggleEye}>
          {secureTextEntry ? <EyeIcon width={20} height={20} /> : <EyeOffIcon width={20} height={20} />}
        </Pressable>
      </View>
    </View>
  );
};

export default PasswordField;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  input: {
    fontSize: 16,
    flex: 1,
    letterSpacing: 1,
    color: '#000',
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 15,
    fontFamily: fonts.Poppins.regular,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
  },
});
