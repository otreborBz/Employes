import CustomAlert from '@/components/alert/Alert';
import { addFuncionario, getFuncionarioById, getFuncionarios, updateFuncionario } from '@/sqLite/SQLiteConecction';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles'; // Assumindo que os estilos já existem


export default function NewEmployes() {
  const navigation = useNavigation();
  const route = useRoute();
  const employeeId = route.params?.employeeId;

  const [nome, setNome] = useState('');
  const [re, setRe] = useState('');
  const [setor, setSetor] = useState('');
  const [turno, setTurno] = useState('');

  const [setorModalVisible, setSetorModalVisible] = useState(false);
  const [turnoModalVisible, setTurnoModalVisible] = useState(false);
  const [novoSetorInput, setNovoSetorInput] = useState('');
  const [novoTurnoInput, setNovoTurnoInput] = useState('');

  const [setoresUnicos, setSetoresUnicos] = useState([]);
  const [turnosUnicos, setTurnosUnicos] = useState([]);

  const [alertInfo, setAlertInfo] = useState({ visible: false });

  // Carrega os dados da tela (funcionário para edição e listas de seleção)
  useEffect(() => {
    const loadScreenData = async () => {
      // Carrega itens customizados do AsyncStorage
      const customSectors = await getCustomItems('@customSectors');
      const customTurnos = await getCustomItems('@customTurnos');

      // Carrega funcionários para extrair setores e turnos em uso
      const allFuncionarios = await getFuncionarios();
      const usedSectors = allFuncionarios.map(f => f.setor);
      const usedTurnos = allFuncionarios.map(f => f.turno);

      // Combina e remove duplicatas
      const setores = [...new Set([...customSectors, ...usedSectors].filter(Boolean))].sort();
      const turnos = [...new Set([...customTurnos, ...usedTurnos].filter(Boolean))].sort();

      setSetoresUnicos(setores);
      setTurnosUnicos(turnos);

      // Se for modo de edição, preenche o formulário
      if (employeeId) {
        const funcionario = await getFuncionarioById(employeeId);
        if (funcionario) {
          setNome(funcionario.nome);
          setRe(funcionario.re);
          setSetor(funcionario.setor);
          setTurno(funcionario.turno);
        }
      }
    };

    loadScreenData();
  }, [employeeId]);

  const handleSalvar = async () => {
    if (!nome || !re || !setor || !turno) {
      setAlertInfo({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha todos os campos!',
        buttons: [{ text: 'OK' }],
      });
      return;
    }

    try {
      if (employeeId) {
        await updateFuncionario(employeeId, nome, re, setor, turno);
      } else {
        await addFuncionario(nome, re, setor, turno);
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      setAlertInfo({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível salvar o funcionário.',
        buttons: [{ text: 'OK' }],
      });
    }
  };

  // Funções auxiliares para AsyncStorage
  const getCustomItems = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error(`Erro ao ler ${key} do AsyncStorage`, e);
      return [];
    }
  };

  const addCustomItem = async (key, newItem, currentList, setList) => {
    const upperCaseItem = newItem.toUpperCase();
    if (!upperCaseItem || currentList.map(i => i.toUpperCase()).includes(upperCaseItem)) return;

    try {
      const newList = [...currentList, newItem].sort();
      setList(newList); // Atualiza a lista na UI
      await AsyncStorage.setItem(key, JSON.stringify(newList));
    } catch (e) {
      console.error(`Erro ao salvar ${key} no AsyncStorage`, e);
    }
  };

  // Funções para adicionar novos setores/turnos
  const handleAddNewSetor = () => {
    const trimmedInput = novoSetorInput.trim();
    if (trimmedInput) {
      setSetor(trimmedInput);
      addCustomItem('@customSectors', trimmedInput, setoresUnicos, setSetoresUnicos);
      setNovoSetorInput('');
      setSetorModalVisible(false);
    }
  };

  const handleAddNewTurno = () => {
    const trimmedInput = novoTurnoInput.trim().toUpperCase();
    if (trimmedInput) {
      setTurno(trimmedInput);
      addCustomItem('@customTurnos', trimmedInput, turnosUnicos, setTurnosUnicos);
      setNovoTurnoInput('');
      setTurnoModalVisible(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{employeeId ? 'Editar Funcionário' : 'Novo Funcionário'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.formContainer}>
        <Text style={styles.label}>Nome do Funcionário</Text>
        <TextInput placeholder="Digite o nome completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} style={styles.input} />

        <Text style={styles.label}>RE (Registro)</Text>
        <TextInput placeholder="Digite o RE" placeholderTextColor="#888" value={re} onChangeText={(text) => setRe(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Setor</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setSetorModalVisible(true)}>
          <Text style={setor ? styles.selectorText : styles.selectorPlaceholder}>
            {setor || 'Selecione o Setor'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>Turno</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setTurnoModalVisible(true)}>
          <Text style={turno ? styles.selectorText : styles.selectorPlaceholder}>
            {turno || 'Selecione o Turno'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.btnSave]} onPress={handleSalvar}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>{employeeId ? 'Salvar Alterações' : 'Adicionar Funcionário'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de setores */}
      <Modal visible={setorModalVisible} transparent animationType="fade" onRequestClose={() => setSetorModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSetorModalVisible(false)}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Setores</Text>
            <View style={styles.modalInputContainer}>
              <TextInput placeholder="Adicionar novo setor" placeholderTextColor="#888" value={novoSetorInput} onChangeText={setNovoSetorInput} style={styles.modalInput} onSubmitEditing={handleAddNewSetor} />
              <TouchableOpacity style={styles.modalAddButton} onPress={handleAddNewSetor}>
                <Ionicons name="add-circle" size={28} color="#007bff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={setoresUnicos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOption} onPress={() => { setSetor(item); setSetorModalVisible(false); }}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de turnos */}
      <Modal visible={turnoModalVisible} transparent animationType="fade" onRequestClose={() => setTurnoModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setTurnoModalVisible(false)}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Turnos</Text>
            <View style={styles.modalInputContainer}>
              <TextInput placeholder="Adicionar novo turno" placeholderTextColor="#888" value={novoTurnoInput} onChangeText={setNovoTurnoInput} style={styles.modalInput} onSubmitEditing={handleAddNewTurno} />
              <TouchableOpacity style={styles.modalAddButton} onPress={handleAddNewTurno}>
                <Ionicons name="add-circle" size={28} color="#007bff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={turnosUnicos}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOption} onPress={() => { setTurno(item); setTurnoModalVisible(false); }}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <CustomAlert {...alertInfo} onClose={() => setAlertInfo({ visible: false })} />
    </KeyboardAvoidingView>
  );
}
