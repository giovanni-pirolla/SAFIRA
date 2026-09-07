import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1B1B1B',
  },
  headerLogo: {
    width: 100,
    height: 30,
  },
  helpButton: {
    padding: 5,
  },
  helpIcon: {
    width: 24,
    height: 24,
    tintColor: '#1B1B1B',
  },

  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#2F6FED',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5A5A5A',
  },
  progressTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#5A5A5A',
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },

  infoBox: {
    backgroundColor: '#E6EEFC', // Fundo azul claro
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#2F6FED', // Cor azul para o texto
    lineHeight: 20,
  },

  limitSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  limitIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#1B1B1B',
  },
  limitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  limitBarContainer: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  limitBarSegment: {
    flex: 1,
    height: '100%',
  },
  limitBarComfort: {
    backgroundColor: '#8BC34A', // Verde
  },
  limitBarAttention: {
    backgroundColor: '#FFC107', // Amarelo
  },
  limitBarDiscomfort: {
    backgroundColor: '#F44336', // Vermelho
  },
  limitLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitLabelItem: {
    flex: 1,
    alignItems: 'center',
  },
  limitLabelText: {
    fontSize: 12,
    color: '#5A5A5A',
    textAlign: 'center',
  },
  limitLabelValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B1B1B',
    textAlign: 'center',
  },

  readyBox: {
    backgroundColor: '#E8F5E9', // Fundo verde claro
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  readyIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#4CAF50', // Verde
  },
  readyText: {
    flex: 1,
    fontSize: 14,
    color: '#4CAF50', // Verde
    lineHeight: 20,
  },
  readyTextBold: {
    fontWeight: 'bold',
  },

  saveButton: {
    backgroundColor: '#2F6FED',
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  retakeButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5A5A5A',
  },

  progressBottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBottomBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBottomFill: {
    width: '100%', // Para a barra ficar inteiramente azul
    height: '100%',
    backgroundColor: '#2F6FED',
    borderRadius: 3,
  },
  progressBottomText: {
    fontSize: 13,
    color: '#5A5A5A',
  },
});

export default styles;