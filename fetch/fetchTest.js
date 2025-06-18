// queries/queriesTest.js
const API_URL = "https://cesizenbackend-0b349b880511.herokuapp.com/api";

export const fetchTestHelloApi = async () => {
  try {
    const response = await fetch(`${API_URL}/hello`); // ✅ template string correcte
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Erreur dans fetchTestApi:', error);
    throw error;
  }
};

export const fetchTestApi = async () => {
  try {
    const response = await fetch(`${API_URL}/test`); // ✅ template string correcte
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Erreur dans fetchTestApi:', error);
    throw error;
  }
};
