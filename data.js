const CART_KEY = "minhmart_cart";

let products = [];
let sales = [];
let importsData = [];
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}");

const elements = {
  customerModeBtn: document.getElementById("customerModeBtn"),
  adminModeBtn: document.getElementById("adminModeBtn"),
  customerSection: document.getElementById("customerSection"),
  adminSection: document.getElementById("adminSection"),
  productCards: document.getElementById("productCards"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  purchaseHistory: document.getElementById("purchaseHistory"),
  importForm: document.getElementById("importForm"),
  importProduct: document.getElementById("importProduct"),
  importQty: document.getElementById("importQty"),
  importDate: document.getElementById("importDate"),
  reportDate: document.getElementById("reportDate"),
  loadReportBtn: document.getElementById("loadReportBtn"),
  dailySummary: document.getElementById("dailySummary"),
  inventoryTable: document.getElementById("inventoryTable"),
  importLog: document.getElementById("importLog"),
  salesLog: document.getElementById("salesLog"),
};

function formatCurrency(value) {
  return value.toLocaleString("vi-VN");
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("vi-VN");
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || response.statusText);
  }
  return response.json();
}

function getProductName(productId) {
  const product = products.find((item) => item.id === productId);
  return product ? product.name : productId;
}

function getProductBrand(name) {
  if (!name) return "Thời trang";
  if (name.toLowerCase().startsWith("uniqlo")) return "Uniqlo";
  if (name.toLowerCase().startsWith("gu")) return "GU";
  return "Thời trang";
}

async function loadData() {
  const [productData, salesData, importsList] = await Promise.all([
    fetchJson("/api/products"),
    fetchJson("/api/sales"),
    fetchJson("/api/imports"),
  ]);
  products = productData;
  sales = salesData;
  importsData = importsList;
}

function changeMode(toAdmin) {
  elements.customerModeBtn.classList.toggle("active", !toAdmin);
  elements.adminModeBtn.classList.toggle("active", toAdmin);
  elements.customerSection.classList.toggle("active-panel", !toAdmin);
  elements.adminSection.classList.toggle("active-panel", toAdmin);
}

function renderProducts() {
  elements.productCards.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <div>
          <strong>${product.name}</strong>
          <p class="product-brand">${getProductBrand(product.name)}</p>
          <p>${product.description}</p>
        </div>
        <div class="product-actions">
          <span>${formatCurrency(product.price)} đ</span>
          <span>Tồn: ${product.stock}</span>
          <button class="btn primary" data-id="${product.id}">Thêm vào giỏ</button>
        </div>
      </div>
    `;
    elements.productCards.appendChild(card);
  });
  elements.productCards.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.id));
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || product.stock <= 0) {
    alert("Sản phẩm đã hết hàng hoặc không tồn tại.");
    return;
  }
  const currentQty = cart[productId] || 0;
  if (currentQty + 1 > product.stock) {
    alert("Số lượng vượt quá tồn kho.");
    return;
  }
  cart[productId] = currentQty + 1;
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCart();
}

function renderCart() {
  elements.cartItems.innerHTML = "";
  const productIds = Object.keys(cart);
  if (!productIds.length) {
    elements.cartItems.innerHTML = "<p>Giỏ hàng đang trống.</p>";
    elements.cartTotal.textContent = "0";
    elements.checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  productIds.forEach((id) => {
    const qty = cart[id];
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const subtotal = qty * product.price;
    total += subtotal;

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p>Số lượng: ${qty}</p>
        <p><span>${formatCurrency(product.price)} đ</span> x ${qty}</p>
      </div>
      <div>
        <p><strong>${formatCurrency(subtotal)} đ</strong></p>
        <button class="btn secondary" data-id="${product.id}">Xóa</button>
      </div>
    `;
    item
      .querySelector("button")
      .addEventListener("click", () => removeFromCart(id));
    elements.cartItems.appendChild(item);
  });
  elements.cartTotal.textContent = formatCurrency(total);
  elements.checkoutBtn.disabled = false;
}

