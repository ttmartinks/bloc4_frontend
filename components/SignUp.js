import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { createUser } from '../fetch/fetchUser';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  const validateInputs = () => {
    if (!email || !pseudo || !password || !age) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return false;
    }

    if (pseudo.length < 3) {
      Alert.alert('Erreur', 'Le pseudonyme doit contenir au moins 3 caractères.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }

    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un âge valide.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    try {
      const data = await createUser(email, pseudo, age, password);
      Alert.alert('Succès', 'Compte créé avec succès !');
      navigation.navigate('Login'); // Redirige vers la page de connexion
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la création du compte.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Image source={require('../assets/img/logo_cesizen_mini.png')} style={styles.logo} />
      <Text style={styles.title}>Inscription</Text>
      <Text style={styles.subtitle}>
        Inscrivez-vous maintenant pour accéder à toutes les fonctionnalités !
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse email..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Pseudonyme..."
        value={pseudo}
        onChangeText={setPseudo}
      />
      <TextInput
        style={styles.input}
        placeholder="Age..."
        value={age}
        onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>SIGNUP</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>Vous avez déjà un compte?</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.backButtonWrapper}
      >
        <Text style={styles.registerLink}>Connectez-vous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.backButtonWrapper}
      >
        <Text style={styles.backButton}>Retour à l'accueil</Text>
      </TouchableOpacity>

      <Image source={require('../assets/img/leaf_bottom_page.png')} style={styles.logo_bottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    marginTop: 50,
    marginBottom: 50,
  },
  logo_bottom: {
    marginTop: 60,
    width: '100%',
    resizeMode: 'contain',
    zIndex: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#666',
    fontSize: 18,
    marginTop: 20,
  },
  registerLink: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    zIndex: 1,
  },
  backButtonWrapper: {
    marginBottom: 60,
    zIndex: 1,
  },
  backButton: {
    fontSize: 20,
    marginTop: 30,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});