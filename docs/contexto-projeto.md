# Contexto do Projeto — C# SQL Login API
> ÍNDICE CENTRAL. Máximo 300 linhas.
> Todo agente lê ao iniciar. Todo agente atualiza ao criar arquivos.

## Projeto
API C# de Conexão SQL para Login Universitário

## Objetivo de Negócio
Desenvolver uma API básica e simplista em C# (com "aparência de trabalho universitário") para validar credenciais de login a partir de uma tabela SQL e liberar a navegação de um frontend já existente.

## Stack
- Frontend  : HTML / CSS / JS (Existente)
- Backend   : C# (ASP.NET Core Minimal API ou Controller-based)
- Banco     : SQL (SQLite ou SQL Server LocalDB - simplicidade acadêmica)
- Infra     : Localhost
- Testes    : Manuais / Unitários Básicos

## Estrutura de Pastas
| Pasta                       | Propósito                                  |
|-----------------------------|--------------------------------------------|
| .gemini/agents/             | Definição dos agentes                      |
| .gemini/melhoria-continua/  | Aprendizados incrementais por agente       |
| docs/contexto-projeto.md    | Este índice central                        |
| docs/prd/                   | PRDs por demanda                           |
| docs/arquitetura/           | Documentação arquitetural                  |
| docs/design-system/         | Design system                              |
| docs/deploys/               | Histórico de deploys                       |

## PRDs
| ID      | Nome                              | Status        | Fase Atual      |
|---------|-----------------------------------|---------------|-----------------|
| PRD-001 | API de Conexão SQL para Login     | Aprovado (QA) | VERSÃO/DEPLOY   |

## Arquivos Registrados
| Arquivo                                    | Responsável | Descrição                |
|--------------------------------------------|-------------|--------------------------|
| GEMINI.md                                  | Sistema     | Instruções globais       |
| README-AGENTS.md                           | Sistema     | Guia de uso              |
| .gemini/settings.json                      | Sistema     | Config do Gemini CLI     |
| .gemini/agents/maestro.md                  | Sistema     | Orquestrador             |
| .gemini/agents/ba.md                       | Sistema     | Analista de negócios     |
| .gemini/agents/ux-ui.md                    | Sistema     | Designer UX/UI           |
| .gemini/agents/architect.md                | Sistema     | Arquiteto                |
| .gemini/agents/dev.md                      | Sistema     | Desenvolvedor            |
| .gemini/agents/qa.md                       | Sistema     | QA                       |
| .gemini/agents/devops.md                   | Sistema     | DevOps                   |
| docs/contexto-projeto.md                   | Sistema     | Índice central           |
| docs/prd/prd-001/prd-inicial.md           | @ba         | PRD inicial da API SQL   |
| docs/prd/prd-001/plano-implementacao.md   | @architect  | Plano de implementação   |
| docs/prd/prd-001/relatorio-qa.md          | @qa         | Relatório de testes QA   |
| docs/arquitetura/arquitetura-atual.md      | Sistema     | Arquitetura              |
| docs/design-system/design-system.md        | Sistema     | Design system            |
| backend/LoginApi.csproj                    | @dev        | Arquivo de projeto .NET  |
| backend/Program.cs                         | @dev        | Código C# Minimal API    |
| banco/schema.sql                           | @dev        | Script SQL Schema        |
| banco/seed.sql                             | @dev        | Script SQL Seed          |
| frontend/index.html                        | @dev        | Frontend HTML Login      |
| frontend/login-integracao.js               | @dev        | Script Fetch de Login    |
| INSTRUCOES.md                              | @maestro    | Guia acadêmico do aluno  |

## Última Atualização
- Data    : 2026-05-17
- Por     : @devops (Antigravity)
- Motivo  : Otimização drástica de assets (PNG -> WebP), remoção de arquivos e pastas mortas e reconstrução do histórico Git para clonagem ultraveloz.