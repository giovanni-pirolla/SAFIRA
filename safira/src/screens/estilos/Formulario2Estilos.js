import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
    width: 90,
    height: 28,
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E6EEFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    width: 18,
    height: 18,
    tintColor: '#2F6FED',
  },

  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  progressStepActive: {
    backgroundColor: '#2F6FED',
  },
  progressText: {
    fontSize: 15,
    color: '#888888',
    fontWeight: 'bold',
  },
  progressTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#5A5A5A',
    marginHorizontal: 20,
    marginBottom: 25,
    lineHeight: 22,
  },

  infoCardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6EEFC', // Fundo azul claro para o card de informação
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  infoCardIcon: {
    width: 24,
    height: 24,
    tintColor: '#2F6FED', // Cor azul para o ícone de volume
    marginRight: 10,
    marginTop: 2,
  },
  infoCardText: {
    flex: 1,
    fontSize: 14,
    color: '#2F6FED', // Cor azul para o texto
    lineHeight: 20,
  },

  situationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  situationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 25,
    overflow: 'hidden', // Garante que a imagem respeite o borderRadius
  },
  situationImage: {
    width: '100%',
    height: 180, // Altura fixa para a imagem
    resizeMode: 'cover',
  },
  situationDetails: {
    padding: 15,
  },
  situationDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 8,
  },
  situationDetailText: {
    fontSize: 14,
    color: '#5A5A5A',
    lineHeight: 20,
    marginBottom: 10,
  },
  situationDetailSoundLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  situationDetailSoundLevelIcon: {
    width: 16,
    height: 16,
    tintColor: '#5A5A5A', // Cor para o ícone de volume pequeno
    marginRight: 5,
  },
  situationDetailSoundLevelText: {
    fontSize: 13,
    color: '#5A5A5A',
  },

  feelingQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  feelingSubQuestion: {
    fontSize: 14,
    color: '#5A5A5A',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  feelingOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que os itens quebrem a linha
    justifyContent: 'space-between', // Distribui os itens uniformemente
    marginHorizontal: 15, // Ajuste para espaçamento lateral
    marginBottom: 20,
  },
  feelingOption: {
    width: (width - 60) / 2, // Calcula a largura para 2 colunas com espaçamento
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10, // Espaçamento entre as linhas
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  feelingOptionActive: {
    borderColor: '#2F6FED', // Borda azul quando selecionado
    backgroundColor: '#E6EEFC', // Fundo azul claro quando selecionado
  },
  feelingOptionEmoji: {
    fontSize: 30, // Tamanho do emoji
    marginBottom: 5,
  },
  feelingOptionText: {
    fontSize: 13,
    color: '#1B1B1B',
    textAlign: 'center',
  },

  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#E0E0E0', // Cinza para o botão Anterior
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A5A5A',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2F6FED', // Azul para o botão Próxima
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    width: '50%', // Ajuste conforme a situação atual (ex: 50% para 1 de 2)
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