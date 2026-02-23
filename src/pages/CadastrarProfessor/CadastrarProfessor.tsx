import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";
import type { ProfessorForm } from "../../interfaces/api/forms/profesorForms";
import ProfessorService from "../../services/professorService";


const professorSchema = yup.object({
  nome: yup.string().required("O nome é obrigatório."),
  email: yup.string().email("Email inválido.").required("O email é obrigatório."),
  laboratorioId: yup.number().typeError("Selecione um laboratório.").required("O laboratório é obrigatório."),
}).required();

export default function CadastraProfessor() {

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [laboratorios, setLaboratorios] = useState<{ id: number; nome: string }[]>([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProfessorForm>({
    resolver: yupResolver(professorSchema),
    mode: "onChange",
  });

  // 🔹 Carregar laboratórios corretamente
useEffect(() => {
    ProfessorService.getAll()
    .then((res) => {
      console.log("RETORNO DO SERVICE:", res); // 👈 AQUI VAMOS VER A VERDADE REAL

      const labsCorrigidos = res.map((lab: any) => ({
        id: lab.laboratorioId ?? lab.id,
        nome: lab.nomeLaboratorio ?? lab.nome
      }));

      console.log("CORRIGIDOS:", labsCorrigidos);
      setLaboratorios(labsCorrigidos);
    })
    .catch((err) => console.error("Erro ao carregar laboratórios:", err));
}, []);


  const onSubmit = async (data: ProfessorForm) => {
    try {
      await ProfessorService.create({
        nome: data.nome,
        email: data.email,
        LaboratorioId: data.laboratorioId,  // 🔥 backend exige L maiúsculo
      });

      setToast({ message: "👨‍🏫 Professor cadastrado com sucesso!", type: "success" });

      reset();
      setTimeout(() => navigate("/registro-de-professores"), 1500);
      
    } catch (error: any) {
      console.error("Erro ao cadastrar professor:", error);
      setToast({
        message: `❌ Erro ao cadastrar professor: ${error.response?.data || error.message}`,
        type: "error",
      });
    }
  };

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/registro-de-professores", label: "Professores" },
        ]}
      />

      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">👨‍🏫 Cadastrar Professor</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 p-4">
              <form onSubmit={handleSubmit(onSubmit)}>

                {/* Nome */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nome do Professor</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                    {...register("nome")}
                    placeholder="Ex: João da Silva"
                  />
                  <div className="invalid-feedback">{errors.nome?.message}</div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    {...register("email")}
                    placeholder="Ex: professor@email.com"
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>

                {/* Laboratório */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Laboratório</label>
            <select
  className={`form-select ${errors.laboratorioId ? "is-invalid" : ""}`}
  {...register("laboratorioId", { valueAsNumber: true })}
>
  <option value="">Selecione um laboratório</option>

  {laboratorios.map((lab) => (
    <option key={lab.id} value={lab.id}>
      {lab.nome}
    </option>
  ))}
</select>
                  <div className="invalid-feedback">{errors.laboratorioId?.message}</div>
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
