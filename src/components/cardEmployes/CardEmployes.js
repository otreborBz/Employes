// src/components/CardEmployes.js
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

// Subcomponente para cada item da lista, com seu próprio modal
function CardItem({ item, onShare, onEdit, onDelete, onLongPress, isSelected, selectionMode }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.itemRow, isSelected && styles.itemSelected]}
      onLongPress={() => onLongPress(item)}
      delayLongPress={200}
    >
      {selectionMode && (
        <Ionicons name={isSelected ? "checkbox" : "square-outline"} size={24} color="#007bff" style={{ marginRight: 15 }} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemDetails}>RE: {item.re} | {item.setor} | Turno: {item.turno} | Tel: {item.telefone}</Text>
      </View>

      {!selectionMode && (
        <TouchableOpacity
          style={{
            paddingLeft: 10,
            paddingVertical: 5,
            justifyContent: 'center',
          }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#555" />
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 10,
              width: '70%',
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 15,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
              }}
              onPress={() => { setModalVisible(false); onShare(item); }}
            >
              <Ionicons name="share-social-outline" size={22} color="#28a745" />
              <Text style={{
                marginLeft: 15,
                fontSize: 16,
                color: '#333',
                fontWeight: '500',
              }}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 15,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
              }}
              onPress={() => { setModalVisible(false); onEdit(item); }}
            >
              <Ionicons name="create-outline" size={22} color="#007bff" />
              <Text style={{
                marginLeft: 15,
                fontSize: 16,
                color: '#333',
                fontWeight: '500',
              }}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 15,
                paddingHorizontal: 10,
              }}
              onPress={() => { setModalVisible(false); onDelete(item); }}
            >
              <Ionicons name="trash-outline" size={22} color="#dc3545" />
              <Text style={{
                marginLeft: 15,
                fontSize: 16,
                color: '#dc3545',
                fontWeight: '500',
              }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
}

export default function CardEmployes({ data, onShare, onEdit, onDelete, onLongPress, selectionMode, selectedItems }) {

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <CardItem
          item={item}
          isSelected={selectedItems.includes(item.id)}
          selectionMode={selectionMode}
          onShare={onShare}
          onEdit={onEdit}
          onDelete={onDelete}
          onLongPress={onLongPress}
        />
      )}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
