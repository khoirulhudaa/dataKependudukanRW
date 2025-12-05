// components/layout/BottomNav.tsx
import { Link, useLocation } from "react-router-dom";
import {
  MdHome,
  MdFamilyRestroom,
  MdForum,
  MdDescription,
  MdCardGiftcard,
  MdHdrPlus,
  MdCardMembership,
} from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { IoCardSharp, IoClose, IoIdCard, IoIdCardSharp, IoWarning } from "react-icons/io5";
import { BsCardImage, BsCardText } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import { IoMdCard } from "react-icons/io";

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
    name: "Data KK",
    path: "/admin/data-kk",
    icon: <MdFamilyRestroom className="h-6 w-6" />,
  },
  {
    name: "KTP",
    path: "/admin/pencarian-individu",
    icon: <IoCardSharp className="h-6 w-6" />,
  },
  {
    name: "Konflik",
    path: "/admin/data-bermasalah",
    icon: <IoWarning className="h-6 w-6" />,
  },
  {
    name: "Status",
    path: "/admin/status-kependudukan", // akan aktif juga di subroute jenis/penerima
    icon: <FaUserCheck className="h-6 w-6" />,
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