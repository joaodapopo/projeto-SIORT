# SIORT — Simpósio de Implantes Ortopédicos

Este projeto está dividido em duas partes principais: **frontend** (React + Vite) e **backend** (NestJS + SQLite).

## 🚀 Como Executar a Aplicação

### 1. Backend (API & Banco de Dados)
O backend gerencia os participantes, minicursos, inscrições e certificados em um banco de dados SQLite (`siort.sqlite`).

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run start:dev
```

* **URL da API**: `http://localhost:3000`
* **Swagger UI (Documentação e Testes)**: `http://localhost:3000/api`

---

### 2. Frontend (Interface Web)
O frontend consome as APIs do backend para simular as inscrições em tempo real e emissão de certificados.

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento do Vite
npm run dev
```

* **URL do Frontend**: `http://localhost:5173`
