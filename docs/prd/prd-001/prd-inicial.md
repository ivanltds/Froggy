# PRD-001 — API de Conexão SQL para Login Universitário

## 1. Contexto e Problema
Estudantes universitários de tecnologia frequentemente precisam integrar frontends estáticos a bancos de dados relacionais (SQL) para fins de validação acadêmica e projetos de fim de período. 
O desafio principal é construir uma ponte de comunicação simples e funcional:
- O frontend envia as credenciais de login digitadas pelo usuário no navegador.
- A API (desenvolvida em **C# / .NET**) intercepta essa requisição, realiza uma consulta direta ou parametrizada em uma tabela SQL e valida a existência do usuário.
- A API responde com sucesso (liberando a navegação) ou erro (barrando a navegação).

O código precisa ser limpo, seguro contra injeções SQL básicas (utilizando queries parametrizadas), mas estruturado de forma **simplista**, sem padrões arquiteturais de nível corporativo (como DDD ou Clean Architecture redundante) para que o trabalho mantenha a autenticidade de um projeto acadêmico de graduação.

---

## 2. Público-Alvo e Personas
### Persona Acadêmica: Pedro, o Estudante
- **Perfil**: Estudante do 3º período de Análise e Desenvolvimento de Sistemas ou Engenharia de Software.
- **Necessidade**: Uma API funcional em C# que seja fácil de apresentar na banca de avaliação, com código legível que ele consiga explicar linha por linha aos professores.
- **Frustração**: APIs corporativas muito complexas com dezenas de pastas, interfaces e injeção de dependência avançada que dificultam a explicação acadêmica e parecem "copiadas da internet".

---

## 3. Benchmarks Acadêmicos
*   **Minimal APIs (ASP.NET Core)**:
    - *Referência*: Documentação Oficial da Microsoft para Minimal APIs.
    - *Vantagem*: Permite criar uma API completa em um único arquivo `Program.cs`. É a abordagem moderna mais limpa e ideal para trabalhos universitários, pois elimina arquivos de Controller redundantes e foca no fluxo lógico.
*   **ADO.NET Direto (Microsoft.Data.SqlClient ou System.Data.SQLite)**:
    - *Referência*: Práticas acadêmicas tradicionais.
    - *Vantagem*: Mostrar consultas SQL nativas (ex: `SELECT * FROM Usuarios WHERE...`) em C# ganha muitos pontos com professores de Banco de Dados, pois demonstra que o aluno entende tanto SQL quanto C#, sem esconder a lógica atrás de ORMs pesados como o Entity Framework.

---

## 4. Proposta de Valor
Entregar uma API C# leve, segura e didática que conecte um frontend estático a uma tabela SQL, fornecendo autenticação básica de forma imediata e transparente, pronta para apresentação acadêmica.

---

## 5. Monetização e Retorno Esperado (Contexto Acadêmico)
- **Retorno Esperado**: Nota máxima na disciplina de Desenvolvimento Web / Banco de Dados.
- **Custo**: Zero (utilizando ferramentas e pacotes gratuitos da Microsoft / SQLite).

---

## 6. Escopo Inicial (MVP)
1. **Banco de Dados SQL**:
   - Uma única tabela `Usuarios` com colunas `Id`, `Usuario` e `Senha`.
   - Script de criação (`schema.sql`) e sementes de teste (`seed.sql`).
2. **API C# (.NET 8.0/9.0)**:
   - Endpoint `/api/login` que aceita requisições HTTP POST com JSON (`usuario` e `senha`).
   - Conexão nativa ADO.NET usando queries parametrizadas para evitar SQL Injection (essencial para não perder pontos de segurança).
   - Retorno HTTP apropriado: `200 OK` (com sinalizador de sucesso para liberar a rota) ou `401 Unauthorized`.
   - Habilitação de CORS (Cross-Origin Resource Sharing) para permitir que o frontend rodando em outro endereço (ou arquivo local) consiga consumir a API sem bloqueios no navegador.
3. **Ponte de Integração (Frontend)**:
   - Um arquivo JavaScript simples usando `fetch()` para realizar a chamada e manipular o redirecionamento.

---

## 7. Fora de Escopo
- Criptografia avançada (como Argon2/bcrypt) - manteremos senhas em texto puro ou hash MD5 simples (identificado como simplificação acadêmica).
- Tokens JWT complexos ou cookies de sessão criptografados.
- Painel de administração de usuários.
- Reset de senha ou envio de e-mails.

---

## 8. KPIs e Critérios de Sucesso
- **Tempo de Resposta**: Requisição resolvida em menos de 100ms localmente.
- **Segurança Acadêmica**: Passar em testes básicos de SQL Injection (ex: digitar `' OR '1'='1` no login não deve autenticar).
- **Facilidade de Explicação**: O código deve ter menos de 100 linhas no total e ser amplamente documentado com comentários didáticos em português.

---

## 9. Riscos e Mitigações
- **Risco de Bloqueio CORS**: O frontend não consegue acessar a API devido às regras de segurança do navegador.
  * *Mitigação*: Configuração explícita de política de CORS liberada (`AllowAnyOrigin`, `AllowAnyMethod`, `AllowAnyHeader`) na inicialização da API C#.
- **Risco de Conexão com o Banco**: Dificuldade de instalar ou configurar um servidor SQL Server pesado.
  * *Mitigação*: Oferecer suporte nativo ao **SQLite** (um arquivo `.db` local, sem necessidade de instalar servidores de banco) ou **SQL Server Express LocalDB**, deixando a escolha flexível.

---

## 10. Fases Sugeridas de Entrega
1. **Fase 1: Descoberta & Alinhamento** (Esta fase - Validação do PRD pelo Operador).
2. **Fase 2: Experiência & UX/UI** (Definição do contrato da API e o fluxo de tela do front).
3. **Fase 3: Arquitetura & Planejamento Técnico** (Definição dos scripts SQL e estrutura do projeto C#).
4. **Fase 4: Desenvolvimento (DEV)** (Implementação do banco, API C# e script de fetch frontend).
5. **Fase 5: Validação (QA)** (Teste de login bem-sucedido, login malsucedido e segurança contra SQL Injection).
6. **Fase 6: Conclusão & Instruções** (Preparação do roteiro para apresentação acadêmica).
