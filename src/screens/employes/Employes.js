import CustomAlert from '@/components/alert/Alert';
import {
  deleteFuncionario,
  getFuncionarios
} from '@/sqLite/SQLiteConecction';
import {
  Ionicons
} from '@expo/vector-icons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CardEmployes from '@/components/cardEmployes/CardEmployes';
import styles from './styles/index.js';

export default function Employes() {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [multiShareModalVisible, setMultiShareModalVisible] = useState(false);
  const [shareOptions, setShareOptions] = useState({});

  const [alertInfo, setAlertInfo] = useState({ visible: false });

  // Efeito para carregar os dados quando a tela está em foco
  useEffect(() => {
    if (isFocused) {
      carregar();
      // Limpa a seleção ao focar na tela
      cancelSelection();
    }
  }, [isFocused]);

  // Efeito para aplicar o filtro vindo da navegação (da tela Home)
  useEffect(() => {
    // Log para depuração: verifica os parâmetros recebidos pela rota
    console.log('[Employes.js] Rota focada. Parâmetros recebidos:', route.params);
    if (isFocused && route.params) {
      if (route.params.filtro === null) {
        // Se o filtro for explicitamente nulo, limpa a busca
        setBusca('');
      } else if (route.params.filtro) {
        // Se houver um filtro, aplica-o
        setBusca(route.params.filtro);
      }
    }
  }, [isFocused, route.params?.filtro]);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await getFuncionarios();
      setLista(data);
    } catch (error) {
      console.error(error);
      setAlertInfo({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os funcionários.',
        buttons: [{ text: 'OK' }],
      });
    } finally {
      setLoading(false);
    }
  };

  const excluir = async (item) => {
    setAlertInfo({
      visible: true,
      type: 'confirm',
      title: 'Excluir Funcionário',
      message: `Tem certeza que deseja remover ${item.nome}?`,
      buttons: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteFuncionario(item.id);
            await carregar();
          },
        },
      ],
    });
  };

  // 🔗 Compartilhar Funcionário via WhatsApp
  const handleShare = async (item) => {
    if (!item) return;

    const performShare = async (includeAddress) => {
      let message = `*Detalhes do Funcionário*\n\n*Nome:* ${item.nome}\n*RE:* ${item.re}\n*Setor:* ${item.setor}\n*Turno:* ${item.turno}\n*Telefone:* ${item.telefone}`;
      if (includeAddress && item.endereco) {
        message += `\n*Endereço:* ${item.endereco}`;
      }
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

    if (item.endereco) {
      setAlertInfo({
        visible: true,
        type: 'confirm',
        title: 'Incluir Endereço?',
        message: 'Deseja incluir o endereço do funcionário no compartilhamento?',
        buttons: [
          {
            text: 'Não, omitir',
            style: 'cancel',
            onPress: () => performShare(false),
          },
          {
            text: 'Sim, incluir',
            onPress: () => performShare(true),
          },
        ],
      });
    } else {
      // Se não houver endereço, compartilha diretamente
      performShare(false);
    }
  };

  // 🔵 Funções para o modo de seleção
  const handleLongPress = (item) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedItems([item.id]);
    }
  };

  const handlePress = (item) => {
    if (selectionMode) {
      const newSelectedItems = selectedItems.includes(item.id)
        ? selectedItems.filter(id => id !== item.id)
        : [...selectedItems, item.id];

      setSelectedItems(newSelectedItems);

      if (newSelectedItems.length === 0) cancelSelection();
    }
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedItems([]);
  };

  const handleMultiShare = async () => {
    if (selectedItems.length === 0) return;

    const initialOptions = {};
    lista.filter(f => selectedItems.includes(f.id)).forEach(f => {
      // Por padrão, inclui o endereço se ele existir
      initialOptions[f.id] = !!f.endereco;
    });
    setShareOptions(initialOptions);
    setMultiShareModalVisible(true);
  };

  const performFinalMultiShare = async () => {
    const funcionariosSelecionados = lista.filter(f => selectedItems.includes(f.id));

    let message = '*Lista de Funcionários*\n\n';
    funcionariosSelecionados.forEach((item, index) => {
      message += `*${index + 1}. ${item.nome}*\n`;
      message += `   - RE: ${item.re}\n`;
      message += `   - Setor: ${item.setor}\n`;
      message += `   - Turno: ${item.turno}\n`;
      message += `   - Telefone: ${item.telefone}\n`;
      // Verifica a opção individual para cada funcionário
      if (shareOptions[item.id] && item.endereco) {
        message += `   - Endereço: ${item.endereco}\n`;
      }
      message += '\n';
    });

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      setAlertInfo({ visible: true, type: 'error', title: 'Erro', message: 'Não foi possível abrir o WhatsApp.', buttons: [{ text: 'OK' }] });
    } finally {
      setMultiShareModalVisible(false);
      cancelSelection();
    }
  };

  // Combina os turnos base com os já cadastrados para ter uma lista completa e sem duplicatas
  const turnosUnicos = [...new Set(lista.map(f => f.turno).filter(Boolean).sort())];
  const setoresUnicos = [...new Set(lista.map(f => f.setor).filter(s => s && s.trim() !== ''))];

  const filtrados = lista.filter(funcionario => {
    const buscaLower = busca.toLowerCase();

    // Verifica se o termo de busca corresponde exatamente a um turno ou setor conhecido
    const isTurnoFilter = turnosUnicos.some(t => t.toLowerCase() === buscaLower);
    const isSetorFilter = setoresUnicos.some(s => s.toLowerCase() === buscaLower);

    if (isTurnoFilter) {
      return funcionario.turno && funcionario.turno.toLowerCase() === buscaLower;
    } else if (isSetorFilter) {
      return funcionario.setor && funcionario.setor.toLowerCase() === buscaLower;
    } else {
      return funcionario.nome.toLowerCase().includes(buscaLower);
    }
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        {selectionMode ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
            paddingTop: Constants.statusBarHeight + 15,
            backgroundColor: '#e7f3ff',
            borderBottomWidth: 1,
            borderBottomColor: '#cce5ff',
          }}>
            <TouchableOpacity onPress={cancelSelection}>
              <Ionicons name="close" size={26} color="#007bff" />
            </TouchableOpacity>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#004085',
            }}>
              {selectedItems.length} selecionado(s)
            </Text>
            <TouchableOpacity onPress={handleMultiShare}>
              <Ionicons name="share-social" size={26} color="#007bff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Funcionários</Text>
          </View>
        )}

        {/* Busca */}
        <TextInput
          placeholder="🔍 Buscar por nome, setor ou turno"
          placeholderTextColor="#888"
          value={busca}
          onChangeText={setBusca}
          style={styles.searchInput}
        />

        {/* Lista */}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
        ) : filtrados.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum funcionário encontrado</Text>
        ) : (
          <CardEmployes
            data={filtrados}
            onLongPress={handleLongPress}
            onPress={handlePress}
            onEdit={(item) => navigation.navigate('AddEditEmployee', { employeeId: item.id })} // Para o menu de 3 pontos
            onDelete={excluir}
            onShare={handleShare}
            selectionMode={selectionMode}
            selectedItems={selectedItems}
          />

        )}
      </KeyboardAvoidingView>

      {/* Modal para configurar compartilhamento múltiplo */}
      <Modal
        visible={multiShareModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMultiShareModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setMultiShareModalVisible(false)}>
              <Ionicons name="close" size={26} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Configurar Compartilhamento</Text>
            <Text style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>
              Selecione para quais funcionários deseja incluir o endereço.
            </Text>

            {lista.filter(f => selectedItems.includes(f.id)).map(item => (
              <View key={item.id} style={styles.shareOptionRow}>
                <Text style={styles.shareOptionName}>{item.nome}</Text>
                {item.endereco ? (
                  <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={shareOptions[item.id] ? '#007bff' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() =>
                      setShareOptions(prev => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    value={shareOptions[item.id]}
                  />
                ) : (
                  <Text style={styles.noAddressText}>Sem endereço</Text>
                )}
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setMultiShareModalVisible(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={performFinalMultiShare}>
                <Text style={[styles.btnText, { color: '#fff' }]}>Compartilhar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>


      <CustomAlert {...alertInfo} onClose={() => setAlertInfo({ visible: false })} />
    </View>
  );
}
