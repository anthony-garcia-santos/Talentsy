// src/services/login.ts


import api from "../axios";


export const login = async ({ email, senha }: { email: string; senha: string }) => {
  const response = await api.post('/clientes/login', { email, senha }, {
    withCredentials: true,
  });
  return response.data;
};
