# Database Schema
### Tabel: `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL, -- 'cashier', 'warehouse', 'admin'
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  
  CONSTRAINT chk_role CHECK (role IN ('cashier', 'warehouse', 'admin'))
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_username ON users(username);
```

### Tabel: `permissions`
```sql
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  role VARCHAR(20) NOT NULL,
  resource VARCHAR(50) NOT NULL, -- 'products', 'transactions', 'users', etc.
  actions TEXT[], -- ['create', 'read', 'update', 'delete']
  
  UNIQUE(role, resource)
);

-- Default Permissions
INSERT INTO permissions (role, resource, actions) VALUES
('cashier', 'products', ARRAY['read']),
('cashier', 'transactions', ARRAY['create', 'read']),
('cashier', 'promos', ARRAY['read']),

('warehouse', 'products', ARRAY['create', 'read', 'update', 'delete']),
('warehouse', 'stock', ARRAY['create', 'read', 'update']),
('warehouse', 'suppliers', ARRAY['create', 'read', 'update', 'delete']),
('warehouse', 'transactions', ARRAY['read']),

('admin', 'users', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'products', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'transactions', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'promos', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'reports', ARRAY['read']),
('admin', 'settings', ARRAY['create', 'read', 'update']);
```

### Tabel: `categories`
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel: `suppliers`
```sql
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel: `products`
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  barcode VARCHAR(50) UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  supplier_id INTEGER REFERENCES suppliers(id),
  price DECIMAL(15, 2) NOT NULL,
  cost_price DECIMAL(15, 2), -- Harga pokok
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 10, -- Alert stok minimum
  unit VARCHAR(20) DEFAULT 'pcs', -- pcs, box, kg, liter, dll
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
```

### Tabel: `stock_movements`
```sql
CREATE TABLE stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'damaged', 'expired'
  quantity INTEGER NOT NULL, -- Positif untuk masuk, negatif untuk keluar
  stock_before INTEGER,
  stock_after INTEGER,
  reference_type VARCHAR(50), -- 'transaction', 'stock_in', 'adjustment'
  reference_id INTEGER,
  cost_price DECIMAL(15, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  
  CONSTRAINT chk_type CHECK (type IN ('in', 'out', 'adjustment', 'damaged', 'expired', 'return'))
);

CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(type);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);
```

### Tabel: `stock_ins`
```sql
CREATE TABLE stock_ins (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  total_items INTEGER,
  total_quantity INTEGER,
  total_cost DECIMAL(15, 2),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE TABLE stock_in_items (
  id SERIAL PRIMARY KEY,
  stock_in_id INTEGER REFERENCES stock_ins(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  cost_price DECIMAL(15, 2),
  subtotal DECIMAL(15, 2)
);
```

### Tabel: `transactions`
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  cashier_id INTEGER REFERENCES users(id) NOT NULL,
  subtotal DECIMAL(15, 2) NOT NULL,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL, -- 'cash', 'card', 'qris', 'transfer'
  payment_amount DECIMAL(15, 2) NOT NULL,
  change_amount DECIMAL(15, 2) DEFAULT 0,
  promo_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed', -- 'completed', 'refunded', 'void'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_payment_method CHECK (payment_method IN ('cash', 'card', 'qris', 'transfer')),
  CONSTRAINT chk_status CHECK (status IN ('completed', 'refunded', 'void', 'pending'))
);

CREATE INDEX idx_transactions_invoice ON transactions(invoice_number);
CREATE INDEX idx_transactions_cashier ON transactions(cashier_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);
```

### Table: `transaction_items`
```sql
CREATE TABLE transaction_items (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(100) NOT NULL, -- Simpan nama untuk history
  sku VARCHAR(50),
  price DECIMAL(15, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  discount DECIMAL(15, 2) DEFAULT 0,
  subtotal DECIMAL(15, 2) NOT NULL
);

CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product ON transaction_items(product_id);
```

### Table: `promos`
```sql
CREATE TABLE promos (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed', 'buy_x_get_y'
  value DECIMAL(15, 2) NOT NULL,
  min_purchase DECIMAL(15, 2) DEFAULT 0,
  max_discount DECIMAL(15, 2), -- Max diskon untuk percentage type
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  usage_limit INTEGER, -- Null = unlimited
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  
  CONSTRAINT chk_promo_type CHECK (type IN ('percentage', 'fixed', 'buy_x_get_y'))
);

CREATE INDEX idx_promos_code ON promos(code);
CREATE INDEX idx_promos_valid ON promos(valid_from, valid_until);
```
### Tabel: `refunds` 
```sql
CREATE TABLE refunds (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  refund_amount DECIMAL(15, 2) NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE TABLE refund_items (
  id SERIAL PRIMARY KEY,
  refund_id INTEGER REFERENCES refunds(id),
  transaction_item_id INTEGER REFERENCES transaction_items(id),
  quantity INTEGER NOT NULL,
  refund_amount DECIMAL(15, 2) NOT NULL
);
```

### Tabel: `audit_logs`
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  resource VARCHAR(50) NOT NULL, -- 'transaction', 'product', 'user', etc.
  resource_id INTEGER,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
```