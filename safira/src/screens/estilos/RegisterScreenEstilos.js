import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  backButton: {
    width: 32,
  },
  backButtonText: {
    fontSize: 22,
    color: '#1B1B1B',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 13,
    color: '#8A8A8A',
    marginBottom: 24,
  },
  campoWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1B1B1B',
    backgroundColor: '#FAFAFA',
  },
  erroTexto: {
    fontSize: 12,
    color: '#E44B4B',
    marginBottom: 10,
    textAlign: 'center',
  },
  sucessoTexto: {
    fontSize: 12,
    color: '#2FAE5C',
    marginBottom: 10,
    textAlign: 'center',
  },
  botaoPrimario: {
    backgroundColor: '#2F6FED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoPrimarioTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  linkWrapper: {
    marginTop: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  linkTexto: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  linkTextoDestaque: {
    color: '#2F6FED',
    fontWeight: 'bold',
  },
});

export default styles;