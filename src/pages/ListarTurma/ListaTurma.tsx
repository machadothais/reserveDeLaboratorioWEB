import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";


import TurmaService, {
  type ProfessorDTO,
  type TurmaDTO,
} from "../../services/turmaService";

export default function ListaTurmas() {
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [editando, setEditando] = useState<TurmaDTO | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);

  // 🔹 Carregar turmas e professores usando service
  const carregarTurmas = async () => {
    try {
      const [turmasData, professoresData] = await Promise.all([
        TurmaService.getTurmas(),
        TurmaService.getProfessores(),
      ]);

      setTurmas(turmasData);
      setProfessores(professoresData);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      setToast({ message: "❌ Erro ao carregar turmas.", type: "error" });
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  // 🔹 Buscar nome do professor pelo id
  const getProfessorNome = (id: number) => {
    const professor = professores.find((p) => p.professorId === id);
    return professor ? professor.nome : "Professor não encontrado";
  };
  function abrirConfirmacao(id: number) {
  setItemId(id);
  setConfirmOpen(true);
}

async function confirmarExclusao() {
  if (itemId === null) return;
  await excluirTurma(itemId);
  setConfirmOpen(false);
}

  // 🔹 Excluir turma
const excluirTurma = async (id: number) => {
  try {
    await TurmaService.deleteTurma(id);

    setToast({ message: "🗑️ Turma excluída com sucesso!", type: "success" });
    setTurmas((prev) => prev.filter((t) => t.turmaId !== id));

  } catch (error) {
    console.error("Erro ao excluir turma:", error);
    setToast({ message: "❌ Erro ao excluir turma.", type: "error" });
  }
};

  // 🔹 Salvar edição
  const salvarEdicao = async () => {
    if (!editando) return;
    setLoading(true);

    try {
      const payload = {
        nome: editando.nome,
        quantidadeAlunos: editando.quantidadeAlunos,
        professorId: editando.professorId,
      };

      await TurmaService.updateTurma(editando.turmaId, payload);

      setToast({ message: "✅ Turma atualizada com sucesso!", type: "success" });
      setEditando(null);
      carregarTurmas();

    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
      setToast({ message: "❌ Erro ao atualizar turma.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cancelar edição
  const cancelarEdicao = () => {
    setEditando(null);
  };

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/CadastrarTurma", label: "Cadastrar Turma" },
        ]}
      />

      <div className="container py-5">
        <h2 className="text-center mb-5 text-primary fw-bold">📚 Turmas Cadastradas</h2>

        {turmas.length === 0 ? (
          <p className="text-center text-muted">Nenhuma turma cadastrada ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>Nome da Turma</th>
                  <th>Qtd. de Alunos</th>
                  <th>Professor Responsável</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {turmas.map((turma) => (
                  <tr key={turma.turmaId}>
                    {editando?.turmaId === turma.turmaId ? (
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
                            value={editando.quantidadeAlunos}
                            onChange={(e) =>
                              setEditando({
                                ...editando,
                                quantidadeAlunos: Number(e.target.value),
                              })
                            }
                          />
                        </td>

                        <td>
                          <select
                            className="form-select"
                            value={editando.professorId}
                            onChange={(e) =>
                              setEditando({
                                ...editando,
                                professorId: Number(e.target.value),
                              })
                            }
                          >
                            <option value="">Selecione...</option>
                            {professores.map((p) => (
                              <option key={p.professorId} value={p.professorId}>
                                {p.nome}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={salvarEdicao}
                            disabled={loading}
                          >
                            💾 Salvar
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={cancelarEdicao}>
                            ❌ Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{turma.nome}</td>
                        <td>{turma.quantidadeAlunos}</td>
                        <td>{getProfessorNome(turma.professorId)}</td>

                        <td className="text-center">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => setEditando(turma)}
                          >
                            📝 Editar
                          </button>

                         <button
  className="btn btn-danger btn-sm"
  onClick={() => abrirConfirmacao(turma.turmaId)}
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
    message="Tem certeza que deseja excluir esta turma?"
    onConfirm={confirmarExclusao}
    onCancel={() => setConfirmOpen(false)}
  />
)}

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  );
}
