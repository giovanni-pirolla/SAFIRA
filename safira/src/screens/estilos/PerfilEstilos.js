import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    width: 32,
  },
  backButtonText: {
    fontSize: 22,
    color: '#1B1B1B',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingTop: 14,
    paddingBottom: 20,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 10,
    marginTop: 8,
  },

  /* Cartão do usuário */
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarIcone: {
    fontSize: 22,
  },
  userInfo: {
    flex: 1,
  },
  userNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  userEmail: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 2,
    marginBottom: 6,
  },
  contaAtivaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCEAFB',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  contaAtivaTexto: {
    fontSize: 10,
    color: '#2F6FED',
    fontWeight: '600',
  },
  engrenagemButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  engrenagemIcone: {
    fontSize: 18,
  },

  /* Resumo da conta */
  resumoWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resumoCard: {
    width: '48%',
    backgroundColor: '#F7F8FA',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resumoIconeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumoIconeTexto: {
    fontSize: 17,
  },
  resumoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  resumoLabel: {
    fontSize: 11,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: 3,
  },

  /* Limites sensoriais */
  limiteCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  limiteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  limiteIconeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  limiteIconeTexto: {
    fontSize: 16,
  },
  limiteTextos: {
    flex: 1,
  },
  limiteTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  limiteRecomendado: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 1,
  },
  sliderWrapper: {
    marginBottom: 4,
  },
  sliderTrilha: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E4E4E4',
    justifyContent: 'center',
  },
  sliderPreenchido: {
    height: '100%',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderLabelText: {
    fontSize: 10,
    color: '#B5B5B5',
  },

  /* Caixa informativa */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF1FE',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  infoIcone: {
    fontSize: 14,
    color: '#2F6FED',
    marginRight: 8,
  },
  infoTexto: {
    flex: 1,
    fontSize: 12,
    color: '#3E5C8A',
    lineHeight: 16,
  },

  /* Botão de sair */
  sairBotao: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 12,
  },
  sairTexto: {
    fontSize: 13,
    color: '#E44B4B',
    fontWeight: '600',
  },

  /* Rodapé de navegação */
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  bottomItem: {
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  bottomTextActive: {
    color: '#2F6FED',
    fontWeight: 'bold',
  },
});

export default styles;