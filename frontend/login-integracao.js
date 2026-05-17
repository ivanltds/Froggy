// ============================================================================
// SCRIPT DE INTEGRAÇÃO FRONTEND (JavaScript Fetch API)
// Propósito: Conectar o formulário HTML aos endpoints da API em C#
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario-login");
    const campoUsuario = document.getElementById("usuario");
    const campoSenha = document.getElementById("senha");
    const botaoEntrar = document.getElementById("btn-entrar");
    const boxFeedback = document.getElementById("mensagem-feedback");

    // URL da nossa API C# (rodando localmente)
    // Detecta dinamicamente se está rodando no servidor C# ou aberto como arquivo local
    const API_URL = window.location.origin.includes("localhost:5000") 
        ? "/api/login" 
        : "http://localhost:5000/api/login";

    formulario.addEventListener("submit", async (evento) => {
        // Impede que a página recarregue ao submeter o formulário
        evento.preventDefault();

        // Coleta os valores digitados pelo usuário
        const usuario = campoUsuario.value;
        const senha = campoSenha.value;

        // Limpa mensagens anteriores
        limparFeedback();
        desativarBotao(true);

        try {
            // Chamada assíncrona HTTP POST usando fetch
            const resposta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // Converte os dados coletados em formato JSON
                body: JSON.stringify({ usuario, senha })
            });

            // Converte o corpo da resposta HTTP em um objeto JS
            const dados = await resposta.json();

            if (resposta.status === 200) {
                // SUCESSO: Credenciais existem no banco!
                mostrarFeedback(dados.mensagem, "sucesso");
                
                // Armazena no navegador que o usuário está logado (simulação de sessão)
                localStorage.setItem("usuarioLogado", usuario);

                // Aguarda 1.5s para exibir o visual de sucesso e depois redireciona/libera a tela
                setTimeout(() => {
                    alert(`Login bem-sucedido! Bem-vindo(a) ao sistema, ${usuario}.`);
                    // Se houvesse outra tela real, redirecionaríamos:
                    // window.location.href = "home.html";
                }, 1500);

            } else if (resposta.status === 401) {
                // ERRO DE AUTENTICAÇÃO: Credenciais não batem no banco
                mostrarFeedback(dados.mensagem || "Usuário ou senha inválidos.", "erro");
                desativarBotao(false);
            } else {
                // OUTROS ERROS (Ex: Bad Request, etc.)
                mostrarFeedback(dados.mensagem || "Ocorreu um problema ao validar dados.", "erro");
                desativarBotao(false);
            }

        } catch (erro) {
            // TRATAMENTO DE ERROS DE CONEXÃO: Se o servidor C# estiver desligado/offline
            console.error("Erro na comunicação com a API:", erro);
            mostrarFeedback("Não foi possível conectar à API C#. Verifique se o servidor C# está rodando no localhost:5000.", "erro");
            desativarBotao(false);
        }
    });

    // Funções utilitárias de Feedback e UI
    function mostrarFeedback(texto, tipo) {
        boxFeedback.textContent = texto;
        boxFeedback.style.display = "block";
        
        if (tipo === "sucesso") {
            boxFeedback.className = "feedback-sucesso";
        } else {
            boxFeedback.className = "feedback-erro";
        }
    }

    function limparFeedback() {
        boxFeedback.textContent = "";
        boxFeedback.style.display = "none";
        boxFeedback.className = "";
    }

    function desativarBotao(estado) {
        if (estado) {
            botaoEntrar.disabled = true;
            botaoEntrar.textContent = "Verificando no Banco SQL...";
            botaoEntrar.style.opacity = "0.7";
            botaoEntrar.style.cursor = "not-allowed";
        } else {
            botaoEntrar.disabled = false;
            botaoEntrar.textContent = "Acessar Sistema";
            botaoEntrar.style.opacity = "1";
            botaoEntrar.style.cursor = "pointer";
        }
    }
});
