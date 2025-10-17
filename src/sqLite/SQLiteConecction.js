import { openDatabaseAsync } from 'expo-sqlite';

// abre (ou cria) o banco local
const dbPromise = openDatabaseAsync('empresa.db');

// cria a tabela, se não existir
export const createTable = async () => {
  const db = await dbPromise;
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS funcionarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        re TEXT,
        setor TEXT,
        turno TEXT
      );`
  );

  
  // Garante que a coluna 'turno' exista em instalações antigas
  const columns = await db.getAllAsync(`PRAGMA table_info(funcionarios);`);
  if (!columns.some(c => c.name === 'turno')) {
    await db.execAsync('ALTER TABLE funcionarios ADD COLUMN turno TEXT;');
    console.log('✅ Coluna "turno" adicionada à tabela.');
  }
};

// inserir um funcionário
export const addFuncionario = async (nome, re, setor, turno) => {
  const db = await dbPromise;
  const result = await db.runAsync(
    'INSERT INTO funcionarios (nome, re, setor, turno) VALUES (?, ?, ?, ?);',
    [nome.toUpperCase(), re, setor.toUpperCase(), turno]
  );
  console.log('✅ Inserido com sucesso, ID:', result.lastInsertRowId);
};

// buscar todos
export const getFuncionarios = async () => {
  const db = await dbPromise;
  const allRows = await db.getAllAsync('SELECT * FROM funcionarios;');
  return allRows;
};

// buscar um funcionário pelo ID
export const getFuncionarioById = async (id) => {
  const db = await dbPromise;
  const funcionario = await db.getFirstAsync('SELECT * FROM funcionarios WHERE id = ?;', [id]);
  return funcionario;
};

// deletar um funcionário pelo ID
export const deleteFuncionario = async id => {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM funcionarios WHERE id = ?;', [id]);
  console.log(`✅ Funcionário com ID ${id} deletado.`);
};

// atualizar um funcionário
export const updateFuncionario = async (id, nome, re, setor, turno) => {
  const db = await dbPromise;
  const result = await db.runAsync('UPDATE funcionarios SET nome = ?, re = ?, setor = ?, turno = ? WHERE id = ?;', [
    nome.toUpperCase(), re, setor.toUpperCase(), turno, id
  ]);
  console.log(`✅ Funcionário com ID ${id} atualizado. Linhas afetadas: ${result.changes}`);
};

// deletar todos (opcional)
export const clearFuncionarios = async () => {
  const db = await dbPromise;
  await db.execAsync('DELETE FROM funcionarios;');
};
