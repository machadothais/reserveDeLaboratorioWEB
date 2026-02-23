import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function TestNav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#">ReservaLab</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Contatos</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Registro</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
