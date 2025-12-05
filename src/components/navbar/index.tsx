import avatar from "assets/img/avatars/avatar4.png";
import Dropdown from "components/dropdown";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FiCalendar } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { useLocation } from "react-router-dom"; // ← tambahkan useLocation

// Daftar mapping path → judul yang ingin ditampilkan
const PAGE_TITLES: Record<string, string> = {
  "/admin/default": "Beranda",
  "/admin/dashboard": "Dashboard",
  "/admin/akun": "Akun Admin",
  "/admin/profile": "Profile Akun",
  "/admin/data-kependudukan": "Data Kependudukan",
  "/admin/data-keluarga": "Data Keluarga",
  "/admin/surat-pengantar": "Surat Pengantar",
  "/admin/laporan": "Laporan",
  "/admin/pengaturan": "Pengaturan",
  "/admin/anggota": "Pembaruan data",
  // tambahkan sesuai kebutuhan
};

const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText?: string;        // sudah tidak wajib lagi
  secondary?: boolean | string;
}) => {
  const { onOpenSidenav } = props;
  const location = useLocation();

  // Fungsi untuk mendapatkan judul dari path
  const getPageTitle = () => {
    const path = location.pathname;

    // Cari exact match dulu
    if (PAGE_TITLES[path]) {
      return PAGE_TITLES[path];
    }

    // Jika tidak ada exact match, coba ambil yang terakhir dari path
    // Contoh: /admin/data-kependudukan → "data-kependudukan" → ubah jadi title case
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (lastSegment) {
      return lastSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return "Dashboard"; // fallback
  };

  const pageTitle = getPageTitle();

  return (
    <nav className="sticky border-b border-black/30 top-0 md:py-0 py-0 pb-0 md:py-4 mb-0 md:mb-4 z-40 flex flex-row flex-wrap items-center justify-between bg-white/10 md:px-2 h-[14vh] backdrop-blur-xl dark:bg-[#0b14374d]">
      
      {/* Hamburger Button — HANYA MUNCUL DI MOBILE */}
      {/* <div className="block md:hidden w-max ml-[6px]">
        <button
          onClick={onOpenSidenav}
          className="block md:hidden border border-purple-500 rounded-md bg-white/10 p-2 text-brand-500 hover:bg-white/20 dark:bg-navy-700 dark:text-white"
        >
          <MdMenu className="w-5 md:h-7 h-5 md:w-7" />
        </button>
      </div> */}
      
      {/* Judul dinamis */}
      <div className="ml-[12px] md:ml-[6px]">
        <p className="shrink text-[20px] uppercase text-navy-700 dark:text-white font-bold">
          {pageTitle}
        </p>
      </div>

      {/* Bagian kanan (tanggal + avatar) */}
      <div className="relative mt-[3px] flex h-[61px] w-[40px] flex-grow items-center justify-end md:justify-around gap-2 rounded-full px-2 py-2 shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:flex-grow-0 md:gap-1 md:w-[365px] xl:gap-2">
        <div className="hidden md:flex h-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white px-4 py-2 w-max">
          <div className="mr-3 text-xl">
            <FiCalendar className="h-7 w-7 text-brand-500" />
          </div>
          <div className="flex flex-col leading-tight uppercase">
            <span className="text-lg font-semibold text-navy-700 dark:text-white">
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
            </span>
          </div>
        </div>

        <Dropdown
          button={
            <img
              className="relative top-[0px] h-10 w-10 border-2 border-blue-500 bg-blue-500 rounded-full cursor-pointer active:scale-[0.98] hover:brightness-90"
              src={'/default.jpg'}
              alt="Avatar"
            />
          }
          children={
            <div className="flex h-max pb-3 w-56 md:w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="mt-3 ml-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    Hey, Adela
                  </p>
                </div>
              </div>
              <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="mt-3 ml-4 flex flex-col">
                <a
                  href="/admin/profile"
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Akun
                </a>
                <a
                  href="/auth/sign-in"
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                >
                  Log Out
                </a>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;