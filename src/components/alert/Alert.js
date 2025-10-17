import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';


const alertIcons = {
  success: { name: 'checkmark-circle-outline', color: '#28a745' },
  error: { name: 'close-circle-outline', color: '#dc3545' },
  warning: { name: 'alert-circle-outline', color: '#ffc107' },
  confirm: { name: 'help-circle-outline', color: '#007bff' },
};

export default function CustomAlert({ visible, type = 'success', title, message, buttons, onClose }) {
  const icon = alertIcons[type] || alertIcons.success;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          <Ionicons name={icon.name} size={50} color={icon.color} style={styles.icon} />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons && buttons.map((button, index) => {
              let buttonStyle = styles.button;
              let textStyle = styles.buttonText;

              if (button.style === 'destructive') {
                buttonStyle = [styles.button, styles.destructiveButton];
                textStyle = [styles.buttonText, { color: '#fff' }];
              } else if (button.style === 'cancel') {
                buttonStyle = [styles.button, styles.cancelButton];
                textStyle = [styles.buttonText, { color: '#333' }];
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={buttonStyle}
                  onPress={() => {
                    if (button.onPress) button.onPress();
                    onClose(); // Fecha o alerta após o clique
                  }}
                >
                  <Text style={textStyle}>{button.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

