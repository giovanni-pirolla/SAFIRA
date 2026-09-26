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
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 12,
  },
  periodoWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  periodoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#EFEFEF',
    marginRight: 8,
  },
  periodoButtonAtivo: {
    backgroundColor: '#2F6FED',
  },
  periodoText: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
  },
  periodoTextAtivo: {
    color: '#FFFFFF',
  },
  sensorWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  sensorButton: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    marginRight: 7,
    marginBottom: 7,
  },
  sensorButtonAtivo: {
    backgroundColor: '#2F6FED',
  },
  sensorText: {
    fontSize: 11,
    color: '#5A5A5A',
    fontWeight: '600',
  },
  sensorTextAtivo: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
    alignSelf: 'center',
  },
  legendWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#5A5A5A',
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
  sensorButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  legendIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
});

export default styles;