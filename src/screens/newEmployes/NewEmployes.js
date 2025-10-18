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
  const [telefone, setTelefone] = useState('');

  const [setorModalVisible, setSetorModalVisible] = useState(false);
  const [turnoModalVisible, setTurnoModalVisible] = useState(false);
  const [novoSetorInput, setNovoSetorInput] = useState('');
  const [novoTurnoInput, setNovoTurnoInput] = useState('');

  const [allFuncionarios, setAllFuncionarios] = useState([]);
  const [setoresUnicos, setSetoresUnicos] = useState([]);
  const [turnosUnicos, setTurnosUnicos] = useState([]);

  const [alertInfo, setAlertInfo] = useState({ visible: false });

  // Carrega os dados da tela (funcionário para edição e listas de seleção)
  useEffect(() => {
    const loadScreenData = async () => {
      // Carrega funcionários para extrair setores e turnos em uso
      const funcionariosData = await getFuncionarios();
      setAllFuncionarios(funcionariosData);

      // Carrega itens customizados do AsyncStorage
      const customSectors = await getCustomItems('@customSectors');
      const customTurnos = await getCustomItems('@customTurnos');
      const usedSectors = funcionariosData.map(f => f.setor);
      const usedTurnos = funcionariosData.map(f => f.turno);

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
          setTelefone(funcionario.telefone || '');
        }
      }
    };

    loadScreenData();
  }, [employeeId]);

  // Função para formatar o número de telefone
  const handlePhoneChange = (text) => {
    const cleaned = ('' + text).replace(/\D/g, ''); // Remove tudo que não é dígito
    let formatted = cleaned;

    if (cleaned.length > 0) {
      formatted = '(' + cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted = '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 7);
    }
    if (cleaned.length > 7) {
      formatted = '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 7) + '-' + cleaned.substring(7, 11);
    }

    setTelefone(formatted);
  };

  const handleSalvar = async () => {
    if (!nome || !re || !setor || !turno || !telefone) {
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
        await updateFuncionario(employeeId, nome, re, setor, turno, telefone);
      } else {
        await addFuncionario(nome, re, setor, turno, telefone);
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

  const handleDeleteSetor = async (setorParaDeletar) => {
    const isSetorInUse = allFuncionarios.some(f => f.setor === setorParaDeletar);

    if (isSetorInUse) {
      setAlertInfo({
        visible: true,
        type: 'warning',
        title: 'Ação Bloqueada',
        message: `O setor "${setorParaDeletar}" está em uso e não pode ser excluído.`,
        buttons: [{ text: 'Entendi' }],
      });
      return;
    }

    setAlertInfo({
      visible: true,
      type: 'confirm',
      title: 'Excluir Setor',
      message: `Tem certeza que deseja remover o setor "${setorParaDeletar}"?`,
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const novaLista = setoresUnicos.filter(s => s !== setorParaDeletar);
            setSetoresUnicos(novaLista);
            await AsyncStorage.setItem('@customSectors', JSON.stringify(novaLista.filter(s => !allFuncionarios.some(f => f.setor === s))));
          },
        },
      ],
    });
  };

  const handleDeleteTurno = async (turnoParaDeletar) => {
    const isTurnoInUse = allFuncionarios.some(f => f.turno === turnoParaDeletar);

    if (isTurnoInUse) {
      setAlertInfo({
        visible: true,
        type: 'warning',
        title: 'Ação Bloqueada',
        message: `O turno "${turnoParaDeletar}" está em uso e não pode ser excluído.`,
        buttons: [{ text: 'Entendi' }],
      });
      return;
    }

    setAlertInfo({
      visible: true,
      type: 'confirm',
      title: 'Excluir Turno',
      message: `Tem certeza que deseja remover o turno "${turnoParaDeletar}"?`,
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const novaLista = turnosUnicos.filter(t => t !== turnoParaDeletar);
            setTurnosUnicos(novaLista);
            await AsyncStorage.setItem('@customTurnos', JSON.stringify(novaLista.filter(t => !allFuncionarios.some(f => f.turno === t))));
          },
        },
      ],
    });
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

        <Text style={styles.label}>Telefone</Text>
        <TextInput placeholder="(XX) XXXXX-XXXX" placeholderTextColor="#888" value={telefone} onChangeText={handlePhoneChange} keyboardType="phone-pad" style={styles.input} maxLength={15} />

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
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.modalOption}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { setSetor(item); setSetorModalVisible(false); }}>
                    <Text style={styles.modalOptionText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSetor(item)} style={{ padding: 5 }}>
                    <Ionicons name="close-circle" size={22} color="#dc3545" />
                  </TouchableOpacity>
                </View>
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
                <View style={styles.modalOption}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { setTurno(item); setTurnoModalVisible(false); }}>
                    <Text style={styles.modalOptionText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTurno(item)} style={{ padding: 5 }}>
                    <Ionicons name="close-circle" size={22} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      <CustomAlert {...alertInfo} onClose={() => setAlertInfo({ visible: false })} />
    </KeyboardAvoidingView>
  );
}
