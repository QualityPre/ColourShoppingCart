import items from '../items.json'
import formatCurrency from '../helpers/formatCurrency'
import addglobalEventListener from '../helpers/addGlobalEventListener'

const cartButton = document.querySelector('[data-cart-button]')
const cartItemWrapper = document.querySelector('[data-cart-items-wrapper]')
let shoppingCart = []
const IMAGE_URL = `https://dummyimage.com/210x130/`

const shoppingItemTemplate = document.querySelector('#shopping-cart-template')
const shoppingItemContainer = document.querySelector(
  '[data-cart-items-container ]'
)
const cartQuantity = document.querySelector('[data-cart-quantity]')
const cartTotal = document.querySelector('[data-cart-total]')
const cart = document.querySelector('[data-cart]')

const SESSION_STORAGE_KEY = `SHOPPING_CART-cart`

export function setupShoppingCart() {
  addglobalEventListener('click', '[data-remove-from-cart-button]', (e) => {
    const id = parseInt(e.target.closest('[data-item]').dataset.itemId)
    removeFromCart(id)
  })
  shoppingCart = loadCart()
  renderCart()

  // Show/hide the cart when clicked

  cartButton.addEventListener('click', () => {
    cartItemWrapper.classList.toggle('invisible')
  })
}

// handle click event for adding..on store.js

// Calculate an accurate total

// Add the items to the cart
export function addToCart(id) {
  //Handle multiple of same item of the cart
  const existingItem = shoppingCart.find((entry) => entry.id === id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    shoppingCart.push({ id: id, quantity: +1 })
  }
  saveCart()
  renderCart()
}

// Show/hide cart button when it has no items OR when it goes from 0 to 1 item
function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart()
  } else {
    showCart()
    renderShoppingCart()
  }
}
function hideCart() {
  cart.classList.add('invisible')
  cartItemWrapper.classList.add('invisible')
}
function showCart() {
  cart.classList.remove('invisible')
}

function renderShoppingCart() {
  cartQuantity.innerText = shoppingCart.length

  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find((i) => i.id === entry.id)
    return sum + item.priceCents * entry.quantity
  }, 0)

  cartTotal.innerText = formatCurrency(totalCents / 100)

  shoppingItemContainer.innerHTML = ''
  shoppingCart.forEach((entry) => {
    const item = items.find((i) => i.id === entry.id)
    const shoppingItem = shoppingItemTemplate.content.cloneNode(true)
    const container = shoppingItem.querySelector(' [data-item]')
    container.dataset.itemId = item.id

    const name = shoppingItem.querySelector('[data-name]')
    name.innerText = item.name

    const price = shoppingItem.querySelector('[data-price]')
    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100)

    const quantity = shoppingItem.querySelector('[data-quantity]')
    entry.quantity === 1
      ? (quantity.innerText = '')
      : (quantity.innerText = `x${entry.quantity}`)

    const image = shoppingItem.querySelector('[data-image]')
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

    shoppingItemContainer.appendChild(shoppingItem)
  })
}
// Remove items from cart

function removeFromCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id)
  if (existingItem == null) return
  shoppingCart = shoppingCart.filter((entry) => entry.id !== id)
  saveCart()
  renderCart()
}

// Persist across multiple pages

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
  console.log(cart)
  return JSON.parse(cart) || []
}
