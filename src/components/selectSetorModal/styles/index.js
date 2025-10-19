import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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

})

export default styles;
