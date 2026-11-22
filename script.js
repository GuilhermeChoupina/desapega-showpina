// ==========================================================
// CONFIGURAÇÃO PRINCIPAL
// ==========================================================

// Troque pelo seu número com código do país e DDD, somente números.
const WHATSAPP_NUMBER = "5511954607586";

// Troque "#" pelos links oficiais das suas redes e lives.
const SOCIAL_LINKS = {
  live: "linktr.ee/Showpina",
  instagram: "https://www.instagram.com/shwpina/",
  youtube: "https://www.youtube.com/@Showpina"
};

// ==========================================================
// PRODUTOS
// ==========================================================
// Centralize aqui os itens do catálogo.
// status aceita: "Disponível" ou "Vendido".
// fotos aceita uma ou várias imagens.
// Fotos locais sugeridas: "assets/produtos/nome-da-foto.jpg"
const produtos = [
  {
    id: 1,
    nome: "Nintendo Switch",
    preco: null,
    status: "Disponível",
    categoria: "Games",
    resumo: "Console Nintendo Switch, mostrado funcionando ao vivo antes da venda.",
    especificacoes: ["Testado na live", "Controles inclusos", "Detalhes a confirmar"],
    fotos: [
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: 2,
    nome: "Notebook Lenovo Gaming",
    preco: null,
    status: "Disponível",
    categoria: "Informática",
    resumo: "Notebook Lenovo voltado para jogos e trabalho pesado, testado ao vivo.",
    especificacoes: ["Modelo a confirmar", "Acessórios inclusos", "Testado na live"],
    fotos: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80"
    ]
  }
];

const productGrid = document.querySelector("#product-grid");
const filterButtons = document.querySelectorAll(".filter");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector(".lightbox__close");
const lightboxPrevious = document.querySelector(".lightbox__arrow--previous");
const lightboxNext = document.querySelector(".lightbox__arrow--next");
let lightboxPhotos = [];
let lightboxIndex = 0;
let lightboxProductName = "";

