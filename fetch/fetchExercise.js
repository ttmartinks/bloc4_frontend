import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL_EXERCISE = "https://morning-forest-33577-012c62b17577.herokuapp.com/api/exercise";

// Récupérer le token JWT depuis AsyncStorage
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('Utilisateur non authentifié. Veuillez vous connecter.');
  }
  return {
    'Content-Type': 'application/json', 
    Authorization: `Bearer ${token}`,
  };
};

// Créer un exercice
export const createExercise = async (exerciseData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL_EXERCISE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(exerciseData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la création de l\'exercice.');
    }

    return data; // Retourne les données de l'exercice créé
  } catch (error) {
    console.error('Erreur dans createExercise :', error);
    throw error;
  }
};

// Récupérer tous les exercices
export const getAllExercises = async () => {
  try {
    const response = await fetch(`${API_BASE_URL_EXERCISE}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la récupération des exercices.');
    }

    return data; // Retourne la liste des exercices
  } catch (error) {
    console.error('Erreur dans getAllExercises :', error);
    throw error;
  }
};


export const getAllExercisesOfUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL_EXERCISE}/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la récupération des exercices.');
    }

    return data; // Retourne la liste des exercices
  } catch (error) {
    console.error('Erreur dans getAllExercises :', error);
    throw error;
  }
};


// Récupérer un exercice par ID
export const getExerciseById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL_EXERCISE}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la récupération de l\'exercice.');
    }

    return data; // Retourne les données de l'exercice
  } catch (error) {
    console.error('Erreur dans getExerciseById :', error);
    throw error;
  }
};

// Mettre à jour un exercice
export const updateExercise = async (id, exerciseData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL_EXERCISE}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(exerciseData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la mise à jour de l\'exercice.');
    }

    return data; // Retourne les données de l'exercice mis à jour
  } catch (error) {
    console.error('Erreur dans updateExercise :', error);
    throw error;
  }
};

// Supprimer un exercice
export const deleteExercise = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL_EXERCISE}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Une erreur est survenue lors de la suppression de l\'exercice.');
    }

    return true; // Retourne true si la suppression a réussi
  } catch (error) {
    console.error('Erreur dans deleteExercise :', error);
    throw error;
  }
};


export const addExerciseHistory = async (historyData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL_EXERCISE}/history`, {
      method: 'POST',
      headers,
      body: JSON.stringify(historyData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de l\'enregistrement de l\'historique.');
    }

    return data; // Retourne les données de l'historique enregistré
  } catch (error) {
    console.error('Erreur dans addExerciseHistory :', error);
    throw error;
  }
};

export const getAllHistoriesForUser = async (id_user) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL_EXERCISE}/history/${id_user}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue lors de la récupération des historiques.');
    }

    return data; // Retourne tous les historiques
  } catch (error) {
    console.error('Erreur dans getAllHistoriesForUser :', error);
    throw error;
  }
};