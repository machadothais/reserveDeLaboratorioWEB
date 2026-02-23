import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';




import CadastrarLaboratorio from "./pages/CadastrarLaboratorio/CadastrarLaboratorio";
import CadastrarProfessor from "./pages/CadastrarProfessor/CadastrarProfessor";
import CadastrarTurmas from './pages/cadastrarTurmas/CadastrarTumas';
import Contatos from './pages/contatos/Contatos';
import EditarProfessor from "./pages/Editarprofessor/EditarProfessor";
import Home from "./pages/home/Home";
import ListarContatos from "./pages/listarContatos/ListarContatos";
import ListaTurmas from "./pages/ListarTurma/ListaTurma";
import ListaLaboratorios from "./pages/RegistroLaboratorio/registroLaboratorio";
import Reserva from "./pages/reserva/Reserva";
import Resumo from './pages/resumo/Resumo';
 

// Páginas

function App() {
  return (
    <BrowserRouter>
     

      {/* Definição das rotas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contatos" element={<Contatos />} />
        <Route path="/Reserva" element={<Reserva/>} />
        <Route path="/Registro-de-reserva" element={<Resumo/>} />
       <Route path="/registro-de-contatos" element={<ListarContatos />} /> 
       <Route path="/CadastrarLaboratorio" element={<CadastrarLaboratorio onSubmit={undefined}/>}/>
       <Route path="/registro-de-laboratorios" element={<ListaLaboratorios/>}/>
       <Route path="/registro-de-professores" element={<EditarProfessor/>}/>
       <Route path="/CadastrarProfessor"  element={<CadastrarProfessor/>}/>
       <Route path="/CadastrarTurma" element={<CadastrarTurmas/>}/>
       <Route path="/registro-de-turmas" element={<ListaTurmas/>}/>
       

      </Routes>
    </BrowserRouter>
 
  );
}

export default App;
