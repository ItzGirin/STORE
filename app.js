const products = [
  {
    id: 1,
    title: "Komik Invicible seri 60 “THE INVICIBLE WAR!” (Bahasa Inggris)",
    price: 59000,
    images: [
      "komik1.jpeg"
    ],
    description: "Komik Invicible seri 60 “THE INVICIBLE WAR!” (Bahasa Inggris)",
    shopeeUrl: "https://shopee.co.id/Komik-Invicible-seri-60-%E2%80%9CTHE-INVICIBLE-WAR!%E2%80%9D-(Bahasa-Inggris)-i.994813608.27483901311",
    checkoutUrl: "https://shopee.co.id/cart?itemKeys=27483901311.253215422518.&shopId=994813608"
  },
  {
    id: 2,
    title: "Minecraft Account",
    price: 160000,
    images: [
      "Gambar java bedrock.jpg"
    ],
    description: "Minecraft Account",
    shopeeUrl: "",
    checkoutUrl: ""
  }
];

// Utility to format price in IDR
function formatPrice(price) {
  return "Rp " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function renderProducts(productList) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  productList.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    let viewButtonHtml = '';
    if (product.id === 2) {
      // Minecraft product: change button to DM Instagram with updated link
      viewButtonHtml = `<button style="font-size: 12px; padding: 4px 8px; background-color: #ff5722; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="window.location.href='https://www.instagram.com/direct/t/17847853344401219'">DM For Buy</button>`;
    } else {
      viewButtonHtml = `<button onclick="redirectToProduct(${product.id})">View</button>`;
    }
    card.innerHTML = `
      <img src="${product.image || product.images?.[0]}" alt="${product.title}" class="product-image" />
      <div class="product-title" style="margin-top: 8px;">${product.title}</div>
      <div class="product-price">${formatPrice(product.price)}</div>
      <div class="product-actions">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        ${viewButtonHtml}
      </div>
    `;
    container.appendChild(card);
  });
}

function addToCart(productId) {
  const loggedInUser = sessionStorage.getItem("loggedInUser") || "guest";
  let cart = JSON.parse(localStorage.getItem(`cart_${loggedInUser}`)) || [];
  const productInCart = cart.find(item => item.id === productId);
  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem(`cart_${loggedInUser}`, JSON.stringify(cart));
  updateCartCount();
  alert("Product added to cart!");
}

function updateCartCount() {
  const loggedInUser = sessionStorage.getItem("loggedInUser") || "guest";
  const cartRaw = localStorage.getItem(`cart_${loggedInUser}`);
  let cart = [];
  try {
    cart = JSON.parse(cartRaw);
    if (!Array.isArray(cart)) {
      cart = [];
    }
  } catch {
    cart = [];
  }
  let count = 0;
  if (Array.isArray(cart)) {
    count = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }
  if (isNaN(count) || count < 0) {
    count = 0;
  }
  document.getElementById("cart-count").textContent = count;
}

function redirectToProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (product && product.shopeeUrl) {
    window.location.href = product.shopeeUrl;
  } else {
    alert("Product link not available");
  }
}

// Search functionality
document.getElementById("search-input").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(query));
  renderProducts(filtered);
});

// Initialize
renderProducts(products);
updateCartCount();

// Show username modal if no username in sessionStorage
document.addEventListener("DOMContentLoaded", () => {
  const usernameModal = document.getElementById("username-modal");
  if (!usernameModal) return; // modal not present on this page

  const usernameInput = document.getElementById("username-input");
  const usernameSubmit = document.getElementById("username-submit");

  function hideModal() {
    usernameModal.style.display = "none";
  }

  function showModal() {
    usernameModal.style.display = "flex";
  }

  function saveUsername(name) {
    sessionStorage.setItem("loggedInUser", name);
  }

  if (!sessionStorage.getItem("loggedInUser")) {
    showModal();
  } else {
    hideModal();
  }

  usernameSubmit.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    if (name.length === 0) {
      alert("Please enter your name.");
      return;
    }
    saveUsername(name);
    hideModal();
  });

  usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      usernameSubmit.click();
    }
  });
});
