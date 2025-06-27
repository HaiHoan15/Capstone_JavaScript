import { Product } from '../models/Product.js';

// gọi api 
const API_URL = 'https://685e5bd87b57aebd2af914ed.mockapi.io/Products';

let allProducts = [];

function getProducts() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      allProducts = data;
      renderProducts(allProducts);
      loadCartFromLocal();
    })
    .catch((err) => console.error('Lỗi gọi API:', err));
}

// Hiển thị sản phẩm
function renderProducts(products) {
  const container = document.getElementById('productList');
  container.innerHTML = '';

  products.forEach((item) => {
    const product = new Product(
      item.id,
      item.name,
      item.price,
      item.screen,
      item.backCamera,
      item.frontCamera,
      item.img,
      item.desc,
      item.type
    );

    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="top">
        <i class="fab fa-apple"></i>
        <span class="status">Còn hàng</span>
      </div>
      <img src="${product.img}" alt="${product.name}" />
      <div class="info">
        <h3>${product.name}</h3>
        <p class="desc">${product.desc}</p>
        <p class="price">$${product.price}</p>
        <button onclick="addToCart('${product.id}')">Add</button>
      </div>
    `;
    container.appendChild(div);
  });
}


// dropdown
document.getElementById('productType').addEventListener('change', function () {
  const selectedType = this.value;

  if (selectedType === 'all') {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      (item) => item.type.toLowerCase() === selectedType
    );
    renderProducts(filtered);
  }
});

// GỌI API ban đầu
getProducts();

//thêm sản phẩm vào giỏ hàng
import { CartItem } from '../models/CartItem.js';

let cart = [];

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const index = cart.findIndex(item => item.id === product.id);

  if (index === -1) {
    const newItem = new CartItem(product.id, product.name, product.price, product.img);
    cart.push(newItem);
  } else {
    cart[index].quantity += 1;
  }
  renderCart();
  saveCartToLocal();
}


// Hiển thị giỏ hàng
function renderCart() {
  const cartList = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartHeaderCount = document.getElementById("cart-count-header");
  const totalEl = document.getElementById("cart-total");

  cartList.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "product";

    li.innerHTML = `
      <span class="product-image">
        <img src="${item.img}" alt="${item.name}">
      </span>

      <span class="product-details">
        <h3>${item.name}</h3>
        <span class="qty-price">
          <span class="qty">
            <button onclick="decreaseQuantity('${item.id}')" class="minus-button">-</button>
            <input type="number" class="qty-input" value="${item.quantity}" readonly>
            <button onclick="increaseQuantity('${item.id}')" class="plus-button">+</button>
          </span>
          <span class="price">$${item.price * item.quantity}</span>
        </span>
      </span>

      <a href="#" class="remove-button" onclick="removeItem('${item.id}')">
        <span class="remove-icon">X</span>
      </a>
    `;

    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  // Tổng số lượng sản phẩm (theo quantity)
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalQuantity;
  cartHeaderCount.innerText = totalQuantity;
  totalEl.innerText = `$${total}`;
}


//tăng sản phẩm trong giỏ hàng
function increaseQuantity(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart[index].quantity++;
    renderCart();
    saveCartToLocal();
  }
}

//giảm sản phẩm trong giỏ hàng
function decreaseQuantity(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart[index].quantity--;
    if (cart[index].quantity === 0) {
      cart.splice(index, 1); //xóa sản phẩm khi bằng 0
    }
    renderCart();
    saveCartToLocal();
  }
}

// xóa sản phẩm trong giỏ hàng
function removeItem(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
    renderCart();
    saveCartToLocal();
  }
}

//goi hàm để sử dụng trong HTML
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;


function saveCartToLocal() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// lưu giỏ hàng vào localStorage 
function loadCartFromLocal() {
  const data = localStorage.getItem('cart');
  if (data) {
    cart = JSON.parse(data);
    renderCart();
  }
}

// thanh toán
document.getElementById('btnCheckout').addEventListener('click', function () {
  if (confirm('Bạn có chắc muốn thanh toán và xóa toàn bộ giỏ hàng?')) {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
  }
});
