import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /* Ondas do topo */
  ondaTopoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    overflow: 'hidden',
  },
  ondaTopoCamada1: {
    position: 'absolute',
    top: -60,
    left: -width * 0.2,
    width: width * 1.4,
    height: 160,
    backgroundColor: '#E6EEFC',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width * 0.6,
    transform: [{ rotate: '-4deg' }],
  },
  ondaTopoCamada2: {
    position: 'absolute',
    top: -80,
    left: -width * 0.3,
    width: width * 1.5,
    height: 150,
    backgroundColor: '#D6E4FB',
    borderBottomLeftRadius: width * 0.8,
    borderBottomRightRadius: width,
    transform: [{ rotate: '3deg' }],
  },

  /* Conteúdo central */
  conteudoCentral: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 18,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B1B1B',
    letterSpacing: 1,
    marginBottom: 14,
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C9DBFA',
    marginHorizontal: 4,
  },
  dotAtivo: {
    backgroundColor: '#2F6FED',
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  /* Ondas do rodapé */
  ondaBaseWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 170,
    overflow: 'hidden',
  },
  ondaBaseCamada1: {
    position: 'absolute',
    bottom: -60,
    left: -width * 0.3,
    width: width * 1.5,
    height: 160,
    backgroundColor: '#E6EEFC',
    borderTopLeftRadius: width * 0.7,
    borderTopRightRadius: width,
    transform: [{ rotate: '4deg' }],
  },
  ondaBaseCamada2: {
    position: 'absolute',
    bottom: -80,
    left: -width * 0.2,
    width: width * 1.4,
    height: 150,
    backgroundColor: '#D6E4FB',
    borderTopLeftRadius: width,
    borderTopRightRadius: width * 0.6,
    transform: [{ rotate: '-3deg' }],
  },
});

export default styles;