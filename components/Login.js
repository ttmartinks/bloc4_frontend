import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../fetch/fetchUser';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const data = await loginUser(email, password);
      if (!data.token || !data.user_id) {
        throw new Error('Données invalides retournées par le serveur.');
      }

      
      // Stocker le token dans AsyncStorage
      await Promise.all([
      AsyncStorage.setItem('token', String(data.token)),
      AsyncStorage.setItem('user_id', String(data.user_id)),
      AsyncStorage.setItem('role_id', String(data.role_id)),
      ]);
      Alert.alert('Succès', 'Connexion réussie !');
      navigation.navigate('MainPage'); // Rediriger vers la page principale
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de se connecter.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Image
        source={require('../assets/img/logo_cesizen_mini.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Connexion</Text>
      <Text style={styles.subtitle}>
        Connectez-vous maintenant pour accéder à toutes les fonctionnalités !
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>Vous avez déjà un compte?</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={styles.signUpButton}>
        <Text style={styles.registerLink}>Inscrivez-vous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.backButtonWrapper}>
        <Text style={styles.backButton}>Retour à l'accueil</Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/img/leaf_bottom_page.png')}
        style={styles.logo_bottom}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  logo: {
    marginTop: 50,
    marginBottom: 50,
  },
  logo_bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    resizeMode: 'contain',
    zIndex: 0, // S'assurer que l'image est derrière tous les autres éléments
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
  forgotPassword: {
    fontSize: 16,
    color: '#888',
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 15,
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
  signUpButton: {
    zIndex: 1,
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
    marginBottom: 60, // Ajout de marginBottom pour éloigner un peu plus le bouton de l'image
    zIndex: 1,
  },
  backButton: {
    fontSize: 20,
    marginTop: 50,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
