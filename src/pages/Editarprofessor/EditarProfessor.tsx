import { useEffect, useState } from "react";
import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";

import LaboratorioService from "../../services/laboratorioService";
import ProfessorService, { type ProfessorDTO } from "../../services/professorService";

export default function RegistrarProfessores() {
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [editando, setEditando] = useState<ProfessorDTO | null>(null);

  const [laboratorios, setLaboratorios] = useState<
    { laboratorioId: number; nome: string }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 🔹 Buscar dados APENAS pelos services
  const carregarDados = async () => {
    try {
      const professoresResponse = await ProfessorService.getAll();
      const labsResponse = await LaboratorioService.getAll();

      setProfessores(professoresResponse);

      const labsCorrigidos = labsResponse.map((lab) => ({
        laboratorioId: lab.laboratorioId,
        nome: lab.nome
      }));

      setLaboratorios(labsCorrigidos);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setToast({
        message: "❌ Erro ao carregar professores ou laboratórios.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // 🔹 Excluir professor (via service)
  const excluirProfessor = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este professor?")) return;

    try {
      await ProfessorService.delete(id);
      setToast({ message: "🗑️ Professor excluído com sucesso!", type: "success" });
      setProfessores((prev) => prev.filter((p) => p.professorId !== id));
    } catch (error) {
      console.error(error);
      setToast({ message: "❌ Erro ao excluir professor.", type: "error" });
    }
  };

  // 🔹 Iniciar edição
  const iniciarEdicao = (prof: ProfessorDTO) => {
    setEditando({ ...prof });
  };

  // 🔹 Cancelar edição
  const cancelarEdicao = () => {
    setEditando(null);
  };

  // 🔹 Salvar edição (via service)
  const salvarEdicao = async () => {
    if (!editando) return;

    try {
    await ProfessorService.update(editando.professorId, {
  nome: editando.nome,
  email: editando.email,
  laboratorioId: editando.laboratorioId, // 🔥 ESSA LINHA FALTAVA!
})

      setToast({ message: "💾 Professor atualizado com sucesso!", type: "success" });
      setEditando(null);
      carregarDados();
    } catch (error) {
      console.error(error);
      setToast({ message: "❌ Erro ao atualizar professor.", type: "error" });
    }
  };

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/CadastrarProfessor", label: "Cadastrar Professor" },
        ]}
      />

      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">👩‍🏫 Professores Cadastrados</h2>

        {loading ? (
          <p className="text-center text-muted">⏳ Carregando professores...</p>
        ) : professores.length === 0 ? (
          <p className="text-center text-muted">Nenhum professor cadastrado ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Laboratório</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {professores.map((prof) =>
                  editando?.professorId === prof.professorId ? (
                    <tr key={prof.professorId}>
                      {/* Nome */}
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editando.nome}
                          onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                        />
                      </td>

                      {/* Email */}
                      <td>
                        <input
                          type="email"
                          className="form-control"
                          value={editando.email}
                          onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                        />
                      </td>

                      {/* Laboratório */}
                      <td>
                        <select
                          className="form-select"
                          value={editando.laboratorioId}
                          onChange={(e) =>
                            setEditando({
                              ...editando,
                              laboratorioId: Number(e.target.value),
                            })
                          }
                        >
                          {laboratorios.map((lab) => (
                            <option key={lab.laboratorioId} value={lab.laboratorioId}>
                              {lab.nome}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Ações */}
                      <td className="text-center">
                        <button className="btn btn-success btn-sm me-2" onClick={salvarEdicao}>
                          💾 Salvar
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelarEdicao}>
                          ❌ Cancelar
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={prof.professorId}>
                      <td>{prof.nome}</td>
                      <td>{prof.email}</td>
                      <td>
                        {laboratorios.find(
                          (l) => l.laboratorioId === prof.laboratorioId
                        )?.nome}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => iniciarEdicao(prof)}
                        >
                          📝 Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => excluirProfessor(prof.professorId)}
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  );
}
