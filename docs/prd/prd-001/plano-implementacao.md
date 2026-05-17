# Plano de Implementação — PRD-001: API C# SQL de Login

Este documento orienta a implementação prática da API C# conectada ao banco de dados SQL e integrada com o frontend. A estrutura é focada em ser **simplista, segura contra SQL Injection e didática** para fins acadêmicos.

---

## 1. Objetivo Técnico
Construir uma Minimal API funcional usando ASP.NET Core que se conecta a um banco de dados SQLite/SQL Server local para validar credenciais de login informadas pelo frontend, expondo uma política de CORS aberta e retornando estados HTTP coerentes.

---

## 2. Arquivos a Criar e Alterar

### Banco de Dados
- **`banco/schema.sql`** (Novo): Script SQL de criação da tabela `Usuarios`.
- **`banco/seed.sql`** (Novo): Dados de teste iniciais (usuários cadastrados).
- **`banco/banco.db`** (Novo - autogerado): Arquivo físico SQLite gerado após execução do schema.

### Backend (C#)
- **`backend/LoginApi.csproj`** (Novo): Arquivo de projeto do .NET.
- **`backend/Program.cs`** (Novo): Código principal da API contendo a rota, lógica de conexão e segurança.

### Frontend
- **`frontend/login-integracao.js`** (Novo ou Ajustado): Script com a função fetch que conecta o formulário de login já existente à nossa API C#.

---

## 3. Ordem de Implementação

```
[Passo 1: Banco SQL] ----> [Passo 2: Criar Projeto C#] ----> [Passo 3: Codificar Program.cs] ----> [Passo 4: Integrar Frontend]
```

1. **Definição de Banco**: Criar os scripts SQL (`schema.sql` e `seed.sql`).
2. **Setup do Projeto C#**: Criar a estrutura do projeto web e instalar o pacote SQLite/SQL Server.
3. **Desenvolvimento da API**: Escrever o código de rotas e banco em `Program.cs`.
4. **Integração do Frontend**: Codificar a chamada `fetch` e lógica de redirecionamento.
5. **Validação**: Testar credenciais corretas, incorretas e SQL Injection.

---

## 4. Contrato de API

### Endpoint: `POST /api/login`
Responsável por autenticar o usuário.

*   **Request Headers**:
    ```http
    Content-Type: application/json
    ```
*   **Request Body (JSON)**:
    ```json
    {
      "usuario": "admin",
      "senha": "123"
    }
    ```
*   **Response (Sucesso - HTTP 200 OK)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Autenticado com sucesso!"
    }
    ```
*   **Response (Falha - HTTP 401 Unauthorized)**:
    ```json
    {
      "sucesso": false,
      "mensagem": "Usuário ou senha incorretos."
    }
    ```
*   **Response (Erro no Servidor - HTTP 500 Internal Server Error)**:
    ```json
    {
      "sucesso": false,
      "mensagem": "Erro interno ao conectar ao banco de dados."
    }
    ```

---

## 5. Modelo de Dados & Scripts SQL

### SQLite Schema (`banco/schema.sql`)
```sql
CREATE TABLE IF NOT EXISTS Usuarios (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Usuario VARCHAR(50) UNIQUE NOT NULL,
    Senha VARCHAR(50) NOT NULL
);
```

### SQL Server Schema (Caso o aluno precise rodar em SQL Server corporativo)
```sql
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Usuario VARCHAR(50) UNIQUE NOT NULL,
    Senha VARCHAR(50) NOT NULL
);
```

---

## 6. Lógica Principal do Backend (Rascunho de Engenharia)
A consulta SQL deve obrigatoriamente usar **queries parametrizadas** com `@Usuario` e `@Senha` para garantir nota máxima em segurança contra SQL Injection:

```csharp
using (var conexao = new SqliteConnection("Data Source=../banco/banco.db"))
{
    conexao.Open();
    string sql = "SELECT COUNT(1) FROM Usuarios WHERE Usuario = @Usuario AND Senha = @Senha";
    
    using (var comando = new SqliteCommand(sql, conexao))
    {
        comando.Parameters.AddWithValue("@Usuario", loginRequest.Usuario);
        comando.Parameters.AddWithValue("@Senha", loginRequest.Senha);
        
        long count = (long)comando.ExecuteScalar();
        bool existe = count > 0;
    }
}
```

---

## 7. Dependências
- **.NET SDK** (Versão 8.0 ou posterior)
- Pacote NuGet **`Microsoft.Data.Sqlite`** (Para banco SQLite embarcado)

---

## 8. Critérios de Pronto (Definition of Done)
1. **Compilação**: O projeto backend compila sem erros.
2. **CORS Habilitado**: A requisição externa (frontend local) não é bloqueada pelo navegador.
3. **Autenticação Correta**: Credenciais certas retornam `200 OK` e liberam a navegação.
4. **Autenticação Incorreta**: Credenciais erradas retornam `401 Unauthorized` e mostram erro no front.
5. **Segurança Anti-Injection**: A tentativa de SQL Injection `' OR '1'='1` é barrada com erro 401.
6. **Simplicidade**: Todo o código C# cabe em um único arquivo bem estruturado e didático.
