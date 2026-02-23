import { useNavigate } from "react-router-dom";
function Header(){
  const navigate=useNavigate();
  const irReserva=()=>{
    navigate("/reserva")
  }
    return(<>{/* Hero Section */}
      <header className="bg-light text-center py-5">
        <div className="container">
          <h1 className="display-4 text fw-bold">Reserve seu Laboratório com Facilidade</h1>
          <p className="lead">Sistema rápido, moderno e acessível para todos os usuários</p>
          <button onClick={irReserva} className="btn btn-personalizado btn-lg mt-3">Fazer Reserva</button>
        </div>
      </header></>)
}
export default Header;