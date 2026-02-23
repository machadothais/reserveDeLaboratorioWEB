import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";
import ProfessorService, { type ProfessorDTO } from "../../services/professorService";


export default function RegistrarProfessores() {
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  // 🔹 Buscar professores do backend
  const carregarProfessores = async () => {
    try {
      const data=await ProfessorService.getAll()
      setProfessores(data);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
      setToast({ message: "❌ Erro ao carregar professores.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProfessores();
  }, []);

  // 🔹 Excluir professor
  const excluirProfessor = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este professor?")) return;
    try {
      await ProfessorService.delete(id);
      setToast({ message: "🗑️ Professor excluído com sucesso!", type: "success" });
      setProfessores(professores.filter((p) => p.ProfessorId !== id));
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
      setToast({ message: "❌ Erro ao excluir professor.", type: "error" });
    }
  };

  // 🔹 Redirecionar para a página de edição
  const editarProfessor = (id: number) => {
    navigate(`/professores/editar/${id}`);
  };

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/CadastrarProfessor"  , label: "Cadastrar Professor" },
        ]}
      />

      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">👩‍🏫 Professores Cadastrados</h2>

        {/* Estado de carregamento */}
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
                {professores.map((professor) => (
                  <tr key={professor.professorId}>
                    <td>{professor.nome}</td>
                    <td>{professor.email}</td>
                    <td>{professor.nomeLaboratorio}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editarProfessor(professor.professorId)}
                      >
                        📝 Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => excluirProfessor(professor.professorId)}
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  );
}
