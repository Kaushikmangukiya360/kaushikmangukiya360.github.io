export function searchBox({ placeholder, target }) {
  return `
  <div class="search-box reveal">
    <input type="search" class="search-box__input" placeholder="${placeholder}" data-search-input data-search-target="${target}" aria-label="${placeholder}">
  </div>`;
}
