import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";
import type { TurmaForm } from "../../interfaces/api/forms/turmas.forms";
import type { CriarTurmaDTO, ProfessorDTO } from "../../interfaces/api/turma.dto";
import TurmaService from "../../services/turmaService";



const turmaSchema = yup
  .object({
    nome: yup.string().required("O nome da turma é obrigatório."),
    quantidadeAlunos: yup
      .number()
      .typeError("Informe um número.")
      .min(1, "A turma deve ter pelo menos 1 aluno.")
      .required("A quantidade de alunos é obrigatória."),
    professorId: yup
      .number()
      .typeError("Selecione um professor.")
      .positive("Selecione um professor válido.")
      .required("O professor é obrigatório."),
  })
  .required();

export default function FormTurma() {
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TurmaForm>({
    resolver: yupResolver(turmaSchema),
    mode: "onChange",
  });

  // 🔹 Carregar professores via Service
  useEffect(() => {
    const carregar = async () => {
      try {
        const lista = await TurmaService.getProfessores();
        setProfessores(lista);
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
        setToast({ message: "❌ Erro ao carregar professores.", type: "error" });
      }
    };

    carregar();
  }, []);

  // 🔹 Enviar turma via service
 const onSubmit = async (data: TurmaForm) => {
  try {
    const payload: CriarTurmaDTO = {
      nome: data.nome,
      quantidadeAlunos: data.quantidadeAlunos,
      professorId: data.professorId,
    };

    await TurmaService.createTurma(payload);

    setToast({ message: "✅ Turma cadastrada com sucesso!", type: "success" });
    reset();
    setTimeout(() => navigate("/registro-de-turmas"), 1500);

  } catch (error: any) {
    console.error("Erro ao cadastrar turma:", error);
    setToast({
      message: `❌ Erro ao cadastrar turma: ${error.response?.data || error.message}`,
      type: "error",
    });
  }
};

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/registro-de-turmas", label: "Turmas" },
        ]}
      />

      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">🏫 Cadastrar Turma</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                
                {/* Nome da Turma */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nome da Turma</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                    {...register("nome")}
                    placeholder="Ex: Turma de Desenvolvimento Web"
                  />
                  <div className="invalid-feedback">{errors.nome?.message}</div>
                </div>

                {/* Quantidade de Alunos */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Quantidade de Alunos</label>
                  <input
                    type="number"
                    className={`form-control ${errors.quantidadeAlunos ? "is-invalid" : ""}`}
                    {...register("quantidadeAlunos", { valueAsNumber: true })}
                    placeholder="Ex: 30"
                  />
                  <div className="invalid-feedback">{errors.quantidadeAlunos?.message}</div>
                </div>

                {/* Professor */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Professor Responsável</label>
                  <select
                    className={`form-select ${errors.professorId ? "is-invalid" : ""}`}
                    {...register("professorId")}
                  >
                    <option value="">Selecione um professor...</option>
                    {professores.map((prof) => (
                      <option key={prof.professorId} value={prof.professorId}>
                        {prof.nome}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.professorId?.message}</div>
                </div>

                {/* Botão */}
                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  disabled={!isValid || isSubmitting}
                  style={{
                    backgroundColor: !isValid || isSubmitting ? "#ccc" : "#198754",
                    color: "white",
                    border: "none",
                    cursor: !isValid || isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Cadastrar"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  );
}
