// ================= USUÁRIO =================
const user = JSON.parse(localStorage.getItem("usuarioLogado"));

// ================= CARRINHO =================
let carrinho = [];

if (user) {
  carrinho = JSON.parse(localStorage.getItem("carrinho_" + user.email)) || [];
}

// ================= RENDERIZAR CARRINHO =================
function renderizarCarrinho() {
  const container = document.getElementById("lista-carrinho");
  const totalSpan = document.getElementById("total");

  container.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.qtd;

    container.innerHTML += `
      <div class="item">
        <img src="${item.img}">
        <div class="info">
          <h3>${item.nome}</h3>
          <p>R$ ${item.preco.toFixed(2)}</p>
        </div>

        <div class="quantidade">
          <button onclick="alterarQtd(${index}, -1)">-</button>
          <span>${item.qtd}</span>
          <button onclick="alterarQtd(${index}, 1)">+</button>
        </div>

        <button class="remover" onclick="removerItem(${index})">X</button>
      </div>
    `;
  });

  totalSpan.innerText = total.toFixed(2);

  salvarCarrinho();
  atualizarContadorCarrinho();
}

// ================= ALTERAR QUANTIDADE =================
function alterarQtd(index, delta) {
  carrinho[index].qtd += delta;

  if (carrinho[index].qtd <= 0) {
    carrinho.splice(index, 1);
  }

  renderizarCarrinho();
}

// ================= REMOVER ITEM =================
function removerItem(index) {
  carrinho.splice(index, 1);
  renderizarCarrinho();
}

// ================= SALVAR =================
function salvarCarrinho() {
  if (user) {
    localStorage.setItem("carrinho_" + user.email, JSON.stringify(carrinho));
  }
}

// ================= CONTADOR =================
function atualizarContadorCarrinho() {
  const contador = document.getElementById("contador-carrinho");

  if (!contador) return;

  const total = carrinho.reduce((soma, item) => soma + item.qtd, 0);
  contador.innerText = total;
}

// ================= MOSTRAR PAGAMENTO =================
function mostrarPix() {
  document.getElementById("pix-box").style.display = "block";
  document.getElementById("cartao-box").style.display = "none";
}

function mostrarCartao() {
  document.getElementById("cartao-box").style.display = "block";
  document.getElementById("pix-box").style.display = "none";
}

// ================= CONFIRMAR PAGAMENTO =================
function confirmarPagamento() {
  if (!user) {
    alert("Você precisa estar logado!");
    return;
  }

  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const pedidos =
    JSON.parse(localStorage.getItem("pedidos_" + user.email)) || [];

  const novoPedido = {
    itens: carrinho,
    total: carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0),
    data: new Date().toLocaleString(),
    metodo: "PIX"
  };

  pedidos.push(novoPedido);

  localStorage.setItem(
    "pedidos_" + user.email,
    JSON.stringify(pedidos)
  );

  // limpar carrinho
  carrinho = [];
  salvarCarrinho();
  renderizarCarrinho();

  alert("Pagamento realizado com sucesso via PIX! 🐸");
  window.location.href = "pedidos.html";
}

// ================= PAGAR CARTÃO =================
function pagarCartao() {
  if (!user) {
    alert("Você precisa estar logado!");
    return;
  }

  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const nome = document.getElementById("nome-cartao").value.trim();
  const numero = document.getElementById("numero-cartao").value.trim();
  const validade = document.getElementById("validade-cartao").value.trim();
  const cvv = document.getElementById("cvv-cartao").value.trim();

  if (!nome || !numero || !validade || !cvv) {
    alert("Por favor, preencha todos os campos do cartão!");
    return;
  }

  if (numero.replace(/\s/g, "").length < 16) {
    alert("Número de cartão inválido!");
    return;
  }

  if (validade.length < 5) {
    alert("Validade de cartão inválida (use MM/AA)!");
    return;
  }

  if (cvv.length < 3) {
    alert("CVV inválido!");
    return;
  }

  const pedidos =
    JSON.parse(localStorage.getItem("pedidos_" + user.email)) || [];

  const novoPedido = {
    itens: carrinho,
    total: carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0),
    data: new Date().toLocaleString(),
    metodo: "Cartão de Crédito"
  };

  pedidos.push(novoPedido);

  localStorage.setItem(
    "pedidos_" + user.email,
    JSON.stringify(pedidos)
  );

  // limpar carrinho
  carrinho = [];
  salvarCarrinho();
  renderizarCarrinho();

  alert("Pagamento realizado com sucesso via Cartão! 🐸");
  window.location.href = "pedidos.html";
}

// ================= ABRIR POPUP =================
function abrirPagamento() {
  document.getElementById("pagamento-popup").style.display = "flex";

  // resetar estado
  document.getElementById("pix-box").style.display = "none";
  document.getElementById("cartao-box").style.display = "none";
}

// ================= FECHAR =================
function fecharPagamento() {
  document.getElementById("pagamento-popup").style.display = "none";
}

// ================= VOLTAR =================
function voltarPagamento() {
  document.getElementById("pix-box").style.display = "none";
  document.getElementById("cartao-box").style.display = "none";
}

// ================= ESCOLHAS =================
function escolherPix() {
  document.getElementById("pix-box").style.display = "block";
  document.getElementById("cartao-box").style.display = "none";
}

function escolherCartao() {
  document.getElementById("cartao-box").style.display = "block";
  document.getElementById("pix-box").style.display = "none";
}

// ================= MÁSCARAS =================
const numeroInput = document.getElementById("numero-cartao");
const validadeInput = document.getElementById("validade-cartao");
const cvvInput = document.getElementById("cvv-cartao");
const nomeInput = document.getElementById("nome-cartao");

if (numeroInput) {
  numeroInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 16) v = v.slice(0, 16);
    v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = v;
  });
}

if (validadeInput) {
  validadeInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);

    if (v.length >= 3) {
      v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    e.target.value = v;
  });
}

if (cvvInput) {
  cvvInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 3) v = v.slice(0, 3);
    e.target.value = v;
  });
}

if (nomeInput) {
  nomeInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    e.target.value = v;
  });
}

// ================= INIT =================
renderizarCarrinho();