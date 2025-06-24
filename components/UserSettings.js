import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { getUserById, updateUser } from '../fetch/fetchUser';
import { getRessourcesUser, getFavoriteRessourcesByUser } from '../fetch/fetchRessource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './BottomNav';


export default function UserSettings({ navigation }) {
  const [user, setUser] = useState(null); // Informations utilisateur
  const [resources, setResources] = useState([]); // Dernières ressources publiées
  const [favorites, setFavorites] = useState([]); // Dernières ressources favorites
  const [jwt, setJwt] = useState(null); // Token JWT
  const [editableUser, setEditableUser] = useState({
    pseudo_user: '',
    email_user: '',
    age_user: '',
    password_user: '', // Champ mot de passe
  });

  // Vérification du JWT et récupération des données utilisateur
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('user_id');
      if (!token || !userId) {
        Alert.alert('Erreur', 'Vous devez être connecté.');
        navigation.navigate('Login');
        return;
      }
      setJwt(token);

      // Récupérer les informations utilisateur
      const userData = await getUserById(userId, token);
      setUser(userData);
      setEditableUser({
        pseudo_user: userData.pseudo_user,
        email_user: userData.email_user,
        age_user: userData.age_user.toString(),
        password_user: '',
      });

      // Récupérer les ressources publiées
      try {
        const userResources = await getRessourcesUser(userId, token);
        setResources(userResources);
      } catch (error) {
        console.warn("Erreur lors de la récupération des ressources de l'utilisateur :", error);
        setResources([]); // Si erreur, mettre un tableau vide par exemple
      }

      // Récupérer les ressources favorites
      try {
        const userFavorites = await getFavoriteRessourcesByUser(userId, token);
        setFavorites(userFavorites);
      } catch (error) {
        console.warn("Erreur lors de la récupération des ressources favorites :", error);
        setFavorites([]); // Pareil ici
      }

    } catch (error) {
      console.error("Erreur générale lors du chargement des données utilisateur :", error);
    }
  };

  fetchUserData();
}, []);

  // Gestion de la mise à jour des informations utilisateur
  const handleUpdateUser = async () => {
    try {
      const updatedData = {
        pseudo: editableUser.pseudo_user,
        email: editableUser.email_user,
        age: parseInt(editableUser.age_user, 10),
        ...(editableUser.password_user && { password: editableUser.password_user }), // Inclure le mot de passe uniquement s'il est modifié
      };
      await updateUser(user.id_user, updatedData, jwt);
      Alert.alert('Succès', 'Vos informations ont été mises à jour.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations utilisateur :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour vos informations.');
    }
  };

  // Gestion de la désactivation du compte
  const handleDeactivateAccount = async () => {
    try {
      const updatedData = { status: 'inactive' }; // Mettre à jour le statut de l'utilisateur
      await updateUser(user.id_user, updatedData, jwt);
      Alert.alert('Compte désactivé', 'Votre compte a été désactivé.');
      navigation.navigate('Login'); // Redirection vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de la désactivation du compte :', error);
      Alert.alert('Erreur', 'Impossible de désactiver le compte.');
    }
  };

  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('role_id');
      Alert.alert('Déconnexion', 'Vous avez été déconnecté.');
      navigation.navigate('Login'); // Redirection vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    }
  };
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  const isWeb = Platform.OS === 'web';

  return (

      <View style={[styles.container, isWeb && styles.webMainContainer]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={isWeb ? styles.webScrollView : undefined}
      >
    
      <Text style={styles.title}>Gestion du compte</Text>

      {/* Informations utilisateur */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <TextInput
          style={styles.input}
          placeholder="Pseudo"
          value={editableUser.pseudo_user}
          onChangeText={(text) => setEditableUser({ ...editableUser, pseudo_user: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={editableUser.email_user}
          onChangeText={(text) => setEditableUser({ ...editableUser, email_user: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Âge"
          value={editableUser.age_user}
          keyboardType="numeric"
          onChangeText={(text) => setEditableUser({ ...editableUser, age_user: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          value={editableUser.password_user}
          secureTextEntry={true}
          onChangeText={(text) => setEditableUser({ ...editableUser, password_user: text })}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUser}>
          <Text style={styles.updateButtonText}>Mettre à jour</Text>
        </TouchableOpacity>
      </View>

      {/* Dernières ressources publiées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos dernières ressources</Text>
        {resources.length > 0 ? (
          resources.map((resource) => (
            <TouchableOpacity
              key={resource.id_ressource}
              style={styles.resourceCard}
              onPress={() => navigation.navigate('RessourceDetails', { id: resource.id_ressource })}
            >
              <Text style={styles.resourceTitle}>{resource.title_ressource}</Text>
              <Text style={styles.resourceContent}>{resource.content_ressource.substring(0, 35)}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucune ressource publiée.</Text>
        )}
      </View>

      {/* Dernières ressources favorites */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos ressources favorites</Text>
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <TouchableOpacity
              key={favorite.id_favorite}
              style={styles.resourceCard}
              onPress={() => navigation.navigate('RessourceDetails', { id: favorite.id_ressource })}
            >
              <Text style={styles.resourceTitle}>{favorite.title_ressource}</Text>
              <Text style={styles.resourceContent}>{favorite.content_ressource.substring(0, 35)}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucune ressource favorite.</Text>
        )}
      </View>

      {/* Bouton de désactivation du compte */}
      <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivateAccount}>
        <Text style={styles.deactivateButtonText}>Désactiver le compte</Text>
      </TouchableOpacity>

      {/* Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    
    
    </ScrollView>
    <BottomNav navigation={navigation} />
    </View>
         

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  resourceCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resourceContent: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  deactivateButton: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  deactivateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  // Styles spécifiques au web
  webMainContainer: {
    height: '100vh',
    overflow: 'hidden',
  },
  webScrollView: {
    height: '100%',
    overflow: 'auto',
  },
});