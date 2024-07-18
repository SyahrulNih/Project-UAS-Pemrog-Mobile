// app.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboardScreen from './src/screens/DashboardAdmin';
import UserDashboardScreen from './src/screens/DashboardUser';
import UserTable from './src/screens/Admin/DataUser';
import PengajianInput from './src/screens/Admin/PengajianInput';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DashboardAdmin" component={AdminDashboardScreen} />
        <Stack.Screen name="DashboardUser" component={UserDashboardScreen} />
        <Stack.Screen name="UserTable" component={UserTable} />
        <Stack.Screen name="PengajianInput" component={PengajianInput} options={{ title: 'Pengajian Input' }} />
        {/* Tambahkan screen lain sesuai kebutuhan Anda */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
