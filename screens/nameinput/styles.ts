
import { fonts } from '@/hooks/useCacheResources';
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  innerWrap: {
    flexGrow: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,

  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: fonts.Poppins.semibold,
    color: 'black',
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
  errorText: {
    color: 'red',
    fontSize: 15,
    marginTop: 5,
    paddingHorizontal: 5,
  },
});
