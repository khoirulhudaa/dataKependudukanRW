
// // Admin Imports
// import MainDashboard from "views/admin/default";
// import Profile from "views/admin/profile";

// // Auth Imports
// import SignIn from "views/auth/SignIn";

// // Icon Imports
// import {
//   MdBackHand,
//   MdCardMembership,
//   MdChat,
//   MdCreditScore,
//   MdFlag,
//   MdHandyman,
//   MdHome,
//   MdHouse,
//   MdLock,
//   MdPerson
// } from "react-icons/md";
// import DataKK from "views/admin/dataKK";
// import DataKTP from "views/admin/dataKTP";
// import KelurahanPage from "views/admin/dataKelurahan";
// import JenisBantuanPage from "views/admin/jenisBantuan";
// import PenerimaBantuan from "views/admin/penerimaBantuan";
// import PengaduanPage from "views/admin/pengaduan";
// import ProvinsiPage from "views/admin/provinsi";

// const routes = [
//   {
//     name: "Main Dashboard",
//     layout: "/admin",
//     path: "default",
//     icon: <MdHome className="h-6 w-6" />,
//     component: <MainDashboard />,
//   },
//   {
//     name: "Kartu Keluarga",
//     layout: "/admin",
//     icon: <MdCardMembership className="h-6 w-6" />,
//     path: "data-kartu-keluarga",
//     component: <DataKK />,
//   },
//   {
//     name: "Kartu Tanda Penduduk",
//     layout: "/admin",
//     icon: <MdCreditScore className="h-6 w-6" />,
//     path: "data-kartu-tanda-penduduk",
//     component: <DataKTP />,
//   },
//   {
//     name: "Jenis Bantuan",
//     layout: "/admin",
//     icon: <MdHandyman className="h-6 w-6" />,
//     path: "jenis-bantuan",
//     component: <JenisBantuanPage />,
//   },
//   {
//     name: "Penerima Bantuan",
//     layout: "/admin",
//     icon: <MdBackHand className="h-6 w-6" />,
//     path: "penerima-bantuan",
//     component: <PenerimaBantuan />,
//   },
//   {
//     name: "Data Kelurahan",
//     layout: "/admin",
//     icon: <MdHouse className="h-6 w-6" />,
//     path: "kelurahan",
//     component: <KelurahanPage />,
//   },
//   {
//     name: "Data Provinsi",
//     layout: "/admin",
//     icon: <MdFlag className="h-6 w-6" />,
//     path: "provinsi",
//     component: <ProvinsiPage />,
//   },
//   {
//     name: "Data Pengaduan",
//     layout: "/admin",
//     icon: <MdChat className="h-6 w-6" />,
//     path: "pengaduan",
//     component: <PengaduanPage />,
//   },
//   {
//     name: "Profile",
//     layout: "/admin",
//     path: "profile",
//     icon: <MdPerson className="h-6 w-6" />,
//     component: <Profile />,
//   },
//   {
//     name: "Sign In",
//     layout: "/auth",
//     path: "sign-in",
//     icon: <MdLock className="h-6 w-6" />,
//     component: <SignIn />,
//   },
// ];
// export default routes;




// routes.ts
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import SignIn from "views/auth/SignIn";

