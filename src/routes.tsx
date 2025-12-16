import { BsVirus } from "react-icons/bs";
import { IoWarning } from "react-icons/io5";
import {
  MdAccessibilityNew,
  MdAccountBox,
  MdAdminPanelSettings,
  MdBadge,
  MdBarChart,
  MdDiversity3,
  MdElderly,
  MdFamilyRestroom,
  MdFlashOn,
  MdGroup,
  MdHome,
  MdHomeWork,
  MdLocalHospital,
  MdPaid,
  MdPeople,
  MdPersonSearch,
  MdPregnantWoman,
  MdSchool,
  MdSupervisorAccount,
  MdWarning,
  MdWork,
} from "react-icons/md";

import DataBermasalah from "views/admin/dataBermasalah";
import DataKK from "views/admin/dataKK";
import MainDashboard from "views/admin/default";
import KesehatanDisabilitas from "views/admin/disabilitias";
import JenisKelaminAgama from "views/admin/jenisKelamin";
import KelompokUsia from "views/admin/kelompokUsia";
import KondisiRumah from "views/admin/kondisiRumah";
import KesehatanKronis from "views/admin/kronis";
import KesehatanMenular from "views/admin/menular";
import Pekerjaan from "views/admin/pekerjaan";
import PencarianIndividu from "views/admin/pencarianDataInvidual";
import Pendidikan from "views/admin/pendidikan";
import KesehatanIbuAnak from "views/admin/programIbuAnak";
import KesehatanLansia from "views/admin/programLansia";
import QuickAccess from "views/admin/quickAccess";
import StatusEkonomi from "views/admin/statusEkonomi";
import StatusKependudukan from "views/admin/statusKependudukan";

import KarangTarunaPage from "views/admin/karangtaruna";
import ManajemenAdmin from "views/admin/manajemenAdmin";
import PegawaiRTPage from "views/admin/pegawaiRT";
import PegawaiRWPage from "views/admin/pegawaiRW";
import ProfileOverview from "views/admin/profile";

