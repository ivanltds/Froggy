function verProduto(id) {
  window.location.href = `produtos.html?id=${id}`;
}

// ================= BANNER =================
let indexBanner = 0;
const bannerSlide = document.getElementById("banner-slide");

setInterval(() => {
  indexBanner++;
  if (indexBanner > 2) indexBanner = 0;

  bannerSlide.style.transform = `translateX(-${indexBanner * 100}%)`;
}, 3000);