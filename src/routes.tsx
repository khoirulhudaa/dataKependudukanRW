import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import SignIn from "views/auth/SignIn";

import {
  MdHome,                    // Beranda
  MdFamilyRestroom,          // Kartu Keluarga
  MdCardGiftcard,            // Bantuan
  MdCategory,                // Jenis Bantuan
  MdPeople,                  // Penerima Bantuan
  MdWeb,                     // Manajemen Konten
  MdArticle,                 // Layanan / Berita
  MdStadium,                 // Fasilitas (olahraga, umum)
  MdVisibility,              // Profile RW (Visi Misi)
  MdBadge,                   // Pegawai RT/RW
  MdForum,                   // Pengaduan (chat)
  MdDescription,             // Template Surat
  MdContactPhone,            // Kontak
  MdAdminPanelSettings,      // Manajemen Admin
  MdPerson,                  // Profile Akun
  MdLock,                    // Sign In
  MdDashboard,               // Dashboard (fallback)
} from "react-icons/md";

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
    name: "Data Master",
    layout: "/admin",
    path: "data-master", // hanya sebagai anchor
    icon: <MdDashboard className="h-6 w-6" />,
    subRoutes: [
      {
        name: "Kartu Keluarga",
        layout: "/admin",
        path: "data-kartu-keluarga",
        icon: <MdFamilyRestroom className="h-6 w-6" />,
        component: <DataKK />,
      },
      // Tambahkan KTP, Akta, dll nanti di sini
    ],
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
        name: "Berita",
        layout: "/admin",
        path: "berita",
        icon: <MdArticle className="h-6 w-6" />,
        component: <BeritaPage />,
      },
      {
        name: "Fasilitas",
        layout: "/admin",
        path: "fasilitas",
        icon: <MdStadium className="h-6 w-6" />,
        component: <FasilitasPage />,
      },
      {
        name: "Profile RW",
        layout: "/admin",
        path: "profile-rw",
        icon: <MdVisibility className="h-6 w-6" />,
        component: <VisiMisiPage />,
      },
      {
        name: "Pegawai RT",
        layout: "/admin",
        path: "data-pegawai-rt",
        icon: <MdBadge className="h-6 w-6" />,
        component: <PegawaiRTPage />,
      },
      {
        name: "Pegawai RW",
        layout: "/admin",
        path: "data-pegawai-rw",
        icon: <MdBadge className="h-6 w-6" />,
        component: <PegawaiRWPage />,
      },
    ],
  },

  // ==================== MENU UTAMA LAINNYA ====================
  {
    name: "Data Pengaduan",
    layout: "/admin",
    path: "pengaduan",
    icon: <MdForum className="h-6 w-6" />,
    component: <PengaduanPage />,
  },
  {
    name: "Template Surat",
    layout: "/admin",
    path: "template-surat",
    icon: <MdDescription className="h-6 w-6" />,
    component: <TemplateSurat />,
  },
  {
    name: "Data Kontak",
    layout: "/admin",
    path: "kontak",
    icon: <MdContactPhone className="h-6 w-6" />,
    component: <KontakPage />,
  },
  {
    name: "Manajemen Admin",
    layout: "/admin",
    path: "akun",
    icon: <MdAdminPanelSettings className="h-6 w-6" />,
    component: <AdminPage />,
  },
  {
    name: "Profile Akun",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];

export default routes;