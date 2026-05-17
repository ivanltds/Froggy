// =========================
// AUTH - CONTROLE DE LOGIN
// =========================

function getUsuarioLogado() {
  return JSON.parse(localStorage.getItem("usuarioLogado"));
}

function estaLogado() {
  return !!getUsuarioLogado();
}

function protegerPagina() {
  if (!estaLogado()) {
    alert("Você precisa estar logado!");
    window.location.href = "login.html";
  }
}

// =========================
// LOGIN INTEGRADO À API C# & SQLITE
// =========================
async function login(email, senha) {
  // URL da nossa API C# (detecta dinamicamente se está no servidor ou arquivo local)
  const API_URL = window.location.origin.includes("localhost:5000") 
      ? "/api/login" 
      : "http://localhost:5000/api/login";

  try {
    // Faz a chamada HTTP POST para a API C# que consulta a tabela SQLite
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Usuario: email, Senha: senha })
    });

    const dados = await resposta.json();

    if (resposta.status === 200) {
      // Sucesso! Registra o usuário logado para liberar a navegação
      localStorage.setItem("usuarioLogado", JSON.stringify({ nome: email, email: email }));
      
      alert("Login realizado com sucesso via C# & SQLite! 🐸");
      window.location.href = "inicial.html";
      return true;
    } else {
      // Falha (Usuário ou senha incorretos)
      alert(dados.mensagem || "Usuário ou senha inválidos no banco de dados!");
      return false;
    }
  } catch (erro) {
    console.error("Erro na comunicação com a API C#:", erro);
    alert("Não foi possível conectar à API C#. Certifique-se de que o backend está rodando no terminal (dotnet run)!");
    return false;
  }
}

// =========================
// CADASTRO INTEGRADO À API C# & SQLITE
// =========================
async function cadastrar(nome, email, senha) {
  // URL do cadastro na API C# (detecta dinamicamente se está no servidor ou arquivo local)
  const API_URL = window.location.origin.includes("localhost:5000") 
      ? "/api/cadastro" 
      : "http://localhost:5000/api/cadastro";

  try {
    // Faz a chamada HTTP POST para registrar o usuário no banco de dados SQLite
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Usuario: email, Senha: senha })
    });

    const dados = await resposta.json();

    if (resposta.status === 200) {
      // Salva no localStorage também para compatibilidade e histórico local do frontend
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios.push({ nome, email, senha });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      alert("Cadastro realizado com sucesso via C# & SQLite! 🐸");
      window.location.href = "login.html";
      return true;
    } else {
      // Caso a API retorne erro (ex: usuário duplicado)
      alert(dados.mensagem || "Erro ao realizar cadastro.");
      return false;
    }
  } catch (erro) {
    console.error("Erro na comunicação com a API C# para cadastro:", erro);
    alert("Não foi possível conectar à API C#. Certifique-se de que o backend está rodando no terminal (dotnet run)!");
    return false;
  }
}

// =========================
// LOGOUT
// =========================
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

// =========================
// AUTO PROTEÇÃO
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const paginasProtegidas = ["carrinho.html", "pedidos.html"];
  const paginaAtual = window.location.pathname;

  paginasProtegidas.forEach(pagina => {
    if (paginaAtual.includes(pagina)) {
      protegerPagina();
    }
  });
});