const routes: any = [
  // ==============================
  // Dashboard di root URL "/"
  // ==============================
  {
    name: "Halaman Utama",
    layout: "/admin",
    path: "/",                              // ← Sekarang langsung ke root
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    layout: "/admin",
    path: "/profile",                              // ← Sekarang langsung ke root
    component: <ProfileOverview />,
  },

  // ==============================
  // Menu Utama: Data Kependudukan
  // ==============================
  {
    name: "Data Kependudukan",
    layout: "/admin",
    path: "data-kependudukan",
    icon: <MdPeople className="h-6 w-6" />,
    subRoutes: [
      // ───────────────────────────────────────────────
      // Submenu 1: Data Utama
      // ───────────────────────────────────────────────
      {
        name: "Data Utama",
        icon: <MdBadge className="h-6 w-6" />,
        subRoutes: [
          {
            name: "Daftar KK",
            path: "data-kk",
            layout: "/admin",
            icon: <MdFamilyRestroom className="h-5 w-5" />,
            component: <DataKK />,
          },
          {
            name: "Pencarian Individu",
            path: "pencarian-individu",
            layout: "/admin",
            icon: <MdPersonSearch className="h-5 w-5" />,
            component: <PencarianIndividu />,
          },
          {
            name: "Data Bermasalah",
            path: "data-bermasalah",
            layout: "/admin",
            icon: <MdWarning className="h-5 w-5 text-red-500" />,
            component: <DataBermasalah />,
          },
        ],
      },

      // ───────────────────────────────────────────────
      // Submenu 2: Analisis Demografi
      // ───────────────────────────────────────────────
      {
        name: "Analisis Demografi",
        icon: <MdBarChart className="h-6 w-6" />,
        subRoutes: [
          {
            name: "Kelompok Usia",
            path: "kelompok-usia",
            layout: "/admin",
            icon: <MdSupervisorAccount className="h-5 w-5" />,
            component: <KelompokUsia />,
          },
          {
            name: "Status Penduduk",
            path: "status-kependudukan",
            layout: "/admin",
            icon: <MdBadge className="h-5 w-5" />,
            component: <StatusKependudukan />,
          },
          {
            name: "Kelamin & Agama",
            path: "jenis-kelamin-agama",
            layout: "/admin",
            icon: <MdDiversity3 className="h-5 w-5" />,
            component: <JenisKelaminAgama />,
          },
        ],
      },

      // ───────────────────────────────────────────────
      // Submenu 3: Sosial Ekonomi
      // ───────────────────────────────────────────────
      {
        name: "Sosial Ekonomi",
        icon: <MdPaid className="h-6 w-6" />,
        subRoutes: [
          {
            name: "Quick Access",
            path: "sosial-quick-access",
            layout: "/admin",
            icon: <MdFlashOn className="h-5 w-5 text-yellow-500" />,
            component: <QuickAccess />,
          },
          {
            name: "Status Ekonomi",
            path: "status-ekonomi-desil",
            layout: "/admin",
            icon: <MdPaid className="h-5 w-5" />,
            component: <StatusEkonomi />,
          },
          {
            name: "Pekerjaan",
            path: "pekerjaan",
            layout: "/admin",
            icon: <MdWork className="h-5 w-5" />,
            component: <Pekerjaan />,
          },
          {
            name: "Pendidikan",
            path: "pendidikan",
            layout: "/admin",
            icon: <MdSchool className="h-5 w-5" />,
            component: <Pendidikan />,
          },
          {
            name: "Kondisi Rumah",
            path: "kondisi-rumah",
            layout: "/admin",
            icon: <MdHomeWork className="h-5 w-5" />,
            component: <KondisiRumah />,
          },
        ],
      },

      // ───────────────────────────────────────────────
      // Submenu 4: Kesehatan
      // ───────────────────────────────────────────────
      {
        name: "Kesehatan",
        icon: <MdLocalHospital className="h-6 w-6" />,
        subRoutes: [
          {
            name: "Prog. Ibu & Anak",
            path: "kesehatan-ibu-anak",
            layout: "/admin",
            icon: <MdPregnantWoman className="h-5 w-5" />,
            component: <KesehatanIbuAnak />,
          },
          {
            name: "Prog. Lansia",
            path: "kesehatan-lansia",
            layout: "/admin",
            icon: <MdElderly className="h-5 w-5" />,
            component: <KesehatanLansia />,
          },
          {
            name: "Disabilitas",
            path: "kesehatan-disabilitas",
            layout: "/admin",
            icon: <MdAccessibilityNew className="h-5 w-5" />,
            component: <KesehatanDisabilitas />,
          },
          {
            name: "Kronis",
            path: "kesehatan-kronis",
            layout: "/admin",
            icon: <IoWarning className="h-5 w-5 text-orange-600" />,
            component: <KesehatanKronis />,
          },
          {
            name: "Menular",
            path: "kesehatan-menular",
            layout: "/admin",
            icon: <BsVirus className="h-5 w-5" />,
            component: <KesehatanMenular />,
          },
        ],
      },

      // ───────────────────────────────────────────────
      // Submenu 5: Organisasi & Manajemen (BARU)
      // ───────────────────────────────────────────────
      {
        name: "Data Pengguna",
        icon: <MdGroup className="h-6 w-6" />,
        subRoutes: [
          {
            name: "Organisasi RT",
            path: "organisasi-rt",
            layout: "/admin",
            icon: <MdAccountBox className="h-5 w-5" />,
            component: <PegawaiRTPage />,
          },
          {
            name: "Organisasi RW",
            path: "organisasi-rw",
            layout: "/admin",
            icon: <MdAccountBox className="h-5 w-5" />,
            component: <PegawaiRWPage />,
          },
          // {
          //   name: "Karang Taruna",
          //   path: "karang-taruna",
          //   layout: "/admin",
          //   icon: <MdAccountBox className="h-5 w-5" />,
          //   component: <KarangTarunaPage />,
          // },
          {
            name: "Manajemen Admin",
            path: "manajemen-admin",
            layout: "/admin",
            icon: <MdAdminPanelSettings className="h-5 w-5" />,
            component: <ManajemenAdmin />,
          },
        ],
      },
    ],
  },
];

export default routes;