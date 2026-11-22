// ==========================================================
// CONFIGURAÇÃO PRINCIPAL
// ==========================================================

const WHATSAPP_NUMBER = "5511954607586";

const SOCIAL_LINKS = {
  live: "https://linktr.ee/Showpina",
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
    nome: "Notebook Lenovo Ideapad Gaming 3i i5-11300H 8GB RAM SSD 512GB Windows 11",
    grupo: "Tecnologia",
    preco: 2499.00,
    status: "Disponível",
    categoria: "Informática",
    resumo: "R$ 2.499,00 no Pix / débito ou até 12x de R$ 254,16 no cartão de crédito (total R$ 3.050,00)",
    especificacoes: ["Estado de conservação do notebook: bom", "Estado de conservação do carregador: um pouco gasto, mas funcional", "Bateria com boa durabilidade", "Tela Full HD", "Processador i5 de 11ª geração", "Placa de vídeo dedicada NVIDIA GTX 1650", "16GB de RAM (pente de 8GB adicionado)", "512GB SSD"],
    fotos: [
      "assets/produtos/notebook-capa.jpeg",
      "assets/produtos/notebook-02.jpeg",
      "assets/produtos/notebook-03.jpeg",
      "assets/produtos/notebook-04.jpeg",
      "assets/produtos/notebook-05.jpeg",
      "assets/produtos/notebook-06.jpeg",
      "assets/produtos/notebook-07.jpeg",
      "assets/produtos/notebook-08.jpeg",
      "assets/produtos/notebook-09.jpeg",
      "assets/produtos/notebook-10.jpeg",
      "assets/produtos/notebook-11.jpeg",
      "assets/produtos/notebook-12.jpeg",
      "assets/produtos/notebook-13.jpeg",
      "assets/produtos/notebook-14.jpeg",
      "assets/produtos/notebook-15.jpeg"
    ]
  },
  {
    id: 2,
    nome: "Controle Sony DualShock 4 Original (PS4 / PC)",
    grupo: "Tecnologia",
    preco: 199.00,
    status: "Disponível",
    categoria: "Informática",
    resumo: "R$ 199,00 no Pix / débito ou até 12x de R$ 20,29 no cartão de crédito (total R$ 243,55)",
    especificacoes: ["Estado de conservação do controle: excelente", "Estado de conservação do cabo de carregador: excelente (cabo original)", "Bateria com excelente durabilidade", "Compatível com PlayStation 4, PC, Android e iOS", "Conexão via Bluetooth ou cabo USB"],
    fotos: [
      "assets/controle/capa.jpg",
      "assets/controle/2.jpg"
    ]
  },
  {
    id: 3,
    nome: "Ainda não há produtos cadastrados nesta categoria.",
    grupo: "Outros",
    preco: null,
    status: "Disponível",
    categoria: "Exemplo",
    resumo: "Item fictício para testar os filtros.",
    especificacoes: [],
    fotos: [],
    exemplo: true
  }
];

const productGrid = document.querySelector("#product-grid");
const categoryButtons = document.querySelectorAll(".category-tab");
const filterButtons = document.querySelectorAll(".status-filter");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector(".lightbox__close");
const lightboxPrevious = document.querySelector(".lightbox__arrow--previous");
const lightboxNext = document.querySelector(".lightbox__arrow--next");
let lightboxPhotos = [];
let lightboxIndex = 0;
let lightboxProductName = "";
let activeCategory = "Tecnologia";
const categoryStatusFilters = {
  Tecnologia: "Disponível",
  Outros: "Disponível"
};

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
  const disabled = sold || produto.exemplo;
  const hasPhotos = produto.fotos.length > 0;
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
    <article class="product-card ${sold ? "is-sold" : ""}" data-status="${produto.status}" data-product-id="${produto.id}">
      <div class="product-card__media">
        <span class="status-badge ${sold ? "status-badge--sold" : ""}">
          ${produto.status}
        </span>
        ${hasPhotos
          ? `<button class="product-card__image" type="button"
                    data-photo="${firstPhoto}" aria-label="Ampliar foto de ${produto.nome}">
               <img class="product-card__main-image" src="${firstPhoto}"
                    alt="${produto.nome}" loading="lazy">
             </button>`
          : '<div class="product-card__placeholder">Foto em breve</div>'}
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
        <a class="whatsapp-button ${disabled ? "is-disabled" : ""}"
           href="${disabled ? "#" : createWhatsAppLink(produto)}"
           ${disabled ? 'aria-disabled="true" tabindex="-1"' : 'target="_blank" rel="noopener"'}>
          ${sold ? "Produto vendido" : produto.exemplo ? "Item de exemplo" : "Comprar pelo WhatsApp"}
        </a>
      </div>
    </article>
  `;
}

function updateFilterCounts() {
  categoryButtons.forEach((button) => {
    const category = button.dataset.category;
    const count = produtos.filter((produto) => produto.grupo === category).length;
    button.querySelector("[data-category-count]").textContent = count;
    button.classList.toggle("is-active", category === activeCategory);
    button.setAttribute("aria-pressed", String(category === activeCategory));
  });

  const categoryProducts = produtos.filter((produto) => produto.grupo === activeCategory);
  filterButtons.forEach((button) => {
    const filter = button.dataset.filter;
    const count = categoryProducts.filter((produto) => produto.status === filter).length;
    const isActive = filter === categoryStatusFilters[activeCategory];
    button.querySelector("[data-status-count]").textContent = count;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderProducts() {
  const filter = categoryStatusFilters[activeCategory];
  const categoryProducts = produtos.filter((produto) => produto.grupo === activeCategory);
  const filtered = categoryProducts.filter((produto) => produto.status === filter);

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

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    updateFilterCounts();
    renderProducts();
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryStatusFilters[activeCategory] = button.dataset.filter;
    updateFilterCounts();
    renderProducts();
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
      item.id === Number(card.dataset.productId)
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

updateFilterCounts();
renderProducts();
