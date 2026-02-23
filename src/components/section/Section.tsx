function Section(){
    return(<> {/* Benefícios */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="mb-4 text-secondary">Por que usar o App reserva?</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <i className="bi bi-clock fs-1 text-primary"></i>
                  <h5 className="card-title mt-3">Agilidade</h5>
                  <p className="card-text">Reserve em segundos com poucos cliques.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <i className="bi bi-laptop fs-1 text-primary"></i>
                  <h5 className="card-title mt-3">Tecnologia</h5>
                  <p className="card-text">Interface moderna e responsiva para todos os dispositivos.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <i className="bi bi-shield-check fs-1 text-primary"></i>
                  <h5 className="card-title mt-3">Segurança</h5>
                  <p className="card-text">Seus dados protegidos com criptografia e autenticação.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Laboratórios */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4 text-secondary">Laboratórios Disponíveis</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <img src="/lab1.jpg" className="card-img-top" alt="Lab 1" />
                <div className="card-body">
                  <h5 className="card-title">Laboratório 01</h5>
                  <p className="card-text">Equipado com 20 computadores e projetor multimídia.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <img src="/lab2.jpg" className="card-img-top" alt="Lab 2" />
                <div className="card-body">
                  <h5 className="card-title">Laboratório 02</h5>
                  <p className="card-text">Ideal para aulas de programação e robótica.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <img src="/lab3.jpg" className="card-img-top" alt="Lab 3" />
                <div className="card-body">
                  <h5 className="card-title">Laboratório 03</h5>
                  <p className="card-text">Ambiente climatizado com acesso à internet de alta velocidade.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section></>)
}
export default Section;