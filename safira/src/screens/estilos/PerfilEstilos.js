import { StyleSheet } from 'react-native';

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
  backButtonText: {
    fontSize: 24,
    color: '#1B1B1B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  headerSpacer: {
    width: 34, // Para equilibrar o botão de voltar
  },
  scrollContent: {
    paddingBottom: 20,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A5A5A',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden', // Para garantir que a imagem não saia do círculo
  },
  avatarIcone: {
    fontSize: 30,
  },
  avatarImage: { // Novo estilo para a imagem de perfil
    width: '100%',
    height: '100%',
    borderRadius: 30, // Garante que a imagem seja circular
  },
  userInfo: {
    flex: 1,
  },
  userNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  userEmail: {
    fontSize: 14,
    color: '#5A5A5A',
  },
  contaAtivaBadge: {
    backgroundColor: '#DFF5E5',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  contaAtivaTexto: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  engrenagemButton: {
    padding: 5,
  },
  engrenagemIcone: {
    fontSize: 24,
    color: '#5A5A5A',
  },
  resumoWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10,
  },
  resumoCard: {
    backgroundColor: '#FFFFFF',
    width: '48%', // Quase metade da largura para 2 por linha
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resumoIconeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  resumoIconeTexto: {
    fontSize: 20,
  },
  resumoValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  resumoLabel: {
    fontSize: 12,
    color: '#5A5A5A',
    textAlign: 'center',
  },
  limiteCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  limiteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  limiteIconeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  limiteIconeTexto: {
    fontSize: 20,
  },
  limiteTextos: {
    flex: 1,
  },
  limiteTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  limiteRecomendado: {
    fontSize: 14,
    color: '#5A5A5A',
  },
  sliderWrapper: {
    marginVertical: 10,
  },
  sliderTrilha: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    position: 'relative',
  },
  sliderPreenchido: {
    height: '100%',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    top: -6, // Ajusta a posição vertical do thumb
    marginLeft: -10, // Centraliza o thumb
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#5A5A5A',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  infoIcone: {
    fontSize: 20,
    color: '#00BCD4',
    marginRight: 10,
  },
  infoTexto: {
    flex: 1,
    fontSize: 14,
    color: '#00BCD4',
  },
  sairBotao: {
    backgroundColor: '#FF4D4D',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 30,
    marginBottom: 20,
  },
  sairTexto: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  bottomItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomText: {
    fontSize: 12,
    color: '#5A5A5A',
  },
  bottomTextActive: {
    color: '#2F6FED',
    fontWeight: 'bold',
  },
});

export default styles;