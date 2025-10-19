import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles'; // Ajuste o caminho conforme necessário

export default function SelectSetorModal({
  visible,
  onClose,
  setores = [],
  selectedSetor,
  setSelectedSetor,
  novoSetorInput,
  setNovoSetorInput,
  onAddSetor,
  onDeleteSetor,
}) {
  const handleSelectSetor = (item) => {
    setSelectedSetor(item);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={26} color="#666" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Setores</Text>

          <View style={styles.modalInputContainer}>
            <TextInput
              placeholder="Adicionar novo setor"
              placeholderTextColor="#888"
              value={novoSetorInput}
              onChangeText={setNovoSetorInput}
              style={styles.modalInput}
              onSubmitEditing={onAddSetor}
            />
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={onAddSetor}
            >
              <Ionicons name="add-circle" size={28} color="#007bff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={setores}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.modalOption}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleSelectSetor(item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onDeleteSetor(item)}
                  style={{ padding: 5 }}
                >
                  <Ionicons name="close-circle" size={22} color="#dc3545" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
