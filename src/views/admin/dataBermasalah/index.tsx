/* src/pages/admin/DataBermasalah.tsx */
import React, { useState } from "react";
import {
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdBabyChangingStation,
  MdClose,
  MdFamilyRestroom,
  MdHome,
  MdLocalHospital,
  MdPersonOff,
  MdPrint,
  MdSearch,
  MdWarning
} from "react-icons/md";

type Masalah = {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  rt: string;
  keterangan: string;
};

/* Data lengkap untuk demo (sudah diisi cukup banyak) */
const DATA_MASALAH = {
  ktp: [
    { id: "m1", nama: "Budi Santoso", nik: "3275011506750004", alamat: "Jl. Ahmad Yani Gg. Mawar No. 5", rt: "02", keterangan: "Belum pernah rekam KTP" },
    { id: "m2", nama: "Siti Nurhaliza", nik: "3275014503850005", alamat: "Jl. Merdeka No. 15", rt: "01", keterangan: "KTP hilang, belum ganti" },
    { id: "m3", nama: "Joko Widodo", nik: "3275010101850001", alamat: "Jl. Sudirman No. 25", rt: "03", keterangan: "KTP rusak tidak terbaca" },
    { id: "m4", nama: "Rina Susanti", nik: "3275011205900002", alamat: "Jl. Gatot Subroto No. 12", rt: "04", keterangan: "Data KTP belum sinkron" },
    { id: "m5", nama: "Ahmad Fauzi", nik: "3275010101900001", alamat: "Jl. Merdeka No. 10", rt: "01", keterangan: "KTP lama belum update" },
    { id: "m6", nama: "Dewi Sartika", nik: "3275012708950003", alamat: "Jl. Ahmad Yani No. 8", rt: "02", keterangan: "Belum rekam KTP anak" },
    { id: "m7", nama: "Slamet Riyadi", nik: "3275010303900003", alamat: "Jl. Sudirman No. 45", rt: "03", keterangan: "KTP hilang saat pindah" },
    { id: "m8", nama: "Fitriani", nik: "3275011507850004", alamat: "Jl. Merdeka Gg. Melati No. 3", rt: "01", keterangan: "KTP rusak terbakar" },
    { id: "m9", nama: "Hendra Gunawan", nik: "3275010504850005", alamat: "Jl. Diponegoro No. 22", rt: "05", keterangan: "Belum ganti KTP" },
    { id: "m10", nama: "Lina Marlina", nik: "3275012806750006", alamat: "Jl. Thamrin No. 18", rt: "06", keterangan: "KTP hilang" },
    { id: "m11", nama: "Bambang S.", nik: "3275010202850007", alamat: "Jl. Ahmad Yani Gg. Mawar No. 5", rt: "02", keterangan: "Data KTP tidak valid" },
    { id: "m12", nama: "Nurhayati", nik: "3275010904850008", alamat: "Jl. Sudirman Gg. 2 No. 7", rt: "03", keterangan: "KTP kadaluarsa" },
  ],
  akte: [
    { id: "a1", nama: "Ahmad Rizky", nik: "3275012312080003", alamat: "Jl. Merdeka No. 10", rt: "01", keterangan: "Lahir 2008, belum ada akte" },
    { id: "a2", nama: "Salsa Putri", nik: "3275011205150001", alamat: "Jl. Sudirman No. 20", rt: "03", keterangan: "Lahir di rumah" },
    { id: "a3", nama: "Fajar Pratama", nik: "3275011504200002", alamat: "Jl. Ahmad Yani No. 12", rt: "02", keterangan: "Akte hilang" },
    { id: "a4", nama: "Rani Kartika", nik: "3275010108150003", alamat: "Jl. Gatot Subroto No. 33", rt: "04", keterangan: "Belum tercatat" },
    { id: "a5", nama: "Bayu Aditya", nik: "3275012509190004", alamat: "Jl. Merdeka Gg. 3 No. 8", rt: "01", keterangan: "Lahir prematur" },
    { id: "a6", nama: "Citra Dewi", nik: "3275010510210005", alamat: "Jl. Diponegoro No. 15", rt: "05", keterangan: "Akte rusak" },
    { id: "a7", nama: "Diki Ramadhan", nik: "3275011406230006", alamat: "Jl. Thamrin No. 22", rt: "06", keterangan: "Belum daftar akte" },
    { id: "a8", nama: "Eka Putri", nik: "3275010307250007", alamat: "Jl. Sudirman No. 67", rt: "03", keterangan: "Lahir di kampung" },
  ],
  kk: [
    { id: "kk1", nama: "Keluarga Budi Santoso", nik: "3275010202850002", alamat: "Jl. Ahmad Yani Gg. Mawar No. 5", rt: "02", keterangan: "KK rusak, data tidak terbaca" },
    { id: "kk2", nama: "Keluarga Slamet Riyadi", nik: "3275010303900003", alamat: "Jl. Sudirman No. 45", rt: "03", keterangan: "KK lama, belum update anggota" },
    { id: "kk3", nama: "Keluarga Ahmad Fauzi", nik: "3275010101900001", alamat: "Jl. Merdeka No. 10", rt: "01", keterangan: "KK hilang" },
    { id: "kk4", nama: "Keluarga Joko Widodo", nik: "3275010404900004", alamat: "Jl. Gatot Subroto No. 78", rt: "04", keterangan: "Data KK tidak sinkron" },
    { id: "kk5", nama: "Keluarga Siti Aminah", nik: "3275014503850002", alamat: "Jl. Merdeka No. 10", rt: "01", keterangan: "KK rusak terkena air" },
  ],
  bpjs: [
    { id: "b1", nama: "Ahmad Fauzi", nik: "3275010101900001", alamat: "Jl. Merdeka No. 10", rt: "01", keterangan: "BPJS non-aktif sejak 2024" },
    { id: "b2", nama: "Siti Aminah", nik: "3275014503850002", alamat: "Jl. Merdeka No. 10", rt: "01", keterangan: "Tunggakan iuran" },
    { id: "b3", nama: "Budi Santoso", nik: "3275011506750004", alamat: "Jl. Ahmad Yani Gg. Mawar No. 5", rt: "02", keterangan: "Belum terdaftar BPJS" },
    { id: "b4", nama: "Rina Susanti", nik: "3275011205900002", alamat: "Jl. Gatot Subroto No. 12", rt: "04", keterangan: "Pindah segmen mandiri" },
    // ... tambahkan lagi sampai ±23 kalau mau
  ],
  rumah: [
    { id: "r1", nama: "Keluarga Joko Widodo", nik: "3275010404900004", alamat: "Jl. Gatot Subroto No. 78", rt: "04", keterangan: "Atap bocor, dinding retak" },
    { id: "r2", nama: "Keluarga Budi Santoso", nik: "3275010202850002", alamat: "Jl. Ahmad Yani Gg. Mawar No. 5", rt: "02", keterangan: "Rumah semi-permanen, rawan banjir" },
    { id: "r3", nama: "Keluarga Slamet Riyadi", nik: "3275010303900003", alamat: "Jl. Sudirman No. 45", rt: "03", keterangan: "Lantai tanah, atap asbes" },
    { id: "r4", nama: "Keluarga Nurhayati", nik: "3275010904850008", alamat: "Jl. Sudirman Gg. 2 No. 7", rt: "03", keterangan: "Rumah kayu lapuk" },
    { id: "r5", nama: "Keluarga Hendra G.", nik: "3275010504850005", alamat: "Jl. Diponegoro No. 22", rt: "05", keterangan: "Dinding bambu, atap bocor" },
    { id: "r6", nama: "Keluarga Lina Marlina", nik: "3275012806750006", alamat: "Jl. Thamrin No. 18", rt: "06", keterangan: "Rumah di bantaran sungai" },
    { id: "r7", nama: "Keluarga Fitriani", nik: "3275011507850004", alamat: "Jl. Merdeka Gg. Melati No. 3", rt: "01", keterangan: "Rumah tidak layak huni" },
  ],
};

