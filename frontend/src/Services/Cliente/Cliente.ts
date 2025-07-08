//frontend/src/services/Cliente/cliente.ts

import api from "../axios";

export const Cadastrar = async (dados: {
  nome: string;
  email: string;
  senha: string;
}) => {
  try {
    const response = await api.post("/clientes/registrar", dados);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const obterPerfil = async () => {
  try {
    const response = await api.get('/perfil', {
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const listarClientes = async () => {
  try {
    const response = await api.get("/clientes/"); 
    return response.data.data; 
  } catch (error) {
    throw error;
  }
};

