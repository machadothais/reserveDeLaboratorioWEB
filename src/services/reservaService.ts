
// src/services/reservaService.ts
import type { TurmaDTO } from '../interfaces/api/turma.dto';
import type { LaboratorioDTO } from '../utils/interfaces/laboratorio.dto';

import type { ReservaDTO } from '../utils/interfaces/reserva.dto';
import api from './api';



const ReservaService = {
  // 🔹 Buscar todas as reservas
  async getAll(): Promise<ReservaDTO[]> {
    const response = await api.get('/Reservas');
    return response.data;
  },

  // 🔹 Buscar por ID
  async getById(id: number): Promise<ReservaDTO> {
    const response = await api.get(`/Reservas/${id}`);
    return response.data;
  },

  // 🔹 Criar nova reserva
  async create(data: ReservaDTO) {
    const response = await api.post('/Reservas', data);
    return response.data;
  },

  // 🔹 Atualizar reserva existente
  async update(id: number, data: ReservaDTO) {
    const response = await api.put(`/Reservas/${id}`, data);
    return response.data;
  },

  // 🔹 Excluir reserva
  async delete(id: number) {
    await api.delete(`/Reservas/${id}`);
  },

  // 🔹 Carregar laboratórios
  async getLaboratorios(): Promise<LaboratorioDTO[]> {
    const response = await api.get('/Laboratorios');
    return response.data;
  },

  // 🔹 Carregar turmas
  async getTurmas(): Promise<TurmaDTO[]> {
    const response = await api.get('/Turmas');
    return response.data;
  }
};

export default ReservaService;
