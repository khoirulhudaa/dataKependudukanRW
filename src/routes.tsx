import {
  MdBadge,
  MdBarChart,
  MdDiversity3,
  MdFamilyRestroom,
  MdHome,
  MdMan2,
  MdPeople,
  MdPersonSearch,
  MdSupervisorAccount,
  MdWarning
} from "react-icons/md";

import DataBermasalah from "views/admin/dataBermasalah";
import DataKK from "views/admin/dataKK";
import MainDashboard from "views/admin/default";
import JenisKelaminAgama from "views/admin/jenisKelamin";
import KelompokUsia from "views/admin/kelompokUsia";
import PencarianIndividu from "views/admin/pencarianDataInvidual";
import StatusKependudukan from "views/admin/statusKependudukan";

const routes: any = [
  // ==================== DASHBOARD ====================
  {
    name: "Halaman Utama",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },

  // ==================== DATA KEPENDUDUKAN (MENU UTAMA) ====================
  {
    name: "Data Kependudukan",
    layout: "/admin",
    path: "data-kependudukan",
    icon: <MdPeople className="h-6 w-6" />,
    subRoutes: [
      // ─── Submenu 1: Data Utama ───
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

      // ─── Submenu 2: Analisis Demografi ───
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
    ],
  },

  // Menu-menu lain tetap di sini...
];

export default routes;