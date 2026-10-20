import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e2edff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    left: 4.5,
    width: 130,
    height: 130,
  },
  notificationButton: {
    width: 55,
    height: 55,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '2px 5px 5px rgba(0, 0, 0, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.055,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardConteudo: {
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Ícone do sol
  solContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solCentro: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F2A93B',
  },
  solRaioWrapper: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
  },
  solRaio: {
    width: 2.5,
    height: 6,
    borderRadius: 2,
    backgroundColor: '#F2A93B',
  },

  // Ícone de ondas sonoras
  somContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  somBarra: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 1.5,
    backgroundColor: '#1F3C88',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B1B1B',
  },
  badgeConfortavel: {
    backgroundColor: '#e0eaf8',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeAtencao: {
    backgroundColor: '#FDF3D0',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeAlerta: {
    backgroundColor: '#FDE4E4',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeTextConfortavel: {
    fontSize: 10,
    color: '#1E3A8A', // verde
    fontWeight: '600',
  },
  badgeTextAtencao: {
    fontSize: 10,
    color: '#D9A400', // amarelo
    fontWeight: '600',
  },
  badgeTextAlerta: {
    fontSize: 10,
    color: '#E44B4B', // vermelho
    fontWeight: '600',
  },
  cardValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 8,
  },
  cardUnidade: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8A8A8A',
  },
  barBackground: {
    width: '100%',
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EDEDED',
    overflow: 'hidden',
  },
  barFillConfortavel: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2F6FED', // azul
  },
  barFillAtencao: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#F2A93B', // amarelo
  },
  barFillAlerta: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#E44B4B', // vermelho
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  barLabelText: {
    fontSize: 10,
    color: '#B5B5B5',
  },
  buttonIcon: {
    marginRight: 8,
  },
  adjustButton: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F2A93B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 9,
  },
  adjustButtonText: {
    color: '#1B1B1B',
    fontSize: 13,
    fontWeight: 'bold',
  },
  historyButton: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 2.5,
    borderColor: '#2F6FED',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  historyButtonText: {
    color: '#2F6FED',
    fontSize: 13,
    fontWeight: 'bold',
  },
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