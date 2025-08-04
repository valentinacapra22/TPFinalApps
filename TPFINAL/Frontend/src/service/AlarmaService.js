import axios from "axios";
import BASE_URL from '../config/apiConfig';

export const setAlarma = async (alarmaData) => {
  const { data } = await axios.post(`${BASE_URL}/alarmas`, alarmaData);
  console.log(data);
  return data;
};

export const getEstadisticasVecindario = async (vecindarioId, token) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/alarmas/estadisticas/${vecindarioId}`, {
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


