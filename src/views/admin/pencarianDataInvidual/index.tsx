/* src/pages/admin/PencarianIndividu.tsx */
import React, { useMemo, useState } from "react";
import {
    MdArrowBackIosNew,
    MdArrowForwardIos,
    MdChildCare,
    MdClose,
    MdElderly,
    MdFamilyRestroom,
    MdHome,
    MdLocationOn,
    MdPerson,
    MdPlace,
    MdSchool,
    MdSearch,
} from "react-icons/md";

type Anggota = {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tanggalLahir: string;
  tempatLahir: string;
  statusKeluarga: string;
  pekerjaan?: string;
  bantuan?: string[];
  ktpUrl: string;
  alamatLengkap: string;
  noKK: string;
  rt: string;
  kepalaKeluarga: string;
};

const DUMMY_DATA: Anggota[] = [
  { id: "1", nik: "3275010101900001", nama: "Ahmad Fauzi", jenisKelamin: "L", tanggalLahir: "1980-05-15", tempatLahir: "Bandung", statusKeluarga: "Kepala Keluarga", pekerjaan: "Wirausaha", bantuan: ["pkh", "bpnt"], ktpUrl: "/ktp.jpg", alamatLengkap: "Jl. Merdeka No. 10 RT 01 RW 001 Kel. Kebon Jeruk", noKK: "3275010101900001", rt: "01", kepalaKeluarga: "Ahmad Fauzi" },
  { id: "2", nik: "3275014503850002", nama: "Siti Aminah", jenisKelamin: "P", tanggalLahir: "1985-03-22", tempatLahir: "Bandung", statusKeluarga: "Istri", pekerjaan: "Ibu Rumah Tangga", bantuan: ["pkh"], ktpUrl: "/ktp.jpg", alamatLengkap: "Jl. Merdeka No. 10 RT 01 RW 001 Kel. Kebon Jeruk", noKK: "3275010101900001", rt: "01", kepalaKeluarga: "Ahmad Fauzi" },
  { id: "3", nik: "3275012312080003", nama: "Muhammad Rizky", jenisKelamin: "L", tanggalLahir: "2008-12-23", tempatLahir: "Bandung", statusKeluarga: "Anak", pekerjaan: "Pelajar", bantuan: ["kip"], ktpUrl: "/ktp.jpg", alamatLengkap: "Jl. Merdeka No. 10 RT 01 RW 001 Kel. Kebon Jeruk", noKK: "3275010101900001", rt: "01", kepalaKeluarga: "Ahmad Fauzi" },
  { id: "4", nik: "3275011506750004", nama: "Budi Santoso", jenisKelamin: "L", tanggalLahir: "1975-06-15", tempatLahir: "Jakarta", statusKeluarga: "Kepala Keluarga", pekerjaan: "Buruh Harian", bantuan: ["bpnt"], ktpUrl: "/ktp.jpg", alamatLengkap: "Jl. Ahmad Yani Gg. Mawar No. 5 RT 02 RW 003", noKK: "3275010202850002", rt: "02", kepalaKeluarga: "Budi Santoso" },
  { id: "5", nik: "3275010403600006", nama: "Slamet Riyadi", jenisKelamin: "L", tanggalLahir: "1960-04-03", tempatLahir: "Bandung", statusKeluarga: "Kepala Keluarga", pekerjaan: "Pensiunan", bantuan: ["kis"], ktpUrl: "/ktp.jpg", alamatLengkap: "Jl. Sudirman No. 45 RT 03 RW 002", noKK: "3275010303900003", rt: "03", kepalaKeluarga: "Slamet Riyadi" },
  { id: "6", nik: "3275010101650007", nama: "Joko Widodo", jenisKelamin: "L", tanggalLahir: "1965-01-01", tempatLahir: "Solo", statusKeluarga: "Kepala Keluarga", pekerjaan: "PNS", bantuan: [], ktpUrl: "/ktp.jpg", alamatLengkap: "Jl. Gatot Subroto No. 78 RT 04 RW 005", noKK: "3275010404900004", rt: "04", kepalaKeluarga: "Joko Widodo" },
];

