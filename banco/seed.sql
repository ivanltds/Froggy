-- Script de Carga de Dados Inicial (Seed)
-- Insere usuários de teste padrão se eles não existirem

INSERT OR IGNORE INTO Usuarios (Usuario, Senha) VALUES ('admin', '123456');
INSERT OR IGNORE INTO Usuarios (Usuario, Senha) VALUES ('estudante', 'faculdade2026');
INSERT OR IGNORE INTO Usuarios (Usuario, Senha) VALUES ('professor', 'nota10');
