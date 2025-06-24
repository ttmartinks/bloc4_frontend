import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { getAllRessources, createRessource } from '../fetch/fetchRessource';
import BottomNav from './BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function Ressources({ navigation }) {
  const [ressources, setRessources] = useState([]);
  const [jwt, setJwt] = useState(null); // État pour stocker le token JWT
  const [idUser, setIdUser] = useState(null); 
  const [showCreateForm, setShowCreateForm] = useState(false); // État pour afficher le formulaire
  const [newRessource, setNewRessource] = useState({
    title: '',
    content: '',
  }); // État pour stocker les données du formulaire

  const fetchRessources = async () => {
    try {
      const data = await getAllRessources();
      setRessources(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les ressources.');
    }
  };

  const checkUserConnection = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setJwt(token); // Stocker le token JWT dans l'état
      const idUser = await AsyncStorage.getItem('user_id');
      setIdUser(idUser); // Stocker le token JWT dans l'état
    } catch (error) {
      console.error('Erreur lors de la vérification de la connexion utilisateur :', error);
    }
  };

  const handleCreateRessource = async () => {
    if (!idUser || !newRessource.title || !newRessource.content) {
       
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      await createRessource({id_creator: idUser, title_ressource: newRessource.title, content_ressource: newRessource.content}); 
      Alert.alert('Succès', 'La ressource a été créée.');
      setShowCreateForm(false); // Masquer le formulaire après la création
      setNewRessource({ title: '', content: '' }); // Réinitialiser le formulaire
      fetchRessources(); // Recharger la liste des ressources
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la ressource.');
    }
  };

  useEffect(() => {
    fetchRessources();
    checkUserConnection(); // Vérifier si l'utilisateur est connecté
  }, []);
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.container, isWeb && styles.webMainContainer]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={isWeb ? styles.webScrollView : undefined}
      >
        <Text style={styles.title}>Liste des Ressources</Text>
        <MaterialIcons
          name="library-books"
          size={40}
          color="#388E3C"
          style={styles.icon}
        />

        {/* ➕ Bouton Créer une ressource (affiché uniquement si connecté) */}
        {jwt && !showCreateForm && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateForm(true)}
          >
            <Text style={styles.createButtonText}>+ Créer une ressource</Text>
          </TouchableOpacity>
        )}

        {/* Formulaire de création de ressource */}
        {showCreateForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Créer une nouvelle ressource</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de la ressource"
              value={newRessource.title}
              onChangeText={(text) =>
                setNewRessource({ ...newRessource, title: text })
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Contenu de la ressource"
              value={newRessource.content}
              onChangeText={(text) =>
                setNewRessource({ ...newRessource, content: text })
              }
              multiline
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleCreateRessource}
            >
              <Text style={styles.saveButtonText}>Créer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCreateForm(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}

        {ressources.map((ressource) => (
          <TouchableOpacity
            key={ressource.id_ressource}
            style={styles.ressourceItem}
            onPress={() =>
              navigation.navigate('Ressource', { id: ressource.id_ressource })
            }
          >
            <Text style={styles.ressourceTitle}>
              {ressource.title_ressource}
            </Text>
            <Text style={styles.ressourceContent}>
              {ressource.content_ressource.substring(0, 35)}...
            </Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: 10,
  },
  icon: {
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F8FDF8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF5722',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ressourceItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  ressourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },  ressourceContent: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
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