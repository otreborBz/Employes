import { StyleSheet } from "react-native";  

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E2A38',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  destructiveButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
