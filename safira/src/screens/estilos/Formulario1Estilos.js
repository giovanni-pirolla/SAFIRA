import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Fundo mais claro para a tela inteira
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Espaçamento inferior para o scroll
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF', // Fundo branco para o header
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1B1B1B', // Cor do ícone de voltar
  },
  headerLogo: {
    width: 90, // Ajustado para ser um pouco maior
    height: 90, // Ajustado para manter proporção
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E6EEFC', // Fundo azul claro para o botão de ajuda
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    width: 18, // Tamanho do ícone de interrogação
    height: 18,
    tintColor: '#2F6FED', // Cor do ícone de interrogação
  },

  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25, // Mais padding vertical
    backgroundColor: '#FFFFFF', // Fundo branco para a barra de progresso
    marginBottom: 20, // Margem inferior para separar do conteúdo
  },
  progressStep: {
    width: 32, // Tamanho maior para os círculos
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0', // Cinza claro para passos inativos
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6, // Mais espaçamento horizontal
  },
  progressStepActive: {
    backgroundColor: '#2F6FED', // Azul para o passo ativo
  },
  progressText: {
    fontSize: 15, // Fonte um pouco maior
    color: '#888888', // Cinza mais escuro para texto inativo
    fontWeight: 'bold',
  },
  progressTextActive: {
    color: '#FFFFFF', // Branco para texto ativo
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0', // Linha cinza claro
  },

  mainTitle: {
    fontSize: 24, // Título maior
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 15, // Descrição um pouco maior
    color: '#5A5A5A',
    marginHorizontal: 20,
    marginBottom: 25, // Mais margem inferior
    lineHeight: 22, // Mais espaçamento entre linhas
  },

  infoSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alinha o ícone e o texto no topo
    marginBottom: 18, // Mais espaçamento entre os itens
  },
  // Estilo para ícones de texto ou ícones que devem ser coloridos por tintColor
  infoIcon: {
    width: 28,
    height: 28,
    marginRight: 15,
    marginTop: 2,
    tintColor: '#2F6FED', // Mantém o tintColor para outros ícones se necessário
  },
  // NOVO ESTILO: Para as imagens que já vêm coloridas e não devem ter tintColor
  infoImageIcon: {
    width: 28, // Tamanho dos ícones de informação
    height: 28,
    marginRight: 15,
    marginTop: 2, // Ajuste fino para alinhar com o texto
    // tintColor removido para que a imagem apareça com suas cores originais
  },
  infoText: {
    flex: 1,
    fontSize: 15, // Texto um pouco maior
    color: '#1B1B1B',
    lineHeight: 22,
  },

  howItWorks: {
    backgroundColor: '#F7F8FA', // Fundo cinza claro
    borderRadius: 12,
    padding: 20, // Mais padding
    marginHorizontal: 20,
    marginBottom: 25,
  },
  howItWorksTitle: {
    fontSize: 17, // Título um pouco maior
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 12, // Mais margem inferior
  },
  howItWorksText: {
    fontSize: 15, // Texto um pouco maior
    color: '#5A5A5A',
    marginBottom: 6, // Mais espaçamento entre os itens
    lineHeight: 22,
  },

  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB', // Fundo amarelo claro
    borderRadius: 12,
    padding: 20, // Mais padding
    marginHorizontal: 20,
    marginBottom: 30, // Mais margem inferior
  },
  tipIcon: {
    fontSize: 22, // Ícone de lâmpada maior
    marginRight: 12,
    color: '#F2A93B', // Cor amarela para o ícone
  },
  tipText: {
    flex: 1,
    fontSize: 15, // Texto um pouco maior
    color: '#5A5A5A',
    lineHeight: 22,
  },
  tipTextBold: {
    fontWeight: 'bold',
    color: '#1B1B1B', // Cor mais escura para o "Dica"
  },

  startButton: {
    backgroundColor: '#2F6FED', // Azul para o botão
    borderRadius: 12,
    paddingVertical: 18, // Mais padding vertical
    alignItems: 'center',
    marginHorizontal: 20, // Ocupa a largura total com margem lateral
    marginTop: 10, // Margem superior para separar do conteúdo
  },
  startButtonText: {
    fontSize: 17, // Texto do botão maior
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default styles;