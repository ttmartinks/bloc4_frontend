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
import { getAllUsers, updateUser } from '../fetch/fetchUser';
import BottomNav from './BottomNav';

export default function AdminUser() {
  const [users, setUsers] = useState([]); // Liste complète des utilisateurs
  const [searchQuery, setSearchQuery] = useState(''); // Recherche par pseudo
  const [filteredUsers, setFilteredUsers] = useState([]); // Liste filtrée
  const [statusFilter, setStatusFilter] = useState(''); // Filtre par statut
  const [roleFilter, setRoleFilter] = useState(''); // Filtre par rôle

  // Récupération des utilisateurs au chargement du composant
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        if (Array.isArray(data)) {
          setUsers(data);
          setFilteredUsers(data);
        } else {
          console.error('Les données récupérées ne sont pas un tableau.');
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        setUsers([]);
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Gestion de la recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterUsers(query, statusFilter, roleFilter);
  };

  // Gestion du filtre par statut
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterUsers(searchQuery, status, roleFilter);
  };

  // Gestion du filtre par rôle
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterUsers(searchQuery, statusFilter, role);
  };

  // Filtrage des utilisateurs
  const filterUsers = (query, status, role) => {
    let filtered = [...users]; // Copie de la liste complète

    if (query) {
      filtered = filtered.filter((user) =>
        user.pseudo_user.toLowerCase().includes(query.toLowerCase())
      );
    } 

    if (status) {
      filtered = filtered.filter((user) =>
        status === 'Activé' ? user.is_activ === true : user.is_activ === false
      );
    }

    if (role) {
      filtered = filtered.filter((user) =>
        role === 'Citoyen' ? user.id_role === 1 : user.id_role === 2
      );
    }

    setFilteredUsers(filtered);
  };

  // Mise à jour d'un utilisateur
  const handleUpdateUser = async (id, updatedData) => {
    try {
      await updateUser(id, updatedData);
      Alert.alert('Succès', 'Utilisateur mis à jour avec succès.');
      // Recharger les utilisateurs après la mise à jour
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour l\'utilisateur.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des utilisateurs</Text>

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un utilisateur..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Filtres */}
      <View style={styles.filters}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Statut :</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === '' && styles.activeFilterButton,
              ]}
              onPress={() => handleStatusFilter('')}
            >
              <Text style={styles.filterButtonText}>Tous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === 'Activé' && styles.activeFilterButton,
              ]}
              onPress={() => handleStatusFilter('Activé')}
            >
              <Text style={styles.filterButtonText}>Activé</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === 'Désactivé' && styles.activeFilterButton,
              ]}
              onPress={() => handleStatusFilter('Désactivé')}
            >
              <Text style={styles.filterButtonText}>Désactivé</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Rôle :</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                roleFilter === '' && styles.activeFilterButton,
              ]}
              onPress={() => handleRoleFilter('')}
            >
              <Text style={styles.filterButtonText}>Tous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                roleFilter === 'Citoyen' && styles.activeFilterButton,
              ]}
              onPress={() => handleRoleFilter('Citoyen')}
            >
              <Text style={styles.filterButtonText}>Citoyen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                roleFilter === 'Administrateur' && styles.activeFilterButton,
              ]}
              onPress={() => handleRoleFilter('Administrateur')}
            >
              <Text style={styles.filterButtonText}>Administrateur</Text>
            </TouchableOpacity>          </View>
        </View>
      </View>

      {/* Liste des utilisateurs */}
      <ScrollView 
        style={Platform.OS === 'web' ? styles.webScrollView : undefined}
        contentContainerStyle={Platform.OS === 'web' ? styles.webContainer : undefined}
      >
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <View key={user.id_user} style={styles.userCard}>
              <Text style={styles.userInfo}>ID : {user.id_user}</Text>
              <Text style={styles.userInfo}>Email : {user.email_user}</Text>
              <Text style={styles.userInfo}>
                Status : {user.is_activ ? 'Actif' : 'Inactif'}
              </Text>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={() =>
                  handleUpdateUser(user.id_user, {
                    id_role: user.id_role === 1 ? 2 : 1,
                  })
                }
              >
                <Text style={styles.updateButtonText}>
                  {user.id_role === 1
                    ? 'Promouvoir Admin'
                    : 'Rétrograder Utilisateur'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.updateButton, styles.statusButton]}
                onPress={() =>
                  handleUpdateUser(user.id_user, {
                    is_activ: (!user.is_activ).toString(),
                  })
                }
              >
                <Text style={styles.updateButtonText}>
                  {user.is_activ ? 'Désactiver Compte' : 'Activer Compte'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyListText}>Aucun utilisateur trouvé.</Text>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FDF8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterContainer: {
    flex: 1,
    marginRight: 10,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 5,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#000',
  },
  userCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: '#FF5722',
  },
  updateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },  emptyListText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
  // Styles spécifiques au web
  webScrollView: {
    maxHeight: '60vh',
    overflow: 'auto',
  },
  webContainer: {
    paddingBottom: 20,
  },
});