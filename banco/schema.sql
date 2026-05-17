-- Script de Criação do Banco de Dados para Trabalho Universitário
-- Tabela: Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Usuario VARCHAR(50) UNIQUE NOT NULL,
    Senha VARCHAR(50) NOT NULL
);