const KATEGORI = [
  { id: "ktp",   label: "Tidak Punya KTP",           icon: <MdPersonOff className="w-9 h-9" />,          count: 12, gradient: "from-red-500 to-red-600" },
  { id: "akte",  label: "Tidak Punya Akte Lahir",    icon: <MdBabyChangingStation className="w-9 h-9" />, count: 8,  gradient: "from-orange-500 to-amber-600" },
  { id: "kk",    label: "KK Tidak Valid",            icon: <MdFamilyRestroom className="w-9 h-9" />,     count: 5,  gradient: "from-amber-500 to-yellow-600" },
  { id: "bpjs",  label: "BPJS Tidak Aktif",          icon: <MdLocalHospital className="w-9 h-9" />,     count: 23, gradient: "from-purple-500 to-purple-600" },
  { id: "rumah", label: "Rumah Tidak Layak Huni",   icon: <MdHome className="w-9 h-9" />,               count: 7,  gradient: "from-green-500 to-green-600" },
];

const DataBermasalah: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [dataDetail, setDataDetail] = useState<Masalah[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const totalMasalah = KATEGORI.reduce((acc, k) => acc + k.count, 0);

  const bukaDetail = (id: string) => {
    const data = DATA_MASALAH[id as keyof typeof DATA_MASALAH] || [];
    setDataDetail(data);
    setSelectedKategori(id);
    setSidebarOpen(true);
  };

  const tutupSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      setSelectedKategori(null);
      setDataDetail([]);
      setSearchTerm("");
    }, 400);
  };

  const kategori = KATEGORI.find((k) => k.id === selectedKategori);

  const filteredData = dataDetail.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nik.includes(searchTerm) ||
      item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl py-10 lg:py-3">
          {/* Header Modern */}
          <div className="text-left mb-6">
            <div className="w-full shadow-lg inline-flex items-center gap-3 bg-red-500 dark:bg-red-500/20 px-6 py-3 rounded-xl mb-6">
              <MdWarning className="w-7 h-7 text-white dark:text-red-400" />
              <span className="text-lg font-medium text-white dark:text-red-400">Peringatan Data Kritis</span>
            </div>
            {/* <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-800 dark:from-white dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              Data Warga Bermasalah
            </h1> */}
            <p className="mt-2 text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
              Total <strong className="text-3xl text-indigo-600 dark:text-indigo-400">{totalMasalah}</strong> data memerlukan penanganan segera
            </p>
          </div>

          {/* Grid Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {KATEGORI.map((kat) => (
              <div
                key={kat.id}
                className="group relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-white/10 shadow-xl hover:shadow-2xl transform hover:brighness-[95%] transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${kat.gradient} opacity-10`} />
                </div>

                <div className="relative z-10">
                  <div className={`w-max p-5 rounded-2xl bg-gradient-to-br ${kat.gradient} text-white shadow-lg mb-6`}>
                    {kat.icon}
                  </div>

                  <h3 className="text-2xl font-medium text-slate-800 dark:text-white mb-3 text-left">{kat.label}</h3>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-5xl font-black text-slate-900 dark:text-white">{kat.count}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {kat.id === "kk" || kat.id === "rumah" ? "KK" : kat.id === "akte" ? "Anak" : "Orang"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => bukaDetail(kat.id)}
                    className="
                      group relative w-full px-6 py-4 
                      bg-gradient-to-r from-brand-500/5 via-brand-500/10 to-brand-500/5
                      hover:from-brand-500/10 hover:via-brand-500/20 hover:to-brand-500/10
                      dark:from-brand-500/10 dark:via-brand-500/20 dark:to-brand-500/10
                      rounded-2xl 
                      border border-brand-200/50 dark:border-brand-700/50
                      backdrop-blur-sm
                      transition-all duration-300 ease-out
                      hover:shadow-lg hover:shadow-brand-500/20
                      hover:border-brand-400/70
                      active:scale-[0.98]
                      overflow-hidden
                    "
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent blur-xl" />
                    </div>

                    <div className="relative flex items-center justify-between">
                      <span className="
                        text-sm font-medium 
                        text-brand-700 dark:text-brand-300 
                        group-hover:text-brand-800 dark:group-hover:text-brand-200 
                        transition-colors
                      ">
                        Lihat Selengkapnya
                      </span>

                      {/* Panah yang bergerak halus */}
                      <div className="flex items-center gap-2">
                        <MdArrowForwardIos className="
                          w-4 h-4 text-brand-600 dark:text-brand-400 
                          translate-x-0 group-hover:translate-x-2 
                          transition-transform duration-300
                        " />
                      </div>
                    </div>

                    {/* Ripple effect saat klik (opsional, tambah aja kalau suka) */}
                    <span className="absolute inset-0 -z-10">
                      <span className="absolute inset-0 bg-brand-400/20 scale-0 rounded-full transition-transform duration-300 active:scale-150" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Sidebar Detail */}
      <div className={`fixed inset-0 z-50 ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={tutupSidebar}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full md:w-[44vw] bg-white dark:bg-slate-900 shadow-2xl transform transition-all duration-500 ease-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header Sidebar */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6 z-10 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <button
                  onClick={tutupSidebar}
                  className="flex items-center gap-3 text-xl font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition"
                >
                  <MdArrowBackIosNew className="w-6 h-6" />
                  Kembali
                </button>
                <button onClick={tutupSidebar} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                  <MdClose className="w-7 h-7 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Konten Sidebar */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {kategori && (
                <>
                  {/* Header Kategori */}
                  <div className="text-left mb-10">
                    <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${kategori.gradient} text-white shadow-2xl`}>
                      {kategori.icon}
                    </div>
                    <h2 className="mt-6 text-4xl font-black text-slate-800 dark:text-white">{kategori.label}</h2>
                    <p className="mt-2 text-2xl font-medium text-slate-600 dark:text-slate-400">
                      {kategori.count} {kategori.id === "kk" || kategori.id === "rumah" ? "KK" : kategori.id === "akte" ? "Anak" : "Orang"}
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative mb-8">
                    <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama, NIK, atau alamat..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* List Data */}
                  <div className="space-y-5">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-medium text-slate-800 dark:text-white">{item.nama}</h4>
                              <p className="font-mono text-sm text-slate-600 dark:text-slate-400">{item.nik}</p>
                            </div>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                              RT {item.rt}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mb-3">{item.alamat}</p>
                          <p className="italic text-amber-600 dark:text-amber-400 mb-5">"{item.keterangan}"</p>

                          <button className={`w-full py-4 bg-gradient-to-r ${kategori.gradient} text-white font-medium text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-98 transition flex items-center justify-center gap-3`}>
                            <MdPrint className="w-6 h-6" />
                            Buat Surat Pengantar
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-left text-slate-500 py-20">Tidak ada data ditemukan.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataBermasalah;