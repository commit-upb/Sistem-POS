## Base URL
Production: https://api.posify.com/v1
Staging: https://staging-api.posify.com/v1
Development: http://localhost:3000/api/v1
## Authentication
**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

## Token Expiry:
**Access Token**: 15 menit
**Refresh Token**: 7 hari


## API Endpoints
### Authentication
**POST** `/auth/login`
```json
// Request
{
    "username": "kasir01",
  "password": "password123"
}

// Response
{
    "success": true,
  "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
      "username": "kasir01",
      "full_name": "John Doe",
      "role": "cashier",
      "permissions": ["view_products", "create_transaction"]
    }
  }
}
```

**POST** `/auth/refresh`
```json
// Request
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response
{
  "success": true,
  "data": {
    "access_token": "new_access_token_here"
  }
}
```

**POST** `/auth/logout`
```json
// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```
### User (Admin Only)
**GET** `/users`
- Role Required: Admin
- Description: Daftar semua user
- Query Parameters:
  - `role` 
  - `page`, `limit`
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "kasir01",
      "full_name": "John Doe",
      "role": "cashier",
      "is_active": true,
      "created_at": "2025-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25
  }
}
```
**POST** `/users`
- **Role Required**: Admin
```json
// Request
{
  "username": "kasir02",
  "password": "password123",
  "full_name": "Jane Smith",
  "role": "cashier",
  "email": "jane@example.com",
  "phone": "081234567890"
}

// Response
{
  "success": true,
  "data": {
    "id": 2,
    "username": "kasir02",
    "full_name": "Jane Smith",
    "role": "cashier"
  }
}
```
**PUT** `/users/:id`
- **Role Required:** Admin
**DELETE** `/users/:id`
- **Role Required:** Admin

## Produks
**GET** `/products`
- Role Required: All (Cashier: view only, Warehouse: full access, Admin: full access)
```json
// Query Parameters
?search=bayqon&category=makanan&page=1&limit=20

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sku": "PRD001",
      "barcode": "8992761111111",
      "name": "Bayqon",
      "category": "Makanan",
      "price": 13000,
      "stock": 150,
      "unit": "pcs",
      "image_url": "https://cdn.posify.com/products/bayqon.jpg",
      "is_active": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 100
  }
}
```
**GET** `/products/:id`
- **Role Required**: All

**POST** `/products`
- **Role Required**: Warehouse, Admin

```json
// Request (multipart/form-data)
{
  "sku": "PRD003",
  "barcode": "8992761333333",
  "name": "Aqua 600ml",
  "category": "Minuman",
  "price": 3500,
  "cost_price": 2800,
  "stock": 200,
  "min_stock": 50,
  "unit": "pcs",
  "description": "Air mineral kemasan",
  "supplier_id": 1,
  "image": [file]
}

// Response
{
  "success": true,
  "data": {
    "id": 3,
    "sku": "PRD003",
    "name": "Aqua 600ml",
    "price": 3500,
    "stock": 200
  }
}
```


**PUT** `/products/:id`
- **Role Required**: Warehouse, Admin

**DELETE** `/products/:id`
- **Role Required**: Admin only

**POST** `/products/bulk-upload`
- **Role Required**: Warehouse, Admin
- **Description**: Upload produk via CSV/Excel

## Stock Management (Wearhouse & Admin)
**POSE** `/stock/in`
- **Role Required**: Warehouse, Admin
- **Description**: Stok masuk dari supplier

```json
// Request
{
  "supplier_id": 1,
  "reference_number": "PO-2025-001",
  "items": [
    {
      "product_id": 1,
      "quantity": 100,
      "cost_price": 12000
    },
    {
      "product_id": 2,
      "quantity": 50,
      "cost_price": 7000
    }
  ],
  "notes": "Pengiriman dari supplier ABC"
}

// Response
{
  "success": true,
  "data": {
    "stock_in_id": 12,
    "reference_number": "PO-2025-001",
    "total_items": 2,
    "total_quantity": 150,
    "created_at": "2025-10-24T10:30:00Z"
  }
}
```

**POSE** `/stock/adjustment`
- **Role Required**: Warehouse, Admin
- **Description**: Adjustment stok (stock opname)

```json
// Request
{
  "product_id": 1,
  "type": "adjustment", // adjustment, damaged, expired
  "quantity": -5,
  "reason": "Barang rusak",
  "notes": "Kerusakan saat display"
}

// Response
{
  "success": true,
  "data": {
    "adjustment_id": 45,
    "product_id": 1,
    "old_stock": 150,
    "new_stock": 145,
    "difference": -5
  }
}
```
**GET** `/stock/history`
- **Role Required**: Warehouse, Admin
- **Description**: History pergerakan stok

**GET** `/stock/report`
- **Role Required**: Warehouse, Admin
- **Description**: Laporan stok (low stock, dead stock, dll)

## Transactions (Cashier - Create, All - View)
**POST** `/transactions`
- **Role Required**: Cashier

```json
// Request
{
  "invoice_number": "#INV-20251024-001",
  "customer_id": null, // optional
  "items": [
    {
      "product_id": 1,
      "product_name": "Bayqon",
      "sku": "PRD001",
      "price": 13000,
      "quantity": 130,
      "discount": 0,
      "subtotal": 1690000
    },
    {
      "product_id": 2,
      "product_name": "Jazz One",
      "sku": "PRD002",
      "price": 7500,
      "quantity": 130,
      "discount": 0,
      "subtotal": 975000
    }
  ],
  "subtotal": 2665000,
  "discount_amount": 0,
  "tax_amount": 0,
  "total": 8800000,
  "payment_method": "cash", // cash, card, qris
  "payment_amount": 9000000,
  "change_amount": 200000,
  "promo_code": null,
  "notes": ""
}

