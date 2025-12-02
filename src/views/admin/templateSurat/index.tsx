// import Card from "components/card";
// import Widget from "components/widget/Widget";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MdAdd,
//   MdCheckCircle,
//   MdClose,
//   MdDelete,
//   MdEdit,
//   MdHourglassEmpty,
//   MdMail,
//   MdSearch,
//   MdWarning,
// } from "react-icons/md";

// // === TIPE DATA ===
// type StatusPengajuan = "Menunggu" | "Diproses" | "Disetujui" | "Ditolak";

// type PengajuanSurat = {
//   id: string;
//   noPengajuan: string;
//   namaWarga: string;
//   nik: string;
//   jenisSurat: string;
//   keterangan: string;
//   tanggalPengajuan: string;
//   status: StatusPengajuan;
//   catatanAdmin?: string;
// };

// const JENIS_SURAT_LIST = [
//   "Surat Keterangan Domisili",
//   "Surat Keterangan Usaha",
//   "Surat Keterangan Tidak Mampu (SKTM)",
//   "Surat Keterangan Kelahiran",
//   "Surat Keterangan Kematian",
//   "Surat Keterangan Ahli Waris",
//   "Surat Pengantar SKCK",
//   "Surat Pengantar Nikah",
//   "Surat Pengantar untuk instansi lain",
//   "Surat Pengantar Legalisasi",
//   "Surat Izin Rame-rame",
//   "Surat Permohonan",
// ];

// // DATA DEMO (akan dipakai jika localStorage kosong)
// const DEMO_DATA: PengajuanSurat[] = [
//   {
//     id: "1",
//     noPengajuan: "SURAT-2025-001",
//     namaWarga: "Budi Santoso",
//     nik: "3275012345678901",
//     jenisSurat: "Surat Keterangan Domisili",
//     keterangan: "Untuk pendaftaran sekolah anak",
//     tanggalPengajuan: "2025-11-15",
//     status: "Diproses",
//     catatanAdmin: "Dokumen lengkap, sedang dicetak",
//   },
//   {
//     id: "2",
//     noPengajuan: "SURAT-2025-002",
//     namaWarga: "Siti Aminah",
//     nik: "3275019876543210",
//     jenisSurat: "Surat Pengantar SKCK",
//     keterangan: "Untuk melamar kerja di BUMN",
//     tanggalPengajuan: "2025-11-14",
//     status: "Menunggu",
//   },
//   {
//     id: "3",
//     noPengajuan: "SURAT-2025-003",
//     namaWarga: "Ahmad Fauzi",
//     nik: "3275010101900001",
//     jenisSurat: "Surat Keterangan Tidak Mampu (SKTM)",
//     keterangan: "Untuk pengobatan gratis",
//     tanggalPengajuan: "2025-11-10",
//     status: "Disetujui",
//     catatanAdmin: "Sudah bisa diambil di kantor RT",
//   },
// ];

// const PengajuanSuratPage: React.FC = () => {
//   const [pengajuanList, setPengajuanList] = useState<PengajuanSurat[]>([]);
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState<StatusPengajuan | "Semua">("Semua");
//   const [showModal, setShowModal] = useState(false);
//   const [showDetail, setShowDetail] = useState<PengajuanSurat | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//   const [form, setForm] = useState({
//     namaWarga: "",
//     nik: "",
//     jenisSurat: JENIS_SURAT_LIST[0],
//     keterangan: "",
//   });

//   // Load data (pakai demo jika kosong)
//   useEffect(() => {
//     const saved = localStorage.getItem("pengajuanSuratList");
//     if (saved && saved !== "[]") {
//       setPengajuanList(JSON.parse(saved));
//     } else {
//       setPengajuanList(DEMO_DATA);
//       localStorage.setItem("pengajuanSuratList", JSON.stringify(DEMO_DATA));
//     }
//   }, []);

//   // Simpan setiap ada perubahan
//   useEffect(() => {
//     if (pengajuanList.length > 0) {
//       localStorage.setItem("pengajuanSuratList", JSON.stringify(pengajuanList));
//     }
//   }, [pengajuanList]);

