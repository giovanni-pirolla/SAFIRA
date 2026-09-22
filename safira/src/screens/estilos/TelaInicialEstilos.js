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
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#E9F1FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 75,
    height: 75,
  },
  notificationButton: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 25,
    height: 25,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.055,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F6FED',
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 22,
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
  badgeNormal: {
    backgroundColor: '#E4F6EA',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeAtencao: {
    backgroundColor: '#FDEFDD',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeTextNormal: {
    fontSize: 10,
    color: '#2FAE5C',
    fontWeight: '600',
  },
  badgeTextAtencao: {
    fontSize: 10,
    color: '#E58A1F',
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
  barFillNormal: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2F6FED',
  },
  barFillAtencao: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#F2A93B',
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
  adjustButton: {
    width: '100%',
    backgroundColor: '#F2A93B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: '#2F6FED',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
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
  },
  bottomText: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  bottomTextActive: {
    color: '#2F6FED',
    fontWeight: 'bold',
  },
});

export default styles;