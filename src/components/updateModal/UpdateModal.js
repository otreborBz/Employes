import React from 'react';
import { Modal, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';


export default function UpdateModal({ visible, onClose, changelog, version, apkUrl }) {
  const handleUpdate = () => {
    Linking.openURL(apkUrl);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Ionicons name="rocket-outline" size={50} color={'#4CAF50'} />
          <Text style={styles.title}>Nova versão disponível 🚀</Text>

          <Text style={styles.subtitle}>Versão {version}</Text>

          <Text style={styles.changelog}>{changelog}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.later]} onPress={onClose}>
              <Text style={styles.laterText}>Mais tarde</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.update]} onPress={handleUpdate}>
              <Text style={styles.updateText}>Atualizar agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