async function checkout() {
  const productIds = Object.keys(cart);
  if (!productIds.length) return;

  const items = productIds.map((id) => {
    const product = products.find((item) => item.id === id);
    return {
      productId: id,
      qty: cart[id],
      price: product.price,
    };
  });

  try {
    elements.checkoutBtn.disabled = true;
    await fetchJson("/api/cart/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    cart = {};
    saveCart();
    await loadData();
    renderAll();
    alert(
      "Thanh toán thành công! Đã cập nhật tồn kho và ghi lịch sử bán hàng.",
    );
  } catch (error) {
    alert(`Lỗi thanh toán: ${error.message}`);
  } finally {
    elements.checkoutBtn.disabled = false;
  }
}

function renderPurchaseHistory() {
  elements.purchaseHistory.innerHTML = "";
  if (!sales.length) {
    elements.purchaseHistory.innerHTML = "<p>Chưa có đơn hàng.</p>";
    return;
  }
  sales.slice(0, 5).forEach((sale) => {
    const log = document.createElement("div");
    log.className = "log-item";
    log.innerHTML = `
      <p><strong>Đơn #${sale.id}</strong></p>
      <p>${getProductName(sale.productId)} - ${sale.qty} cái</p>
      <p>Ngày bán: ${formatDate(sale.date)}</p>
      <p><strong>${formatCurrency(sale.total)} đ</strong></p>
    `;
    elements.purchaseHistory.appendChild(log);
  });
}

function renderImportOptions() {
  elements.importProduct.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} (${product.stock} tồn)`;
    elements.importProduct.appendChild(option);
  });
}

async function importStock(event) {
  event.preventDefault();
  const productId = elements.importProduct.value;
  const qty = Number(elements.importQty.value);
  const date =
    elements.importDate.value || new Date().toISOString().slice(0, 10);

  if (!qty || qty <= 0) {
    alert("Vui lòng nhập số lượng hợp lệ.");
    return;
  }

  try {
    await fetchJson("/api/imports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty, date }),
    });
    await loadData();
    renderAll();
    alert("Nhập hàng thành công.");
    elements.importQty.value = "1";
  } catch (error) {
    alert(`Lỗi nhập hàng: ${error.message}`);
  }
}

function renderInventoryTable() {
  elements.inventoryTable.innerHTML = "";
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${formatCurrency(product.price)} đ</td>
      <td>${product.stock}</td>
      <td>${formatDate(product.importedDate)}</td>
      <td>${formatDate(product.lastSold)}</td>
    `;
    elements.inventoryTable.appendChild(row);
  });
}

function renderImportLog() {
  elements.importLog.innerHTML = "";
  if (!importsData.length) {
    elements.importLog.innerHTML = "<p>Chưa có hoạt động nhập hàng.</p>";
    return;
  }
  importsData.slice(0, 5).forEach((entry) => {
    const item = document.createElement("div");
    item.className = "log-item";
    item.innerHTML = `
      <p><strong>${getProductName(entry.productId)}</strong> - +${entry.qty}</p>
      <p>Ngày nhập: ${formatDate(entry.date)}</p>
    `;
    elements.importLog.appendChild(item);
  });
}

function renderSalesLog() {
  elements.salesLog.innerHTML = "";
  if (!sales.length) {
    elements.salesLog.innerHTML = "<p>Chưa có đơn hàng bán.</p>";
    return;
  }
  sales.slice(0, 5).forEach((sale) => {
    const item = document.createElement("div");
    item.className = "log-item";
    item.innerHTML = `
      <p><strong>${getProductName(sale.productId)}</strong> - ${sale.qty} cái</p>
      <p>Ngày bán: ${formatDate(sale.date)}</p>
      <p>Tổng: ${formatCurrency(sale.total)} đ</p>
    `;
    elements.salesLog.appendChild(item);
  });
}

async function showDailyReport() {
  const date =
    elements.reportDate.value || new Date().toISOString().slice(0, 10);
  try {
    const summary = await fetchJson(`/api/summary?date=${date}`);
    elements.dailySummary.innerHTML = "";
    const summaryContent = document.createElement("div");
    summaryContent.innerHTML = `
      <div><span>Ngày:</span><strong>${formatDate(summary.date)}</strong></div>
      <div><span>Doanh thu:</span><strong>${formatCurrency(summary.revenue)} đ</strong></div>
      <div><span>SL đã bán:</span><strong>${summary.quantitySold}</strong></div>
      <div><span>SL nhập vào:</span><strong>${summary.quantityImported}</strong></div>
      <div><span>Tổng sản phẩm:</span><strong>${summary.productCount}</strong></div>
    `;
    elements.dailySummary.appendChild(summaryContent);
  } catch (error) {
    elements.dailySummary.innerHTML = `<p>Lỗi tải báo cáo: ${error.message}</p>`;
  }
}

function renderAll() {
  renderProducts();
  renderCart();
  renderPurchaseHistory();
  renderImportOptions();
  renderInventoryTable();
  renderImportLog();
  renderSalesLog();
}

async function init() {
  try {
    await loadData();
    renderAll();
    elements.importDate.value = new Date().toISOString().slice(0, 10);
    elements.reportDate.value = new Date().toISOString().slice(0, 10);
    elements.customerModeBtn.addEventListener("click", () => changeMode(false));
    elements.adminModeBtn.addEventListener("click", () => changeMode(true));
    elements.checkoutBtn.addEventListener("click", checkout);
    elements.importForm.addEventListener("submit", importStock);
    elements.loadReportBtn.addEventListener("click", showDailyReport);
    await showDailyReport();
  } catch (error) {
    alert(`Không thể tải dữ liệu: ${error.message}`);
  }
}

init();
