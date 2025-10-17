import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Routes from '@/routes/Routes';


export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, }}>
        <Routes />
        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
