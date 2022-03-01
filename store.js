import items from './items.json';
import formatCurrency from './helpers/formatCurrency';
import { addToCart } from './shoppingCart';
import addglobalEventListener from './helpers/addGlobalEventListener';

const storeItemTemplate = document.querySelector('#store-item-template');
const storeItemContainer = document.querySelector('[data-store-container]');

const IMAGE_URL = `https://dummyimage.com/420x260/`;

export function setupStore() {
  if (storeItemContainer == null) return;
  addglobalEventListener('click', '[data-add-to-cart-button]', e => {
    const id = e.target.closest('[data-store-item]').dataset.itemId;
    addToCart(+id);
  });

  items.forEach(renderStoreItem);
}

function renderStoreItem(item) {
  const storeItem = storeItemTemplate.content.cloneNode(true);
  const container = storeItem.querySelector(' [data-store-item]');
  container.dataset.itemId = item.id;

  const name = storeItem.querySelector('[data-name]');
  name.innerText = item.name;

  const category = storeItem.querySelector('[data-category]');
  category.innerText = item.category;

  const price = storeItem.querySelector('[data-price]');
  price.innerText = formatCurrency(item.priceCents / 100);
  const image = storeItem.querySelector('[data-image]');
  image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

  storeItemContainer.appendChild(storeItem);
}
