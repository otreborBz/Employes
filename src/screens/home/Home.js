import CustomAlert from '@/components/alert/Alert';
import { addFuncionario, clearFuncionarios, createTable, getFuncionarios } from '@/sqLite/SQLiteConecction';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from './styles';
import useCheckUpdate from '@/hooks/useCheckUpdate';


export default function Home() {
  const updateModal = useCheckUpdate();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [funcionarios, setFuncionarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ nome: '', re: '', setor: '', turno: '' });
  const [setorModalVisible, setSetorModalVisible] = useState(false);
  const [novoSetorInput, setNovoSetorInput] = useState('');
  const [viewSetoresModal, setViewSetoresModal] = useState(false);
  const [viewEmployeeModal, setViewEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [userName, setUserName] = useState('');
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [inputName, setInputName] = useState('');
  const [alertInfo, setAlertInfo] = useState({ visible: false });
  const [turnoModalVisible, setTurnoModalVisible] = useState(false);
  const [novoTurnoInput, setNovoTurnoInput] = useState('');
  const [managementModalVisible, setManagementModalVisible] = useState(false);

  const loadData = async () => {
    try {
      await createTable(); // Garante que a tabela exista antes de ler
      const data = await getFuncionarios();
      setFuncionarios(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setAlertInfo({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os funcionários.',
        buttons: [{ text: 'OK' }],
      });
    }
  };

  useEffect(() => {
    const checkUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@userName');
        if (storedName) {
          setUserName(storedName);
        } else {
          setNameModalVisible(true); // Pede o nome se não houver
        }
      } catch (e) { console.error("Erro ao ler nome do usuário", e); }
    };
    checkUserName();
  }, []);

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused]);

  const total = funcionarios.length;
  const setores = [...new Set(funcionarios.map(f => f.setor))];
  const ultimoFuncionario = funcionarios.length > 0 ? funcionarios[funcionarios.length - 1] : null;
  const turnosUnicos = [...new Set(funcionarios.map(f => f.turno).filter(Boolean).sort())];

  // Agrupa funcionários por turno para os cards
  const funcionariosPorTurno = funcionarios.reduce((acc, func) => {
    const turno = func.turno || 'N/D';
    acc[turno] = (acc[turno] || 0) + 1;
    return acc;
  }, {});
  // Ordena os turnos para exibição consistente
  const turnosOrdenados = Object.keys(funcionariosPorTurno).sort();

  const handleAdd = async () => {
    if (!newEmployee.nome || !newEmployee.re || !newEmployee.setor || !newEmployee.turno) {
      setAlertInfo({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Por favor, preencha todos os campos.',
        buttons: [{ text: 'OK' }],
      });
      return;
    }

    try {
      await addFuncionario(newEmployee.nome, newEmployee.re, newEmployee.setor, newEmployee.turno);
      setNewEmployee({ nome: '', re: '', setor: '', turno: '' });
      setModalVisible(false);
      Keyboard.dismiss();
      await loadData();
      setAlertInfo({
        visible: true,
        type: 'success',
        title: 'Sucesso!',
        message: 'Funcionário adicionado com sucesso.',
        buttons: [{ text: 'OK' }],
      });
    } catch (error) {
      console.error("Erro ao adicionar funcionário:", error);
      setAlertInfo({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível salvar o funcionário.',
        buttons: [{ text: 'OK' }],
      });
    }
  };

  const handleSaveName = async () => {
    if (inputName.trim()) {
      try {
        await AsyncStorage.setItem('@userName', inputName.trim().toUpperCase());
        setUserName(inputName.trim());
        setInputName('');
        setNameModalVisible(false);
      } catch (e) { console.error("Erro ao salvar nome do usuário", e); }
    } else {
      setAlertInfo({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Por favor, digite seu nome.',
        buttons: [{ text: 'OK' }],
      });
    }
  };

  const handleDeleteSetor = async (setorParaDeletar) => {
    const isSetorInUse = funcionarios.some(f => f.setor === setorParaDeletar);

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
      message: `O setor "${setorParaDeletar}" não está associado a nenhum funcionário. Deseja removê-lo da lista?`,
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover', style: 'destructive', onPress: () => {
            setSetorModalVisible(false);
          }
        },
      ],
    });
  };

  const confirmarLimpeza = () =>
    setAlertInfo({
      visible: true,
      type: 'confirm',
      title: 'Apagar Tudo',
      message: 'Tem certeza que deseja apagar todos os funcionários? Esta ação não pode ser desfeita.',
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await clearFuncionarios();
            await loadData();
          },
        },
      ],
    });

  // 📦 Exportar Backup
  const handleExportBackup = async () => {
    try {
      if (funcionarios.length === 0) {
        setAlertInfo({
          visible: true,
          type: 'warning',
          title: 'Sem Dados',
          message: 'Não há funcionários para exportar.',
          buttons: [{ text: 'OK' }],
        });
        return;
      }

      const backupData = {
        versao: '1.0',
        geradoEm: new Date().toISOString(),
        funcionarios: funcionarios,
      };

      const fileUri = FileSystemLegacy.documentDirectory + 'backup-funcionarios.json';
      await FileSystemLegacy.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));

      await Sharing.shareAsync(fileUri);

    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      setAlertInfo({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível gerar o backup.',
        buttons: [{ text: 'OK' }],
      });
    }
  };

  // 📥 Importar Backup
  const handleImportBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const content = await FileSystemLegacy.readAsStringAsync(fileUri);
      const data = JSON.parse(content);

      if (!data.funcionarios || !Array.isArray(data.funcionarios)) {
        throw new Error('Arquivo inválido');
      }

      const existingREs = new Set(funcionarios.map(f => f.re));
      let addedCount = 0;
      let skippedCount = 0;

      for (const f of data.funcionarios) {
        if (f.re && !existingREs.has(String(f.re))) {
          await addFuncionario(f.nome, f.re, f.setor, f.turno || 'Não definido');
          existingREs.add(String(f.re));
          addedCount++;
        } else {
          skippedCount++;
        }
      }

      await loadData();

      setAlertInfo({
        visible: true,
        type: addedCount > 0 ? 'success' : 'info',
        title: 'Importação Concluída',
        message: `${addedCount} funcionário(s) adicionado(s).\n${skippedCount} duplicado(s) ou inválido(s) foram ignorados.`,
        buttons: [{ text: 'OK' }],
      });
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      setAlertInfo({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível importar o backup.',
        buttons: [{ text: 'OK' }],
      });
    }
  };


  const handleAddNovoSetor = () => {
    if (novoSetorInput.trim()) {
      setNewEmployee({ ...newEmployee, setor: novoSetorInput.trim().toUpperCase() });
      setNovoSetorInput('');
      setSetorModalVisible(false);
    }
  };

  const handleAddNovoTurno = () => {
    if (novoTurnoInput.trim()) {
      setNewEmployee({ ...newEmployee, turno: novoTurnoInput.trim().toUpperCase() });
      setNovoTurnoInput('');
      setTurnoModalVisible(false);
    }
  };

  const handleShare = async (item) => {
    if (!item) return;
    const message = `*Detalhes do Funcionário*\n\n*Nome:* ${item.nome}\n*RE:* ${item.re}\n*Setor:* ${item.setor}\n*Turno:* ${item.turno}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setAlertInfo({ visible: true, type: 'error', title: 'Erro', message: 'WhatsApp não está instalado no seu dispositivo.', buttons: [{ text: 'OK' }] });
      }
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
      setAlertInfo({ visible: true, type: 'error', title: 'Erro', message: 'Não foi possível abrir o WhatsApp.', buttons: [{ text: 'OK' }] });
    }
  };

  const handleNavigateWithFilter = (filter) => {
    navigation.navigate('Employes', { screen: 'EmployeeList', params: { filtro: filter } });
  };

  return (

    <LinearGradient colors={['#F5F9FF', '#FFFFFF']} style={styles.container}>
      {updateModal}
      <View style={styles.container}> 
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>👋 Olá, {userName.toUpperCase() || 'bem-vindo'}!</Text>
            <TouchableOpacity onPress={() => setManagementModalVisible(true)}>
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* 🔹 Seção de visão geral */}
          <Text style={styles.sectionTitle}>📊 Visão Geral</Text>
          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                console.log('[Home.js] Navegando para a lista completa (limpando filtro).');
                navigation.navigate('Employes', { screen: 'EmployeeList', params: { filtro: null } });
              }}
            >
              <Ionicons name="people-outline" size={24} color="#007BFF" />
              <Text style={styles.cardTitle}>Funcionários</Text>
              <Text style={styles.cardNumber}>{total}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => setViewSetoresModal(true)}>
              <Ionicons name="business-outline" size={24} color="#28A745" />
              <Text style={styles.cardTitle}>Setores</Text>
              <Text style={styles.cardNumber}>{setores.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              // eslint-disable-next-line react/prop-types
              style={styles.card}
              disabled={!ultimoFuncionario}
              onPress={() => {
                setSelectedEmployee(ultimoFuncionario);
                setViewEmployeeModal(true);
              }}
            >
              <Ionicons name="time-outline" size={24} color="#FFC107" />
              <Text style={styles.cardTitle}>Último cadastrado</Text>
              <Text style={styles.cardSmall} numberOfLines={2} ellipsizeMode="tail">
                {funcionarios.length > 0 ? funcionarios[funcionarios.length - 1].nome.split(' ')[0] : '—'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🔹 Seção de Turnos */}
          <Text style={styles.sectionTitle}>👥 Funcionários por Turno</Text>
          <View style={styles.cardsContainer}>
            {turnosOrdenados.map((turno) => (
              <TouchableOpacity
                key={turno}
                style={styles.card}
                onPress={() => handleNavigateWithFilter(turno)}
              >
                <Ionicons name="time-outline" size={24} color="#6C63FF" />
                <Text style={styles.cardTitle}>Turno {turno}</Text>
                <Text style={styles.cardNumber}>{funcionariosPorTurno[turno]}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </View>

      {/* 🔹 Modal de cadastro com KeyboardAvoidingView */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Adicionar Funcionário</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Nome do funcionário"
                value={newEmployee.nome}
                onChangeText={text => setNewEmployee({ ...newEmployee, nome: text })}
                style={styles.modalInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="RE (Registro)"
                value={newEmployee.re}
                onChangeText={text => setNewEmployee({ ...newEmployee, re: text.replace(/[^0-9]/g, '') })}
                style={styles.modalInput}
                keyboardType="numeric"
              />
            </View>
            {/* Botão para abrir modal de setor */}
            <TouchableOpacity style={[styles.inputContainer, styles.selectorButton]} onPress={() => setSetorModalVisible(true)}>
              <Text style={newEmployee.setor ? styles.inputText : styles.placeholderText}>
                {newEmployee.setor || 'Selecione o Setor'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.inputContainer, styles.selectorButton]} onPress={() => setTurnoModalVisible(true)}>
              <Text style={newEmployee.turno ? styles.inputText : styles.placeholderText}>
                {newEmployee.turno || 'Selecione o Turno'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleAdd}>
              <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Seleção de Setor para a Home */}
      <Modal
        visible={setorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSetorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setSetorModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Setores</Text>

            {/* Input para adicionar novo setor */}
            <View style={styles.setorInputContainer}>
              <TextInput
                placeholder="Adicionar novo setor"
                value={novoSetorInput}
                onChangeText={setNovoSetorInput}
                style={styles.setorInput}
              />
              <TouchableOpacity style={styles.addSetorButton} onPress={handleAddNovoSetor}>
                <Ionicons name="add-circle" size={28} color="#007bff" />
              </TouchableOpacity>
            </View>

            {/* Lista de setores existentes */}
            <FlatList
              data={setores}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.setorOption}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { setNewEmployee({ ...newEmployee, setor: item }); setSetorModalVisible(false); }}>
                    <Text style={styles.setorOptionText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSetor(item)}>
                    <Ionicons name="trash-outline" size={22} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum setor cadastrado.</Text>}
              style={{ width: '100%' }}
            />
            <TouchableOpacity onPress={() => setSetorModalVisible(false)} style={styles.cancelButton}><Text style={styles.cancelText}>Fechar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Turno para a Home */}
      <Modal
        visible={turnoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTurnoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setTurnoModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Turnos</Text>
            <View style={styles.setorInputContainer}>
              <TextInput
                placeholder="Adicionar novo turno"
                placeholderTextColor="#888"
                value={novoTurnoInput}
                onChangeText={setNovoTurnoInput}
                style={styles.setorInput}
              />
              <TouchableOpacity style={styles.addSetorButton} onPress={handleAddNovoTurno}>
                <Ionicons name="add-circle" size={28} color="#007bff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={turnosUnicos}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.setorOption}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { setNewEmployee({ ...newEmployee, turno: item }); setTurnoModalVisible(false); }}><Text style={styles.setorOptionText}>{item}</Text></TouchableOpacity>
                </View>
              )}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para Visualizar Setores */}
      <Modal
        visible={viewSetoresModal}
        transparent
        animationType="fade"
        onRequestClose={() => setViewSetoresModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setViewSetoresModal(false)} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Setores Cadastrados</Text>
            <FlatList
              data={setores}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.setorOption}
                  onPress={() => {
                    setViewSetoresModal(false);
                    handleNavigateWithFilter(item);
                  }}
                >
                  <Ionicons name="business-outline" size={20} color="#007BFF" style={{ marginRight: 15 }} />
                  <Text style={styles.setorOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum setor cadastrado.</Text>}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para Visualizar Último Funcionário */}
      {funcionarios.length > 0 && (
        <Modal
          visible={viewEmployeeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setViewEmployeeModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setViewEmployeeModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Detalhes do Funcionário</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Ionicons name="person-circle-outline" size={26} color="#007BFF" style={styles.detailIcon} />
                  <View><Text style={styles.detailLabel}>Nome</Text>
                    <Text style={styles.detailValue}>{funcionarios[funcionarios.length - 1].nome}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="card-outline" size={26} color="#007BFF" style={styles.detailIcon} />
                  <View><Text style={styles.detailLabel}>RE</Text>
                    <Text style={styles.detailValue}>{funcionarios[funcionarios.length - 1].re}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="business-outline" size={26} color="#007BFF" style={styles.detailIcon} />
                  <View><Text style={styles.detailLabel}>Setor</Text>
                    <Text style={styles.detailValue}>{funcionarios[funcionarios.length - 1].setor}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={26} color="#007BFF" style={styles.detailIcon} />
                  <View>
                    <Text style={styles.detailLabel}>Nome</Text>
                    <Text style={styles.detailValue}>{funcionarios[funcionarios.length - 1].turno}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#25D366' }]} onPress={() => handleShare(funcionarios[funcionarios.length - 1])}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.modalButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para pedir o nome do usuário */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => { /* Impede o fechamento pelo botão de voltar */ }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Bem-vindo(a)!</Text>
            <Text style={{ color: '#555', textAlign: 'center', marginBottom: 20 }}>Para começar, como podemos te chamar?</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Digite seu nome"
                placeholderTextColor="#888"
                value={inputName}
                onChangeText={setInputName}
                style={styles.modalInput}
              />
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveName}><Text style={styles.modalButtonText}>Salvar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Gerenciamento (Configurações) */}
      <Modal
        visible={managementModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setManagementModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setManagementModalVisible(false)}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Opções</Text>

            <TouchableOpacity style={styles.managementOption} onPress={() => { setManagementModalVisible(false); setInputName(userName); setNameModalVisible(true); }}>
              <Ionicons name="person-circle-outline" size={24} color="#6f42c1" />
              <Text style={styles.managementOptionText}>Alterar Nome</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.managementOption} onPress={() => { setManagementModalVisible(false); handleImportBackup(); }}>
              <Ionicons name="cloud-download-outline" size={24} color="#28a745" />
              <Text style={styles.managementOptionText}>Importar Backup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.managementOption} onPress={() => { setManagementModalVisible(false); handleExportBackup(); }}>
              <Ionicons name="cloud-upload-outline" size={24} color="#007bff" />
              <Text style={styles.managementOptionText}>Exportar Backup</Text>
            </TouchableOpacity>

            {funcionarios.length > 0 && (
              <TouchableOpacity style={styles.managementOption} onPress={() => { setManagementModalVisible(false); confirmarLimpeza(); }}>
                <Ionicons name="trash-outline" size={24} color="#dc3545" />
                <Text style={[styles.managementOptionText, { color: '#dc3545' }]}>Limpar Tudo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <CustomAlert {...alertInfo} onClose={() => setAlertInfo({ visible: false })} />
    </LinearGradient>
  );
}
