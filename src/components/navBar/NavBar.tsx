import { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar({ links }) {
  const defaultLinks = [
    { to: "/", label: "Home" },
    { to: "/Contatos", label: "Contatos" },
    { to: "/Registro-de-reserva", label: "Registro de reserva" }
  ];

  const finalLinks = links || defaultLinks;
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-dark bg-dark navbar-neutra">
      <div className="container d-flex justify-content-between align-items-center">

        {/* 🔹 Ícone hambúrguer à esquerda */}
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* 🔹 Links fixos à direita (fora do menu hambúrguer) */}
        <ul className="navbar-nav d-flex flex-row ms-auto">
          {finalLinks.map(({ to, label }) => (
            <li className="nav-item mx-2" key={to}>
              <Link className="nav-link" to={to}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 🔹 (Opcional) menu extra que aparece ao clicar no hambúrguer */}
        {open && (
          <div className="menu-flutuante">
            <ul className="list-unstyled m-0 p-3">
              <li><Link className="text-white" to="/CadastrarLaboratorio" onClick={() => setOpen(false)}>Laboratórios</Link></li>
              <li><Link className="text-white" to="/CadastrarProfessor" onClick={() => setOpen(false)}>Professores</Link></li>
              <li><Link className="text-white" to="/CadastrarTurma" onClick={() => setOpen(false)}>Turmas</Link></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
