import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardSelected: {
    backgroundColor: '#e7f3ff',
    borderColor: '#b8daff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#343a40',
  },
  cardRe: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  cardTextSelected: {
    color: '#004085',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOption: {
    padding: 5,
    marginLeft: 10,
  },
  cardBody: {
    // O corpo do card
  },
  detailsContainer: {
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  detailText: {
    fontSize: 15,
    color: '#495057',
    flex: 1, // Permite que o texto quebre a linha
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginRight: 5,
  },
  // Estilos do Modal de Ações
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '75%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default styles;