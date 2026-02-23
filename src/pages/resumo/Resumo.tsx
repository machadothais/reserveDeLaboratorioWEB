// src/pages/reservas/ListaReservas.tsx

import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";

import type { TurmaDTO } from "../../interfaces/api/turma.dto";
import type { LaboratorioDTO } from "../../utils/interfaces/laboratorio.dto";
import type { ReservaDTO } from "../../utils/interfaces/reserva.dto";

import ReservaService from "../../services/reservaService";

export default function ListaReservas() {
  const [reservas, setReservas] = useState<ReservaDTO[]>([]);
  const [laboratorios, setLaboratorios] = useState<LaboratorioDTO[]>([]);
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [editando, setEditando] = useState<ReservaDTO | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);

  // Converte ISO → datetime-local
  const toLocalInput = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  // Normaliza reserva antes de editar
  const normalizarReserva = (r: ReservaDTO): ReservaDTO => ({
    ...r,
    nomeLaboratorio: r.nomeLaboratorio ?? "",
    nomeTurma: r.nomeTurma ?? "",
    dataInicio: r.dataInicio ?? new Date().toISOString(),
    dataFim: r.dataFim ?? new Date().toISOString(),
    observacao: r.observacao ?? "",
  });

  const carregarDados = async () => {
    try {
      const [reservasApi, labs, turmasApi] = await Promise.all([
        ReservaService.getAll(),
        ReservaService.getLaboratorios(),
        ReservaService.getTurmas(),
      ]);

      setReservas(reservasApi);
      setLaboratorios(labs);
      setTurmas(turmasApi);
    } catch {
      setToast({ message: "❌ Erro ao carregar dados.", type: "error" });
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const formatarDataHora = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // ABRIR CONFIRM — NÃO LIMPA MAIS editando AQUI
  const abrirConfirmacao = (id: number) => {
    setItemId(id);
    setConfirmOpen(true);
  };

  const excluirItem = async (id: number) => {
    try {
      await ReservaService.delete(id);
      setToast({ message: "🗑️ Reserva excluída!", type: "success" });
      carregarDados();
    } catch {
      setToast({ message: "❌ Erro ao excluir.", type: "error" });
    }
  };

  // AGORA LIMPA AQUI — DEPOIS DE EXCLUIR
  const confirmarExclusao = async () => {
    if (itemId !== null) {
      await excluirItem(itemId);
      setEditando(null); // ✔ AGORA É SEGURO
      setConfirmOpen(false);
    }
  };

  const salvarEdicao = async () => {
    if (!editando) return;

    setLoading(true);
    try {
      await ReservaService.update(editando.reservaId, {
        nomeLaboratorio: editando.nomeLaboratorio,
        nomeTurma: editando.nomeTurma,
        dataInicio: editando.dataInicio,
        dataFim: editando.dataFim,
        observacao: editando.observacao,
      });

      setToast({ message: "✔️ Reserva atualizada!", type: "success" });
      setEditando(null);
      carregarDados();
    } catch {
      setToast({ message: "❌ Erro ao atualizar.", type: "error" });
    }
    setLoading(false);
  };

  return (
    <>
      <NavBar links={[{ to: "/", label: "Home" }]} />

      <div className="container py-5">
        <h2 className="text-center mb-5 text-primary fw-bold">📋 Reservas Cadastradas</h2>

        {reservas.length === 0 ? (
          <p className="text-center text-muted">Nenhuma reserva cadastrada.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-success">
                <tr>
                  <th>Laboratório</th>
                  <th>Turma</th>
                  <th>Início</th>
                  <th>Término</th>
                  <th>Obs.</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {reservas.map((r) => {
                  const isEditing = editando?.reservaId === r.reservaId;

                  return (
                    <tr key={r.reservaId}>
                      {/* Laboratório */}
                      <td>
                        {isEditing ? (
                          <select
                            className="form-select"
                            value={editando.nomeLaboratorio}
                            onChange={(e) =>
                              setEditando({ ...editando, nomeLaboratorio: e.target.value })
                            }
                          >
                            <option>Selecione...</option>
                            {laboratorios.map((lab) => (
                              <option key={lab.laboratorioId} value={lab.nome}>
                                {lab.nome}
                              </option>
                            ))}
                          </select>
                        ) : (
                          r.nomeLaboratorio
                        )}
                      </td>

                      {/* Turma */}
                      <td>
                        {isEditing ? (
                          <select
                            className="form-select"
                            value={editando.nomeTurma}
                            onChange={(e) =>
                              setEditando({ ...editando, nomeTurma: e.target.value })
                            }
                          >
                            <option>Selecione...</option>
                            {turmas.map((t) => (
                              <option key={t.turmaId} value={t.nome}>
                                {t.nome}
                              </option>
                            ))}
                          </select>
                        ) : (
                          r.nomeTurma
                        )}
                      </td>

                      {/* Data início */}
                      <td>
                        {isEditing ? (
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={toLocalInput(editando.dataInicio)}
                            onChange={(e) =>
                              setEditando({
                                ...editando,
                                dataInicio: new Date(e.target.value).toISOString(),
                              })
                            }
                          />
                        ) : (
                          formatarDataHora(r.dataInicio)
                        )}
                      </td>

                      {/* Data fim */}
                      <td>
                        {isEditing ? (
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={toLocalInput(editando.dataFim)}
                            onChange={(e) =>
                              setEditando({
                                ...editando,
                                dataFim: new Date(e.target.value).toISOString(),
                              })
                            }
                          />
                        ) : (
                          formatarDataHora(r.dataFim)
                        )}
                      </td>

                      {/* Observação */}
                      <td>
                        {isEditing ? (
                          <input
                            className="form-control"
                            value={editando.observacao}
                            onChange={(e) =>
                              setEditando({ ...editando, observacao: e.target.value })
                            }
                          />
                        ) : (
                          r.observacao
                        )}
                      </td>

                      {/* Ações */}
                      <td className="text-center">
                        {isEditing ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              disabled={loading}
                              onClick={salvarEdicao}
                            >
                              💾 Salvar
                            </button>

                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditando(null)}
                            >
                              ❌ Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => setEditando(normalizarReserva(r))}
                            >
                              ✏️ Editar
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => abrirConfirmacao(r.reservaId)}
                            >
                              🗑️ Excluir
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {confirmOpen && (
        <ConfirmDialog
          message="Tem certeza que deseja excluir?"
          onConfirm={confirmarExclusao}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
