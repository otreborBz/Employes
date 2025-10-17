import Constants from 'expo-constants';
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: Constants.statusBarHeight,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2A38',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2A38',
    marginTop: 20, marginBottom: 10
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: '#fff',
    width: '31%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 110,
  },

  cardTitle: { fontSize: 12, color: '#555', marginTop: 8, textAlign: 'center' },
  cardNumber: { fontSize: 22, fontWeight: '700', color: '#1E2A38', marginTop: 4, textAlign: 'center' },
  cardSmall: { fontSize: 14, fontWeight: '600', color: '#1E2A38', marginTop: 4, textAlign: 'center' },

  setoresContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  setorBadge: { backgroundColor: '#E8F1FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, margin: 4 },
  setorText: { color: '#007BFF', fontWeight: '600' },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listItemName: { fontSize: 16, fontWeight: '600', color: '#1E2A38' },
  listItemDetails: { fontSize: 14, color: '#555' },
  emptyText: { textAlign: 'center', color: '#777', fontSize: 15, marginVertical: 10 },

  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 6 },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignItems: 'center',
    paddingTop: 45, // Espaço para o botão de fechar
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#1E2A38' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectorButton: {
    justifyContent: 'space-between'
  },
  modalButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  modalButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelButton: { marginTop: 15 },
  cancelText: { color: '#007BFF', fontWeight: '600', fontSize: 15 },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  inputText: { fontSize: 16, color: '#333' },
  placeholderText: { fontSize: 16, color: '#999' },
  setorInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, width: '100%' },
  setorInput: { flex: 1, height: 44, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D9E6', borderRadius: 8, paddingHorizontal: 10 },
  addSetorButton: { marginLeft: 10 },
  setorOption: { width: '100%', paddingVertical: 15, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  setorOptionText: { fontSize: 16, color: '#333', flex: 1 },
  // Estilos para os seletores de setor no MODAL
  setoresModalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  setorBadgeModal: {
    backgroundColor: '#e9ecef',
    paddingVertical: 6,
    paddingHorizontal: 12, borderRadius: 16, margin: 4,
  },
  setorBadgeModalText: { color: '#495057', fontWeight: '500' },
  // Estilos para o modal de detalhes do funcionário
  detailsContainer: { width: '100%', marginTop: 10 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 15,
  },
  detailLabel: {
    fontSize: 12, color: '#666',
  },
  detailValue: { fontSize: 16, color: '#1E2A38', fontWeight: '600' },
  // Estilos para o Modal de Gerenciamento
  managementOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
  },
  managementOptionText: { fontSize: 16, color: '#333', marginLeft: 15 },
});

export default styles;