//   // Toast sederhana
//   useEffect(() => {
//     if (toast) {
//       const t = setTimeout(() => setToast(null), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [toast]);

//   // Generate nomor pengajuan otomatis
//   const generateNoPengajuan = () => {
//     const year = new Date().getFullYear();
//     const count = pengajuanList.length + 1;
//     return `SURAT-${year}-${count.toString().padStart(3, "0")}`;
//   };

//   const filteredData = useMemo(() => {
//     const query = search.toLowerCase();

//     return pengajuanList.filter((item) => {
//       const matchesSearch =
//         (item.namaWarga ?? "").toLowerCase().includes(query) ||
//         (item.nik ?? "").includes(search) ||
//         (item.noPengajuan ?? "").includes(search) ||
//         (item.jenisSurat ?? "").toLowerCase().includes(query);

//       const matchesStatus = filterStatus === "Semua" || item.status === filterStatus;

//       return matchesSearch && matchesStatus;
//     });
//   }, [pengajuanList, search, filterStatus]);

//   const stats = useMemo(() => ({
//     total: pengajuanList.length,
//     menunggu: pengajuanList.filter(p => p.status === "Menunggu").length,
//     diproses: pengajuanList.filter(p => p.status === "Diproses").length,
//     selesai: pengajuanList.filter(p => p.status === "Disetujui" || p.status === "Ditolak").length,
//   }), [pengajuanList]);

//   const handleSubmit = () => {
//     if (!form.namaWarga.trim() || !form.nik.trim() || form.nik.length !== 16) {
//       setToast({ message: "Nama dan NIK 16 digit wajib diisi!", type: "error" });
//       return;
//     }

//     const baru: PengajuanSurat = {
//       id: Date.now().toString(),
//       noPengajuan: generateNoPengajuan(),
//       namaWarga: form.namaWarga.trim(),
//       nik: form.nik,
//       jenisSurat: form.jenisSurat,
//       keterangan: form.keterangan.trim(),
//       tanggalPengajuan: new Date().toISOString().split("T")[0],
//       status: "Menunggu",
//     };

//     setPengajuanList(prev => [...prev, baru]);
//     setShowModal(false);
//     setForm({ namaWarga: "", nik: "", jenisSurat: JENIS_SURAT_LIST[0], keterangan: "" });
//     setToast({ message: "Pengajuan berhasil diajukan!", type: "success" });
//   };

//   const updateStatus = (id: string, status: StatusPengajuan, catatan?: string) => {
//     setPengajuanList(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, status, catatanAdmin: catatan || item.catatanAdmin } : item
//       )
//     );
//     setToast({ message: `Status diubah menjadi "${status}"`, type: "success" });
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm("Yakin ingin menghapus pengajuan ini?")) {
//       setPengajuanList(prev => prev.filter(item => item.id !== id));
//       setToast({ message: "Pengajuan dihapus!", type: "success" });
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Toast */}
//       {toast && (
//         <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-medium animate-slide-up ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
//           {toast.type === "success" ? <MdCheckCircle className="h-6 w-6" /> : <MdWarning className="h-6 w-6" />}
//           {toast.message}
//         </div>
//       )}

//       {/* Widget */}
//       <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-4">
//         <Widget icon={<MdMail className="h-7 w-7" />} title="Total" subtitle={stats.total.toString()} />
//         <Widget icon={<MdHourglassEmpty className="h-7 w-7" />} title="Menunggu" subtitle={stats.menunggu.toString()} />
//         <Widget icon={<MdEdit className="h-7 w-7" />} title="Diproses" subtitle={stats.diproses.toString()} />
//         <Widget icon={<MdCheckCircle className="h-7 w-7" />} title="Selesai" subtitle={stats.selesai.toString()} />
//       </div>

//       {/* Header */}
//       <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
//             <MdMail className="h-6 w-6" />
//           </div>
//           <h3 className="text-2xl font-bold text-navy-700 dark:text-white">Pengajuan Surat Online</h3>
//         </div>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
//         >
//           <MdAdd className="h-5 w-5" />
//           Ajukan Surat Baru
//         </button>
//       </div>

