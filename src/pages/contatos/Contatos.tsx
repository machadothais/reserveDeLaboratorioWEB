import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import ModalAgradecimento from "../../components/modal/modalAgradecimento";
import NavBar from "../../components/navBar/NavBar";
import Toast from "../../components/toast/Toast";

import { enviarContato } from "../../services/contatoService";
import type { ContatoForm } from "../../utils/interfaces/contatoForms";
import "./Contatos.css";


const contatoSchema = yup
  .object({
    nome: yup
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres.")
      .required("O nome é obrigatório."),
    email: yup
      .string()
      .required("O email é obrigatório.")
      .email("Email inválido.")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "O email deve conter um domínio válido (ex: usuario@dominio.com)."
      ),
    mensagem: yup.string().required("Digite uma mensagem."),
  })
  .required();

export default function Contatos() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContatoForm>({
    resolver: yupResolver(contatoSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ContatoForm) => {
    try {
      const response = await enviarContato(data);
    if (response.status === 201 || response.status === 200) {
  setToast(null); // opcional: remove o toast
  setModalAberto(true); // abre o modal
  reset();

  
}
    } catch (error: any) {
      console.error("Erro ao enviar contato:", error);
      setToast({
        message: `❌ Erro ao enviar mensagem: ${error.response?.data || error.message}`,
        type: "error",
      });
    }
  };

  return (
    <>
      <NavBar
        links={[
          { to: "/", label: "Home" },
          { to: "/contatos", label: "Contato" },
        ]}
      />

      <div className="contato-container">
        <h2 className="contato-titulo">📬 Fale Conosco</h2>

        <div className="contato-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                {...register("nome")}
                placeholder="Digite seu nome completo"
              />
              <div className="invalid-feedback">{errors.nome?.message}</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email")}
                placeholder="exemplo@dominio.com"
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Mensagem</label>
              <textarea
                className={`form-control ${errors.mensagem ? "is-invalid" : ""}`}
                {...register("mensagem")}
                rows={4}
                placeholder="Digite sua mensagem..."
              ></textarea>
              <div className="invalid-feedback">{errors.mensagem?.message}</div>
            </div>

            <button
              type="submit"
              className="contato-btn"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} />}
        {modalAberto && (
  <ModalAgradecimento onClose={() => setModalAberto(false)} />
 
  
)}
        
      </div>
    
    </>
  );
}
