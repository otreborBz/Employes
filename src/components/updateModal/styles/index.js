import { StyleSheet } from "react-native";  

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  changelog: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  later: {
    backgroundColor: '#ccc',
  },
  update: {
    backgroundColor: '#4CAF50',
  },
  laterText: {
    color: '#333',
    fontWeight: '600',
  },
  updateText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default styles;
