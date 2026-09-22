import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#1B1B1B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A5A5A',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
optionIcon: {
  marginRight: 15,
  width: 24,
  height: 24,
  resizeMode: 'contain',
},
  optionLabel: {
    fontSize: 16,
    color: '#1B1B1B',
    flex: 1,
  },
  optionValue: {
    fontSize: 16,
    color: '#5A5A5A',
    marginRight: 10,
  },
  optionArrow: {
    fontSize: 18,
    color: '#C0C0C0',
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addCuidadorButton: { // Novo estilo para o botão de adicionar cuidador
    backgroundColor: '#2F6FED',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  addCuidadorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Estilos do Modal (mantidos do código anterior)
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#E0E0E0',
  },
  buttonSave: {
    backgroundColor: '#2F6FED',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default styles;