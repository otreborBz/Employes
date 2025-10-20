import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Constants.statusBarHeight + 15,
  },
  headerTitle: {
    color: '#0056cc',
    fontSize: 22,
    fontWeight: 'bold'
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10, padding: 12,
    marginBottom: 8, borderWidth: 1,
    borderColor: '#ddd'
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearText: {
    color: '#dc3545',
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%', borderRadius: 12,
    padding: 20, maxHeight: '70%',
    paddingTop: 40
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    height: 48
  },
  inputText: {
    fontSize: 16,
    color: '#333'
  },
  placeholderText: {
    fontSize: 16,
    color: '#999'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8
  },
  btnCancel: {
    backgroundColor: '#eee'
  },
  btnSave: {
    backgroundColor: '#007bff'
  },
  btnText: {
    fontSize: 16, fontWeight: '600'
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    bottom: 25,
    backgroundColor: '#007bff',
    borderRadius: 30,
    elevation: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  setorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  setorInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 44
  },
  addSetorButton: {
    marginLeft: 10
  },
  setorOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  setorOptionText: {
    fontSize: 16,
    color: '#333'
  },
  managementSection: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  managementButtons: {
    flexDirection: 'row',
  },
  managementButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  managementButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  managementOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  managementOptionText: {
    fontSize: 17,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  // Estilos para o Modal de Compartilhamento
  shareOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  shareOptionName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  noAddressText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default styles;
