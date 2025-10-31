import MainDashboard from "views/admin/default";

import {
  MdAdminPanelSettings, // Manajemen Konten
  MdArticle, // Profile RW (Visi Misi)
  MdBadge, // Kartu Keluarga
  MdCardGiftcard, // Bantuan
  MdCategory, // Template Surat
  MdContactPhone, // Sign In
  MdDashboard, // Pengaduan (chat)
  MdDescription, // Beranda
  MdFamilyRestroom, // Pegawai RT/RW
  MdForum,
  MdHome, MdNotes, // Jenis Bantuan
  MdPeople, // Layanan / Berita
  MdStadium, MdSystemUpdate, // Penerima Bantuan
  MdWeb
} from "react-icons/md";

import { IoMdGlobe } from "react-icons/io";
import BeritaPage from "views/admin/berita";
import DataKK from "views/admin/dataKK";
import FasilitasPage from "views/admin/fasilitas";
import JenisBantuanPage from "views/admin/jenisBantuan";
import KontakPage from "views/admin/kontak";
import LayananPage from "views/admin/layanan";
import AdminPage from "views/admin/manajemenAdmin";
import PegawaiRTPage from "views/admin/pegawaiRT";
import PegawaiRWPage from "views/admin/pegawaiRW";
import PenerimaBantuan from "views/admin/penerimaBantuan";
import PengaduanPage from "views/admin/pengaduan";
import TemplateSurat from "views/admin/templateSurat";
import VisiMisiPage from "views/admin/visiMisi";
import MutasiPenduduk from "views/admin/mutasi";
import StatusPenduduk from "views/admin/statusPenduduk";
import AnggotaDetailPage from "views/admin/statusPenduduk";
import PengajuanSuratPage from "views/admin/templateSurat";

const routes: any = [
  // ==================== DASHBOARD ====================
  {
    name: "Halaman Utama",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },

  // ==================== DATA MASTER ====================
  {
    name: "Data Kependudukan",
    layout: "/admin",
    path: "data-kependudukan",
    icon: <MdFamilyRestroom className="h-6 w-6" />,
    component: <DataKK />,
  },
  {
    name: "Detail anggota",
    layout: "/admin",
    path: "detail-anggota",
    icon: <MdNotes className="h-6 w-6" />,
    component: <AnggotaDetailPage />,
  },
  // ==================== BANTUAN KELURAHAN ====================
  {
    name: "Bantuan Kelurahan",
    layout: "/admin",
    path: "bantuan-kelurahan",
    icon: <MdCardGiftcard className="h-6 w-6" />,
    subRoutes: [
      {
        name: "Jenis Bantuan",
        layout: "/admin",
        path: "jenis-bantuan",
        icon: <MdCategory className="h-6 w-6" />,
        component: <JenisBantuanPage />,
      },
      {
        name: "Penerima",
        layout: "/admin",
        path: "penerima-bantuan",
        icon: <MdPeople className="h-6 w-6" />,
        component: <PenerimaBantuan />,
      },
    ],
  },

  // ==================== MANAJEMEN KONTEN ====================
  {
    name: "Manajemen Konten",
    layout: "/admin",
    path: "manajemen-konten",
    icon: <MdWeb className="h-6 w-6" />,
    subRoutes: [
      {
        name: "Layanan",
        layout: "/admin",
        path: "layanan",
        icon: <MdArticle className="h-6 w-6" />,
        component: <LayananPage />,
      },
      {
        name: "Fasilitas",
        layout: "/admin",
        path: "fasilitas",
        icon: <MdStadium className="h-6 w-6" />,
        component: <FasilitasPage />,
      },
      {
        name: "Biodata RW",
        layout: "/admin",
        path: "biodata-rw",
        icon: <IoMdGlobe className="h-6 w-6" />,
        component: <VisiMisiPage />,
      },
      {
        name: "Pengurus RT",
        layout: "/admin",
        path: "data-Pengurus-rt",
        icon: <MdBadge className="h-6 w-6" />,
        component: <PegawaiRTPage />,
      },
      {
        name: "Pengurus RW",
        layout: "/admin",
        path: "data-Pengurus-rw",
        icon: <MdBadge className="h-6 w-6" />,
        component: <PegawaiRWPage />,
      },
    ],
  },
  {
    name: "Berita",
    layout: "/admin",
    path: "berita",
    icon: <MdArticle className="h-6 w-6" />,
    component: <BeritaPage />,
  },

  // ==================== MENU UTAMA LAINNYA ====================
  {
    name: "Mutasi Penduduk",
    layout: "/admin",
    path: "mutaasi-penduduk",
    icon: <MdSystemUpdate className="h-6 w-6" />,
    component: <MutasiPenduduk />,
  },
  {
    name: "Data Pengaduan",
    layout: "/admin",
    path: "pengaduan",
    icon: <MdForum className="h-6 w-6" />,
    component: <PengaduanPage />,
  },
  {
    name: "pengajuan Surat",
    layout: "/admin",
    path: "pengajuan-surat",
    icon: <MdDescription className="h-6 w-6" />,
    component: <PengajuanSuratPage />,
  },
  {
    name: "Manajemen Admin",
    layout: "/admin",
    path: "akun",
    icon: <MdAdminPanelSettings className="h-6 w-6" />,
    component: <AdminPage />,
  },
  {
    name: "Data Kontak RW",
    layout: "/admin",
    path: "kontak",
    icon: <MdContactPhone className="h-6 w-6" />,
    component: <KontakPage />,
  },
];

export default routes;