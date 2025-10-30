import DashIcon from "components/icons/DashIcon";
import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

type LinksProps = { routes: any[] };

export const Links = ({ routes }: LinksProps): JSX.Element => {
  const location = useLocation();

  // DEFAULT: SEMUA SUBMENU TERBUKA
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    routes.forEach((r) => {
      if (r.subRoutes?.length) init[r.name] = true;
    });
    return init;
  });

  const activeRoute = (p: string) => location.pathname.includes(p);
  const toggleMenu = (name: string) =>
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));

  const createLinks = (rts: any[], depth = 0): JSX.Element[] => {
    return rts.map((route, idx) => {
      const key = `${depth}-${idx}`;
      const hasSub = !!route.subRoutes?.length;
      const isOpen = openMenus[route.name] ?? false;
      const isActive = activeRoute(route.path);

      // Hanya tampilkan layout yang diizinkan
      if (!["/admin", "/auth", "/rtl"].includes(route.layout)) return null;

      /* ---------- MENU DENGAN SUBMENU ---------- */
      if (hasSub) {
        return (
          <div key={key} className="mb-2">
            {/* Header (bisa diklik untuk expand/collapse) */}
            <div
              onClick={() => toggleMenu(route.name)}
              className={`
                relative flex cursor-pointer items-center rounded-md px-3 py-2
                transition-colors hover:bg-gray-100 dark:hover:bg-navy-700
                ${isActive ? "bg-gray-50 dark:bg-navy-700" : ""}
              `}
            >
              <span
                className={`${
                  isActive ? "text-brand-500 dark:text-white" : "text-gray-600"
                }`}
              >
                {route.icon || <DashIcon />}
              </span>
              <p
                className={`
                  ml-3 flex-1 text-sm font-medium
                  ${isActive ? "text-navy-700 dark:text-white" : "text-gray-600"}
                `}
              >
                {route.name}
              </p>
              <span className="text-gray-500">
                {isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
              </span>
            </div>

            {/* ---------- SUBMENU ---------- */}
            <div
              className={`
                overflow-hidden transition-all duration-300
                ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
              `}
            >
              <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-white/20 pl-4">
                {createLinks(route.subRoutes!, depth + 1)}
              </div>
            </div>
          </div>
        );
      }

      /* ---------- ITEM TANPA SUBMENU (atau SUB-ITEM) ---------- */
      return (
        <Link key={key} to={`${route.layout}/${route.path}`}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-3">
              <span
                className={`${
                  isActive
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {route.icon ? route.icon : <DashIcon />}
              </span>
              <p
                className={`
                  ml-4 flex leading-1
                  ${isActive
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"}
                `}
              >
                {route.name}
              </p>
            </li>

            {/* Indikator aktif di sisi kanan */}
            {isActive && (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            )}
          </div>
        </Link>
      );
    });
  };

  return <>{createLinks(routes)}</>;
};

export default Links;