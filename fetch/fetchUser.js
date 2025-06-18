const API_BASE_URL_USER = "https://morning-forest-33577-012c62b17577.herokuapp.com/api/user";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Récupérer un utilisateur par ID
export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL_USER}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la récupération du User.');
    }

    return data;
  } catch (error) {
    console.error('Erreur dans getUserById :', error);
    throw error;
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL_USER}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la récupération des utilisateurs.');
    }

    return data;
  } catch (error) {
    console.error('Erreur dans getAllUsers :', error);
    throw error;
  }
};

// Connexion utilisateur
export const loginUser = async (email, password) => {
  try {
    // Vérifier si un token existe déjà dans AsyncStorage
    const existingToken = await AsyncStorage.getItem('token');
    const roleUser = await AsyncStorage.getItem('role_id');
    const userId = await AsyncStorage.getItem('user_id');
    if (existingToken && roleUser && userId) {
      throw new Error('Vous êtes déjà connecté.');
    }

    const response = await fetch(`${API_BASE_URL_USER}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la connexion.');
    }

    // Stocker le token dans AsyncStorage
    await AsyncStorage.setItem('token', data.token);

    return data;
  } catch (error) {
    console.error('Erreur dans loginUser :', error);
    throw error;
  }
};

// Création d'un utilisateur
export const createUser = async (email, pseudo, age, password) => {
  try {
    // Vérifier si un token existe déjà dans AsyncStorage
    const existingToken = await AsyncStorage.getItem('token');
    console.log(existingToken);
    if (existingToken) {
      throw new Error('Vous êtes déjà connecté.');
    }

    const response = await fetch(`${API_BASE_URL_USER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, pseudo, age, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la création du compte.');
    }

    return data;
  } catch (error) {
    console.error('Erreur dans createUser :', error);
    throw error;
  }
};

// Mise à jour d'un utilisateur
export const updateUser = async (id, updatedData) => {
  try {
    // Récupérer le token JWT depuis AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour effectuer cette action.');
    }
    console.log(updatedData);
    const response = await fetch(`${API_BASE_URL_USER}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Ajouter le token dans les en-têtes
      },
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.');
    }

    return data;
  } catch (error) {
    console.error('Erreur dans updateUser :', error);
    throw error;
  }
};

// Supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    // Récupérer le token JWT depuis AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour effectuer cette action.');
    }

    const response = await fetch(`${API_BASE_URL_USER}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Ajouter le token dans les en-têtes
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }

    return true; // Retourne true si la suppression a réussi
  } catch (error) {
    console.error('Erreur dans deleteUser :', error);
    throw error;
  }
};