import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1B1B1B',
  },
  headerLogo: {
    width: 100,
    height: 30,
  },
  helpButton: {
    padding: 5,
  },
  helpIcon: {
    width: 24,
    height: 24,
    tintColor: '#1B1B1B',
  },

  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  progressStep: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#2F6FED',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5A5A5A',
  },
  progressTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },

  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#5A5A5A',
    lineHeight: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  infoCardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6EEFC',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoCardIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#2F6FED',
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: '#2F6FED',
    lineHeight: 18,
  },

  situationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  situationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  situationImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  situationDetails: {
    padding: 15,
  },
  situationDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginBottom: 5,
  },
  situationDetailText: {
    fontSize: 14,
    color: '#5A5A5A',
    lineHeight: 20,
    marginBottom: 10,
  },
  situationDetailSoundLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  situationDetailSoundLevelIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: '#5A5A5A',
  },
  situationDetailSoundLevelText: {
    fontSize: 13,
    color: '#5A5A5A',
  },

  feelingQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  feelingSubQuestion: {
    fontSize: 14,
    color: '#5A5A5A',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  feelingOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  feelingOption: {
    width: (width - 45) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feelingOptionActive: {
    borderColor: '#2F6FED',
    backgroundColor: '#E6EEFC',
  },
  feelingOptionEmoji: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  feelingOptionText: {
    fontSize: 13,
    color: '#1B1B1B',
    textAlign: 'center',
    fontWeight: '500',
  },

  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A5A5A',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2F6FED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  progressBottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBottomBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBottomFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2F6FED',
    borderRadius: 3,
  },
  progressBottomText: {
    fontSize: 13,
    color: '#5A5A5A',
  },
});

export default styles;