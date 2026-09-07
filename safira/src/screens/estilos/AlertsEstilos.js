import { StyleSheet } from 'react-native';

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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#F5F7FA',
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
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
  },
  secao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginTop: 12,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconeAviso: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2A93B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconePerigo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E44B4B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconeSucesso: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconeTexto: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardConteudo: {
    flex: 1,
  },
  cardHeaderLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  cardHora: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  cardDescricao: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 4,
    lineHeight: 18,
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
    marginTop: 4,
  },
  bolinhaAviso: {
    backgroundColor: '#F2A93B',
  },
  bolinhaPerigo: {
    backgroundColor: '#E44B4B',
  },
  bolinhaSucesso: {
    backgroundColor: '#2F6FED',
  },
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
    fontSize: 12,
    color: '#8A8A8A',
  },
});

export default styles;