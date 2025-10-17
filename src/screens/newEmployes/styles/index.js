import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  formContainer: {
    flex: 1,
    padding: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8
  },
  input: { height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 20 },
  selector: { height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectorText: { fontSize: 16, color: '#333' },
  selectorPlaceholder: { fontSize: 16, color: '#888' },
  footer: {
    marginBottom: 40,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff'
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnSave: {
    backgroundColor: '#007bff'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', width: '90%', borderRadius: 12, padding: 20, maxHeight: '70%' },
  modalCloseButton: { position: 'absolute', top: 15, right: 15, zIndex: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  modalInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  modalInput: { flex: 1, height: 44, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  modalAddButton: { marginLeft: 10 },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalOptionText: { fontSize: 16, color: '#333' },
});

export default styles;

