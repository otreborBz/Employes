import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, LayoutAnimation, Modal, Platform, Text, TouchableOpacity, UIManager, View } from 'react-native';
import styles from './styles';

// Habilita LayoutAnimation no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Componente para renderizar um único card de funcionário.
 * Gerencia o estado de visibilidade do endereço.
 */
const EmployeeCardItem = ({ item, onLongPress, onPress, onEdit, onDelete, onShare, selectionMode, selectedItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const isSelected = selectedItems.includes(item.id);

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onLongPress={() => onLongPress(item)}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={[styles.cardName, isSelected && styles.cardTextSelected]}>{item.nome}</Text>
          <Text style={[styles.cardRe, isSelected && styles.cardTextSelected]}>RE: {item.re}</Text>
        </View>
        {/* Menu de 3 pontos */}
        {!selectionMode && (
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuOption}>
            <Ionicons name="ellipsis-vertical" size={24} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardBody}>
        {/* Seção de Detalhes Expansível */}
        {isExpanded && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={18} color="#555" style={styles.detailIcon} />
              <Text style={styles.detailText}>Setor: {item.setor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#555" style={styles.detailIcon} />
              <Text style={styles.detailText}>Turno: {item.turno}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={18} color="#555" style={styles.detailIcon} />
              <Text style={styles.detailText}>Telefone: {item.telefone}</Text>
            </View>
            {item.endereco && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color="#555" style={styles.detailIcon} />
                <Text style={styles.detailText}>Endereço: {item.endereco}</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
          <Text style={styles.expandButtonText}>{isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}</Text>
          <Ionicons name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={18} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Modal de Ações */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setMenuVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => { setMenuVisible(false); onShare(item); }}>
              <Ionicons name="share-social-outline" size={22} color="#28a745" />
              <Text style={styles.modalOptionText}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={() => { setMenuVisible(false); onEdit(item); }}>
              <Ionicons name="create-outline" size={22} color="#007bff" />
              <Text style={styles.modalOptionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, { borderBottomWidth: 0 }]}
              onPress={() => { setMenuVisible(false); onDelete(item); }}
            >
              <Ionicons name="trash-outline" size={22} color="#dc3545" />
              <Text style={[styles.modalOptionText, { color: '#dc3545' }]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

/**
 * Componente principal que renderiza a lista de funcionários.
 */
const CardEmployes = ({ data, ...props }) => {
  const renderItem = ({ item }) => (
    <EmployeeCardItem
      item={item}
      {...props}
    />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CardEmployes;
