const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const dbFile = path.join(__dirname, process.env.DB_FILE || "store.db");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, ".")));

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Lỗi khi mở cơ sở dữ liệu:", err);
    process.exit(1);
  }
});

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

const initialProducts = [
  {
    id: "P001",
    name: "Uniqlo Supima Cotton Crew Neck T-Shirt",
    price: 299000,
    stock: 50,
    importedDate: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1523381213481-22e39b4e7c07?auto=format&fit=crop&w=400&q=80",
    description:
      "Áo thun Uniqlo Supima Cotton mềm mại, thoáng mát cho cả ngày.",
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

const initialSales = [
  {
    id: "S-20260522-P001",
    productId: "P001",
    qty: 2,
    total: 598000,
    date: "2026-05-22",
  },
  {
    id: "S-20260522-P002",
    productId: "P002",
    qty: 1,
    total: 399000,
    date: "2026-05-22",
  },
  {
    id: "S-20260521-P003",
    productId: "P003",
    qty: 3,
    total: 777000,
    date: "2026-05-21",
  },
  {
    id: "S-20260521-P004",
    productId: "P004",
    qty: 2,
    total: 298000,
    date: "2026-05-21",
  },
  {
    id: "S-20260520-P005",
    productId: "P005",
    qty: 1,
    total: 499000,
    date: "2026-05-20",
  },
  {
    id: "S-20260520-P006",
    productId: "P006",
    qty: 2,
    total: 698000,
    date: "2026-05-20",
  },
  {
    id: "S-20260519-P007",
    productId: "P007",
    qty: 1,
    total: 799000,
    date: "2026-05-19",
  },
  {
    id: "S-20260519-P008",
    productId: "P008",
    qty: 1,
    total: 349000,
    date: "2026-05-19",
  },
  {
    id: "S-20260518-P009",
    productId: "P009",
    qty: 1,
    total: 1299000,
    date: "2026-05-18",
  },
  {
    id: "S-20260518-P010",
    productId: "P010",
    qty: 2,
    total: 798000,
    date: "2026-05-18",
  },
  {
    id: "S-20260517-P011",
    productId: "P011",
    qty: 1,
    total: 499000,
    date: "2026-05-17",
  },
  {
    id: "S-20260517-P012",
    productId: "P012",
    qty: 2,
    total: 898000,
    date: "2026-05-17",
  },
  {
    id: "S-20260516-P013",
    productId: "P013",
    qty: 3,
    total: 897000,
    date: "2026-05-16",
  },
  {
    id: "S-20260516-P014",
    productId: "P014",
    qty: 1,
    total: 599000,
    date: "2026-05-16",
  },
  {
    id: "S-20260515-P015",
    productId: "P015",
    qty: 1,
    total: 399000,
    date: "2026-05-15",
  },
  {
    id: "S-20260515-P016",
    productId: "P016",
    qty: 2,
    total: 698000,
    date: "2026-05-15",
  },
  {
    id: "S-20260514-P017",
    productId: "P017",
    qty: 1,
    total: 799000,
    date: "2026-05-14",
  },
  {
    id: "S-20260514-P018",
    productId: "P018",
    qty: 1,
    total: 329000,
    date: "2026-05-14",
  },
  {
    id: "S-20260513-P019",
    productId: "P019",
    qty: 1,
    total: 899000,
    date: "2026-05-13",
  },
  {
    id: "S-20260513-P020",
    productId: "P020",
    qty: 2,
    total: 918000,
    date: "2026-05-13",
  },
];

async function initDatabase() {
  await dbRun(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    importedDate TEXT,
    image TEXT,
    description TEXT,
    lastSold TEXT
  )`);

  await dbRun(`CREATE TABLE IF NOT EXISTS imports (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    qty INTEGER NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(productId) REFERENCES products(id)
  )`);

  await dbRun(`CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    qty INTEGER NOT NULL,
    total INTEGER NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(productId) REFERENCES products(id)
  )`);

  try {
    await dbRun("ALTER TABLE products ADD COLUMN lastSold TEXT");
  } catch (err) {
    if (!/duplicate column/i.test(err.message)) {
      console.warn("Không thể thêm cột lastSold nếu đã tồn tại:", err.message);
    }
  }

  const existingProducts = await dbAll("SELECT id FROM products");
  const existingProductIds = new Set(existingProducts.map((row) => row.id));

  for (const product of initialProducts) {
    if (!existingProductIds.has(product.id)) {
      await dbRun(
        "INSERT INTO products (id, name, price, stock, importedDate, image, description, lastSold) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          product.id,
          product.name,
          product.price,
          product.stock,
          product.importedDate,
          product.image,
          product.description,
          product.lastSold,
        ],
      );
    }
  }

  const salesExisting = await dbAll("SELECT id FROM sales");
  const existingSaleIds = new Set(salesExisting.map((row) => row.id));
  for (const sale of initialSales) {
    if (!existingSaleIds.has(sale.id)) {
      await dbRun(
        "INSERT INTO sales (id, productId, qty, total, date) VALUES (?, ?, ?, ?, ?)",
        [sale.id, sale.productId, sale.qty, sale.total, sale.date],
      );
    }
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM products ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await dbGet("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/overview", async (req, res) => {
  try {
    const totalProducts = await dbGet("SELECT COUNT(*) AS count FROM products");
    const totalStock = await dbGet(
      "SELECT SUM(stock) AS totalStock FROM products",
    );
    const totalRevenue = await dbGet("SELECT SUM(total) AS revenue FROM sales");
    const totalImports = await dbGet(
      "SELECT SUM(qty) AS imported FROM imports",
    );
    res.json({
      totalProducts: totalProducts?.count || 0,
      totalStock: totalStock?.totalStock || 0,
      totalRevenue: totalRevenue?.revenue || 0,
      totalImports: totalImports?.imported || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sales", async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM sales ORDER BY date DESC, id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/imports", async (req, res) => {
  try {
    const rows = await dbAll(
      "SELECT * FROM imports ORDER BY date DESC, id DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/summary", async (req, res) => {
  const selectedDate = req.query.date;
  if (!selectedDate) {
    return res.status(400).json({ error: "Thiếu tham số date" });
  }

  try {
    const salesRow = await dbGet(
      "SELECT SUM(total) AS revenue, SUM(qty) AS quantitySold FROM sales WHERE date = ?",
      [selectedDate],
    );
    const importRow = await dbGet(
      "SELECT SUM(qty) AS quantityImported FROM imports WHERE date = ?",
      [selectedDate],
    );
    const productRow = await dbGet(
      "SELECT COUNT(*) AS productCount FROM products",
    );

    res.json({
      date: selectedDate,
      revenue: salesRow?.revenue || 0,
      quantitySold: salesRow?.quantitySold || 0,
      quantityImported: importRow?.quantityImported || 0,
      productCount: productRow?.productCount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cart/checkout", async (req, res) => {
  const items = req.body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Giỏ hàng trống" });
  }

  const now = new Date().toISOString().slice(0, 10);

  try {
    for (const item of items) {
      const row = await dbGet(
        "SELECT stock, price FROM products WHERE id = ?",
        [item.productId],
      );
      if (!row) {
        return res
          .status(400)
          .json({ error: `Sản phẩm không tồn tại: ${item.productId}` });
      }
      if (row.stock < item.qty) {
        return res
          .status(400)
          .json({ error: `Tồn kho không đủ với ${item.productId}` });
      }
    }

    await dbRun("BEGIN TRANSACTION");

    for (const item of items) {
      await dbRun(
        "UPDATE products SET stock = stock - ?, lastSold = ? WHERE id = ?",
        [item.qty, now, item.productId],
      );
      const saleId = `S-${Date.now()}-${item.productId}-${Math.floor(Math.random() * 10000)}`;
      await dbRun(
        "INSERT INTO sales (id, productId, qty, total, date) VALUES (?, ?, ?, ?, ?)",
        [saleId, item.productId, item.qty, item.qty * item.price, now],
      );
    }

    await dbRun("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await dbRun("ROLLBACK").catch(() => {});
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/imports", async (req, res) => {
  const { productId, qty, date } = req.body;
  if (!productId || !qty || qty <= 0 || !date) {
    return res.status(400).json({ error: "Dữ liệu nhập không hợp lệ" });
  }

  try {
    const row = await dbGet("SELECT id FROM products WHERE id = ?", [
      productId,
    ]);
    if (!row) {
      return res.status(400).json({ error: "Sản phẩm không tồn tại" });
    }

    const importId = `I-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    await dbRun(
      "INSERT INTO imports (id, productId, qty, date) VALUES (?, ?, ?, ?)",
      [importId, productId, qty, date],
    );
    await dbRun(
      "UPDATE products SET stock = stock + ?, importedDate = ? WHERE id = ?",
      [qty, date, productId],
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, async () => {
  try {
    await initDatabase();
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("Lỗi khi khởi tạo cơ sở dữ liệu:", err);
    process.exit(1);
  }
});
