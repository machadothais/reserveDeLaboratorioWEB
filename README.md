# 📚 Reserva de Laboratórios API

API REST desenvolvida em **ASP.NET Core** para gerenciamento de reservas de laboratórios, com foco em organização de código, boas práticas e arquitetura em camadas.

Projeto desenvolvido como parte de estudos em backend, demonstrando conhecimento em construção de APIs, integração com banco de dados e separação de responsabilidades.

---

## 🚀 Tecnologias

- ASP.NET Core
- C#
- Entity Framework Core
- SQL Server
- Swagger (OpenAPI)

---

## 🧠 Conceitos aplicados

- Arquitetura em camadas (Controller → Repository → Database)
- Separação de responsabilidades
- Uso de DTO para controle de dados expostos
- Injeção de dependência
- Migrations com Entity Framework
- Padronização de endpoints REST

---

## 📁 Estrutura
Controllers → Endpoints da API
Models → Entidades de domínio
DTO → Transferência de dados
Repository → Acesso ao banco de dados
Context → Configuração do Entity Framework


---

## ⚙️ Funcionalidades

- Cadastro de reservas de laboratório  
- Consulta de reservas  
- Atualização de agendamentos  
- Cancelamento de reservas  
- Gerenciamento de laboratórios  

---

## ▶️ Como executar

bash
git clone [https://github.com/machadothais/seu-repo.git]
cd reservaDeLaboratorioAPI

dotnet restore
dotnet ef database update
dotnet run

## Via Visual Studio
Abra o projeto no Visual Studio
Clique no botão HTTPS (ou pressione F5)
O navegador será aberto automaticamente

📌 Para acessar a documentação da API (Swagger):

Disponível via Swagger:
https://localhost:7169/swagger/index.html


## 🎯 Objetivo do projeto

Demonstrar habilidades em desenvolvimento backend com .NET, incluindo:

Construção de APIs REST
Organização de código em camadas
Integração com banco de dados relacional
Boas práticas de desenvolvimento
