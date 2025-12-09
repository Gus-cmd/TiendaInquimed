document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const headingEl = document.getElementById("productNameHeading");
  const formulaHeroEl = document.getElementById("productFormula");
  const categoryBadgeEl = document.getElementById("productCategory");
  const gradeBadgeEl = document.getElementById("productGradeBadge");
  const hazardBadgeEl = document.getElementById("productHazardBadge");
  const imgEl = document.getElementById("productImage");

  const nameLeftEl = document.getElementById("productNameLeft");
  const presLeftEl = document.getElementById("productPresentationLeft");

  const descEl = document.getElementById("productDescription");
  const presEl = document.getElementById("productPresentation");

  const idEl = document.getElementById("productId");
  const categorySmallEl = document.getElementById("productCategorySmall");
  const gradeSmallEl = document.getElementById("productGradeSmall");
  const presSmallEl = document.getElementById("productPresentationSmall");
  const hazardSmallEl = document.getElementById("productHazardSmall");

  const tagsEl = document.getElementById("productTags");
  const breadcrumbCurrentEl = document.getElementById("breadcrumbCurrent");
  const ghsContainer = document.getElementById("productGhs");
  const relatedGrid = document.getElementById("relatedProductsGrid");

  if (!productId) {
    descEl.textContent =
      "No se ha especificado un producto. Regrese al catálogo para seleccionar uno.";
    return;
  }

  const GHS_MAP = {
    GHS01: { label: "Explosivo", desc: "Explosivos, auto-reactivos muy sensibles." },
    GHS02: { label: "Inflamable", desc: "Líquidos, sólidos y gases inflamables." },
    GHS03: { label: "Comburente", desc: "Puede provocar o agravar incendios." },
    GHS04: { label: "Gas a presión", desc: "Gases comprimidos, licuados o disueltos." },
    GHS05: { label: "Corrosivo", desc: "Corrosivo para metales, piel y ojos." },
    GHS06: { label: "Tóxico agudo", desc: "Tóxico incluso en pequeñas dosis." },
    GHS07: { label: "Irritante", desc: "Irritación de piel, ojos o vías respiratorias." },
    GHS08: { label: "Peligro crónico", desc: "Efectos a largo plazo (cáncer, toxicidad)." },
    GHS09: { label: "Peligro ambiental", desc: "Muy tóxico para organismos acuáticos." }
  };

  function renderGhsIcons(codes) {
    if (!ghsContainer) return;
    ghsContainer.innerHTML = "";

    if (!Array.isArray(codes) || !codes.length) {
      ghsContainer.innerHTML =
        '<span class="text-muted small">Sin pictogramas registrados.</span>';
      return;
    }

    codes.forEach((code) => {
      const meta = GHS_MAP[code] || { label: code, desc: "" };
      const icon = document.createElement("div");
      icon.className = "ghs-icon";

      const num = code.replace("GHS", "");

      icon.innerHTML = `
        <div class="ghs-diamond">
          <span>${num}</span>
        </div>
        <span class="ghs-label">${meta.label}</span>
      `;

      icon.title = meta.desc
        ? `${meta.label} (${code}): ${meta.desc}`
        : code;

      ghsContainer.appendChild(icon);
    });
  }

  function renderRelatedProducts(allProducts, current) {
    if (!relatedGrid) return;

    let candidates = allProducts.filter((p) => p.id !== current.id);

    const sameCategory = candidates.filter(
      (p) => p.category && current.category && p.category === current.category
    );

    let list = sameCategory.length ? sameCategory : candidates;
    list = list.slice(0, 3);

    if (!list.length) {
      relatedGrid.innerHTML =
        '<p class="small text-muted mb-0">No hay productos relacionados por el momento.</p>';
      return;
    }

    relatedGrid.innerHTML = "";

    list.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      const html = `
        <a href="producto.html?id=${encodeURIComponent(p.id)}"
           class="related-product-card card h-100 text-decoration-none">
          <div class="card-body">
            <h3 class="h6 mb-1 related-name">${p.name || "Producto INQUIMED"}</h3>
            <p class="small text-muted mb-2">${p.formula || ""}</p>
            <span class="badge rounded-pill related-category-badge">
              ${p.category || "Sin categoría"}
            </span>
            <p class="small text-muted mt-2 mb-0">
              ${p.presentation || ""}
            </p>
          </div>
        </a>
      `;

      col.innerHTML = html;
      relatedGrid.appendChild(col);
    });
  }

  fetch("data/products.json")
    .then((res) => res.json())
    .then((data) => {
      const products = data.products || [];
      const product = products.find((p) => p.id === productId);

      if (!product) {
        headingEl.textContent = "Producto no encontrado";
        descEl.textContent =
          "El producto solicitado no se encuentra en el catálogo. Es posible que haya sido actualizado o eliminado.";
        return;
      }

      document.title = `${product.name} – INQUIMED`;

      if (breadcrumbCurrentEl) {
        breadcrumbCurrentEl.textContent = product.name || "Producto";
      }

      headingEl.textContent = product.name || "Producto INQUIMED";
      formulaHeroEl.textContent = product.formula || "";

      if (nameLeftEl) {
        nameLeftEl.textContent = product.name || "Producto INQUIMED";
      }

      categoryBadgeEl.textContent = product.category || "Sin categoría";
      gradeBadgeEl.textContent = product.grade || "Sin grado";

      const hazardText = product.hazard || "Sin clasificación";
      hazardBadgeEl.textContent = hazardText;

      imgEl.src = product.image || "assets/logo-inquimed.png";
      imgEl.alt = product.name || "Producto INQUIMED";

      descEl.textContent =
        product.description ||
        "Producto químico para uso en laboratorio e industria.";

      presEl.textContent =
        product.presentation || "Consultar presentaciones disponibles";

      if (presLeftEl) {
        const firstPres = product.presentation
          ? String(product.presentation).split(",")[0].trim()
          : "Consultar presentaciones disponibles";
        presLeftEl.textContent = firstPres;
      }

      idEl.textContent = product.id || "—";
      categorySmallEl.textContent = product.category || "—";
      gradeSmallEl.textContent = product.grade || "—";
      presSmallEl.textContent = product.presentation || "—";
      hazardSmallEl.textContent = hazardText;

      tagsEl.innerHTML = "";
      const tags = product.tags || [];
      if (!tags.length) {
        tagsEl.innerHTML =
          '<span class="badge rounded-pill bg-secondary-subtle text-secondary-emphasis small">Sin etiquetas</span>';
      } else {
        tags.forEach((tag) => {
          const span = document.createElement("span");
          span.className = "badge rounded-pill product-tag-pill";
          span.textContent = tag;
          tagsEl.appendChild(span);
        });
      }

      const ghsCodes = product.ghsCodes || product.ghs || [];
      renderGhsIcons(ghsCodes);

      // Productos relacionados
      renderRelatedProducts(products, product);
    })
    .catch((err) => {
      console.error("Error cargando producto:", err);
      descEl.textContent =
        "Ocurrió un problema al cargar la información del producto. Intente nuevamente más tarde.";
    });
});
