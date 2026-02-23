import type { LaboratorioDTO } from '../utils/interfaces/laboratorio.dto';
import api from './api';


const LaboratorioService = {
  async getAll(): Promise<LaboratorioDTO[]> {
    const response = await api.get('/Laboratorios');
    return response.data;
  },

  async getById(id: number): Promise<LaboratorioDTO> {
    const response = await api.get(`/Laboratorios/${id}`);
    return response.data;
  },

  async create(data: { nome: string; capacidade: number }) {
    const response = await api.post('/Laboratorios', data);
    return response.data;
  },

  async update(id: number, data: { nome: string; capacidade: number }) {
    const response = await api.put(`/Laboratorios/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    await api.delete(`/Laboratorios/${id}`);
  }
};

export default LaboratorioService;