//       {/* Search & Filter */}
//       <div className="mt-6 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Cari nama, NIK, no pengajuan..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700"
//           />
//         </div>
//         <select
//           value={filterStatus}
//           onChange={e => setFilterStatus(e.target.value as any)}
//           className="px-4 py-3 rounded-xl border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700"
//         >
//           <option value="Semua">Semua Status</option>
//           <option value="Menunggu">Menunggu</option>
//           <option value="Diproses">Diproses</option>
//           <option value="Disetujui">Disetujui</option>
//           <option value="Ditolak">Ditolak</option>
//         </select>
//       </div>

//       {/* Tabel */}
//       <div className="mt-6">
//         <Card extra="w-full p-6">
//           <div className="overflow-x-auto">
//             <table className="w-full table-auto min-w-[900px]">
//               <thead>
//                 <tr className="border-b-2 border-gray-200 dark:border-navy-600">
//                   <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">No Pengajuan</th>
//                   <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Warga</th>
//                   <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Jenis Surat</th>
//                   <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Tanggal</th>
//                   <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Status</th>
//                   <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-12 text-gray-500">
//                       Belum ada pengajuan surat.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map(item => (
//                     <tr key={item.id} className="border-b dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition">
//                       <td className="py-4 px-4 font-medium">{item.noPengajuan}</td>
//                       <td className="py-4 px-4">
//                         <div>
//                           <div className="font-medium text-navy-700 dark:text-white">{item.namaWarga}</div>
//                           <div className="text-xs text-gray-500">{item.nik}</div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-4 text-sm">{item.jenisSurat}</td>
//                       <td className="py-4 px-4 text-sm">{item.tanggalPengajuan}</td>
//                       <td className="py-4 px-4">
//                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//                           item.status === "Menunggu" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50" :
//                           item.status === "Diproses" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50" :
//                           item.status === "Disetujui" ? "bg-green-100 text-green-800 dark:bg-green-900/50" :
//                           "bg-red-100 text-red-800 dark:bg-red-900/50"
//                         }`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="flex gap-2">
//                           <button onClick={() => setShowDetail(item)} className="text-blue-600 hover:text-blue-800">
//                             <MdEdit className="h-5 w-5" />
//                           </button>
//                           <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
//                             <MdDelete className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </div>

//       {/* Modal Ajukan Surat */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.6)]">
//           <div className="absolute inset-0" onClick={() => setShowModal(false)} />
//           <Card extra="relative max-w-lg w-full p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl">
//             <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
//               <MdClose className="h-6 w-6" />
//             </button>
//             <h3 className="text-xl font-bold mb-6">Ajukan Surat Baru</h3>
//             <div className="space-y-4">
//               <input placeholder="Nama Lengkap" value={form.namaWarga} onChange={e => setForm({ ...form, namaWarga: e.target.value })} className="w-full px-4 py-3 rounded-lg border" />
//               <input placeholder="NIK (16 digit)" maxLength={16} value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value.replace(/\D/g, "").slice(0, 16) })} className="w-full px-4 py-3 rounded-lg border" />
//               <select value={form.jenisSurat} onChange={e => setForm({ ...form, jenisSurat: e.target.value })} className="w-full px-4 py-3 rounded-lg border">
//                 {JENIS_SURAT_LIST.map(j => <option key={j}>{j}</option>)}
//               </select>
//               <textarea placeholder="Keterangan (opsional)" rows={3} value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="w-full px-4 py-3 rounded-lg border" />
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-lg border">Batal</button>
//               <button onClick={handleSubmit} className="px-6 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600">Ajukan</button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Modal Detail */}
//       {showDetail && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.6)]">
//           <div className="absolute inset-0" onClick={() => setShowDetail(null)} />
//           <Card extra="relative max-w-lg w-full p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl">
//             <button onClick={() => setShowDetail(null)} className="absolute top-4 right-4"><MdClose className="h-6 w-6" /></button>
//             <h3 className="text-xl font-bold mb-4">Detail Pengajuan</h3>
//             <div className="space-y-3 text-sm">
//               <p><strong>No:</strong> {showDetail.noPengajuan}</p>
//               <p><strong>Nama:</strong> {showDetail.namaWarga}</p>
//               <p><strong>NIK:</strong> {showDetail.nik}</p>
//               <p><strong>Jenis:</strong> {showDetail.jenisSurat}</p>
//               <p><strong>Tanggal:</strong> {showDetail.tanggalPengajuan}</p>
//               {showDetail.keterangan && <p><strong>Keterangan:</strong> {showDetail.keterangan}</p>}
//               {showDetail.catatanAdmin && <p className="p-3 bg-gray-100 dark:bg-navy-700 rounded"><strong>Catatan Admin:</strong> {showDetail.catatanAdmin}</p>}
//             </div>
//             <div className="mt-6">
//               <p className="font-medium mb-3">Ubah Status:</p>
//               <div className="flex flex-wrap gap-2">
//                 {(["Menunggu", "Diproses", "Disetujui", "Ditolak"] as StatusPengajuan[]).map(s => (
//                   <button
//                     key={s}
//                     onClick={() => {
//                       if (s === "Ditolak") {
//                         const alasan = prompt("Alasan penolakan:");
//                         if (alasan !== null) {
//                           updateStatus(showDetail.id, s, alasan || "Tidak ada alasan");
//                           setShowDetail(null);
//                         }
//                       } else {
//                         updateStatus(showDetail.id, s);
//                         setShowDetail(null);
//                       }
//                     }}
//                     className={`px-4 py-2 rounded-lg font-medium transition ${showDetail.status === s ? "bg-brand-500 text-white" : "bg-gray-200 hover:bg-gray-300 dark:bg-navy-600"}`}
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PengajuanSuratPage;



