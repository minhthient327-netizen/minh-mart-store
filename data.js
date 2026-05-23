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

const staticProducts = [
  {
    id: "P001",
    name: "Uniqlo Supima Cotton Crew Neck T-Shirt",
    price: 299000,
    stock: 50,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1523381213481-22e39b4e7c07?auto=format&fit=crop&w=400&q=80",
    description: "Áo thun Uniqlo Supima Cotton mềm mại, thoáng mát cho cả ngày.",
    lastSold: null,
  },
  {
    id: "P002",
    name: "GU Oversized Hoodie",
    price: 399000,
    stock: 42,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Hoodie GU rộng rãi, phong cách streetwear đơn giản.",
    lastSold: null,
  },
  {
    id: "P003",
    name: "Uniqlo Dry Stretch Polo Shirt",
    price: 259000,
    stock: 30,
    importedDate: "2026-05-19",
    image:
      "https://images.unsplash.com/photo-1530845641722-a99fbc0f5b26?auto=format&fit=crop&w=400&q=80",
    description: "Áo polo khô nhanh, phù hợp đi làm hoặc dạo phố.",
    lastSold: null,
  },
  {
    id: "P004",
    name: "GU Ribbed Tank Top",
    price: 149000,
    stock: 60,
    importedDate: "2026-05-20",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Áo hai dây GU đơn giản, dễ phối cả mùa hè.",
    lastSold: null,
  },
  {
    id: "P005",
    name: "Uniqlo Linen Blend Shirt",
    price: 499000,
    stock: 24,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d1?auto=format&fit=crop&w=400&q=80",
    description: "Áo sơ mi linen nhẹ nhàng, thoáng khí cho mùa nóng.",
    lastSold: null,
  },
  {
    id: "P006",
    name: "GU Flannel Check Shirt",
    price: 349000,
    stock: 28,
    importedDate: "2026-05-19",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Sơ mi flannel GU họa tiết kẻ vintage, ấm áp.",
    lastSold: null,
  },
  {
    id: "P007",
    name: "Uniqlo Wide-Fit Jeans",
    price: 799000,
    stock: 18,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Quần jeans dáng rộng Uniqlo, phong cách tối giản.",
    lastSold: null,
  },
  {
    id: "P008",
    name: "GU Pleated Skirt",
    price: 349000,
    stock: 22,
    importedDate: "2026-05-20",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80",
    description: "Chân váy xếp ly GU dễ phối với mọi kiểu áo.",
    lastSold: null,
  },
  {
    id: "P009",
    name: "Uniqlo Ultra Light Down Jacket",
    price: 1299000,
    stock: 12,
    importedDate: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1520975916378-796b999a617d?auto=format&fit=crop&w=400&q=80",
    description: "Áo khoác lông vũ nhẹ và ấm, dễ dàng gấp gọn.",
    lastSold: null,
  },
  {
    id: "P010",
    name: "GU Relaxed Chino Pants",
    price: 399000,
    stock: 26,
    importedDate: "2026-05-19",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    description: "Quần chino GU trẻ trung, form relaxed dễ mặc.",
    lastSold: null,
  },
  {
    id: "P011",
    name: "Uniqlo High-Rise Straight Skirt",
    price: 499000,
    stock: 20,
    importedDate: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1520975916378-796b999a617d?auto=format&fit=crop&w=400&q=80",
    description: "Chân váy cạp cao Uniqlo phong cách công sở.",
    lastSold: null,
  },
  {
    id: "P012",
    name: "GU Knit Cardigan",
    price: 449000,
    stock: 18,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Cardigan GU nữ tính, phù hợp layering mùa thu.",
    lastSold: null,
  },
  {
    id: "P013",
    name: "Uniqlo Dry-EX Active Shorts",
    price: 299000,
    stock: 35,
    importedDate: "2026-05-20",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Short chạy bộ khô nhanh Uniqlo Dry-EX, thoải mái.",
    lastSold: null,
  },
  {
    id: "P014",
    name: "GU Denim Jacket",
    price: 599000,
    stock: 16,
    importedDate: "2026-05-19",
    image:
      "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d1?auto=format&fit=crop&w=400&q=80",
    description: "Áo khoác denim GU cá tính, dễ phối cùng nhiều trang phục.",
    lastSold: null,
  },
  {
    id: "P015",
    name: "Uniqlo Seamless Bra",
    price: 399000,
    stock: 20,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Áo lót Seamless Uniqlo ôm nhẹ, không đường may.",
    lastSold: null,
  },
  {
    id: "P016",
    name: "GU Fleece Sweatpants",
    price: 349000,
    stock: 24,
    importedDate: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80",
    description: "Quần nỉ GU ấm áp, phù hợp ở nhà hoặc dạo phố.",
    lastSold: null,
  },
  {
    id: "P017",
    name: "Uniqlo Comfort Jacket",
    price: 799000,
    stock: 14,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1520975916378-796b999a617d?auto=format&fit=crop&w=400&q=80",
    description: "Áo khoác nhẹ Uniqlo đa năng, phong cách everyday.",
    lastSold: null,
  },
  {
    id: "P018",
    name: "GU Rayon Blouse",
    price: 329000,
    stock: 30,
    importedDate: "2026-05-20",
    image:
      "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d1?auto=format&fit=crop&w=400&q=80",
    description: "Áo blouse GU mềm mại, phù hợp công sở và dạo phố.",
    lastSold: null,
  },
  {
    id: "P019",
    name: "Uniqlo Stretch Jeans",
    price: 899000,
    stock: 20,
    importedDate: "2026-05-19",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Quần jeans co giãn Uniqlo cho cảm giác thoải mái.",
    lastSold: null,
  },
  {
    id: "P020",
    name: "GU Soft Jacket",
    price: 459000,
    stock: 26,
    importedDate: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1523381213481-22e39b4e7c07?auto=format&fit=crop&w=400&q=80",
    description: "Áo khoác GU mềm mại, thiết kế basic dễ phối.",
    lastSold: null,
  },
];

const staticSales = [];
const staticImports = [];

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
  try {
    const [productData, salesData, importsList] = await Promise.all([
      fetchJson("/api/products"),
      fetchJson("/api/sales"),
      fetchJson("/api/imports"),
    ]);
    products = productData;
    sales = salesData;
    importsData = importsList;
  } catch (error) {
    products = staticProducts;
    sales = staticSales;
    importsData = staticImports;
  }
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
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("404") ||
      error.message.includes("NetworkError")
    ) {
      const now = new Date().toISOString().slice(0, 10);
      items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          product.stock = Math.max(0, product.stock - item.qty);
          product.lastSold = now;
          sales.unshift({
            id: `SIM-${Date.now()}-${item.productId}`,
            productId: item.productId,
            qty: item.qty,
            total: item.qty * item.price,
            date: now,
          });
        }
      });
      cart = {};
      saveCart();
      renderAll();
      alert(
        "Thanh toán giả lập thành công. Dữ liệu được cập nhật tạm thời trên trình duyệt.",
      );
      return;
    }
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
