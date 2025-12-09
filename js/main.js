// ELEMENTOS DEL DOM
const grid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

const filterCategory = document.getElementById("filterCategory");
const filterHazard = document.getElementById("filterHazard");
const filterGrade = document.getElementById("filterGrade");
const filterSort = document.getElementById("filterSort");

const chips = document.querySelectorAll(".chip-filter");
const resultsCount = document.getElementById("resultsCount");
const clearFiltersBtn = document.getElementById("clearFilters");

const PAGE_SIZE = 6;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

// -------------------------------------
// 1. Cargar productos JSON
// -------------------------------------
async function loadProducts() {
  try {
    const res = await fetch("data/products.json");
    const data = await res.json();
    allProducts = data.products || [];
    filteredProducts = [...allProducts];

    renderCurrentPage();
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
}

// -------------------------------------
// 2. Aplicar filtros
// -------------------------------------
function applyFilters() {
  filteredProducts = productFilter.filter(allProducts, {
    search: searchInput.value,
    category: filterCategory.value,
    hazard: filterHazard.value,
    grade: filterGrade.value,
    sort: filterSort.value,
  });

  currentPage = 1;
  renderCurrentPage();
}

// -------------------------------------
// 3. Chips de categoría (filtros rápidos)
// -------------------------------------
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const cat = chip.dataset.category || "";

    filterCategory.value = cat;
    applyFilters();
  });
});

// -------------------------------------
// 4. Limpiar filtros
// -------------------------------------
clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterCategory.value = "";
  filterHazard.value = "";
  filterGrade.value = "";
  filterSort.value = "name-asc";

  chips.forEach((chip) => chip.classList.remove("active"));
  chips[0].classList.add("active"); // “Todos”

  applyFilters();
});

// -------------------------------------
// 5. Renderizar productos
// -------------------------------------
function renderProducts(list) {
  grid.innerHTML = "";

  // Contador
  resultsCount.textContent = `${list.length} producto(s) encontrado(s)`;

  if (!list.length) {
    grid.innerHTML = `<p class="text-muted small">No se encontraron productos.</p>`;
    return;
  }

  list.forEach((p) => {
    const hazardClass = "hazard-" + (p.hazard || "").split(" ")[0];

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    col.innerHTML = `
      <a href="producto.html?id=${encodeURIComponent(p.id)}" class="text-decoration-none text-dark">
        <div class="card product-card h-100">
          <img src="${p.image || "assets/product-placeholder.png"}" class="product-img" alt="${p.name}">

          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <h5 class="card-title mb-0">${p.name}</h5>
              <span class="product-pill">${p.category}</span>
            </div>

            ${p.formula ? `<p class="product-formula mb-1">${p.formula}</p>` : ""}

            <p class="small text-muted mb-2">${p.description}</p>

            <p class="small mb-0">
              <strong>Presentación:</strong> ${p.presentation} <br>
              <strong>Peligro:</strong> <span class="${hazardClass}">${p.hazard}</span>
            </p>
          </div>
        </div>
      </a>
    `;

    grid.appendChild(col);
  });
}

// -------------------------------------
// 6. Renderizar paginación
// -------------------------------------
function renderPagination(totalPages) {
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  const ul = document.createElement("ul");
  ul.className = "pagination pagination-sm justify-content-center";

  const addPage = (label, page, disabled, active) => {
    const li = document.createElement("li");
    li.className = "page-item";
    if (disabled) li.classList.add("disabled");
    if (active) li.classList.add("active");

    const btn = document.createElement("button");
    btn.className = "page-link";
    btn.textContent = label;
    btn.dataset.page = page;

    li.appendChild(btn);
    return li;
  };

  ul.appendChild(addPage("«", currentPage - 1, currentPage === 1));

  for (let i = 1; i <= totalPages; i++) {
    ul.appendChild(addPage(i, i, false, i === currentPage));
  }

  ul.appendChild(addPage("»", currentPage + 1, currentPage === totalPages));

  ul.addEventListener("click", (e) => {
    const btn = e.target.closest(".page-link");
    if (!btn) return;

    const page = Number(btn.dataset.page);
    if (!isNaN(page)) {
      currentPage = page;
      renderCurrentPage();
    }
  });

  paginationContainer.appendChild(ul);
}

// -------------------------------------
// 7. Render actual
// -------------------------------------
function renderCurrentPage() {
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredProducts.slice(start, start + PAGE_SIZE);

  renderProducts(pageItems);
  renderPagination(totalPages);
}

// -------------------------------------
// 8. Eventos principales
// -------------------------------------
searchInput.addEventListener("input", applyFilters);
filterCategory.addEventListener("change", applyFilters);
filterHazard.addEventListener("change", applyFilters);
filterGrade.addEventListener("change", applyFilters);
filterSort.addEventListener("change", applyFilters);

// Iniciar
loadProducts();
