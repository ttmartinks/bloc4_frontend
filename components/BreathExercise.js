import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './BottomNav';
import { MaterialIcons } from '@expo/vector-icons';
import { createExercise, getAllExercisesOfUser, addExerciseHistory, getAllHistoriesForUser } from '../fetch/fetchExercise';

export default function BreathExercise({ navigation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [currentRepetition, setCurrentRepetition] = useState(1);
  const intervalRef = useRef(null);

  const [inspiration, setInspiration] = useState(7);
  const [retention, setRetention] = useState(7);
  const [expiration, setExpiration] = useState(7);
  const [repetitions, setRepetitions] = useState(5);

  const [showSaveInput, setShowSaveInput] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [userExercises, setUserExercises] = useState([]);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null); // Exercice actuellement sélectionné
  const [exerciseHistory, setExerciseHistory] = useState([]); // Tous les historiques de l'utilisateur
  const [filteredHistory, setFilteredHistory] = useState([]); // Historiques filtrés pour l'exercice sélectionné
  const [showHistory, setShowHistory] = useState(false); // Afficher ou masquer l'historique

  const MAX_VALUE = 30;

  const getTotalDuration = () => {
    return (inspiration + retention + expiration) * repetitions;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const validateInputs = () => {
    if (
      isNaN(inspiration) ||
      inspiration <= 0 ||
      inspiration > MAX_VALUE ||
      isNaN(retention) ||
      retention <= 0 ||
      retention > MAX_VALUE ||
      isNaN(expiration) ||
      expiration <= 0 ||
      expiration > MAX_VALUE ||
      isNaN(repetitions) ||
      repetitions <= 0
    ) {
      Alert.alert('Erreur', `Veuillez entrer des valeurs valides pour tous les champs.`);
      return false;
    }
    return true;
  };

  const calculatePhase = (elapsedTime) => {
    const cycleDuration = inspiration + retention + expiration;
    const timeInCycle = elapsedTime % cycleDuration;

    if (timeInCycle < inspiration) {
      return 'Inspiration';
    } else if (timeInCycle < inspiration + retention) {
      return 'Rétention';
    } else {
      return 'Expiration';
    }
  };

  const startTimer = () => {
    if (!validateInputs()) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setCurrentPhase('');
          setCurrentRepetition(1);

          // Enregistrer l'historique lorsque le timer se termine
          handleSaveHistory(getTotalDuration());
          return 0;
        }

        const newTime = prev - 1;
        const phase = calculatePhase(getTotalDuration() - newTime);

        setCurrentPhase(phase);

        if (phase === 'Expiration' && newTime % (inspiration + retention + expiration) === 0) {
          setCurrentRepetition((rep) => rep + 1);
        }

        return newTime;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(getTotalDuration());
    setIsRunning(false);
    setCurrentPhase('');
    setCurrentRepetition(1);

    // Enregistrer l'historique lorsque l'utilisateur clique sur "Recommencer"
    handleSaveHistory(getTotalDuration() - timer);
  };

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const handleSaveExercise = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }

      if (!exerciseTitle) {
        Alert.alert('Erreur', 'Veuillez entrer un titre pour l\'exercice.');
        return;
      }

      const exerciseData = {
        title_exercise: exerciseTitle,
        type_exercise: 1,
        id_creator: userId,
        seconds_inspiration: inspiration,
        seconds_apnea: retention,
        seconds_expiration: expiration,
        number_repetitions: repetitions,
      };

      await createExercise(exerciseData);
      Alert.alert('Succès', 'Exercice enregistré avec succès !');
      setShowSaveInput(false);
      setExerciseTitle('');
      fetchUserExercises();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'exercice :', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer l\'exercice.');
    }
  };

  const fetchUserExercises = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }

      const exercises = await getAllExercisesOfUser(userId);
      setUserExercises(exercises);
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices :', error);
      Alert.alert('Erreur', 'Impossible de récupérer les exercices.');
    }
  };

  const fetchAllHistories = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }

      const histories = await getAllHistoriesForUser(userId);
      setExerciseHistory(histories);
    } catch (error) {
      console.error('Erreur lors de la récupération des historiques :', error);
      Alert.alert('Erreur', 'Impossible de récupérer les historiques.');
    }
  };

  const filterHistoryForExercise = () => {
    if (!selectedExercise || !selectedExercise.id_exercise) {
      Alert.alert('Erreur', 'Aucun exercice valide sélectionné.');
      return;
    }

    const filtered = exerciseHistory.filter(
      (history) => history.id_exercise === selectedExercise.id_exercise
    );

    setFilteredHistory(filtered.slice(0, 5)); // Limiter aux 5 derniers historiques
    setShowHistory(!showHistory); // Basculer l'affichage de l'historique
  };

  const handleSelectExercise = (exercise) => {
    if (
      !exercise ||
      !exercise.breathingDetails ||
      !exercise.breathingDetails.seconds_inspiration ||
      !exercise.breathingDetails.seconds_apnea ||
      !exercise.breathingDetails.seconds_expiration ||
      !exercise.breathingDetails.number_repetitions
    ) {
      Alert.alert('Erreur', 'Les données de l\'exercice sélectionné sont invalides.');
      return;
    }

    setSelectedExercise(exercise);
    setInspiration(exercise.breathingDetails.seconds_inspiration);
    setRetention(exercise.breathingDetails.seconds_apnea);
    setExpiration(exercise.breathingDetails.seconds_expiration);
    setRepetitions(exercise.breathingDetails.number_repetitions);
    Alert.alert('Exercice sélectionné', `Vous avez sélectionné : ${exercise.title_exercise}`);
  };

  const handleSaveHistory = async (seconds) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }

      if (!selectedExercise || !selectedExercise.id_exercise) {
        Alert.alert('Erreur', 'Aucun exercice valide sélectionné pour enregistrer l\'historique.');
        return;
      }

      await addExerciseHistory({
        id_user: userId,
        id_exercise: selectedExercise.id_exercise,
        seconds_exercise: seconds,
      });
      console.log('Historique enregistré avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'historique :', error);
    }
  };

  const checkAuthentication = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    setIsAuthenticated(!!userId);
  };
  useEffect(() => {
    setTimer(getTotalDuration());
    checkAuthentication();
    if (isAuthenticated) {
      fetchUserExercises();
      fetchAllHistories();
    }
    return () => clearInterval(intervalRef.current);
  }, [inspiration, retention, expiration, repetitions, isAuthenticated]);

  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      style={[styles.scroll, isWeb && styles.webScrollView]}
      contentContainerStyle={[styles.container, isWeb && styles.webContainer]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Exercice de Respiration</Text>
      <MaterialIcons name="fitness-center" size={40} color="#388E3C" style={styles.icon} />

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Inspiration (max 30s)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(inspiration)}
          onChangeText={(val) => setInspiration(parseInt(val) || 0)}
        />

        <Text style={styles.inputLabel}>Rétention (max 30s)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(retention)}
          onChangeText={(val) => setRetention(parseInt(val) || 0)}
        />

        <Text style={styles.inputLabel}>Expiration (max 30s)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(expiration)}
          onChangeText={(val) => setExpiration(parseInt(val) || 0)}
        />

        <Text style={styles.inputLabel}>Répétitions</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(repetitions)}
          onChangeText={(val) => setRepetitions(parseInt(val) || 0)}
        />
      </View>

      <Text style={styles.phaseText}>
        {isRunning ? `${currentPhase} (Répétition ${currentRepetition}/${repetitions})` : ''}
      </Text>

      <Text style={styles.timer}>{formatTime(timer)}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleTimer}>
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Démarrer'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
        <Text style={styles.buttonText}>Recommencer</Text>
      </TouchableOpacity>

      {isAuthenticated && (
        <>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={() => setShowSaveInput(!showSaveInput)}
          >
            <Text style={styles.buttonText}>Enregistrer un Exercice</Text>
          </TouchableOpacity>
          {showSaveInput && (
            <View style={styles.saveInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Titre de l'exercice"
                value={exerciseTitle}
                onChangeText={setExerciseTitle}
              />
              <TouchableOpacity style={styles.button} onPress={handleSaveExercise}>
                <Text style={styles.buttonText}>Soumettre</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={() => setShowExerciseMenu(!showExerciseMenu)}
          >
            <Text style={styles.buttonText}>Mes Exercices</Text>
          </TouchableOpacity>
          {showExerciseMenu && (
            <View style={styles.exerciseMenu}>
              {userExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id_exercise}
                  onPress={() => handleSelectExercise(exercise)}
                >
                  <Text style={styles.exerciseItem}>{exercise.title_exercise}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedExercise && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.historyButton]}
                onPress={filterHistoryForExercise}
              >
                <Text style={styles.buttonText}>
                  {showHistory ? 'Masquer l\'historique' : 'Voir l\'historique'}
                </Text>
              </TouchableOpacity>

              {showHistory && (
                <View style={styles.historyContainer}>
                  {filteredHistory.map((history, index) => (
                    <Text key={index} style={styles.historyItem}>
                      {`Date : ${new Date(history.date_historic).toLocaleString()} - Durée : ${history.seconds_exercise}s`}
                    </Text>
                  ))}
                </View>
              )}
            </>
          )}
        </>
      )}

      <BottomNav navigation={navigation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#F8FDF8',
  },
  container: {
    minHeight: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#2D2D2D',
  },
  inputGroup: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  phaseText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 10,
  },
  timer: {
    fontSize: 28,
    marginVertical: 10,
    color: '#444',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  resetButton: {
    backgroundColor: '#FF5722',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  menuButton: {
    backgroundColor: '#FFC107',
  },
  historyButton: {
    backgroundColor: '#FFC107',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  historyContainer: {
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exerciseMenu: {
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  exerciseItem: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  saveInputContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 25,
    marginTop: 15,
  },
  // Styles spécifiques au web
  webScrollView: {
    height: '100vh',
    overflow: 'auto',
  },
  webContainer: {
    minHeight: '100vh',
  },
});