import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: height * 0.06,
    paddingBottom: height * 0.03,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E9F1FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  illustration: {
    width: width * 0.85,
    height: height * 0.35,
    marginTop: height * 0.03,
  },
  buttonsWrapper: {
    width: width * 0.85,
    marginTop: 'auto',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonPrimary: {
    backgroundColor: '#2F6FED',
  },
  buttonSecondary: {
    backgroundColor: '#A9C6F5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconImage: {
  width: 150,
  height: 150,
},
});

export default styles;