const DAFTAR_BANTUAN = [
  { id: "pkh", nama: "PKH", color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300" },
  { id: "bpnt", nama: "BPNT", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  { id: "kip", nama: "KIP", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  { id: "kis", nama: "KIS", color: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300" },
];

const PencarianIndividu: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterRT, setFilterRT] = useState("all");
  const [filterGender, setFilterGender] = useState<"all" | "L" | "P">("all");
  const [filterUsia, setFilterUsia] = useState("all");

  // Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState<"profil" | "kk" | null>(null);
  const [selectedAnggota, setSelectedAnggota] = useState<Anggota | null>(null);
  const [detailKKAnggota, setDetailKKAnggota] = useState<Anggota[]>([]);

  const hitungUsia = (tgl: string): number => {
    const birth = new Date(tgl);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const kelompokUsia = (usia: number) => {
    if (usia < 6) return { nama: "Balita", icon: <MdChildCare className="w-5 h-5" />, color: "text-pink-600" };
    if (usia < 13) return { nama: "Anak", icon: <MdChildCare className="w-5 h-5" />, color: "text-blue-600" };
    if (usia < 18) return { nama: "Remaja", icon: <MdSchool className="w-5 h-5" />, color: "text-green-600" };
    if (usia < 60) return { nama: "Dewasa", icon: <MdPerson className="w-5 h-5" />, color: "text-indigo-600" };
    return { nama: "Lansia", icon: <MdElderly className="w-5 h-5" />, color: "text-amber-700" };
  };

  const hasil = useMemo(() => {
    let data = [...DUMMY_DATA];
    if (search) data = data.filter(i => 
      i.nama.toLowerCase().includes(search.toLowerCase()) || 
      i.nik.includes(search) || 
      i.noKK.includes(search)
    );
    if (filterRT !== "all") data = data.filter(i => i.rt === filterRT);
    if (filterGender !== "all") data = data.filter(i => i.jenisKelamin === filterGender);
    if (filterUsia !== "all") {
      data = data.filter(i => {
        const u = hitungUsia(i.tanggalLahir);
        if (filterUsia === "0-17") return u <= 17;
        if (filterUsia === "18-59") return u >= 18 && u <= 59;
        if (filterUsia === "60+") return u >= 60;
        return true;
      });
    }
    return data;
  }, [search, filterRT, filterGender, filterUsia]);

  const bukaProfil = (anggota: Anggota) => {
    setSelectedAnggota(anggota);
    setSidebarType("profil");
    setSidebarOpen(true);
  };

  const bukaDetailKK = (noKK: string) => {
    const anggotaKK = DUMMY_DATA.filter(a => a.noKK === noKK);
    setDetailKKAnggota(anggotaKK);
    setSidebarType("kk");
    setSidebarOpen(true);
  };

  const tutupSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      setSidebarType(null);
      setSelectedAnggota(null);
      setDetailKKAnggota([]);
    }, 400); // sesuaikan dengan durasi animasi
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 py-3 px-0">
        <div className="max-w-7xl mx-auto">
          {/* Filter */}
          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nama / NIK / No. KK"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-base"
                />
              </div>
              <select value={filterRT} onChange={e => setFilterRT(e.target.value)} className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 focus:ring-4 focus:ring-brand-500/30 text-base">
                <option value="all">Semua RT</option>
                {["01","02","03","04"].map(rt => <option key={rt} value={rt}>RT {rt}</option>)}
              </select>
              <select value={filterGender} onChange={e => setFilterGender(e.target.value as any)} className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 focus:ring-4 focus:ring-brand-500/30 text-base">
                <option value="all">Semua Gender</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              <select value={filterUsia} onChange={e => setFilterUsia(e.target.value)} className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 focus:ring-4 focus:ring-brand-500/30 text-base">
                <option value="all">Semua Usia</option>
                <option value="0-17">0-17 tahun</option>
                <option value="18-59">18-59 tahun</option>
                <option value="60+">60+ tahun</option>
              </select>
            </div>
          </div>

          <div className="text-left mb-5 w-full rounded-lg p-2">
            <span className="text-2xl font-black text-brand-600">{hasil.length}</span>
            <span className="text-xl ml-3 relative top-[-2px] text-black dark:text-gray-400">orang ditemukan</span>
          </div>

          {/* Grid Hasil Pencarian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hasil.map(item => {
              const usia = hitungUsia(item.tanggalLahir);
              const kel = kelompokUsia(usia);

              return (
                <div key={item.id} className="bg-white dark:bg-navy-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-navy-700">
                  <div className="h-2 bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-500" />
                  <div className="p-4">
                    <div className="mb-6">
                      <img src={item.ktpUrl} alt={item.nama} className="w-full h-72 md:h-60 object-cover rounded-2xl shadow-2xl border-8 border-white dark:border-navy-700" />
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">{item.nama}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-base text-gray-600 dark:text-gray-400">
                          <span className="text-brand-600 flex gap-2 items-center border border-slate-700 rounded-md p-2">{usia} tahun</span>
                          <span className="flex gap-2 text-brand-600 items-center border border-slate-700 rounded-md p-2">{item.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</span>
                          <span className={`${kel.color} flex gap-2 items-center border border-slate-700 rounded-md p-2`}>{kel.icon} {kel.nama}</span>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm md:text-base">
                        <div className="flex items-center gap-3">
                          <MdPerson className="w-5 h-5 text-brand-600" />
                          <span className="font-mono">{item.nik}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MdPlace className="w-5 h-5 text-brand-600 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{item.alamatLengkap}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MdHome className="w-5 h-5 text-brand-600" />
                          <span>KK: <strong className="text-brand-600">{item.noKK}</strong></span>
                        </div>
                      </div>

                      {item.bantuan && item.bantuan.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.bantuan.map(id => {
                            const b = DAFTAR_BANTUAN.find(x => x.id === id);
                            return b ? <span key={id} className={`px-4 py-2 rounded-full text-xs font-medium ${b.color}`}>{b.nama}</span> : null;
                          })}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button onClick={() => bukaDetailKK(item.noKK)} className="group relative w-full px-6 py-4 bg-gradient-to-r from-brand-500/5 via-brand-500/10 to-brand-500/5 hover:from-brand-500/10 hover:via-brand-500/20 hover:to-brand-500/10 rounded-2xl border border-brand-200/50 dark:border-brand-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98] overflow-hidden">
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent blur-xl" />
                          </div>
                          <div className="relative flex items-center justify-between">
                            <span className="text-sm font-medium text-brand-700 dark:text-brand-300 group-hover:text-brand-800">Lihat KK</span>
                            <MdArrowForwardIos className="w-4 h-4 text-brand-600 translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </button>
                        <button onClick={() => bukaProfil(item)} className="group relative w-full px-6 py-4 bg-gradient-to-r from-brand-500/5 via-brand-500/10 to-brand-500/5 hover:from-brand-500/10 hover:via-brand-500/20 hover:to-brand-500/10 rounded-2xl border border-brand-200/50 dark:border-brand-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98] overflow-hidden">
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent blur-xl" />
                          </div>
                          <div className="relative flex items-center justify-between">
                            <span className="text-sm font-medium text-brand-700 dark:text-brand-300 group-hover:text-brand-800">Lihat Profil</span>
                            <MdArrowForwardIos className="w-4 h-4 text-brand-600 translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar + Overlay Hitam dengan Blur */}
      <div className={`fixed inset-0 z-50 transition-all duration-400 ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Overlay Hitam Gelap + Blur */}
        <div
          className={`absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-md transition-opacity duration-500 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={tutupSidebar}
        />

        {/* Panel Sidebar */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-500 ease-out ${
            sidebarOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="h-full pb-14 md:pb-0 overflow-y-auto">
            {/* Header Sidebar */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 z-10">
              <div className="flex items-center justify-between">
                <button onClick={tutupSidebar} className="flex items-center gap-3 text-lg font-medium text-brand-600 hover:text-brand-700 transition">
                  <MdArrowBackIosNew className="w-5 h-5" />
                  Kembali
                </button>
                <button onClick={tutupSidebar} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <MdClose className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Konten Sidebar */}
            <div className="px-6 py-8 space-y-10">
              {sidebarType === "profil" && selectedAnggota && (
                <>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">Profil Lengkap</p>
                    <h1 className="text-3xl md:text-4xl font-black mt-2">{selectedAnggota.nama}</h1>
                  </div>
                  <div className="flex justify-center">
                    <img src={selectedAnggota.ktpUrl} alt={selectedAnggota.nama} className="w-full h-[250px] md:h-[300px] object-cover rounded-3xl shadow-2xl border-8 border-white dark:border-gray-800" />
                  </div>
                  <div className="space-y-6 text-left bg-gray-50 dark:bg-gray-800 rounded-3xl p-8">
                    <div><strong>NIK</strong><p className="font-mono text-xl mt-1">{selectedAnggota.nik}</p></div>
                    <div><strong>No. KK</strong><p className="font-mono text-xl mt-1">{selectedAnggota.noKK}</p></div>
                    <div><strong>Tempat, Tanggal Lahir</strong><p className="text-lg mt-1">{selectedAnggota.tempatLahir}, {new Date(selectedAnggota.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p></div>
                    <div><strong>Status Keluarga</strong><p className="text-lg mt-1">{selectedAnggota.statusKeluarga}</p></div>
                    <div><strong>Pekerjaan</strong><p className="text-lg mt-1">{selectedAnggota.pekerjaan || "—"}</p></div>
                    {selectedAnggota.bantuan && selectedAnggota.bantuan.length > 0 && (
                      <div>
                        <strong>Bantuan Diterima</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedAnggota.bantuan.map(id => {
                            const b = DAFTAR_BANTUAN.find(x => x.id === id);
                            return b ? <span key={id} className={`px-4 py-2 rounded-full text-xs font-medium ${b.color}`}>{b.nama}</span> : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {sidebarType === "kk" && detailKKAnggota.length > 0 && (
                <>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">Kartu Keluarga</p>
                    <h1 className="text-2xl md:text-5xl font-black text-brand-600 mt-2">{detailKKAnggota[0].noKK}</h1>
                  </div>

                  <div className="bg-gradient-to-br from-brand-50 to-emerald-50 dark:from-brand-900/30 rounded-3xl p-6 border border-brand-200 dark:border-brand-800">
                    <div className="flex items-start gap-4">
                      <MdLocationOn className="w-7 h-7 text-brand-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alamat</p>
                        <p className="text-lg md:text-xl font-medium">{detailKKAnggota[0].alamatLengkap}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <MdFamilyRestroom className="w-8 h-8 text-brand-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Kepala Keluarga</p>
                        <p className="text-lg md:text-2xl font-black text-brand-700 dark:text-brand-300">{detailKKAnggota[0].kepalaKeluarga}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-medium">Anggota Keluarga</h2>
                      <span className="text-3xl font-black text-brand-600">{detailKKAnggota.length}</span>
                    </div>
                    <div className="space-y-6">
                      {detailKKAnggota.map((a, i) => {
                        const usia = hitungUsia(a.tanggalLahir);
                        const isKepala = a.statusKeluarga === "Kepala Keluarga";
                        return (
                          <div key={a.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className={`px-6 py-4 ${isKepala ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white" : "bg-gray-100 dark:bg-gray-700"}`}>
                              <p className="text-xl font-black">{i + 1}. {a.nama}</p>
                              <p className="text-sm opacity-90">{usia} th • {a.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"} • {a.statusKeluarga}</p>
                            </div>
                            <div className="p-6 gap-6 items-start">
                              <img src={a.ktpUrl} alt={a.nama} className="w-full mb-4 h-40 object-cover rounded-xl shadow-md" />
                              <div className="flex-1 space-y-3">
                                <p className="font-mono text-lg border p-2 rounded-lg bg-white">{a.nik}</p>
                                {a.pekerjaan && <p className="font-medium">{a.pekerjaan}</p>}
                                {a.bantuan && a.bantuan.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {a.bantuan.map(id => {
                                      const b = DAFTAR_BANTUAN.find(x => x.id === id);
                                      return b ? <span key={id} className={`px-3 py-1.5 rounded-full text-xs font-medium ${b.color}`}>{b.nama}</span> : null;
                                    })}
                                  </div>
                                )}
                                 <button onClick={() => bukaProfil(a)} className="group relative w-full px-6 py-4 bg-gradient-to-r from-brand-500/5 via-brand-500/10 to-brand-500/5 hover:from-brand-500/10 hover:via-brand-500/20 hover:to-brand-500/10 rounded-2xl border border-brand-200/50 dark:border-brand-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98] overflow-hidden">
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent blur-xl" />
                                  </div>
                                  <div className="relative flex items-center justify-between">
                                    <span className="text-sm font-medium text-brand-700 dark:text-brand-300 group-hover:text-brand-800">Lihat Profil Lengkap</span>
                                    <MdArrowForwardIos className="w-4 h-4 text-brand-600 translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

export default PencarianIndividu;