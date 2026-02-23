import type { ContatoDTO } from "../utils/interfaces/ContatoDTO";
import api from "./api";




export const enviarContato = async (dados: ContatoDTO) => {
  try {
    const response = await api.post('/Contato', dados);
    return response;
  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    throw error;
  }
};