import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdCheckCircle,
  MdClose,
  MdDelete,
  MdDescription,
  MdEdit,
  MdHourglassEmpty,
  MdMail,
  MdPrint,
  MdSearch,
  MdWarning,
} from "react-icons/md";

// === TIPE DATA BARU SESUAI MODUL ===
type StatusPengajuan =
  | "Menunggu Verifikasi RT"
  | "Diverifikasi RT"
  | "Menunggu Pengesahan RW"
  | "Disahkan RW"
  | "Selesai (Siap Dicetak)"
  | "Ditolak";

type PengajuanSurat = {
  id: string;
  noSurat: string;
  noPengajuan: string;
  namaWarga: string;
  nik: string;
  jenisSurat: any; // bukan string!
  keterangan: string;
  tanggalPengajuan: string;
  status: StatusPengajuan;
  catatanRT?: string;
  catatanRW?: string;
  tanggalVerifikasiRT?: string;
  tanggalPengesahanRW?: string;
};

// === DAFTAR JENIS SURAT SESUAI MODUL ===
const JENIS_SURAT_LIST = [
  // Pengantar ke Kelurahan/Kecamatan
  "Pengantar KTP",
  "Pengantar KK",
  "Pengantar Akta Lahir",
  "Pengantar Akta Kematian",
  "Pengantar Surat Pindah",
  "Pengantar Domisili",
  "Pengantar Tidak Mampu (SKTM)",
  "Pengantar Keterangan Usaha",
  "Pengantar SKCK",
  "Pengantar Umum",
  "Pengantar Nikah / Numpang Nikah",
  // Surat Internal RT/RW
  "Surat Keterangan Bertempat Tinggal",
  "Surat Keterangan Kematian",
  "Surat Izin Keramaian",
  "Surat Rekomendasi Kegiatan",
  "Surat Pernyataan Warga",
] as const;

const DEMO_DATA: PengajuanSurat[] = [
  {
    id: "1",
    noSurat: "001/RT.01/RW.05/2025",
    noPengajuan: "SURAT-2025-001",
    namaWarga: "Budi Santoso",
    nik: "3275012345678901",
    jenisSurat: "Pengantar Domisili",
    keterangan: "Untuk pendaftaran sekolah anak",
    tanggalPengajuan: "2025-12-01",
    status: "Disahkan RW",
    catatanRT: "Dokumen lengkap",
    catatanRW: "Sudah diberi nomor surat",
    tanggalVerifikasiRT: "2025-12-01",
    tanggalPengesahanRW: "2025-12-02",
  },
  {
    id: "2",
    noSurat: "",
    noPengajuan: "SURAT-2025-002",
    namaWarga: "Siti Aminah",
    nik: "3275019876543210",
    jenisSurat: "Pengantar SKCK",
    keterangan: "Untuk melamar kerja",
    tanggalPengajuan: "2025-12-02",
    status: "Diverifikasi RT",
    catatanRT: "Menunggu pengesahan RW",
  },
];

