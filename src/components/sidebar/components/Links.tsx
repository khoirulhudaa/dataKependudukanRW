// import { useState, useCallback, useMemo } from "react";
// import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
// import { Link, useLocation } from "react-router-dom";
// import DashIcon from "components/icons/DashIcon";

// interface Route {
//   name: string;
//   path: string;
//   layout: string;
//   icon?: React.ReactNode;
//   subRoutes?: Route[];
// }

// interface LinksProps {
//   routes: any[];
//   onLinkClick?: () => void;   // <-- tambahkan ini
// }

// const Links = ({ routes, onLinkClick }: LinksProps) => {
//   const location = useLocation();

//   // Inisialisasi: semua submenu terbuka secara default
//   const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
//     const init: Record<string, boolean> = {};
//     routes.forEach((r) => {
//       if (r.subRoutes?.length) init[r.name] = true;
//     });
//     return init;
//   });

//   // Cek apakah route aktif
//   const isActiveRoute = useCallback(
//     (path: string) => location.pathname.includes(path),
//     [location.pathname]
//   );

//   const handleClick = () => {
//     // Hanya close otomatis di mobile (lebar < xl = 1280px)
//     if (window.innerWidth < 1280 && onLinkClick) {
//       onLinkClick();
//     }
//   };

//   // Toggle submenu
//   const toggleMenu = useCallback((name: string) => {
//     setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
//   }, []);

//   // Filter hanya layout yang diizinkan
//   const filteredRoutes = useMemo(
//     () =>
//       routes.filter((route) =>
//         ["/admin", "/auth", "/rtl"].includes(route.layout)
//       ),
//     [routes]
//   );

//   // Render rekursif menu
//   const renderLinks = (items: Route[], depth = 0): JSX.Element[] => {
//     return items
//     .filter((route) => {
//       return route.name && (route.icon || route.subRoutes?.length);
//     })
//     .map((route, idx) => {
//       const key = `${depth}-${idx}`;
//       const hasSub = !!route.subRoutes?.length;
//       const isOpen = openMenus[route.name] ?? false;
//       const isActive = isActiveRoute(route.path);

//       if (hasSub) {
//         return (
//           <div key={key} className="mb-2">
//             {/* Menu Header */}
//             <button
//               onClick={() => toggleMenu(route.name)}
//               className={`
//                 flex w-full items-center rounded-md px-3 py-2 text-left transition-colors
//                 hover:bg-gray-100 dark:hover:bg-navy-700
//                 ${isActive ? "bg-gray-50 dark:bg-navy-700" : ""}
//               `}
//               aria-expanded={isOpen}
//               aria-controls={`submenu-${key}`}
//             >
//               <span
//                 className={`${
//                   isActive
//                     ? "text-blue-500 dark:text-white"
//                     : "text-gray-600 dark:text-gray-400"
//                 }`}
//               >
//                 {route.icon ?? <DashIcon />}
//               </span>
//               <span
//                 className={`
//                   ml-3 flex-1 text-sm font-medium
//                   ${isActive ? "text-navy-700 dark:text-white" : "text-gray-700 dark:text-gray-300"}
//                 `}
//               >
//                 {route.name}
//               </span>
//               <span className="text-gray-500">
//                 {isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
//               </span>
//             </button>

//             {/* Submenu */}
//             <div
//               id={`submenu-${key}`}
//               className={`
//                 overflow-hidden transition-all duration-300 ease-in-out
//                 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
//               `}
//             >
//               <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-200 pl-4 dark:border-white/20">
//                 {renderLinks(route.subRoutes!, depth + 1)}
//               </div>
//             </div>
//           </div>
//         );
//       }

