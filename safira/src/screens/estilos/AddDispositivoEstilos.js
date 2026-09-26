import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  /* =========================================================
     CONTAINER PRINCIPAL
  ========================================================= */

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* =========================================================
     HEADER
  ========================================================= */

  header: {
    height: 58,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,

    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',

    backgroundColor: '#FAFAFA',
  },

  backButton: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    fontSize: 24,
    color: '#1B1B1B',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },

  headerSpacer: {
    width: 36,
  },

  /* =========================================================
     CONTEÚDO
  ========================================================= */

  content: {
    flex: 1,
    marginTop: 25,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',

    color: '#1B1B1B',

    textAlign: 'center',

    marginBottom: 6,
  },

  description: {
    fontSize: 13,

    color: '#777777',

    lineHeight: 18,

    textAlign: 'center',

    marginBottom: 18,
  },

  /* =========================================================
     BUSCA
  ========================================================= */

  scanButton: {
    width: '100%',

    paddingVertical: 11,

    borderRadius: 10,

    backgroundColor: '#2F6FED',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 14,
  },

  scanButtonText: {
    fontSize: 13,
    fontWeight: 'bold',

    color: '#FFFFFF',
  },

  buscandoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 12,
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

  /* =========================================================
     LISTA DE DISPOSITIVOS
  ========================================================= */

  deviceList: {
    flex: 1,
    width: '100%',
  },

  deviceCard: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E1E6ED',

    borderRadius: 12,

    paddingVertical: 13,
    paddingHorizontal: 14,

    marginBottom: 9,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  /* =========================================================
     INFORMAÇÕES DO DISPOSITIVO
  ========================================================= */

  deviceInfo: {
    flex: 1,

    marginRight: 12,
  },

  deviceName: {
    fontSize: 14,

    fontWeight: 'bold',

    color: '#1B1B1B',

    marginBottom: 4,
  },

  deviceId: {
    fontSize: 10,

    color: '#8A8A8A',
  },

  /* =========================================================
     BOTÃO CONECTAR
  ========================================================= */

  connectButton: {
    width: 100,
    height: 42,

    borderRadius: 9,

    backgroundColor: '#2F6FED',

    alignItems: 'center',
    justifyContent: 'center',
  },

  connectButtonText: {
    fontSize: 12,

    fontWeight: 'bold',

    color: '#FFFFFF',
  },

  /* =========================================================
     DISPOSITIVO CONECTADO
  ========================================================= */

  connectedButton: {
    width: 100,
    height: 42,

    borderRadius: 9,

    backgroundColor: '#EAF1FE',

    borderWidth: 1,
    borderColor: '#C9DAF8',

    alignItems: 'center',
    justifyContent: 'center',
  },

  connectedButtonText: {
    fontSize: 12,

    fontWeight: 'bold',

    color: '#2F6FED',
  },

  /* =========================================================
     STATUS DA CONEXÃO
  ========================================================= */

  connectionStatus: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 8,
  },

  connectionStatusText: {
    fontSize: 11,

    color: '#5A5A5A',

    textAlign: 'center',
  },

  connectionStatusSuccess: {
    fontSize: 11,

    color: '#2F6FED',

    fontWeight: '600',

    textAlign: 'center',
  },

  /* =========================================================
     NENHUM DISPOSITIVO
  ========================================================= */

  emptyContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 14,

    fontWeight: 'bold',

    color: '#1B1B1B',

    marginBottom: 5,

    textAlign: 'center',
  },

  emptyText: {
    fontSize: 11,

    color: '#8A8A8A',

    lineHeight: 16,

    textAlign: 'center',
  },

  /* =========================================================
     RODAPÉ
  ========================================================= */

  bottomBar: {
    height: 62,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',

    backgroundColor: '#FFFFFF',

    paddingBottom: 4,
  },

  bottomItem: {
    alignItems: 'center',
    justifyContent: 'center',

    minWidth: 60,
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