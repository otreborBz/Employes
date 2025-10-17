// src/components/CardEmployes.js
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

// Subcomponente para cada item da lista, com seu próprio modal
function CardItem({ item, onShare, onEdit, onDelete }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemDetails}>RE: {item.re} | {item.setor} | Turno: {item.turno}</Text>
      </View>

      <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="ellipsis-vertical" size={22} color="#555" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => { setModalVisible(false); onShare(item); }}>
              <Ionicons name="share-social-outline" size={22} color="#28a745" />
              <Text style={styles.modalOptionText}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={() => { setModalVisible(false); onEdit(item); }}>
              <Ionicons name="create-outline" size={22} color="#007bff" />
              <Text style={styles.modalOptionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={() => { setModalVisible(false); onDelete(item); }}>
              <Ionicons name="trash-outline" size={22} color="#dc3545" />
              <Text style={[styles.modalOptionText, { color: '#dc3545' }]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function CardEmployes({ data, onShare, onEdit, onDelete }) {

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <CardItem
          item={item}
          onShare={onShare}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
