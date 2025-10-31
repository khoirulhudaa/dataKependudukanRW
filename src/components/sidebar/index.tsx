// import { HiX } from "react-icons/hi";
// import { MdPeople } from "react-icons/md";
// import routes from "routes";
// import Links from "./components/Links";

// const Sidebar = (props: {
//   open: boolean;
//   onClose: React.MouseEventHandler<HTMLSpanElement>;
// }) => {
//   const { open, onClose } = props;

//   return (
//     <div
//       className={`sm:none w-[21vw] duration-175 linear fixed !z-50 flex max-h-screen overflow-auto flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
//         open ? "translate-x-0" : "-translate-x-96"
//       }`}
//     >
//       {/* Close Button */}
//       <span
//         className="absolute top-4 right-4 block cursor-pointer xl:hidden"
//         onClick={onClose}
//       >
//         <HiX className="h-6 w-6" />
//       </span>

//       {/* Logo */}
//       <div className="w-[90%] h-[172.5px] mx-auto rounded-lg flex items-center px-3 text-left backdrop-blur-sm bg-white/70 dark:bg-navy-800/70">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500 dark:bg-brand-500/30">
//             <MdPeople className="h-6 w-6" />
//           </div>
//           <div className="h-max font-poppins text-[20px] font-bold uppercase text-navy-700 dark:text-white">
//             Data <span className="font-medium">Kependudukan</span>
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="w-full border-black/30 border-t mb-7 h-px bg-gray-300 dark:bg-white/30" />

//       {/* SCROLLABLE MENU AREA */}
//       <div className="flex-1 overflow-y-auto px-6 pb-4">
//         <ul className="mb-auto pt-1">
//           <Links routes={routes} />
//         </ul>
//       </div>

//       {/* Optional: Footer (jika ada) */}
//       {/* <div className="px-6 py-4 border-t border-gray-200 dark:border-navy-600">
//         <p className="text-xs text-gray-500">© 2025 RW App</p>
//       </div> */}
//     </div>
//   );
// };

// export default Sidebar;


import { HiX } from "react-icons/hi";
import { MdPeople } from "react-icons/md";
import routes from "routes";
import Links from "./components/Links";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[21vw] max-w-full flex-col overflow-y-auto bg-white pb-10 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-navy-800 dark:text-white xl:translate-x-0 xl:shadow-none ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close Button (Mobile) */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 xl:hidden"
        aria-label="Tutup sidebar"
      >
        <HiX className="h-6 w-6 text-gray-600 dark:text-white" />
      </button>

      {/* Logo */}
      <div className="mx-auto border-b h-[15%] flex justify-center items-center border-black/50 w-[90%]">
        <div className="flex items-center gap-3 rounded-lg bg-white/70 px-3 backdrop-blur-sm dark:bg-navy-800/70">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500 dark:bg-brand-500/30">
            <MdPeople className="h-6 w-6" />
          </div>
          <h1 className="font-poppins text-xl font-bold uppercase text-navy-700 dark:text-white">
            Data <span className="font-medium">Penduduk</span>
          </h1>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 overflow-y-auto px-6 py-4">
        <Links routes={routes} />
      </nav>

    </aside>
  );
};

export default Sidebar;