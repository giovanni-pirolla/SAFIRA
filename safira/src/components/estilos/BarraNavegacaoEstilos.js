
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },

  bottomItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  bottomText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A8A8A',
    marginTop: 3,
  },

  bottomTextActive: {
    color: '#2F6FED',
    fontWeight: 'bold',
  },

  dispositivoIcone: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
