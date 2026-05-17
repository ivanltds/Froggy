document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("usuarioLogado"));

  const iniciaisSpan = document.getElementById("iniciais-usuario");
  const imgUsuario = document.getElementById("img-usuario");
  const box = document.getElementById("usuario-box");
  const dropdown = document.getElementById("dropdown");

  // =========================
  // USUÁRIO
  // =========================
  if (user && iniciaisSpan) {
    const iniciais = user.nome
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();

    iniciaisSpan.innerText = iniciais;
    iniciaisSpan.style.opacity = "1";

    if (imgUsuario) imgUsuario.style.opacity = "0";
  }

  // =========================
  // DROPDOWN
  // =========================
  if (box && dropdown) {

    box.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", () => {
      dropdown.style.display = "none";
    });
  }

  atualizarContadorCarrinho();
});

// =========================
// CONTADOR GLOBAL
// =========================
function atualizarContadorCarrinho() {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const contador = document.getElementById("contador-carrinho");

  if (!contador) return;

  if (!user) {
    contador.innerText = 0;
    return;
  }

  const carrinho =
    JSON.parse(localStorage.getItem("carrinho_" + user.email)) || [];

  const total = carrinho.reduce((soma, item) => soma + item.qtd, 0);

  contador.innerText = total;
}

// =========================
// AÇÕES
// =========================
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

function irPedidos() {
  window.location.href = "pedidos.html";
}