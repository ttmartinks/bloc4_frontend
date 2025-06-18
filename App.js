import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des composants
import HomeComponent from './components/Home';
import LoginComponent from './components/Login';
import SignUpComponent from './components/SignUp';
import MainPageComponent from './components/MainPage';
import BreathExerciseComponent from './components/BreathExercise';
import RessourcesComponent from './components/Ressources';
import RessourceComponent from './components/Ressource';
import AdminUserComponent from './components/AdminUser';
import UserSettingsComponent from './components/UserSettings';



const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null); // État pour la route initiale

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Récupérer le token
        if (token) {
          setInitialRoute('MainPage'); // Si un token est présent, définir MainPage comme route initiale
        } else {
          setInitialRoute('Home'); // Sinon, définir Home comme route initiale
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        setInitialRoute('Home'); // En cas d'erreur, définir Home comme route initiale
      }
    };

    checkToken();
  }, []);

  // Afficher un écran de chargement tant que la route initiale n'est pas déterminée
  if (initialRoute === null) {
    return null; // Ou un composant de chargement personnalisé
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeComponent} />
        <Stack.Screen name="Login" component={LoginComponent} />
        <Stack.Screen name="SignUp" component={SignUpComponent} />
        <Stack.Screen name="MainPage" component={MainPageComponent} />
        <Stack.Screen name="BreathExercise" component={BreathExerciseComponent} />
        <Stack.Screen name="Ressources" component={RessourcesComponent} />
        <Stack.Screen name="Ressource" component={RessourceComponent} />
        <Stack.Screen name="AdminUser" component={AdminUserComponent} />
        <Stack.Screen name="UserSettings" component={UserSettingsComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}