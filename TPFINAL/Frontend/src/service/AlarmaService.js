import axios from "axios";
const BASE_URL = "http://localhost:3000/api/alarmas"; // Reemplaza con la URL de tu backend

export const setAlarma = async (alarmaData) => {
  const { data } = await axios.post(BASE_URL, alarmaData);
  console.log(data);
  return data;
};

export const getEstadisticasVecindario = async (vecindarioId, token) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/estadisticas/${vecindarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    throw error;
  }
};


