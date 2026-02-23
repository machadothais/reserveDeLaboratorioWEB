export interface Laboratorio {
  laboratorioId: number;
  nome: string;
}

export interface Turma {
  turmaId: number;
  nome: string;
}
export interface ReservaDTO{
   nomeLaboratorio: string;
   nomeTurma: string;
   dataInicio: string;
   dataFim: string;
   observacao: string;
}