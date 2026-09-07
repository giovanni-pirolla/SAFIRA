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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    width: 30,
  },
  backButtonText: {
    fontSize: 20,
    color: '#1B1B1B',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  headerSpacer: {
    width: 30,
  },

  /* Indicador de etapas (1 - 2 - 3) */
  stepsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingTop: 14,
    paddingBottom: 6,
  },
  stepItem: {
    alignItems: 'center',
    width: 66,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleAtivo: {
    backgroundColor: '#2F6FED',
  },
  stepCircleInativo: {
    backgroundColor: '#C9DAF8',
  },
  stepNumero: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepLabelAtivo: {
    color: '#2F6FED',
  },
  stepLabelInativo: {
    color: '#B0BEC5',
  },
  stepLine: {
    width: 36,
    height: 2,
    backgroundColor: '#DCE6F5',
    marginTop: 13,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },

  /* Ilustração do crachá */
  ilustracaoWrapper: {
    width: 150,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  glow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#DCE9FD',
    opacity: 0.6,
  },
  argola: {
    position: 'absolute',
    top: -2,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 7,
    borderColor: '#B9BEC7',
    backgroundColor: 'transparent',
  },
  crachaBox: {
    position: 'absolute',
    bottom: 6,
    width: 78,
    height: 78,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E3FB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  crachaIcone: {
    fontSize: 15,
    color: '#2F6FED',
    fontWeight: 'bold',
  },
  bluetoothCircle: {
    position: 'absolute',
    right: -6,
    bottom: 22,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bluetoothIcone: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },

  /* Textos principais */
  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B1B1B',
    textAlign: 'center',
    marginBottom: 4,
  },
  descricao: {
    fontSize: 12,
    color: '#8A8A8A',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
  },

  /* Caixa de aviso azul */
  avisoBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#EAF1FE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  avisoIconeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  avisoIconeTexto: {
    fontSize: 10,
    color: '#2F6FED',
    fontWeight: 'bold',
  },
  avisoConteudo: {
    flex: 1,
  },
  avisoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 2,
  },
  avisoTexto: {
    fontSize: 11,
    color: '#6B6B6B',
    lineHeight: 15,
  },

  /* Buscando dispositivos */
  buscandoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#2F6FED',
    borderTopColor: 'transparent',
    marginRight: 8,
  },
  buscandoTexto: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
  },

  /* Rodapé de navegação */
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
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