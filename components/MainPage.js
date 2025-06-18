import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BottomNav from './BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '../fetch/fetchUser';

export default function MainPage({ navigation }) {
  const [userPseudo, setUserPseudo] = useState(null);
  const [userRole, setUserRole] = useState(1); // Par défaut, rôle utilisateur simple

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer l'ID utilisateur depuis AsyncStorage
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          console.error('Aucun ID utilisateur trouvé.');
          return;
        }
        // Appeler l'API pour récupérer les données utilisateur
        const data = await getUserById(userId);
        setUserPseudo(data.pseudo_user); // Mettre à jour le pseudo
        setUserRole(data.id_role); // Mettre à jour le rôle
      } catch (err) {
        console.error('Erreur API:', err);
      }
    };

    fetchUserData();
  }, []);

  const welcomeUserTop = () => {
    if (userPseudo == null) {
      return "Welcome !";
    } else {
      return `Welcome back ${userPseudo} !`;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🧘‍♀️</Text>
        </View>

        <Text style={styles.welcome}>
          {welcomeUserTop()} {/* Appel de la fonction directement */}
        </Text>

        {/* Section Ressources */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Ressources</Text>
              <Text style={styles.cardDescription}>
                Un assortiment d’articles sur la santé mentale
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Ressources')}>
                <Text style={styles.buttonText}>Consulter ➜</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section Exercices */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Exercices</Text>
              <Text style={styles.cardDescription}>
                Exercices proposés et configurables
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('BreathExercise')}>
                <Text style={styles.buttonText}>Pratiquez ➜</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section Compte */}
        {userPseudo != null && (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Gestion du compte</Text>
              <Text style={styles.cardDescription}>
                Retrouvez toutes vos préférences et paramètres
              </Text>
              <TouchableOpacity style={styles.button}>
               onPress={() => navigation.navigate('UserSettings')}
                <Text style={styles.buttonText}>Gérer ➜</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        )}

        {/* Section Admin (visible uniquement si rôle > 1) */}
        {userRole > 1 && (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Admin utilisateur</Text>
                <Text style={styles.cardDescription}>
                  Gérer les utilisateurs et leurs rôles
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('AdminUser')}>
                  <Text style={styles.buttonText}>Accéder ➜</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Barre de navigation basse */}
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
  logoPlaceholder: {
    alignSelf: 'center',
    backgroundColor: '#E6F2E6',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 30,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  card: {
    backgroundColor: '#F1F9F1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});