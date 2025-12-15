// src/services/login.ts

import api from "../axios";

// Tipo para os dados de entrada
interface LoginCredentials {
  email: string;
  senha: string;
}

// Tipo para a resposta esperada da API (ajuste conforme necessário)
interface LoginResponse {
  token?: string;
  usuario?: {
    id: number;
    nome: string;
    email: string;
  };
  // Outros campos retornados pela API
}

/**
 * Realiza login do usuário.
 * @param credentials Objeto com email e senha.
 * @returns Dados da resposta da API ou lança erro.
 */
export const login = async ({ email, senha }: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(
      "/clientes/login",
      { email, senha },
      { withCredentials: true }
    );

    return response.data;
  } catch (error: any) {
    // Melhor prática: sempre logar ou tratar o erro de forma amigável
    console.error("Erro ao fazer login:", error);

    // Lançar um erro mais amigável para o front
    throw new Error(
      error?.response?.data?.message || "Erro ao fazer login. Tente novamente mais tarde."
    );
  }
};
