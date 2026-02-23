import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";

// Interfaces
import type { TurmaDTO } from "../../utils/interfaces/api/turma.dto";
import type { FormDataDTO } from "../../utils/interfaces/form-data.dto";
import type { LaboratorioDTO } from "../../utils/interfaces/laboratorio.dto";
import type { ReservaDTO } from "../../utils/interfaces/reserva.dto";

// Service PRINCIPAL
import ReservaService from "../../services/reservaService";

// ------------------ VALIDAÇÃO YUP ------------------

const reservaSchema = yup.object({
  nomeLaboratorio: yup.string().required("Selecione um laboratório."),
  nomeTurma: yup.string().required("Selecione uma turma."),
  dataInicio: yup.string().required("Informe a data de início."),
  horaInicio: yup.string().required("Informe o horário de início."),
  dataFim: yup.string().required("Informe a data de término."),
  horaFim: yup.string().required("Informe o horário de término."),
  observacao: yup.string().required("Informe uma observação."),
});

// ------------------ COMPONENTE ------------------

export default function Reserva() {
  const navigate = useNavigate();

  const [laboratorios, setLaboratorios] = useState<LaboratorioDTO[]>([]);
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormDataDTO>({
    resolver: yupResolver(reservaSchema),
    mode: "onChange",
  });

  // ------------------ WATCH CAMPOS ------------------

  const watchDataInicio = watch("dataInicio");
  const watchHoraInicio = watch("horaInicio");
  const watchDataFim = watch("dataFim");
  const watchHoraFim = watch("horaFim");

  // ------------------ VALIDAÇÃO DE DATAS ------------------

  const datasValidas = useMemo(() => {
    if (!watchDataInicio || !watchHoraInicio || !watchDataFim || !watchHoraFim)
      return false;

    const inicio = new Date(`${watchDataInicio}T${watchHoraInicio}`);
    const fim = new Date(`${watchDataFim}T${watchHoraFim}`);

    return inicio < fim && inicio >= new Date();
  }, [watchDataInicio, watchHoraInicio, watchDataFim, watchHoraFim]);

  // ------------------ CARREGAR LABS E TURMAS ------------------

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const labs = await ReservaService.getLaboratorios();
        const turmasLista = await ReservaService.getTurmas();

        setLaboratorios(labs);
        setTurmas(turmasLista);

      } catch (error) {
        setToast({
          message: "❌ Erro ao carregar laboratórios ou turmas.",
          type: "error",
        });
      }
    };

    carregarDados();
  }, []);

  // ------------------ SUBMIT ------------------

  const onSubmit = async (data: FormDataDTO) => {
    setLoading(true);

    try {
      const inicio = new Date(`${data.dataInicio}T${data.horaInicio}`);
      const fim = new Date(`${data.dataFim}T${data.horaFim}`);

      const payload: ReservaDTO = {
        nomeLaboratorio: data.nomeLaboratorio,
        nomeTurma: data.nomeTurma,
        dataInicio: inicio.toISOString(),
        dataFim: fim.toISOString(),
        observacao: data.observacao,
      };

      await ReservaService.create(payload);

      setToast({
        message: "✅ Reserva cadastrada com sucesso!",
        type: "success",
      });

      reset();
      setTimeout(() => navigate("/registro-de-reserva"), 1500);

    } catch (error: any) {
      setToast({
        message: `❌ Erro ao enviar reserva: ${
          error.response?.data || error.message
        }`,
        type: "error",
      });

    } finally {
      setLoading(false);
    }
  };

  // ------------------ RENDER ------------------

  return (
    <>
      <NavBar links={[{ to: "/", label: "Home" }]} />

      <div className="container py-5">
        <h2 className="text-center mb-5 text-primary fw-bold">📅 Nova Reserva</h2>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card p-4 shadow-lg border-0">
              <form onSubmit={handleSubmit(onSubmit)}>

                {/* LABORATÓRIO */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Laboratório</label>
                  <select
                    className={`form-select ${errors.nomeLaboratorio ? "is-invalid" : ""}`}
                    {...register("nomeLaboratorio")}
                  >
                    <option value="">Selecione um laboratório...</option>
                    {laboratorios.map((lab) => (
                      <option key={lab.laboratorioId} value={lab.nome}>
                        {lab.nome}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.nomeLaboratorio?.message}</div>
                </div>

                {/* TURMA */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Turma</label>
                  <select
                    className={`form-select ${errors.nomeTurma ? "is-invalid" : ""}`}
                    {...register("nomeTurma")}
                  >
                    <option value="">Selecione uma turma...</option>
                    {turmas.map((turma) => (
                      <option key={turma.turmaId} value={turma.nome}>
                        {turma.nome}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.nomeTurma?.message}</div>
                </div>

                {/* DATA INÍCIO / HORA */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Data de Início</label>
                    <input
                      type="date"
                      className={`form-control ${errors.dataInicio ? "is-invalid" : ""}`}
                      {...register("dataInicio")}
                    />
                    <div className="invalid-feedback">{errors.dataInicio?.message}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Hora de Início</label>
                    <input
                      type="time"
                      className={`form-control ${errors.horaInicio ? "is-invalid" : ""}`}
                      {...register("horaInicio")}
                    />
                    <div className="invalid-feedback">{errors.horaInicio?.message}</div>
                  </div>
                </div>

                {/* DATA FIM / HORA */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Data de Término</label>
                    <input
                      type="date"
                      className={`form-control ${errors.dataFim ? "is-invalid" : ""}`}
                      {...register("dataFim")}
                    />
                    <div className="invalid-feedback">{errors.dataFim?.message}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Hora de Término</label>
                    <input
                      type="time"
                      className={`form-control ${errors.horaFim ? "is-invalid" : ""}`}
                      {...register("horaFim")}
                    />
                    <div className="invalid-feedback">{errors.horaFim?.message}</div>
                  </div>
                </div>

                {/* OBSERVAÇÃO */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Observação</label>
                  <textarea
                    className={`form-control ${errors.observacao ? "is-invalid" : ""}`}
                    rows={3}
                    {...register("observacao")}
                    placeholder="Descreva o motivo da reserva..."
                  />
                  <div className="invalid-feedback">{errors.observacao?.message}</div>
                </div>

                {/* BOTÃO */}
                <button
                  type="submit"
                  className={`w-100 fw-bold btn ${
                    loading || !isValid || !datasValidas ? "btn-secondary" : "btn-success"
                  }`}
                  disabled={loading || !isValid || !datasValidas}
                >
                  {loading ? "Enviando..." : "Confirmar Reserva"}
                </button>

                {!datasValidas && (
                  <p className="text-danger text-center mt-2">
                    ⚠️ Verifique se a data/hora de término é posterior à de início.
                  </p>
                )}

              </form>
            </div>
          </div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  );
}