//       // Item tanpa submenu
//       return (
//         <Link
//           key={key}
//           to={`${route.layout}/${route.path}`}
//           className="block"
//           onClick={handleClick}   // <-- ini yang penting
//         >
//           <div
//             className={`
//               relative mb-3 flex items-center px-3 py-2 rounded-md transition-colors
//               hover:bg-gray-100 dark:hover:bg-navy-700
//               ${isActive ? "bg-gray-50 dark:bg-navy-700" : ""}
//             `}
//           >
//             <span
//               className={`${
//                 isActive
//                   ? "text-blue-500 dark:text-white font-bold"
//                   : "text-gray-600 dark:text-gray-400 font-medium"
//               }`}
//             >
//               {route.icon ?? <DashIcon />}
//             </span>
//             <span
//               className={`
//                 ml-4 text-sm
//                 ${isActive ? "font-bold text-navy-700 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}
//               `}
//             >
//               {route.name}
//             </span>

//             {/* Indikator aktif */}
//             {isActive && (
//               <div className="absolute right-0 top-0 h-full w-1 rounded-l-lg bg-blue-500" />
//             )}
//           </div>
//         </Link>
//       );
//     });
//   };

//   return <ul className="space-y-1">{renderLinks(filteredRoutes)}</ul>;
// };

// export default Links;

// components/sidebar/components/Links.tsx
import { useCallback, useMemo, useState } from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdPeople,
  MdBadge,
  MdWarning,
  MdFamilyRestroom,
  MdAttachMoney,
  MdSchool,
  MdHomeRepairService,
  MdHealthAndSafety,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

interface RouteItem {
  name: string;
  layout: string;
  path?: string;
  icon?: React.ReactNode;
  subRoutes?: RouteItem[];
  badge?: string;
}

interface LinksProps {
  routes: RouteItem[];
  onLinkClick?: () => void;
}

const Links = ({ routes, onLinkClick }: LinksProps) => {
  const location = useLocation();

  // Default: semua menu level 1 & 2 terbuka (biar user langsung lihat semua)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = useCallback((name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const isRouteActive: any = useCallback(
    (routePath?: string, subRoutes?: RouteItem[]) => {
      if (!routePath) return false;
      const fullPath = routePath.startsWith("/")
        ? routePath
        : `/admin/${routePath}`;
      if (location.pathname.startsWith(fullPath)) return true;

      // Cek juga di subRoutes (penting untuk nesting 3 level)
      return subRoutes?.some((sub) =>
        isRouteActive(sub.path, sub.subRoutes)
      );
    },
    [location.pathname]
  );

  const buildFullPath = (layout: string, path?: string) => {
    if (!path) return "#";
    return `${layout}/${path}`;
  };

  const renderLinks = (items: RouteItem[], depth = 0): JSX.Element[] => {
    return items
      .filter((r) => r.name && (r.icon || r.subRoutes?.length))
      .map((route, idx) => {
        const key = `${depth}-${idx}`;
        const hasSub = !!route.subRoutes?.length;
        const isOpen = openMenus[route.name] ?? true; // default open
        const isActive = isRouteActive(route.path, route.subRoutes);

        if (hasSub) {
          return (
            <div key={key} className="mb-2 pr-2 overflow-auto">
              {/* Parent Menu */}
              <button
                onClick={() => toggleMenu(route.name)}
                className={`
                  flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all
                  ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700"}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-blue-600" : ""}>
                    {route.icon}
                  </span>
                  <span>{route.name}</span>
                </div>
                {isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
              </button>

              {/* Submenu */}
              <div
                className={`overflow-auto transition-all duration-300 ${
                  isOpen ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-1 space-y-1 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
                  {renderLinks(route.subRoutes!, depth + 1)}
                </div>
              </div>
            </div>
          );
        }

        // Leaf Item
        return (
          <Link
            key={key}
            to={buildFullPath(route.layout, route.path)}
            // onClick={onLinkClick}
            className="block"
          >
            <div
              className={`
                group relative flex items-center gap-3 mr-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                ${isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/30"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-700"
                }
              `}
            >
              <span className={isActive ? "text-blue-600" : ""}>
                {route.icon}
              </span>
              <span className="flex-1">{route.name}</span>

              {/* Badge PALING SERING */}
              {route.badge && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">
                  {route.badge}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
              )}
            </div>
          </Link>
        );
      });
  };

  const menuItems = useMemo(() => renderLinks(routes), [routes, openMenus, isRouteActive]);

  return <div className="mt-4 space-y-3">{menuItems}</div>;
};

export default Links;