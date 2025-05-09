// src/services/parceiros.service.jsx
import axios from "axios";

const API_URL = "https://dummyjson.com/users"; // ou sua API real

const getParceiros = async () => {
  const response = await axios.get(API_URL);
  return response.data.users || []; // dummyjson retorna { users: [...] }
};

const postParceiro = async (parceiro) => {
  const response = await axios.post(API_URL + "/add", parceiro, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

const putParceiro = async (id, parceiro) => {
  const response = await axios.put(`${API_URL}/${id}`, parceiro, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

const deleteParceiroById = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

const ParceirosService = {
  getParceiros,
  postParceiro,
  putParceiro,
  deleteParceiroById,
};

export default ParceirosService;
