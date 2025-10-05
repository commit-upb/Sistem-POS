# Sistem Point of Sale (POS) Sederhana

Selamat datang di Proyek Sistem Point of Sale (POS) Sederhana. Aplikasi ini dirancang untuk membantu mengelola transaksi penjualan, stok barang, dan manajemen data lainnya untuk usaha kecil hingga menengah.

Proyek ini dibangun dengan arsitektur modern yang memisahkan antara antarmuka pengguna (Frontend) dan logika server (Backend) dalam satu repositori (monorepo).

## ✨ Fitur Utama (Rencana)

- **Manajemen Transaksi**: Melakukan dan mencatat transaksi penjualan
- **Manajemen Produk**: Mengelola data produk, kategori, dan stok barang
- **Manajemen Pelanggan**: Menyimpan data pelanggan setia
- **Manajemen Supplier**: Mengelola data pemasok barang
- **Laporan**: Menghasilkan laporan penjualan dan stok
- **Manajemen Pengguna**: Sistem hak akses untuk Admin, Kasir, dan Gudang

## 🚀 Teknologi yang Digunakan

| Bagian | Teknologi Utama |
|--------|----------------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (melalui Prisma ORM) |
| Lainnya | Concurrently (untuk menjalankan multi-proyek) |

## 📂 Struktur Proyek

Proyek ini diorganisir sebagai monorepo dengan dua direktori utama:

```
Sistem-POS/
├── backend/         # Semua kode sisi server (API, database, logika bisnis)
├── frontend/        # Semua kode sisi klien (UI, komponen React)
├── package.json     # "Manajer" untuk menjalankan skrip frontend & backend
└── README.md        # Dokumentasi
```

Setiap folder (frontend dan backend) memiliki `package.json`-nya sendiri untuk mengelola dependensinya masing-masing.

## 🛠️ Instalasi & Pengaturan

Ikuti langkah-langkah berikut untuk menjalankan app ini.

### 1. Prasyarat

Install dependensi yang diperlukan:

- Node.js (disarankan versi LTS)
- npm (biasanya terinstal bersama Node.js)
- PostgreSQL atau Docker untuk menjalankan database

### 2. Clone Repositori

```bash
git clone https://github.com/commit-upb/Sistem-POS.git
cd Sistem-POS
```

### 3. Instal Dependensi

Jalankan perintah berikut dari folder root (`Sistem-POS/`). Perintah ini akan menginstal dependensi untuk root, frontend, dan backend sekaligus.

```bash
npm install
```

### 4. Konfigurasi Backend & Database

**a.** Pindah ke direktori backend:

```bash
cd backend
```

**b.** Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

**c.** Buka file `.env` dan sesuaikan nilai `DATABASE_URL` dengan konfigurasi database PostgreSQL:

```env
# Contoh DATABASE_URL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**d.** Jalankan migrasi database untuk membuat semua tabel yang diperlukan:

```bash
npm run prisma:migrate
```

**e.** Kembali ke direktori root:

```bash
cd ..
```

## ▶️ Menjalankan Aplikasi

Untuk menjalankan server backend dan frontend secara bersamaan, cukup jalankan perintah berikut dari folder root (`Sistem-POS/`):

```bash
npm run dev
```

Perintah ini akan:

- Memulai server backend pada `http://localhost:5000` 
- Memulai server development frontend pada `http://localhost:5173`

Buka `http://localhost:5173` di browser untuk melihat aplikasi.

## 📜 Skrip yang Tersedia

Berikut adalah daftar skrip yang dapat jalankan dari folder root:

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Menjalankan server frontend dan backend secara bersamaan |
| `npm run dev:fe` | Hanya menjalankan server development frontend |
| `npm run dev:be` | Hanya menjalankan server development backend |
| `npm run build:fe` | Mem-build aplikasi frontend untuk produksi |
| `npm run build:be` | Meng-compile kode TypeScript backend menjadi JavaScript |
| `npm run start:be` | Menjalankan server backend dari kode yang sudah di-build |
| `npm run migrate:be` | Menjalankan migrasi database Prisma |
| `npm run studio:be` | Membuka Prisma Studio untuk melihat dan mengelola data |