// Response
{
  "success": true,
  "data": {
    "transaction_id": 1001,
    "invoice_number": "#INV-20251024-001",
    "total": 8800000,
    "payment_amount": 9000000,
    "change_amount": 200000,
    "cashier": {
      "id": 1,
      "name": "John Doe"
    },
    "created_at": "2025-10-24T10:24:00Z",
    "receipt_url": "https://api.posify.com/receipts/1001.pdf"
  }
}
```

**GET** `/transactions`
- **Role Required**: own transactions only
- **Admin**: all transactions

```json
// Query Parameters
?start_date=2025-10-01&end_date=2025-10-24&cashier_id=1&page=1&limit=20

// Response
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "invoice_number": "#INV-20251024-001",
      "total": 8800000,
      "payment_method": "cash",
      "cashier": "John Doe",
      "customer": null,
      "status": "completed",
      "created_at": "2025-10-24T10:24:00Z"
    }
  ],
  "summary": {
    "total_transactions": 150,
    "total_revenue": 125000000,
    "total_items_sold": 1250
  }
}
```

**GET** `/transactions/:id`
- **Role Required**: Cashier (own), Admin (all)

**POST** `/transactions/:id/refund`
- **Role Required**: Admin only

```json
// Request
{
  "reason": "Produk cacat",
  "refund_items": [
    {
      "transaction_item_id": 1,
      "quantity": 1
    }
  ]
}

// Response
{
  "success": true,
  "data": {
    "refund_id": 50,
    "transaction_id": 1001,
    "refund_amount": 13000,
    "status": "completed"
  }
}
```

**POST** `/transactions/:id/void`
- **Role Required**: Admin only
- **Description**: Batalkan transaksi

## Promos
**GET** `/promos`
- **Role Required:** All

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "DISKON10",
      "name": "Diskon 10% Akhir Tahun",
      "type": "percentage", // percentage, fixed, buy_x_get_y
      "value": 10,
      "min_purchase": 100000,
      "max_discount": 50000,
      "valid_from": "2025-10-01T00:00:00Z",
      "valid_until": "2025-12-31T23:59:59Z",
      "is_active": true,
      "usage_limit": 1000,
      "usage_count": 245
    }
  ]
}
```

**POST** `/promos/validate`
- **Role Required:** Cashier

```json
// Request
{
  "promo_code": "DISKON10",
  "subtotal": 150000,
  "items": [...]
}

// Response
{
  "success": true,
  "data": {
    "is_valid": true,
    "promo": {
      "id": 1,
      "code": "DISKON10",
      "type": "percentage",
      "value": 10
    },
    "discount_amount": 15000,
    "final_total": 135000,
    "message": "Promo berhasil diterapkan"
  }
}
```

**POST** `/promos`
- **Role Required:** Admin **PUT** `/promos/:id`
- **Role Required:** Admin **DELETE** `/promos/:id`
- **Role Required:** Admin

## Reports (Admin & specific for Warehouse)
**GET** `/reports/sales`
- **Role Required:** Admin

```json
// Query Parameters
?start_date=2025-10-01&end_date=2025-10-24&group_by=daily

// Response
{
  "success": true,
  "data": {
    "total_revenue": 125000000,
    "total_transactions": 450,
    "avg_transaction": 277777,
    "total_profit": 25000000,
    "daily_breakdown": [
      {
        "date": "2025-10-24",
        "revenue": 8800000,
        "transactions": 15,
        "items_sold": 145
      }
    ]
  }
}
```

**GET** `/report/inventory`
- **Role Required:** Warehouse, Admin
- **Description:** Laporan stok, dead stock, low stock

**GET** `/report/cashier-performance`
- **Role Required:** Admin
- **Description:** Performa masing-masing kasir

**GET** `/report/best-selling`
- **Role Required:** Admin
- **Description:** Produk terlaris

## Dashboard
**GET** `/dashboard/cashier`
- **Role Required:** Cashier

```json
// Response
{
  "success": true,
  "data": {
    "today": {
      "total_sales": 8800000,
      "total_transactions": 15,
      "items_sold": 145
    },
    "this_month": {
      "total_sales": 125000000,
      "total_transactions": 450
    },
    "recent_transactions": [...]
  }
}
```

**GET** `/dashboard/werehouse`
- **Role Required:** Werehouse

```json
// Response
{
  "success": true,
  "data": {
    "total_products": 250,
    "low_stock_products": 12,
    "out_of_stock": 3,
    "stock_value": 45000000,
    "recent_stock_movements": [...]
  }
}
```

**GET** `/dashboard/admin`
- **Role Required:** Admin

```json
// Response
{
  "success": true,
  "data": {
    "today_revenue": 8800000,
    "month_revenue": 125000000,
    "total_transactions": 450,
    "active_promos": 3,
    "low_stock_alerts": 12,
    "charts": {
      "revenue_trend": [...],
      "top_products": [...],
      "cashier_performance": [...]
    }
  }
}
```