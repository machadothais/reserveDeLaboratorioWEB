import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./modalAgradecimento.css";

interface ModalAgradecimentoProps {
  onClose: () => void;
}

export default function ModalAgradecimento({ onClose }: ModalAgradecimentoProps) {
  const navigate = useNavigate();

  function fecharModal() {
    // garante que não quebra se onClose vier undefined por algum motivo
    if (typeof onClose === "function") {
      onClose();
    }
    navigate("/");
  }

  // ESC para fechar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        fecharModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // aqui tá ok vazio mesmo

  // Fechar clicando fora do modal
  function handleClickOverlay(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      fecharModal();
    }
  }

  return (
    <>
      <div
        className="modal fade-custom show d-block"
        onClick={handleClickOverlay}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow position-relative">
            {/* BOTÃO X */}
            <button
              type="button"
              className="btn-close position-absolute end-0 mt-2 me-2"
              aria-label="Close"
              onClick={fecharModal}
            ></button>

            <div className="modal-header border-0 mt-3">
              <h5 className="modal-title w-100 text-center">
                🎉 Obrigado pelo contato!
              </h5>
            </div>

            <div className="modal-body text-center pb-4">
              <p className="text-muted mb-0">
                Recebemos sua mensagem e retornaremos em breve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <div className="modal-backdrop-custom"></div>
    </>
  );
}
