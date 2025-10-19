import { useEffect, useState, useCallback } from 'react';
import {
  createTable,
  getFuncionarios,
  addFuncionario as dbAddFuncionario,
  updateFuncionario as dbUpdateFuncionario,
  deleteFuncionario as dbDeleteFuncionario,
  clearFuncionarios as dbClearFuncionarios,
} from '@/sqLite/SQLiteConecction';

export default function useFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Cria tabela e carrega dados na inicialização
  const loadFuncionarios = useCallback(async () => {
    try {
      setLoading(true);
      await createTable();
      const data = await getFuncionarios();
      setFuncionarios(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Adiciona funcionário
  const addFuncionario = useCallback(async (novoFuncionario) => {
    try {
      await dbAddFuncionario(novoFuncionario);
      await loadFuncionarios();
    } catch (err) {
      console.error('Erro ao adicionar funcionário:', err);
      setError(err.message);
    }
  }, [loadFuncionarios]);

  // 🔹 Atualiza funcionário
  const updateFuncionario = useCallback(async (funcionarioAtualizado) => {
    try {
      await dbUpdateFuncionario(funcionarioAtualizado);
      await loadFuncionarios();
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
      setError(err.message);
    }
  }, [loadFuncionarios]);

  // 🔹 Exclui funcionário
  const deleteFuncionario = useCallback(async (id) => {
    try {
      await dbDeleteFuncionario(id);
      await loadFuncionarios();
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err);
      setError(err.message);
    }
  }, [loadFuncionarios]);

  // 🔹 Limpa tabela
  const clearAll = useCallback(async () => {
    try {
      await dbClearFuncionarios();
      setFuncionarios([]);
    } catch (err) {
      console.error('Erro ao limpar tabela:', err);
      setError(err.message);
    }
  }, []);

  // 🔹 Carrega na montagem
  useEffect(() => {
    loadFuncionarios();
  }, [loadFuncionarios]);

  return {
    funcionarios,
    loading,
    error,
    loadFuncionarios,
    addFuncionario,
    updateFuncionario,
    deleteFuncionario,
    clearAll,
  };
}
