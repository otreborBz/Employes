import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateModal from '@/components/updateModal/UpdateModal';

export default function useCheckUpdate() {
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    async function checkForUpdate() {
      try {
        // URL que contém as informações da nova versão
        const response = await fetch('https://seu-servidor.com/update.json');
        const data = await response.json();

        const currentVersion = Constants.expoConfig.version;
        const latestVersion = data.version;

        if (latestVersion !== currentVersion) {
          // Verifica se o usuário adiou recentemente
          const lastRemindTime = await AsyncStorage.getItem('lastRemindTime');

          if (lastRemindTime) {
            const lastRemind = new Date(Number(lastRemindTime));
            const now = new Date();

            const hoursDiff = (now.getTime() - lastRemind.getTime()) / 1000 / 60 / 60;
          }

          setUpdateInfo(data);
        }
      } catch (error) {
        console.log('Erro ao verificar atualização:', error);
      }
    }

    checkForUpdate();
  }, []);

  async function handleRemindLater() {
    await AsyncStorage.setItem('lastRemindTime', Date.now().toString());
    setUpdateInfo(null);
  }

  return (
    <>
      {updateInfo && (
        <UpdateModal
          visible={true}
          onUpdate={() => {
            // ação de atualizar (abrir link, etc)
            setUpdateInfo(null);
          }}
          onRemindLater={handleRemindLater}
        />
      )}
    </>
  );
}
