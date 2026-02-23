import type { AtualizarTurmaDTO, CriarTurmaDTO, ProfessorDTO, TurmaDTO } from "../interfaces/api/turma.dto";
import api from "./api";

const TurmaService = {
  async createTurma(data: CriarTurmaDTO) {
    const response = await api.post("/Turmas", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  async getTurmas(): Promise<TurmaDTO[]> {
    const response = await api.get("/Turmas");
    return response.data;
  },

  async getProfessores(): Promise<ProfessorDTO[]> {
    const response = await api.get("/Professores");
    return response.data;
  },

  async deleteTurma(id: number) {
    return await api.delete(`/Turmas/${id}`);
  },

  async updateTurma(id: number, data: AtualizarTurmaDTO) {
    return await api.put(`/Turmas/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },
};

export default TurmaService;