// components/layout/BottomNav.tsx
import { Link, useLocation } from "react-router-dom";
import {
  MdHome,
  MdFamilyRestroom,
  MdForum,
  MdDescription,
  MdCardGiftcard,
} from "react-icons/md";

interface BottomNavItem {
  name: string;
  path: string; // full path: /admin/xxx
  icon: React.ReactNode;
}

const bottomNavItems: BottomNavItem[] = [
  {
    name: "Beranda",
    path: "/admin/default",
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: "Penduduk",
    path: "/admin/data-kependudukan",
    icon: <MdFamilyRestroom className="h-6 w-6" />,
  },
  {
    name: "Pengaduan",
    path: "/admin/pengaduan",
    icon: <MdForum className="h-6 w-6" />,
  },
  {
    name: "Surat",
    path: "/admin/pengajuan-surat",
    icon: <MdDescription className="h-6 w-6" />,
  },
  {
    name: "Bantuan",
    path: "/admin/penerima-bantuan", // akan aktif juga di subroute jenis/penerima
    icon: <MdCardGiftcard className="h-6 w-6" />,
  },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-navy-800 dark:border-navy-700 lg:hidden">
      <div className="grid grid-cols-5">
        {bottomNavItems.map((item) => {
          // Cek active: exact match atau parent route (untuk bantuan)
          const isActive =
            location.pathname === item.path ||
            (item.path === "/admin/bantuan-kelurahan" &&
              location.pathname.startsWith("/admin/jenis-bantuan")) ||
            (item.path === "/admin/bantuan-kelurahan" &&
              location.pathname.startsWith("/admin/penerima-bantuan"));

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center py-3 transition-colors"
            >
              <div
                className={`${
                  isActive
                    ? "text-brand-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  isActive
                    ? "text-brand-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;