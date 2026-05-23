-- SQLite schema for Minh Mart store

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  importedDate TEXT,
  image TEXT,
  description TEXT,
  lastSold TEXT
);

CREATE TABLE IF NOT EXISTS imports (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  qty INTEGER NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY(productId) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  qty INTEGER NOT NULL,
  total INTEGER NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY(productId) REFERENCES products(id)
);
