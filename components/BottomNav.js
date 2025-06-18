import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BottomNav({ navigation }) {
  const handleNavigation = async (route) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token && route === 'UserSettings') {
        // Si pas de token et l'utilisateur essaie d'accéder à "Profil"
        Alert.alert('Non connecté', 'Veuillez vous connecter pour accéder à cette page.');
        navigation.navigate('Login'); // Rediriger vers la page de connexion
      } else {
        navigation.navigate(route); // Naviguer normalement
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token :', error);
      navigation.navigate('Login'); // En cas d'erreur, rediriger vers la page de connexion
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => handleNavigation('Ressources')}>
        <Text style={styles.navIcon}>📖</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('BreathExercise')}>
        <Text style={styles.navIcon}>🫁</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('MainPage')}>
        <Text style={styles.navIcon}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('UserSettings')}>
        <Text style={styles.navIcon}>👤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
  },
});