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
    width: 34,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1B1B1B',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  headerSpacer: {
    width: 34,
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingTop: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  iconeQuadrado: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#D9E8FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconeEmoji: {
    fontSize: 24,
  },
  cardConteudo: {
    flex: 1,
  },
  nomeLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nomeTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginRight: 5,
  },
  editarIcone: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  ambienteTexto: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
    marginBottom: 6,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bateriaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bateriaBase: {
    width: 20,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#B5B5B5',
    marginRight: 4,
    overflow: 'hidden',
  },
  bateriaPreenchimento: {
    height: '100%',
  },
  bateriaAlta: {
    backgroundColor: '#2FAE5C',
  },
  bateriaBaixa: {
    backgroundColor: '#E44B4B',
  },
  bateriaTexto: {
    fontSize: 11,
    color: '#5A5A5A',
  },
  pontoSeparador: {
    fontSize: 11,
    color: '#B5B5B5',
    marginHorizontal: 6,
  },
  atualizadoTexto: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  ladoDireito: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
  },
  badgeAtivo: {
    backgroundColor: '#E4F6EA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeInativo: {
    backgroundColor: '#FCE4E4',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeTextAtivo: {
    fontSize: 11,
    color: '#2FAE5C',
    fontWeight: '600',
  },
  badgeTextInativo: {
    fontSize: 11,
    color: '#E44B4B',
    fontWeight: '600',
  },
  setaTexto: {
    fontSize: 16,
    color: '#B5B5B5',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabTexto: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
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