import axios from "axios";
import BASE_URL from '../config/apiConfig';

export const setPais = async () => {
  const { data } = await axios.get(`${BASE_URL}/enumGeoNames/pais`);
  console.log(data);
  return data;
};

export const setProvincia = async (paisId) => {
  const { data } = await axios.post(`${BASE_URL}/enumGeoNames/provincia`, {
    paisId,
  });
  console.log(data);
  return data;
};

export const setLocalidad = async (provinciaId) => {
  const { data } = await axios.post(`${BASE_URL}/enumGeoNames/localidad`, {
    provinciaId,
  });
  console.log(data);
  return data;
};
