// queries/queriesTest.js
const API_URL = "https://morning-forest-33577-012c62b17577.herokuapp.com/api";

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
