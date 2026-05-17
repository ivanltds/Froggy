# 📖 Guia do Projeto Acadêmico: API C# SQL de Login

Este projeto foi construído sob medida para sua apresentação acadêmica. Ele demonstra uma conexão direta, robusta e segura entre um Frontend estático e um Banco de Dados SQL usando C# com **ASP.NET Core Minimal APIs**.

---

## ⚙️ Pré-requisitos
Para rodar este projeto no seu computador, você precisa do **.NET SDK** instalado:
1. Acesse [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
2. Baixe e instale a versão **.NET 8.0** ou **.NET 9.0** (Recomendado: .NET 8.0 LTS).
3. Confirme a instalação abrindo seu terminal e digitando:
   ```bash
   dotnet --version
   ```

*(Não é necessário instalar nenhum banco de dados relacional complexo como SQL Server ou MySQL, pois configuramos o **SQLite**, que armazena os dados localmente em um arquivo super leve, ideal para trabalhos universitários!)*

---

## 📂 Estrutura do Projeto
O projeto está organizado de maneira limpa e didática:
*   **`frontend/`**: Contém a interface do usuário (HTML5 + CSS3 Premium com Glassmorphism) e o arquivo de controle JavaScript (`login-integracao.js`).
*   **`backend/`**: Contém a API em C# desenvolvida em arquivo único (`Program.cs`) para que você consiga ler e explicar o código sequencialmente sem complicação.
*   **`banco/`**: Contém os scripts SQL oficiais (`schema.sql` de tabelas e `seed.sql` de dados de teste). O arquivo físico do banco `banco.db` é gerado automaticamente aqui na primeira execução do backend.

---

## 🚀 Como Executar o Projeto

### Passo 1: Iniciar a API Backend (C#)
Abra o seu terminal (PowerShell, Command Prompt ou Terminal do VS Code) na pasta raiz do projeto e execute os seguintes comandos:

```bash
# Navegar até a pasta do backend
cd backend

# Baixar pacotes e rodar a API C#
dotnet run
```

Você verá a saída informando que o banco de dados foi inicializado e a API está ativa:
```text
[BANCO]: Tabela 'Usuarios' verificada/creada com sucesso.
[BANCO]: Dados de teste carregados com sucesso (seed.sql).
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```
*Mantenha essa janela do terminal aberta! Ela é o servidor da sua API.*

### Passo 2: Executar o Frontend (Interface)
1. Navegue até a pasta `frontend`.
2. Dê um duplo-clique no arquivo **`index.html`** para abri-lo diretamente em qualquer navegador (Chrome, Edge, Firefox).
3. Pronto! O frontend se comunicará automaticamente com a API C# rodando em background.

---

## 🧪 Credenciais para Teste (Banco Injetado)
Quando o sistema foi iniciado pela primeira vez, ele rodou o script `seed.sql` e inseriu os seguintes usuários de demonstração que você pode usar para a sua apresentação:

| Usuário | Senha | Resultado do Login |
| :--- | :--- | :--- |
| `admin` | `123456` | **Liberado** (200 OK) |
| `estudante` | `faculdade2026` | **Liberado** (200 OK) |
| `professor` | `nota10` | **Liberado** (200 OK) |
| `qualquer_outro` | `senha_errada` | **Bloqueado** (401 Unauthorized) |

---

## 🎓 Dicas para a Apresentação Acadêmica (Banca de Avaliação)

Se os professores fizerem perguntas técnicas sobre o projeto, aqui estão as respostas ideais:

1. **Por que você escolheu Minimal APIs em vez de Controllers?**
   > *"Escolhi Minimal APIs (novidade do ASP.NET Core) porque ela reduz o código boilerplate (redundante). Conseguimos ter uma API enxuta, de alta performance e legível em um único arquivo `Program.cs`, o que facilita a manutenção e leitura lógica."*

2. **Como a API se protege contra SQL Injection?**
   > *"Não concatenamos strings de variáveis diretamente na query. Usamos **queries parametrizadas** com `command.Parameters.AddWithValue()`. Isso faz com que o SQLite/SQL trate qualquer input do usuário estritamente como dado de texto puro, e nunca como comando executável. Se alguém tentar digitar `' OR '1'='1`, a query buscará literalmente por esse texto exato, em vez de alterar a lógica booleana da consulta SQL."*

3. **O que é CORS e por que está configurado na API?**
   > *"CORS (Cross-Origin Resource Sharing) é uma política de segurança dos navegadores que bloqueia scripts de uma origem (como o frontend rodando localmente) de acessar recursos de outra origem (como a API C# na porta 5000). Adicionamos a configuração `AddCors` na API com `AllowAnyOrigin` para autorizar a comunicação local sem interrupções."*
