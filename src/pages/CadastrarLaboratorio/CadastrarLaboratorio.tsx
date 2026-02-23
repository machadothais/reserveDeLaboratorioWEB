import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";
import LaboratorioService from "../../services/laboratorioService";
import type { LaboratorioForm } from "../../utils/interfaces/laborarioForms";



const laboratorioSchema = yup
  .object({
    nome: yup.string().required("O nome do laboratório é obrigatório."),
    capacidade: yup
      .number()
      .typeError("A capacidade deve ser um número.")
      .positive("A capacidade deve ser maior que zero.")
      .integer("A capacidade deve ser um número inteiro.")
      .required("A capacidade é obrigatória."),
  })
  .required();

export default function LaboratorioForm() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LaboratorioForm>({
    resolver: yupResolver(laboratorioSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LaboratorioForm) => {
    try {
      await LaboratorioService.create(data);

      setToast({ message: "✅ Laboratório cadastrado com sucesso!", type: "success" });

      reset();
      setTimeout(() => navigate("/registro-de-laboratorios"), 1500);
    } catch (error: any) {
      console.error("Erro ao cadastrar laboratório:", error);
      setToast({
        message: `❌ Erro ao cadastrar laboratório: ${error.response?.data || error.message}`,
        type: "error",
      });
    }
  };

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/registro-de-laboratorios", label: "Laboratórios" },
        ]}
      />

      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">🏫 Cadastrar Laboratório</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nome do Laboratório</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                    {...register("nome")}
                    placeholder="Ex: Laboratório de Informática 1"
                  />
                  <div className="invalid-feedback">{errors.nome?.message}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Capacidade (número de alunos)</label>
                  <input
                    type="number"
                    className={`form-control ${errors.capacidade ? "is-invalid" : ""}`}
                    {...register("capacidade")}
                    placeholder="Ex: 40"
                  />
                  <div className="invalid-feedback">{errors.capacidade?.message}</div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  disabled={!isValid || isSubmitting}
                  style={{
                    backgroundColor: !isValid || isSubmitting ? "#ccc" : "#198754",
                    color: "white",
                    cursor: !isValid || isSubmitting ? "not-allowed" : "pointer",
                    border: "none",
                    transition: "background-color 0.3s ease",
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