const PengajuanSuratPage: React.FC = () => {
  const [pengajuanList, setPengajuanList] = useState<PengajuanSurat[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusPengajuan | "Semua">("Semua");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<PengajuanSurat | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState<{
    namaWarga: string;
    nik: string;
    jenisSurat: any; // Ini kuncinya!
    keterangan: string;
  }>({
    namaWarga: "",
    nik: "",
    jenisSurat: "", // sekarang aman
    keterangan: "",
  });

  // Load & Save
  useEffect(() => {
    const saved = localStorage.getItem("pengajuanSuratListV2");
    if (saved && saved !== "[]") {
      setPengajuanList(JSON.parse(saved));
    } else {
      setPengajuanList(DEMO_DATA);
      localStorage.setItem("pengajuanSuratListV2", JSON.stringify(DEMO_DATA));
    }
  }, []);

  useEffect(() => {
    if (pengajuanList.length > 0) {
      localStorage.setItem("pengajuanSuratListV2", JSON.stringify(pengajuanList));
    }
  }, [pengajuanList]);

  // Toast
  useEffect(() => {
    if (toast) setTimeout(() => setToast(null), 4000);
  }, [toast]);

  // Generate Nomor Pengajuan
  const generateNoPengajuan = () => {
    const year = new Date().getFullYear();
    const count = pengajuanList.length + 1;
    return `SURAT-${year}-${count.toString().padStart(3, "0")}`;
  };

  // Generate Nomor Surat Resmi (contoh: 001/RT.01/RW.05/2025)
  const generateNoSurat = () => {
    const count = pengajuanList.filter(p => p.status === "Disahkan RW" || p.status === "Selesai (Siap Dicetak)").length + 1;
    return `${count.toString().padStart(3, "0")}/RT.01/RW.05/${new Date().getFullYear()}`;
  };

  const filteredData = useMemo(() => {
    return pengajuanList.filter(item => {
      const q = search.toLowerCase();
      const matchSearch =
        item.namaWarga.toLowerCase().includes(q) ||
        item.nik.includes(search) ||
        item.noPengajuan.includes(search) ||
        item.jenisSurat.toLowerCase().includes(q);
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [pengajuanList, search, filterStatus]);

  const stats = useMemo(() => ({
    total: pengajuanList.length,
    menungguRT: pengajuanList.filter(p => p.status === "Menunggu Verifikasi RT").length,
    diprosesRT: pengajuanList.filter(p => p.status === "Diverifikasi RT").length,
    menungguRW: pengajuanList.filter(p => p.status === "Menunggu Pengesahan RW").length,
    selesai: pengajuanList.filter(p => p.status === "Disahkan RW" || p.status === "Selesai (Siap Dicetak)").length,
  }), [pengajuanList]);

  const handleSubmit = () => {
    if (!form.namaWarga.trim() || !form.nik.trim() || form.nik.length !== 16) {
      setToast({ message: "Nama dan NIK 16 digit wajib diisi!", type: "error" });
      return;
    }

    const baru: PengajuanSurat = {
      id: Date.now().toString(),
      noSurat: "",
      noPengajuan: generateNoPengajuan(),
      namaWarga: form.namaWarga.trim(),
      nik: form.nik,
      jenisSurat: form.jenisSurat,
      keterangan: form.keterangan.trim(),
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      status: "Menunggu Verifikasi RT",
    };

    setPengajuanList(prev => [...prev, baru]);
    setShowModal(false);
    setForm({ namaWarga: "", nik: "", jenisSurat: JENIS_SURAT_LIST[0], keterangan: "" });
    setToast({ message: "Pengajuan berhasil diajukan!", type: "success" });
  };

  const updateStatus = (id: string, status: StatusPengajuan, catatan?: string) => {
    setPengajuanList(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, status };
        if (catatan !== undefined) {
          if (status.includes("RT")) updated.catatanRT = catatan;
          if (status.includes("RW")) updated.catatanRW = catatan;
        }
        if (status === "Diverifikasi RT") updated.tanggalVerifikasiRT = new Date().toISOString().split("T")[0];
        if (status === "Disahkan RW") {
          updated.tanggalPengesahanRW = new Date().toISOString().split("T")[0];
          updated.noSurat = item.noSurat || generateNoSurat();
        }
        return updated;
      })
    );
    setToast({ message: `Status diubah → ${status}`, type: "success" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Hapus pengajuan ini?")) {
      setPengajuanList(prev => prev.filter(p => p.id !== id));
      setToast({ message: "Pengajuan dihapus", type: "success" });
    }
  };

  const getStatusColor = (status: StatusPengajuan) => {
    switch (status) {
      case "Menunggu Verifikasi RT": return "bg-orange-100 text-orange-800 dark:bg-orange-900/40";
      case "Diverifikasi RT": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40";
      case "Menunggu Pengesahan RW": return "bg-purple-100 text-purple-800 dark:bg-purple-900/40";
      case "Disahkan RW":
      case "Selesai (Siap Dicetak)": return "bg-green-100 text-green-800 dark:bg-green-900/40";
      case "Ditolak": return "bg-red-100 text-red-800 dark:bg-red-900/40";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-medium animate-slide-up ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <MdCheckCircle className="h-6 w-6" /> : <MdWarning className="h-6 w-6" />}
          {toast.message}
        </div>
      )}

      {/* Widget Statistik */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Widget icon={<MdMail className="h-7 w-7" />} title="Total Pengajuan" subtitle={stats.total.toString()} />
        {/* <Widget icon={<MdHourglassEmpty className="h-7 w-7" />} title="Menunggu" subtitle={stats.menungguRT.toString()} /> */}
        <Widget icon={<MdEdit className="h-7 w-7" />} title="Diproses" subtitle={stats.diprosesRT.toString()} />
        {/* <Widget icon={<MdDescription className="h-7 w-7" />} title="Menunggu RW" subtitle={stats.menungguRW.toString()} /> */}
        <Widget icon={<MdCheckCircle className="h-7 w-7" />} title="Selesai" subtitle={stats.selesai.toString()} />
      </div>

      {/* Header */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-3 ml-[1px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
            <MdDescription className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">Pengajuan Surat</h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-brand-500 text-white shadow-xl hover:shadow-2xl hover:brightness-95 transition-all"
        >
          <MdAdd className="h-6 w-6" />
          Ajukan Surat Baru
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MdSearch className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, NIK, no pengajuan, jenis surat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 h-[38px] rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800"
        >
          <option value="Semua">Semua Status</option>
          <option value="Menunggu Verifikasi RT">Menunggu RT</option>
          <option value="Diverifikasi RT">Diverifikasi RT</option>
          <option value="Menunggu Pengesahan RW">Menunggu RW</option>
          <option value="Disahkan RW">Disahkan RW</option>
          <option value="Selesai (Siap Dicetak)">Selesai</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      {/* Tabel */}
      <div className="mt-6">
        <Card extra="w-full p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto min-w-[1000px]">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-navy-600 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <th className="text-left py-4 px-4">No Surat</th>
                  <th className="text-left py-4 px-4">Warga</th>
                  <th className="text-left py-4 px-4">Jenis Surat</th>
                  <th className="text-left py-4 px-4">Tanggal</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-left py-4 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-500 text-lg">
                      <MdDescription className="mx-auto h-16 w-16 mb-4 opacity-30" />
                      Belum ada pengajuan surat
                    </td>
                  </tr>
                ) : (
                  filteredData.map(item => (
                    <tr key={item.id} className="border-b dark:border-navy-700 hover:bg-gray-50/70 dark:hover:bg-navy-700/50 transition">
                      <td className="py-4 px-4 font-medium">{item.noSurat || "-"}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-navy-700 dark:text-white">{item.namaWarga}</div>
                          <div className="text-xs text-gray-500">{item.nik}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{item.jenisSurat}</td>
                      <td className="py-4 px-4 text-sm">{item.tanggalPengajuan}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setShowDetail(item)} className="text-brand-600 hover:text-brand-700">
                            <MdEdit className="h-5 w-5" />
                          </button>
                          {item.status === "Disahkan RW" && (
                            <button className="text-green-600 hover:text-green-700" title="Cetak Surat">
                              <MdPrint className="h-5 w-5" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700">
                            <MdDelete className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Ajukan Surat & Detail tetap sama — hanya dipercantik sedikit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          <Card extra="relative max-w-2xl w-full p-8 bg-white dark:bg-navy-800 rounded-3xl shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-red-600">
              <MdClose className="h-7 w-7" />
            </button>
            <h3 className="text-2xl font-bold mb-8 text-center">Ajukan Surat Baru</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Nama Lengkap" value={form.namaWarga} onChange={e => setForm({ ...form, namaWarga: e.target.value })} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30" />
              <input placeholder="NIK (16 digit)" maxLength={16} value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value.replace(/\D/g, "").slice(0, 16) })} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30" />
              <select value={form.jenisSurat} onChange={e => setForm({ ...form, jenisSurat: e.target.value })} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 md:col-span-2">
                {JENIS_SURAT_LIST.map(j => <option key={j}>{j}</option>)}
              </select>
              <textarea rows={4} placeholder="Keterangan / keperluan surat" value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700 md:col-span-2 resize-none" />
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-navy-600 font-medium hover:bg-gray-50 dark:hover:bg-navy-700">Batal</button>
              <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                <MdDescription className="h-6 w-6" />
                Ajukan Surat
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Detail & Disposisi */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowDetail(null)} />
          <Card extra="relative max-w-3xl w-full p-8 bg-white dark:bg-navy-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowDetail(null)} className="absolute top-6 right-6 text-gray-500 hover:text-red-600">
              <MdClose className="h-7 w-7" />
            </button>
            <h3 className="text-2xl font-bold mb-6">Detail & Disposisi Surat</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div><strong>No Surat Resmi:</strong> <span className="font-mono text-brand-600">{showDetail.noSurat || "Belum ada"}</span></div>
              <div><strong>No Pengajuan:</strong> {showDetail.noPengajuan}</div>
              <div><strong>Nama Warga:</strong> {showDetail.namaWarga}</div>
              <div><strong>NIK:</strong> {showDetail.nik}</div>
              <div><strong>Jenis Surat:</strong> {showDetail.jenisSurat}</div>
              <div><strong>Tanggal Pengajuan:</strong> {showDetail.tanggalPengajuan}</div>
              {showDetail.keterangan && <div className="md:col-span-2"><strong>Keperluan:</strong> {showDetail.keterangan}</div>}
              {showDetail.catatanRT && <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl"><strong>Catatan RT:</strong> {showDetail.catatanRT}</div>}
              {showDetail.catatanRW && <div className="md:col-span-2 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl"><strong>Catatan RW:</strong> {showDetail.catatanRW}</div>}
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-lg mb-4">Ubah Status Disposisi</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(["Menunggu Verifikasi RT", "Diverifikasi RT", "Menunggu Pengesahan RW", "Disahkan RW", "Selesai (Siap Dicetak)", "Ditolak"] as StatusPengajuan[]).map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      if (s === "Ditolak") {
                        const alasan = prompt("Alasan penolakan:");
                        if (alasan !== null) {
                          updateStatus(showDetail.id, s, alasan || "Tidak ada alasan");
                          setShowDetail(null);
                        }
                      } else if (s.includes("RT") || s.includes("RW")) {
                        const catatan = prompt(`Catatan untuk ${s.includes("RT") ? "RT" : "RW"}:`);
                        updateStatus(showDetail.id, s, catatan || undefined);
                        setShowDetail(null);
                      } else {
                        updateStatus(showDetail.id, s);
                        setShowDetail(null);
                      }
                    }}
                    disabled={showDetail.status === s}
                    className={`px-5 py-3 rounded-xl font-medium transition ${showDetail.status === s ? "bg-brand-500 text-white" : "bg-gray-100 hover:bg-gray-200 dark:bg-navy-700 dark:hover:bg-navy-600"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PengajuanSuratPage;