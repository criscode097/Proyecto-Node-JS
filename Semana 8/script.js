'use strict';

// ============================================================
// GENERADOR DE DATOS — Catálogo de propiedades VacaRent
// ============================================================

const PROPERTY_TYPES  = ['Villa', 'Apartamento', 'Cabaña', 'Casa'];
const CITIES          = ['Cartagena', 'Medellín', 'Santa Marta', 'Bogotá', 'Cali', 'Barichara', 'Salento', 'Eje Cafetero'];
const CATEGORIES      = ['Económica', 'Estándar', 'Premium'];

function* dataGenerator(total) {
  for (let i = 1; i <= total; i++) {
    const type     = PROPERTY_TYPES[(i - 1) % PROPERTY_TYPES.length];
    const city     = CITIES[(i - 1) % CITIES.length];
    const category = CATEGORIES[(i - 1) % CATEGORIES.length];
    const price    = 50 + ((i * 17) % 450);
    const capacity = 1 + (i % 8);

    yield {
      id:          i,
      title:       `${type} ${city} #${i}`,
      description: `${category} · $${price}/noche · hasta ${capacity} huéspedes · ${city}, Colombia`,
    };
  }
}

// ============================================================
// UTILIDADES DE GENERADORES
// ============================================================

function* take(iterator, n) {
  for (let i = 0; i < n; i++) {
    const { value, done } = iterator.next();
    if (done) return;
    yield value;
  }
}

function* skip(iterator, n) {
  for (let i = 0; i < n; i++) {
    const { done } = iterator.next();
    if (done) return;
  }
  yield* iterator;
}

// ============================================================
// CLASE PAGINATOR
// ============================================================

class Paginator {
  constructor(generatorFn, totalItems, itemsPerPage = 5) {
    this.generatorFn  = generatorFn;
    this.totalItems   = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.currentPage  = 1;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get hasNext() {
    return this.currentPage < this.totalPages;
  }

  get hasPrevious() {
    return this.currentPage > 1;
  }

  getPageItems() {
    // Crea un generador nuevo cada vez (lazy — solo genera lo que se pide)
    const iterator    = this.generatorFn(this.totalItems);
    const toSkip      = (this.currentPage - 1) * this.itemsPerPage;
    const skipped     = skip(iterator, toSkip);
    const pageItems   = take(skipped, this.itemsPerPage);
    return [...pageItems];
  }

  next() {
    if (!this.hasNext) return false;
    this.currentPage++;
    return true;
  }

  previous() {
    if (!this.hasPrevious) return false;
    this.currentPage--;
    return true;
  }

  goToPage(page) {
    const p = Number(page);
    if (p < 1 || p > this.totalPages || isNaN(p)) return false;
    this.currentPage = p;
    return true;
  }

  first() {
    this.currentPage = 1;
  }

  last() {
    this.currentPage = this.totalPages;
  }

  setItemsPerPage(newItemsPerPage) {
    // Mantiene aproximadamente la posición del primer item visible
    const firstVisible    = (this.currentPage - 1) * this.itemsPerPage + 1;
    this.itemsPerPage     = newItemsPerPage;
    this.currentPage      = Math.max(1, Math.ceil(firstVisible / newItemsPerPage));
  }

  getRange() {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end   = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return { start, end };
  }
}

// ============================================================
// CONTROLADOR DE UI
// ============================================================

let paginator = null;

const elements = {
  totalItems:        document.getElementById('totalItems'),
  itemsPerPage:      document.getElementById('itemsPerPage'),
  btnGenerate:       document.getElementById('btnGenerate'),
  dataList:          document.getElementById('dataList'),
  pagination:        document.getElementById('pagination'),
  btnFirst:          document.getElementById('btnFirst'),
  btnPrev:           document.getElementById('btnPrev'),
  btnNext:           document.getElementById('btnNext'),
  btnLast:           document.getElementById('btnLast'),
  pageInput:         document.getElementById('pageInput'),
  totalPages:        document.getElementById('totalPages'),
  stats:             document.getElementById('stats'),
  itemRange:         document.getElementById('itemRange'),
  totalItemsDisplay: document.getElementById('totalItemsDisplay'),
};

function createItemHTML(item) {
  return `
    <div class="data-item">
      <div class="data-item-id">${item.id}</div>
      <div class="data-item-content">
        <div class="data-item-title">${item.title}</div>
        <div class="data-item-description">${item.description}</div>
      </div>
    </div>
  `;
}

function updatePaginationUI() {
  elements.btnFirst.disabled   = !paginator.hasPrevious;
  elements.btnPrev.disabled    = !paginator.hasPrevious;
  elements.btnNext.disabled    = !paginator.hasNext;
  elements.btnLast.disabled    = !paginator.hasNext;

  elements.pageInput.value     = paginator.currentPage;
  elements.pageInput.max       = paginator.totalPages;
  elements.totalPages.textContent = paginator.totalPages;

  const { start, end } = paginator.getRange();
  elements.itemRange.textContent      = `Propiedades ${start}–${end}`;
  elements.totalItemsDisplay.textContent = paginator.totalItems;
}

function renderItems() {
  const items = paginator.getPageItems();

  if (items.length === 0) {
    elements.dataList.innerHTML = '<p class="placeholder">No hay propiedades para mostrar</p>';
  } else {
    elements.dataList.innerHTML = items.map(createItemHTML).join('');
  }

  updatePaginationUI();
}

function initializePaginator() {
  const total    = Number(elements.totalItems.value);
  const perPage  = Number(elements.itemsPerPage.value);

  paginator = new Paginator(dataGenerator, total, perPage);

  elements.pagination.style.display = 'flex';
  elements.stats.style.display      = 'flex';

  renderItems();
}

// ============================================================
// EVENT LISTENERS
// ============================================================

elements.btnGenerate.addEventListener('click', () => {
  initializePaginator();
});

elements.btnFirst.addEventListener('click', () => {
  if (!paginator) return;
  paginator.first();
  renderItems();
});

elements.btnPrev.addEventListener('click', () => {
  if (!paginator) return;
  paginator.previous();
  renderItems();
});

elements.btnNext.addEventListener('click', () => {
  if (!paginator) return;
  paginator.next();
  renderItems();
});

elements.btnLast.addEventListener('click', () => {
  if (!paginator) return;
  paginator.last();
  renderItems();
});

elements.pageInput.addEventListener('change', e => {
  if (!paginator) return;
  const success = paginator.goToPage(e.target.value);
  if (success) {
    renderItems();
  } else {
    // Si la página es inválida, restaura el valor actual
    e.target.value = paginator.currentPage;
  }
});

elements.itemsPerPage.addEventListener('change', e => {
  if (!paginator) return;
  paginator.setItemsPerPage(Number(e.target.value));
  renderItems();
});

// ============================================================
// INICIALIZACIÓN
// ============================================================

console.log('🏖️ VacaRent — Paginador con Generadores listo');
