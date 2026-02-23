import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";
import LaboratorioService from "../../services/laboratorioService";
import type { LaboratorioDTO } from "../../utils/interfaces/laboratorio.dto";



export default function ListaLaboratorios() {
  const [laboratorios, setLaboratorios] = useState<LaboratorioDTO[]>([]);
  const [editando, setEditando] = useState<LaboratorioDTO | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);

  // 🔹 Carregar dados
  const carregarLaboratorios = async () => {
    try {
      const data = await LaboratorioService.getAll();
      setLaboratorios(data);
    } catch (error) {
      console.error("Erro ao carregar laboratórios:", error);
      setToast({ message: "❌ Erro ao carregar laboratórios.", type: "error" });
    }
  };

  useEffect(() => {
    carregarLaboratorios();
  }, []);
   function abrirConfirmacao(id: number) {
  setItemId(id);
  setConfirmOpen(true);
}

async function confirmarExclusao() {
  if (itemId === null) return;
  await excluirTurma(itemId);
  setConfirmOpen(false);
}

  // 🔹 Excluir
  const excluirLaboratorio = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este laboratório?")) return;

    try {
      await LaboratorioService.delete(id);
      setToast({ message: "🗑️ Laboratório excluído com sucesso!", type: "success" });
      setLaboratorios((prev) => prev.filter((l) => l.laboratorioId !== id));
    } catch (error) {
      console.error("Erro ao excluir laboratório:", error);
      setToast({ message: "❌ Erro ao excluir laboratório.", type: "error" });
    }
  };

  // 🔹 Salvar edição
  const salvarEdicao = async () => {
    if (!editando) return;
    setLoading(true);

    try {
      await LaboratorioService.update(editando.laboratorioId, {
        nome: editando.nome,
        capacidade: editando.capacidade,
      });

      setToast({ message: "✅ Laboratório atualizado com sucesso!", type: "success" });
      setEditando(null);
      carregarLaboratorios();
    } catch (error) {
      console.error("Erro ao atualizar laboratório:", error);
      setToast({ message: "❌ Erro ao atualizar laboratório.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/CadastrarLaboratorio", label: "Cadastrar laboratório" },
        ]}
      />

      <div className="container py-5">
        <h2 className="text-center mb-5 text-primary fw-bold">🏫 Laboratórios Cadastrados</h2>

        {/* Tabela */}
        {laboratorios.length === 0 ? (
          <p className="text-center text-muted">Nenhum laboratório cadastrado ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>Nome</th>
                  <th>Capacidade</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {laboratorios.map((lab) => (
                  <tr key={lab.laboratorioId}>
                    {editando?.laboratorioId === lab.laboratorioId ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={editando.nome}
                            onChange={(e) =>
                              setEditando({ ...editando, nome: e.target.value })
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={editando.capacidade}
                            onChange={(e) =>
                              setEditando({
                                ...editando,
                                capacidade: Number(e.target.value),
                              })
                            }
                          />
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={salvarEdicao}
                            disabled={loading}
                          >
                            💾 Salvar
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditando(null)}
                          >
                            ❌ Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{lab.nome}</td>
                        <td>{lab.capacidade}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => setEditando(lab)}
                          >
                            📝 Editar
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => abrirConfirmacao(lab.laboratorioId)}
                          >
                            🗑️ Excluir
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
              {confirmOpen && (
          <ConfirmDialog
            message="Tem certeza que deseja excluir este laboratório?"
            onConfirm={confirmarExclusao}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
        

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  );
}
