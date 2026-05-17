function getUsuario() {
  return JSON.parse(localStorage.getItem("usuarioLogado"));
}

function getPedidos() {
  const user = getUsuario();
  if (!user) return [];
  return JSON.parse(localStorage.getItem("pedidos_" + user.email)) || [];
}

function renderizarPedidos() {
  const container = document.getElementById("lista-pedidos");
  if (!container) return;

  const pedidos = getPedidos();
  container.innerHTML = "";

  if (pedidos.length === 0) {
    container.innerHTML = "<p>Você ainda não fez nenhum pedido 🐸</p>";
    return;
  }

  pedidos.reverse().forEach(pedido => {

    const total = pedido.itens.reduce(
      (soma, item) => soma + item.preco * item.qtd,
      0
    );

    const itensHTML = pedido.itens.map(item => `
      <div class="item-pedido">
        <img src="${item.img}">
        <div>
          <p>${item.nome}</p>
          <p>Qtd: ${item.qtd}</p>
        </div>
      </div>
    `).join("");

    const card = document.createElement("div");
    card.classList.add("pedido");

    card.innerHTML = `
      <h3>Pedido - ${pedido.data}</h3>
      ${itensHTML}
      <p class="pedido-total">Total: R$ ${total.toFixed(2)}</p>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarPedidos();
  atualizarContadorCarrinho();
});