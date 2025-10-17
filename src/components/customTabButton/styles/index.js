import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: '#fff'
  },
});

export default styles;