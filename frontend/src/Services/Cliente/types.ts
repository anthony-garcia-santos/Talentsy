// frontend/src/Services/Cliente/types.ts

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
}

export interface ICliente {
  id: string;
  nome: string;
  email: string;
  foto?: string | null;
  cargo?: string;
  sobre?: string;
  habilidades: string[];
  projetosRecentes: Array<{
    titulo: string;
    descricao: string;
  }>;
}