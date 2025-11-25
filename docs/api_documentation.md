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