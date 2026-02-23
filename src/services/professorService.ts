import type { ProfessorDTO } from '../interfaces/api/professor.dto';
import api from './api';


const ProfessorService={
  async getAll(): Promise<ProfessorDTO[]>{
    const response= await api.get('/Professores')
    return response.data
  },
  async getById(id: number): Promise<ProfessorDTO[]>{
    const response= await api.get(`/Professores/${id}`)
    return response.data


  },

  async create(data: {nome: string, email: string, LaboratorioId: number}): 
  Promise<ProfessorDTO[]>{
    const response= await api.post(`/Professores/`, data);
    return response.data
  },
async update(
  id: number,
  data: { nome: string; email: string; laboratorioId: number }
): Promise<ProfessorDTO> {
  const response = await api.put(`/Professores/${id}`, data);
  return response.data;
},

  async delete(id: number)
  {
    await api.delete(`/Professores/${id}`);
    

  }
  
}
export default ProfessorService