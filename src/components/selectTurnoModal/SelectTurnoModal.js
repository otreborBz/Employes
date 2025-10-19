import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function SelectTurnoModal({
  visible,
  onClose,
  turnos = [],
  selectedTurno,
  setSelectedTurno,
  novoTurnoInput,
  setNovoTurnoInput,
  onAddTurno,
  onDeleteTurno,
}) {
  const handleSelectTurno = (item) => {
    setSelectedTurno(item);
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

          <Text style={styles.modalTitle}>Turnos</Text>

          <View style={styles.modalInputContainer}>
            <TextInput
              placeholder="Adicionar novo turno"
              placeholderTextColor="#888"
              value={novoTurnoInput}
              onChangeText={setNovoTurnoInput}
              style={styles.modalInput}
              onSubmitEditing={onAddTurno}
            />
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={onAddTurno}
            >
              <Ionicons name="add-circle" size={28} color="#007bff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={turnos}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.modalOption}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleSelectTurno(item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onDeleteTurno(item)}
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
