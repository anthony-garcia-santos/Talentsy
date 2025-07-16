//frontend/src/services/Cliente/cliente.ts

import api from "../axios";

// Cadastro de novo cliente
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

// Buscar perfil por ID
export const obterPerfilPorId = async (id: string) => {
  try {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Listar todos os clientes
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

// Verificar autenticação do usuário logado
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





// Enviar dados + imagem para atualizar o perfil
export const enviarPerfilCompleto = async (
  id: string,
  dados: {
    sobre: string;
    habilidades: string;
    projetos_recentes: string;
    cargo?: string;
  },
  file?: File
) => {
  const formData = new FormData();
  formData.append("sobre", dados.sobre);
  formData.append("habilidades", dados.habilidades);
  formData.append("projetos_recentes", dados.projetos_recentes);
  if (dados.cargo) formData.append("cargo", dados.cargo);
  if (file) formData.append("foto", file);

  try {
    const response = await api.patch(`/clientes/${id}/editar-perfil`, formData, {
      withCredentials: true,
    });

    return response.data.data;
  } catch (error) {
    console.error("Erro ao enviar perfil completo:", error);
    throw error;
  }
};
