/* UMD filter function: usable in Node (module.exports) and browser (window.productFilter)
   productFilter.filter(list, options) -> filteredList */

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.productFilter = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

  function filter(list, opts = {}) {
    if (!Array.isArray(list)) return [];

    const {
      search = "",
      category = "",
      hazard = "",
      grade = "",
      sort = "name-asc"
    } = opts;

    const q = search.toLowerCase().trim();

    let result = list.slice();

    // 1. FILTRO DE BÚSQUEDA
    if (q) {
      result = result.filter((p) => {
        const text = `${p.name || ""} ${p.formula || ""} ${p.category || ""} ${(p.tags || []).join(" ")}`;
        return text.toLowerCase().includes(q);
      });
    }

    // 2. FILTRO POR CATEGORÍA
    if (category) {
      result = result.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. FILTRO POR PELIGRO
    if (hazard) {
      result = result.filter(
        (p) => (p.hazard || "").toLowerCase() === hazard.toLowerCase()
      );
    }

    // 4. FILTRO POR GRADO
    if (grade) {
      result = result.filter(
        (p) => (p.grade || "").toLowerCase() === grade.toLowerCase()
      );
    }

    // 5. ORDENAMIENTO
    result.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      const catA = (a.category || "").toLowerCase();
      const catB = (b.category || "").toLowerCase();

      switch (sort) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "category-asc":
          return catA.localeCompare(catB);
        case "category-desc":
          return catB.localeCompare(catA);
        default:
          return 0;
      }
    });

    return result;
  }

  // Export API
  return { filter };
});