function formatPrice(value) {
  if (value === null || value === undefined) {
    return "A consultar";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function createWhatsAppLink(produto) {
  const message = `Olá! Tenho interesse no produto "${produto.nome}". Ainda está disponível?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function setMainPhoto(card, foto) {
  const mainImage = card.querySelector(".product-card__main-image");
  mainImage.src = foto;
  mainImage.closest(".product-card__image").dataset.photo = foto;
  card.querySelectorAll(".photo-thumb").forEach((thumb) => {
    thumb.classList.toggle("is-active", thumb.dataset.photo === foto);
  });
}

function openLightbox(fotos, fotoAtual, nome) {
  lightboxPhotos = fotos;
  lightboxIndex = Math.max(0, fotos.indexOf(fotoAtual));
  lightboxProductName = nome;
  showLightboxPhoto();
  if (typeof lightbox.showModal === "function") {
    lightbox.showModal();
  } else {
    lightbox.setAttribute("open", "");
  }
}

function showLightboxPhoto() {
  const foto = lightboxPhotos[lightboxIndex];
  if (!foto) return;

  lightboxImage.src = foto;
  lightboxImage.alt = `Foto ampliada de ${lightboxProductName}`;

  const hasMultiplePhotos = lightboxPhotos.length > 1;
  lightboxPrevious.hidden = !hasMultiplePhotos;
  lightboxNext.hidden = !hasMultiplePhotos;
}

function changeLightboxPhoto(direction) {
  if (lightboxPhotos.length < 2) return;
  lightboxIndex = (lightboxIndex + direction + lightboxPhotos.length) % lightboxPhotos.length;
  showLightboxPhoto();
}

function closeLightbox() {
  if (typeof lightbox.close === "function") {
    lightbox.close();
  } else {
    lightbox.removeAttribute("open");
  }
  lightboxImage.src = "";
  lightboxPhotos = [];
  lightboxIndex = 0;
}

function renderCard(produto) {
  const sold = produto.status === "Vendido";
  const firstPhoto = produto.fotos[0];
  const specifications = produto.especificacoes
    .map((item) => `<span class="specification">${item}</span>`)
    .join("");

  const thumbnails = produto.fotos.length > 1
    ? produto.fotos.map((foto, index) => `
        <button class="photo-thumb ${index === 0 ? "is-active" : ""}" type="button" data-photo="${foto}"
                aria-label="Ver foto ${index + 1} de ${produto.nome}">
          <img src="${foto}" alt="" loading="lazy">
        </button>
      `).join("")
    : "";

  const photoControls = produto.fotos.length > 1
    ? `
        <button class="photo-arrow photo-arrow--previous" type="button"
                data-direction="-1" aria-label="Foto anterior de ${produto.nome}">&#8249;</button>
        <button class="photo-arrow photo-arrow--next" type="button"
                data-direction="1" aria-label="Próxima foto de ${produto.nome}">&#8250;</button>
      `
    : "";

  return `
    <article class="product-card ${sold ? "is-sold" : ""}" data-status="${produto.status}">
      <div class="product-card__media">
        <span class="status-badge ${sold ? "status-badge--sold" : ""}">
          ${produto.status}
        </span>
        <button class="product-card__image" type="button"
                data-photo="${firstPhoto}" aria-label="Ampliar foto de ${produto.nome}">
          <img class="product-card__main-image" src="${firstPhoto}"
               alt="${produto.nome}" loading="lazy">
        </button>
        ${photoControls}
        ${thumbnails ? `<div class="photo-thumbs">${thumbnails}</div>` : ""}
        ${produto.fotos.length > 1
          ? `<span class="photo-count" aria-label="${produto.fotos.length} fotos">+${produto.fotos.length - 1}</span>`
          : ""}
      </div>
      <div class="product-card__body">
        <p class="product-card__category">${produto.categoria}</p>
        <div class="product-card__title-row">
          <h3>${produto.nome}</h3>
          <span class="product-card__price">${formatPrice(produto.preco)}</span>
        </div>
        <p class="product-card__summary">${produto.resumo}</p>
        <div class="specifications">${specifications}</div>
        <a class="whatsapp-button ${sold ? "is-disabled" : ""}"
           href="${sold ? "#" : createWhatsAppLink(produto)}"
           ${sold ? 'aria-disabled="true" tabindex="-1"' : 'target="_blank" rel="noopener"'}>
          ${sold ? "Produto vendido" : "Comprar pelo WhatsApp"}
        </a>
      </div>
    </article>
  `;
}

function renderProducts(filter = "Todos") {
  const filtered = filter === "Todos"
    ? produtos
    : produtos.filter((produto) => produto.status === filter);

  if (!filtered.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <strong>Nenhum item nesta seção.</strong>
        <p>Novos achados podem aparecer nas próximas lives.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(renderCard).join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    renderProducts(button.dataset.filter);
  });
});

productGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");
  if (!card) return;

  const arrow = event.target.closest(".photo-arrow");
  if (arrow) {
    const photos = Array.from(card.querySelectorAll(".photo-thumb"))
      .map((thumb) => thumb.dataset.photo);
    if (!photos.length) return;

    const mainPhotoButton = card.querySelector(".product-card__image");
    const currentIndex = photos.indexOf(mainPhotoButton.dataset.photo);
    const normalizedIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (normalizedIndex + Number(arrow.dataset.direction) + photos.length) % photos.length;
    setMainPhoto(card, photos[nextIndex]);
    return;
  }

  const thumb = event.target.closest(".photo-thumb");
  if (thumb) {
    setMainPhoto(card, thumb.dataset.photo);
    return;
  }

  const imageButton = event.target.closest(".product-card__image");
  if (imageButton) {
    const product = produtos.find((item) =>
      item.nome === card.querySelector("h3").textContent
    );
    openLightbox(
      product ? product.fotos : [imageButton.dataset.photo],
      imageButton.dataset.photo,
      card.querySelector("h3").textContent
    );
  }
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrevious.addEventListener("click", () => changeLightboxPhoto(-1));
lightboxNext.addEventListener("click", () => changeLightboxPhoto(1));

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") changeLightboxPhoto(-1);
  if (event.key === "ArrowRight") changeLightboxPhoto(1);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.querySelector("#live-link").href = SOCIAL_LINKS.live;
document.querySelectorAll(".footer__links a").forEach((link) => {
  const name = link.textContent.trim().toLowerCase();
  if (SOCIAL_LINKS[name]) link.href = SOCIAL_LINKS[name];
});

renderProducts();
