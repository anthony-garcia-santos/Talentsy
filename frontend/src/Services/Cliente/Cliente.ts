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






export const obterPerfilPorId = async (id: string) => {
  try {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};








export const listarClientes = async () => {
  try {
    const response = await api.get("/clientes/", {
      withCredentials: true 
    });

    console.log('Resposta da API:', response);

    if (response.data.success) {
      return response.data.data; 
    }
    return []; 
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    throw error;
  }
};









export const autenticacaoLogin = async () => {
  try {
    const response = await api.get("/api/me", {
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};










export const enviarPerfilCompleto = async (
  id: string,
  dados: {
    sobre: string;
    habilidades: string;
    projetos_recentes: string;
    cargo?: string;
    foto?: string; 
  }
) => {
  try {
    const response = await api.patch(`/clientes/${id}/editar-perfil`, dados, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao enviar perfil completo:", error);
    throw error;
  }
};







export const uploadFotoPerfil = async (
  id: string,
  file: File
): Promise<{ url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append('foto', file);

  const response = await api.post(`/clientes/${id}/foto`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; 
};
