import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomTabBarButton from '@/components/customTabButton/CustomTabBarButton';
import Employes from '@/screens/employes/Employes';
import Home from '@/screens/home/Home';
import AddEditEmployee from '@/screens/newEmployes/NewEmployes';

import styles from './styles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DummyComponent = () => null;

function EmployesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeList" component={Employes} />
      <Stack.Screen name="AddEditEmployee" component={AddEditEmployee} />
    </Stack.Navigator>
  );
}

function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size * 1.1} />
          ),
        }}
      />
      <Tab.Screen
        name="NewEmployees"
        component={DummyComponent}
        options={{
          tabBarButton: () => <CustomTabBarButton />,
        }}
      />

      <Tab.Screen
        name="Employes"
        component={EmployesStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Employes', { screen: 'EmployeeList', params: { filtro: null } });
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size * 1.1} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <TabRoutes />
    </NavigationContainer>
  );
}
