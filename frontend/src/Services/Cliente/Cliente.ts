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