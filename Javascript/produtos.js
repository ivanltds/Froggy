// ================= PRODUTOS =================
const PRODUTOS = [
  {
    id: 1,
    nome: "OVERSIZED PRIME",
    modelo: "FROGGY OVERSIZED PRIME",
    desc: "Camiseta oversized premium desenvolvida com tecido de alta qualidade, garantindo toque macio e excelente respirabilidade. Seu caimento solto proporciona liberdade de movimento e um visual moderno. Ideal para compor looks streetwear com autenticidade, além de possuir acabamento reforçado que aumenta sua durabilidade no uso diário.",
    preco: 129.90,
    img: "../IMG/Produtos/Froggy Oversized Prime - PRETA e AMARELA.webp"
  },
  {
    id: 2,
    nome: "HIGH TEE",
    modelo: "FROGGY HIGH TEE",
    desc: "A High Tee combina leveza e estilo urbano em uma peça versátil para o dia a dia. Produzida com tecido respirável, oferece conforto prolongado mesmo em longos períodos de uso. Seu design moderno valoriza o visual streetwear, sendo perfeita para quem busca praticidade sem abrir mão do estilo.",
    preco: 119.90,
    img: "../IMG/Produtos/Froggy High Tee - BRANCA e ROXA.webp"
  },
  {
    id: 3,
    nome: "CLASSIC POLO",
    modelo: "FROGGY CLASSIC POLO",
    desc: "A Classic Polo une elegância e conforto em uma peça indispensável. Confeccionada com tecido macio e acabamento premium, proporciona um caimento alinhado e sofisticado. Ideal para ocasiões casuais ou mais formais, entregando versatilidade e estilo em qualquer situação.",
    preco: 139.90,
    img: "../IMG/Produtos/Froggy Classic Polo - PRETO e BRANCO.webp"
  },
  {
    id: 4,
    nome: "PARK URBAN",
    modelo: "FROGGY PARK URBAN",
    desc: "A Park Urban é uma jaqueta pensada para enfrentar dias frios com estilo e conforto. Possui design moderno, resistência ao vento e ótimo isolamento térmico. Perfeita para compor looks urbanos, garantindo proteção sem perder a identidade streetwear.",
    preco: 199.90,
    img: "../IMG/Produtos/Froggy Park Urban - AMARELO e ROXO.webp"
  },
  {
    id: 5,
    nome: "WINDRUNNER STREET",
    modelo: "FROGGY WINDRUNNER STREET",
    desc: "O Windrunner Street é um corta-vento leve e funcional, ideal para dias com clima instável. Sua estrutura resistente protege contra vento sem comprometer o conforto. Com visual moderno e urbano, é a escolha perfeita para quem busca mobilidade e estilo no dia a dia.",
    preco: 399.90,
    img: "../IMG/Produtos/Froggy Windrunner Street - ROXO com AMARELO.webp"
  },
  {
    id: 6,
    nome: "CREW CLASSIC",
    modelo: "FROGGY CREW CLASSIC",
    desc: "O Crew Classic é um moletom essencial para qualquer guarda-roupa. Seu interior macio proporciona conforto térmico, enquanto o design minimalista facilita combinações com diferentes estilos. Ideal para uso diário, oferecendo equilíbrio entre conforto, praticidade e estética.",
    preco: 229.90,
    img: "../IMG/Produtos/Froggy Crew Classic - ROXO e BRANCO.webp"
  },
  {
    id: 7,
    nome: "SLIDE FLOW",
    modelo: "FROGGY SLIDE FLOW",
    desc: "O Slide Flow foi desenvolvido para oferecer máximo conforto em momentos casuais. Seu solado macio e formato ergonômico garantem uma pisada confortável durante todo o dia. Com design moderno, é ideal para quem quer praticidade sem abrir mão do estilo.",
    preco: 249.90,
    img: "../IMG/Produtos/Froggy Slide Flow - BRANCO e ROXO.webp"
  },
  {
    id: 8,
    nome: "SKATE PRO",
    modelo: "FROGGY SKATE PRO",
    desc: "O Skate Pro é um tênis pensado para performance e durabilidade. Conta com estrutura reforçada, excelente aderência e conforto para uso prolongado. Ideal para skatistas e amantes do streetwear que buscam resistência aliada a um visual marcante.",
    preco: 349.90,
    img: "../IMG/Produtos/Froggy Skate Pro - ROXO e AMARELO.webp"
  },
  {
    id: 9,
    nome: "STREET ONE",
    modelo: "FROGGY STREET ONE",
    desc: "O Street One representa o nível máximo de conforto e estilo dentro da linha. Produzido com materiais premium, oferece durabilidade superior e ajuste confortável. Seu design sofisticado destaca qualquer look, sendo perfeito para quem busca presença e qualidade em um único produto.",
    preco: 799.90,
    img: "../IMG/Produtos/Froggy Street One - BRANCO e ROXO.webp"
  }
];


// ================= PEGAR PRODUTO DA URL =================
function getProdutoAtual() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || 1;
  return PRODUTOS.find(p => p.id === id);
}


// ================= RENDER =================
const produto = getProdutoAtual();

if (produto) {
  document.getElementById("produto-nome").innerText = produto.nome;
  document.getElementById("produto-desc").innerText = produto.desc; // 👈 AQUI
  document.getElementById("produto-preco").innerText =
    `R$ ${produto.preco.toFixed(2)}`;
  document.getElementById("produto-img").src = produto.img;
}


// ================= QUANTIDADE =================
let qtd = 1;

function aumentarQtd() {
  qtd++;
  document.getElementById("qtd").innerText = qtd;
}

function diminuirQtd() {
  if (qtd > 1) qtd--;
  document.getElementById("qtd").innerText = qtd;
}


// ================= CARRINHO =================
function getCarrinhoKey() {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  return user ? "carrinho_" + user.email : null;
}

function comprar() {
  const key = getCarrinhoKey();

  if (!key) {
    alert("Faça login para comprar!");
    return;
  }

  let carrinho = JSON.parse(localStorage.getItem(key)) || [];

  const existente = carrinho.find(p => p.id === produto.id);

  if (existente) {
    existente.qtd += qtd;
  } else {
    carrinho.push({ ...produto, qtd });
  }

  localStorage.setItem(key, JSON.stringify(carrinho));

  alert("Adicionado ao carrinho 🐸");

  if (typeof atualizarContadorCarrinho === "function") {
    atualizarContadorCarrinho();
  }
}


// ================= RECOMENDADOS =================
function getCarrinho() {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!user) return [];

  return JSON.parse(localStorage.getItem("carrinho_" + user.email)) || [];
}

function renderizarRecomendados(produtoAtualId) {
  const container = document.getElementById("lista-recomendados");
  if (!container) return;

  const carrinho = getCarrinho();
  const idsCarrinho = carrinho.map(p => p.id);

  const recomendados = PRODUTOS.filter(p =>
    p.id !== produtoAtualId && !idsCarrinho.includes(p.id)
  );

  container.innerHTML = "";

  recomendados.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card-produto");

    card.innerHTML = `
      <img src="${produto.img}" alt="${produto.nome}">
      <p class="titulo-produto">${produto.nome}</p>
      <p class="preco-produto">R$ ${produto.preco.toFixed(2)}</p>
      <button class="ver-mais" onclick="irProduto(${produto.id})">
        VER MAIS
      </button>
    `;

    container.appendChild(card);
  });
}

renderizarRecomendados(produto.id);


// ================= NAVEGAÇÃO =================
function irProduto(id) {
  window.location.href = `produtos.html?id=${id}`;
}