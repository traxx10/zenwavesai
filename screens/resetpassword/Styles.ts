
import { fonts } from '@/hooks/useCacheResources'
import { StyleSheet } from 'react-native'

export const style = StyleSheet.create({
    errorText: {
        color: 'red', // 添加错误文本的颜色
        fontSize: 14, // 添加错误文本的字体大小
        textAlign: 'center', // 添加错误文本的对齐方式
  },

  welcomeBackBtn: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: fonts.Poppins.semibold,
    color: '#000',
  },
  innerWrap: {
    flexGrow: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  fieldTitle: {
    color: '#000',
    fontSize: 14,
    fontFamily: fonts.Poppins.medium,
  },
  inputField: {
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  mainWrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
