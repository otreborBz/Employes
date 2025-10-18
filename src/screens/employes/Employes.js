import CustomAlert from '@/components/alert/Alert';
import {
  createTable,
  deleteFuncionario,
  getFuncionarios
} from '@/sqLite/SQLiteConecction';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TextInput,
  View
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

  const [alertInfo, setAlertInfo] = useState({ visible: false });

  // Efeito para carregar os dados quando a tela está em foco
  useEffect(() => {
    if (isFocused) {
      createTable().then(() => carregar());
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
    const message = `*Detalhes do Funcionário*\n\n*Nome:* ${item.nome}\n*RE:* ${item.re}\n*Setor:* ${item.setor}\n*Turno:* ${item.turno}\n*Telefone:* ${item.telefone}`;
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Funcionários</Text>
        </View>

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
            onEdit={(item) => navigation.navigate('AddEditEmployee', { employeeId: item.id })}
            onDelete={excluir}
            onShare={handleShare}
          />

        )}
      </KeyboardAvoidingView>

      <CustomAlert {...alertInfo} onClose={() => setAlertInfo({ visible: false })} />
    </View>
  );
}
