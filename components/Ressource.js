import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {
  getRessourceById,
  updateRessource,
  deleteRessource,
  addFavoriteRessource,
  getFavoriteRessourcesByUser,
} from '../fetch/fetchRessource';
import BottomNav from './BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

export default function Ressource({ route, navigation }) {
  const { id } = route.params;
  const [ressource, setRessource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [editableTitle, setEditableTitle] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const fetchRessourceDetails = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedRoleId = await AsyncStorage.getItem('role_id');
      const token = await AsyncStorage.getItem('token');
      setUserId(parseInt(storedUserId, 10));
      setRoleId(parseInt(storedRoleId, 10));
      setJwt(token);

      const data = await getRessourceById(id);
      setRessource(data);
      setEditableContent(data.content_ressource);
      setEditableTitle(data.title_ressource);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les détails de la ressource.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      if (!jwt || !userId) return;

      const favorites = await getFavoriteRessourcesByUser(userId, jwt);
      const favorite = favorites.find((fav) => fav.id_related_item === ressource.id_ressource);

      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id_favorite);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris :', error);
    }
  };

  useEffect(() => {
    fetchRessourceDetails();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (ressource) {
      fetchFavorites();
    }
    // eslint-disable-next-line
  }, [ressource]);

  const parseYouTubeLink = (content) => {
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+))/;
    const match = content.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const handleFavoriteToggle = async () => {
    if (!jwt) {
      Alert.alert('Erreur', 'Vous devez être connecté pour gérer vos favoris.');
      return;
    }

    try {
      if (isFavorite) {
        await addFavoriteRessource(userId, ressource.id_ressource, jwt);
        Alert.alert('Succès', 'La ressource a été retirée de vos favoris.');
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const result = await addFavoriteRessource(userId, ressource.id_ressource, jwt);
        Alert.alert('Succès', 'La ressource a été ajoutée à vos favoris.');
        setIsFavorite(true);
        setFavoriteId(result.favorite.id_favorite);
      }
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de gérer vos favoris.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateRessource(id, {
        title_ressource: editableTitle,
        content_ressource: editableContent,
      }, jwt);
      setRessource({
        ...ressource,
        title_ressource: editableTitle,
        content_ressource: editableContent,
      });
      setIsEditing(false);
      Alert.alert('Succès', 'La ressource a été mise à jour.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la ressource.');
    }
  };

  const handleCancelEdit = () => {
    setEditableContent(ressource.content_ressource);
    setEditableTitle(ressource.title_ressource);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette ressource ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteRessource(ressource.id_ressource);
            Alert.alert('Supprimé', 'La ressource a été supprimée.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!ressource) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ressource introuvable.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const youtubeLink = parseYouTubeLink(ressource.content_ressource);
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.container, isWeb && styles.webMainContainer]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={isWeb ? styles.webScrollView : undefined}
      >
        {isEditing ? (
          <>
            <TextInput
              style={[styles.input, { fontWeight: 'bold', fontSize: 20 }]}
              value={editableTitle}
              onChangeText={setEditableTitle}
              placeholder="Titre de la ressource"
            />
            <TextInput
              style={styles.input}
              value={editableContent}
              onChangeText={setEditableContent}
              multiline
              placeholder="Contenu de la ressource"
            />
            <TouchableOpacity style={styles.editButton} onPress={handleSaveEdit}>
              <Text style={styles.editButtonText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleCancelEdit}>
              <Text style={styles.deleteButtonText}>Annuler</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>{ressource.title_ressource}</Text>
            <Text style={styles.content}>{ressource.content_ressource}</Text>
          </>
        )}

        {youtubeLink && (
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: youtubeLink }}
              style={styles.video}
              allowsFullscreenVideo
            />
          </View>
        )}

        <Text style={styles.creator}>Créé par : Utilisateur {ressource.id_creator}</Text>
        <Text style={styles.date}>
          Date : {new Date(ressource.date_ressource).toLocaleString()}
        </Text>

        {jwt && (
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? 'Enlever des favoris' : 'Mettre en favoris'}
            </Text>
          </TouchableOpacity>
        )}

        {jwt && (userId === ressource.id_creator || roleId > 1) && !isEditing && (
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
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
    marginBottom: 15,
    color: '#2D2D2D',
    textAlign: 'center',
    marginTop: 20
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
    textAlign: 'justify',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  creator: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    marginBottom: 20,
  },
  videoContainer: {
    marginBottom: 20,
    height: 200,
  },
  video: {
    flex: 1,
  },
  favoriteButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginBottom: 10,
  },
  favoriteButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF5722',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDF8',
  },  errorText: {
    fontSize: 18,
    color: '#FF5722',
    marginBottom: 20,
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