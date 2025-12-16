import { HiX } from "react-icons/hi";
import { MdPeople } from "react-icons/md";
import routes from "routes";
import Links from "./components/Links";

interface SidebarProps {
  open: boolean;
  onClose: () => void;   // <-- pastikan ini ada
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <aside
        className={`
          fixed inset-y-0 h-screen left-0 pl-4 z-50 flex w-[300px] flex-col overflow-hidden bg-white pb-10 shadow-2xl transition-transform duration-300 ease-in-out
          dark:bg-navy-800 dark:text-white
          /* Mobile & tablet kecil: disembunyikan dulu, drawer hanya jika open */
          ${open ? "translate-x-0" : "-translate-x-full"}
          /* Mulai lg (768px): selalu terbuka, tidak ada translate */
          lg:translate-x-0 lg:shadow-none
          /* Pastikan tidak muncul di bawah lg kalau tidak open */
          hidden lg:block
        `}
      >

      {/* Overlay gelap saat drawer terbuka di mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Close Button (Mobile) */}
      <button
        onClick={onClose}
        className="absolute right-4 top-7 xl:hidden"
        aria-label="Tutup sidebar"
      >
        <HiX className="h-6 w-6 text-gray-600 dark:text-white" />
      </button>

      {/* Logo */}
      <div className="md:mx-auto border-b h-[15%] flex justify-normal items-center border-black/50 md:w-full">
        <div className="flex items-center gap-3 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-navy-800/70">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/20 text-blue-500 dark:bg-blue-500/30">
            <MdPeople className="h-6 w-6" />
          </div>
          <h1 className="font-poppins text-xl font-bold uppercase text-navy-700 dark:text-white">
            Data <span className="font-medium">Penduduk</span>
          </h1>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 h-full overflow-y-auto pb-24 px-3 md:px-2 py-4">
       <Links routes={routes} onLinkClick={onClose} />
      </nav>

    </aside>
  );
};

export default Sidebar;