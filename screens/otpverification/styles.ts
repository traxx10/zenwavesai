
import { fonts } from '@/hooks/useCacheResources';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  welcomeBackBtn: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: fonts.Poppins.semibold,
    color: 'black',
  },
  innerWrap: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldTitle: {
    color: 'black',
    fontSize: 14,
    fontFamily: fonts.Poppins.medium,
  },
  rowDontHaveAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dontHaveAccount: {
    color: 'black',
    fontSize: 14,
    fontFamily: fonts.Poppins.regular,
  },
  signupBtnText: {
    fontSize: 14,
    color: '#6A7F84',
    fontFamily: fonts.Poppins.medium,
  },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 48, // Adjust width for six digits
    height: 56,
    lineHeight: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    color: 'black',
    fontSize: 24,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  focusCell: {
    width: 48, // Keep consistent with cell width
    height: 56,
    color: 'black',
    textAlignVertical: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: '#F5F5F5',
  },
  mainWrap: {
    flex: 1,
    backgroundColor: '#fff', // 你可以根据需要调整背景颜色
  },
});
