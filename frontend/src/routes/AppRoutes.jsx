import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Import halaman Home
import HomePage from "../pages/HomePage";

// Import halaman Login
import LoginPage from "../pages/LoginPage";

// Import halaman Kasir
import DashboardKasir from "../pages/kasir/DashboardKasir";
import Transaksi from "../pages/kasir/Transaksi";
import RiwayatTransaksi from "../pages/kasir/RiwayatTransaksi";
import Pelanggan from "../pages/kasir/Pelanggan";
import ProdukReadOnly from "../pages/kasir/ProdukReadOnly";
import PengaturanKasir from "../pages/kasir/PengaturanKasir";

// Import halaman Gudang
import DashboardGudang from "../pages/gudang/DashboardGudang";
import ProdukGudang from "../pages/gudang/ProdukGudang";
import Kategori from "../pages/gudang/Kategori";
import Supplier from "../pages/gudang/Supplier";
import Pembelian from "../pages/gudang/Pembelian";
import StokMasukKeluar from "../pages/gudang/StokMasukKeluar";
import LaporanStok from "../pages/gudang/LaporanStok";

// Import halaman Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import TransaksiSemua from "../pages/admin/TransaksiSemua";
import ProdukAdmin from "../pages/admin/ProdukAdmin";
import KategoriAdmin from "../pages/admin/KategoriAdmin";
import GudangAdmin from "../pages/admin/GudangAdmin";
import PelangganAdmin from "../pages/admin/PelangganAdmin";
import SupplierAdmin from "../pages/admin/SupplierAdmin";
import PembelianAdmin from "../pages/admin/PembelianAdmin";
import LaporanKeuangan from "../pages/admin/LaporanKeuangan";
import KasKeuangan from "../pages/admin/KasKeuangan";
import ManajemenUser from "../pages/admin/ManajemenUser";
import PengaturanSistem from "../pages/admin/PengaturanSistem";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman utama (pilih role) */}
        <Route path="/" element={<HomePage />} />

        {/* Redirect agar /login memilih role terlebih dahulu */}
        <Route path="/login" element={<Navigate to="/" />} />

        {/* Login */}
        <Route path="/login/:role" element={<LoginPage />} />

        {/* Kasir Routes */}
        <Route path="/kasir" element={<DashboardKasir />} />
        <Route path="/kasir/transaksi" element={<Transaksi />} />
        <Route path="/kasir/riwayat" element={<RiwayatTransaksi />} />
        <Route path="/kasir/pelanggan" element={<Pelanggan />} />
        <Route path="/kasir/produk" element={<ProdukReadOnly />} />
        <Route path="/kasir/pengaturan" element={<PengaturanKasir />} />

        {/* Gudang Routes */}
        <Route path="/gudang" element={<DashboardGudang />} />
        <Route path="/gudang/produk" element={<ProdukGudang />} />
        <Route path="/gudang/kategori" element={<Kategori />} />
        <Route path="/gudang/supplier" element={<Supplier />} />
        <Route path="/gudang/pembelian" element={<Pembelian />} />
        <Route path="/gudang/stok" element={<StokMasukKeluar />} />
        <Route path="/gudang/laporan" element={<LaporanStok />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/transaksi" element={<TransaksiSemua />} />
        <Route path="/admin/produk" element={<ProdukAdmin />} />
        <Route path="/admin/kategori" element={<KategoriAdmin />} />
        <Route path="/admin/gudang" element={<GudangAdmin />} />
        <Route path="/admin/pelanggan" element={<PelangganAdmin />} />
        <Route path="/admin/supplier" element={<SupplierAdmin />} />
        <Route path="/admin/pembelian" element={<PembelianAdmin />} />
        <Route path="/admin/laporan-keuangan" element={<LaporanKeuangan />} />
        <Route path="/admin/kas" element={<KasKeuangan />} />
        <Route path="/admin/user" element={<ManajemenUser />} />
        <Route path="/admin/pengaturan" element={<PengaturanSistem />} />
      </Routes>
    </BrowserRouter>
  );
}