import {
  MdAddCard,
  MdBackHand,
  MdBarChart,
  MdCardMembership,
  MdChat,
  MdFilePresent,
  MdHome,
  MdKey,
  MdLock,
  MdMan,
  MdMenu,
  MdNewspaper,
  MdNumbers,
  MdPerson,
  MdPictureAsPdf,
  MdSportsBaseball,
  MdVisibility,
  MdWeb
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
import StatistikPage from "views/admin/statistik";
import TemplateSurat from "views/admin/templateSurat";
import VisiMisiPage from "views/admin/visiMisi";
import SignUp from "views/auth/SignUp";

const routes: any[] = [
  {
    name: "Halaman Utama",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  // ==================== MENU DENGAN SUBMENU ====================
  {
    name: "Data Master",
    layout: "/admin",
    path: "data-master",                 // tidak wajib diklik
    icon: <MdCardMembership className="h-6 w-6" />,
    subRoutes: [
      {
        name: "Kartu Keluarga",
        layout: "/admin",
        path: "data-kartu-keluarga",
        icon: <MdFilePresent className="h-6 w-6" />,
        component: <DataKK />,
      },
      // {
      //   name: "Statistik",
      //   layout: "/admin",
      //   icon: <MdBarChart className="h-6 w-6" />,
      //   path: "statistik",
      //   component: <StatistikPage />,
      // },
      // {
      //   name: "KTP",
      //   layout: "/admin",
      //   path: "data-kartu-tanda-penduduk",
      //   icon: <MdFilePresent className="h-6 w-6" />,
      //   component: <DataKTP />,
      // },
      // {
      //   name: "Kelurahan",
      //   layout: "/admin",
      //   path: "kelurahan",
      //   icon: <MdFilePresent className="h-6 w-6" />,
      //   component: <KelurahanPage />,
      // },
      // {
      //   name: "Provinsi",
      //   layout: "/admin",
      //   path: "provinsi",
      //   icon: <MdFilePresent className="h-6 w-6" />,
      //   component: <ProvinsiPage />,
      // },
    ],
  },
  {
    name: "Bantuan Kelurahan",
    layout: "/admin",
    path: "data-master",                 // tidak wajib diklik
    icon: <MdCardMembership className="h-6 w-6" />,
    subRoutes: [
      {
        name: "Jenis Bantuan",
        layout: "/admin",
        icon: <MdMenu className="h-6 w-6" />,
        path: "jenis-bantuan",
        component: <JenisBantuanPage />,
      },
      {
        name: "Penerima",
        layout: "/admin",
        icon: <MdBackHand className="h-6 w-6" />,
        path: "penerima-bantuan",
        component: <PenerimaBantuan />,
      },
    ],
  },
  {
    name: "Manajemen Konten",
    layout: "/admin",
    path: "manajemen-konten",                 // tidak wajib diklik
    icon: <MdWeb className="h-6 w-6" />,
    subRoutes: [
      {
        name: "Layanan",
        layout: "/admin",
        icon: <MdMenu className="h-6 w-6" />,
        path: "layanan",
        component: <LayananPage />,
      },
      {
        name: "Berita",
        layout: "/admin",
        icon: <MdNewspaper className="h-6 w-6" />,
        path: "berita",
        component: <BeritaPage />,
      },
      {
        name: "Fasilitas",
        layout: "/admin",
        icon: <MdSportsBaseball className="h-6 w-6" />,
        path: "fasilitias",
        component: <FasilitasPage />,
      },
      {
        name: "Profile RW",
        layout: "/admin",
        icon: <MdVisibility className="h-6 w-6" />,
        path: "profile-RW",
        component: <VisiMisiPage />,
      },
      {
        name: "Pegawai RT",
        layout: "/admin",
        icon: <MdAddCard className="h-6 w-6" />,
        path: "data-pegawai-RT",
        component: <PegawaiRTPage />,
      },
      {
        name: "Pegawai RW",
        layout: "/admin",
        icon: <MdAddCard className="h-6 w-6" />,
        path: "data-pegawai-RW",
        component: <PegawaiRWPage />,
      },
    ],
  },
  // ==================== MENU LAIN ====================
  {
    name: "Data Pengaduan",
    layout: "/admin",
    icon: <MdChat className="h-6 w-6" />,
    path: "pengaduan",
    component: <PengaduanPage />,
  },
  {
    name: "Template Surat",
    layout: "/admin",
    icon: <MdPictureAsPdf className="h-6 w-6" />,
    path: "template-surat",
    component: <TemplateSurat />,
  },
  {
    name: "Data Kontak",
    layout: "/admin",
    icon: <MdNumbers className="h-6 w-6" />,
    path: "kontak",
    component: <KontakPage />,
  },
  {
    name: "Manajemen Admin",
    layout: "/admin",
    icon: <MdMan className="h-6 w-6" />,
    path: "akun",
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
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdKey className="h-6 w-6" />,
    component: <SignUp />,
  },
];

export default routes;