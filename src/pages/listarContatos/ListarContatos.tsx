import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from '../../components/navBar/NavBar';

function ListarContatos() {
  const navigate = useNavigate();
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('contatos');
    try {
      const parsed = raw ? JSON.parse(raw) : [];

      const arr = Array.isArray(parsed) ? parsed : [];

      const validContato = arr.filter((r) => {
        if (!r || typeof r !== 'object') return false;
        return Object.values(r).some(
          (v) => v !== null && v !== undefined && String(v).trim() !== ""
        );
      });
      setContatos(validContato);
    } catch (err) {
      console.error("Erro ao ler/parsear contatos do localStorage:", err);
      setContatos([]);
    }
  }, []);

  if (!contatos || contatos.length === 0) {
    return (
      <div className="container text-center mt-5">
        <p>Nenhum contato encontrado.</p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/")}
        >
          Entrar em contato novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <NavBar links={[{ to: "/", label: "Home" }]} />
      <div className="container py-5">
        <h2 className="text-center mb-4 text-success">📋 Lista de Contatos</h2>

        {[...contatos].reverse().map((contato, index) => (
          <div key={contato.id ?? index} className="card p-4 shadow-lg mb-3">
            <h5 className="text-primary">Contato #{contatos.length - index}</h5>
            <p><strong>Nome:</strong> {contato.nome}</p>
            <p><strong>Email:</strong> {contato.email}</p>
            <p><strong>Assunto:</strong> {contato.assunto}</p>
            <p><strong>Mensagem:</strong> {contato.mensagem}</p>
          </div>
        ))}

        <div className="text-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/Contatos")}
          >
            🔙 Fazer Novo Contato
          </button>
        </div>
      </div>
    </>
  );
}

export default ListarContatos;
