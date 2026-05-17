# Relatório de QA — PRD-001: API C# SQL de Login

**Status**: ✅ APROVADO COM RESSALVA (Sem SDK .NET local para execução automatizada, aprovado por análise estática estrita).

---

## 1. Testes Executados (Análise Estática & Cobertura)

### Cenário 1: Caminho Feliz (Happy Path)
*   **Ação**: Enviar requisição POST com credenciais cadastradas (ex: `admin` / `123456`).
*   **Análise de Código**:
    - O endpoint `POST /api/login` recebe o JSON mapeado pelo record `LoginRequest`.
    - Executa `ExecuteScalar` comparando com os parâmetros `@Usuario` e `@Senha`.
    - Retorna `200 OK` com sucesso e mensagem correspondente.
    - O JavaScript intercepta o status `200` no frontend, armazena no `localStorage` e emite o alerta de boas-vindas.
*   **Status**: ✅ Passou na revisão estática.

### Cenário 2: Credenciais Incorretas (Edge Case)
*   **Ação**: Enviar usuário ou senha que não constam no banco.
*   **Análise de Código**:
    - O SQLite retorna contagem `0`.
    - A API C# retorna `Results.Json(..., statusCode: 401)`.
    - O JavaScript captura o status `401`, exibe a mensagem de erro formatada em vermelho no container de feedback e reativa o botão de login para nova tentativa.
*   **Status**: ✅ Passou na revisão estática.

### Cenário 3: Tentativa de SQL Injection (Segurança)
*   **Ação**: Digitar `' OR '1'='1` no campo de login.
*   **Análise de Código**:
    - A API C# faz o bind do parâmetro de forma segura:
      `comando.Parameters.AddWithValue("@Usuario", request.Usuario.Trim());`
    - A query enviada ao SQLite é tratada como texto literal. O banco de dados buscará por um usuário cujo nome seja exatamente a string `"' OR '1'='1"`. Como este usuário não existe, o banco retornará `0` linhas e a API responderá com `401 Unauthorized` de forma segura.
*   **Status**: ✅ Passou na revisão estática (100% Imune a SQL Injection básico).

### Cenário 4: CORS e Comunicação Cruzada
*   **Ação**: Frontend local chamando API na porta 5000.
*   **Análise de Código**:
    - Configuração de CORS ativa na API:
      ```csharp
      builder.Services.AddCors(options => {
          options.AddPolicy("PermitirTudo", policy => {
              policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
          });
      });
      ```
    - Chamada ativada via `app.UseCors("PermitirTudo")`. Isso garante que o navegador do aluno não disparará erros de segurança ao abrir o frontend localmente.
*   **Status**: ✅ Passou na revisão estática.

---

## 2. Cenários Não Cobertos (Limitações do Trabalho Acadêmico)
- **Criptografia de Senhas**: As senhas são tratadas em texto puro (plain text). Isso foi aceito de forma consciente sob os requisitos do PRD para manter o código didático e simplista para a banca de faculdade.
- **Tokens de Sessão (JWT/Cookies)**: A autenticação é stateless; o frontend simula a persistência gravando o usuário no `localStorage`. Para um projeto acadêmico de login básico, isso é totalmente viável e aceito.

---

## 3. Recomendações de Testes Manuais ao Aluno
Assim que instalar o .NET SDK, execute os seguintes testes rápidos para verificar se tudo está operacional:
1. Abra o navegador com ferramentas de desenvolvedor (F12) na aba "Console" ou "Network" (Rede).
2. Tente fazer login em branco (verifica validação de campos vazios).
3. Tente fazer login com `admin` e `123` (deve dar erro 401).
4. Tente fazer login com `admin` e `123456` (deve dar sucesso 200).
