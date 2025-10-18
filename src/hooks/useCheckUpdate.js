import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import UpdateModal from '@/components/updateModal/UpdateModal';

export default function useCheckUpdate() {
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    async function checkForUpdate() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/otreborBz/employees-update/refs/heads/main/update.json');
        const data = await response.json();

        const localVersion = Constants.expoConfig.version;
        const remoteVersion = data.latestVersion;

        console.log('Local Version:', localVersion);
        console.log('Remote Version:', remoteVersion);




        if (isNewerVersion(remoteVersion, localVersion)) {
          setUpdateInfo({
            changelog: data.updateMessage,
            version: remoteVersion,
            apkUrl: data.downloadUrl,
          });
        }
      } catch (error) {
        console.log('Erro ao verificar atualização:', error);
      }
    }

    checkForUpdate();
  }, []);

  return (
    updateInfo && (
      <UpdateModal
        visible={true}
        changelog={updateInfo.changelog}
        version={updateInfo.version}
        apkUrl={updateInfo.apkUrl}
        onClose={() => setUpdateInfo(null)}
      />
    )
  );
}

function isNewerVersion(remote, local) {
  const r = remote.split('.').map(Number);
  const l = local.split('.').map(Number);
  for (let i = 0; i < r.length; i++) {
    if (r[i] > (l[i] || 0)) return true;
    if (r[i] < (l[i] || 0)) return false;
  }
  return false;
}
