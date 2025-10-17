import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomTabBarButton() {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navega para a pilha 'Employes' e, dentro dela, para a tela 'AddEditEmployee'
    navigation.navigate('Employes', { screen: 'AddEditEmployee' });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.button}>
        <Ionicons name="add" size={30} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: '#fff'
  },
});