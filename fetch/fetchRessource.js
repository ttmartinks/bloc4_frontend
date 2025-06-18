const API_BASE_URL_RESSOURCE = "https://morning-forest-33577-012c62b17577.herokuapp.com/api/ressource";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Récupérer toutes les ressources
export const getAllRessources = async () => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la récupération des ressources.');
    }
    return data;
  } catch (error) {
    console.error('Erreur dans getAllRessources :', error);
    throw error;
  }
};

// Récupérer une ressource par ID
export const getRessourceById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la récupération de la ressource.');
    }
    return data;
  } catch (error) {
    console.error('Erreur dans getRessourceById :', error);
    throw error;
  }
};

export const getRessourcesUser  = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}/user/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la récupération de la ressource.');
    }
    return data;
  } catch (error) {
    console.error('Erreur dans getRessourceById :', error);
    throw error;
  }
};

// Créer une ressource
export const createRessource = async (ressourceData) => {
  try {
    console.log(ressourceData);
    const response = await fetch(`${API_BASE_URL_RESSOURCE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ressourceData),
    });
    console.log(response.body);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la création de la ressource.');
    }
    return data;
  } catch (error) {
    console.error('Erreur dans createRessource :', error);
    throw error;
  }
};

// Mettre à jour une ressource
export const updateRessource = async (id, ressourceData) => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ressourceData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la mise à jour de la ressource.');
    }
    return data;
  } catch (error) {
    console.error('Erreur dans updateRessource :', error);
    throw error;
  }
};

// Supprimer une ressource
export const deleteRessource = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erreur lors de la suppression de la ressource.');
    }
    return true; // Retourne true si la suppression a réussi
  } catch (error) {
    console.error('Erreur dans deleteRessource :', error);
    throw error;
  }
};



//FAVORITES


export const addFavoriteRessource = async (userId, ressourceId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_user: userId,
        id_related_item: ressourceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'ajout aux favoris.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris :', error);
    throw error;
  }
};

// Récupérer tous les favoris d'un utilisateur
export const getFavoriteRessourcesByUser = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}/favorites/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la récupération des favoris.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris :', error);
    throw error;
  }
};

// Supprimer un favori
export const removeFavoriteRessource = async (favoriteId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL_RESSOURCE}/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la suppression du favori.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la suppression du favori :', error);
    throw error;
  }
};


