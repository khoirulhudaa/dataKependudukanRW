import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdCheckCircle,
  MdClose,
  MdDelete,
  MdEdit,
  MdHourglassEmpty,
  MdMail,
  MdSearch,
  MdWarning,
} from "react-icons/md";

// === TIPE DATA ===
type StatusPengajuan = "Menunggu" | "Diproses" | "Disetujui" | "Ditolak";

type PengajuanSurat = {
  id: string;
  noPengajuan: string;
  namaWarga: string;
  nik: string;
  jenisSurat: string;
  keterangan: string;
  tanggalPengajuan: string;
  status: StatusPengajuan;
  catatanAdmin?: string;
};

const JENIS_SURAT_LIST = [
  "Surat Keterangan Domisili",
  "Surat Keterangan Usaha",
  "Surat Keterangan Tidak Mampu (SKTM)",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Kematian",
  "Surat Keterangan Ahli Waris",
  "Surat Pengantar SKCK",
  "Surat Pengantar Nikah",
  "Surat Pengantar untuk instansi lain",
  "Surat Pengantar Legalisasi",
  "Surat Izin Rame-rame",
  "Surat Permohonan",
];

// DATA DEMO (akan dipakai jika localStorage kosong)
const DEMO_DATA: PengajuanSurat[] = [
  {
    id: "1",
    noPengajuan: "SURAT-2025-001",
    namaWarga: "Budi Santoso",
    nik: "3275012345678901",
    jenisSurat: "Surat Keterangan Domisili",
    keterangan: "Untuk pendaftaran sekolah anak",
    tanggalPengajuan: "2025-11-15",
    status: "Diproses",
    catatanAdmin: "Dokumen lengkap, sedang dicetak",
  },
  {
    id: "2",
    noPengajuan: "SURAT-2025-002",
    namaWarga: "Siti Aminah",
    nik: "3275019876543210",
    jenisSurat: "Surat Pengantar SKCK",
    keterangan: "Untuk melamar kerja di BUMN",
    tanggalPengajuan: "2025-11-14",
    status: "Menunggu",
  },
  {
    id: "3",
    noPengajuan: "SURAT-2025-003",
    namaWarga: "Ahmad Fauzi",
    nik: "3275010101900001",
    jenisSurat: "Surat Keterangan Tidak Mampu (SKTM)",
    keterangan: "Untuk pengobatan gratis",
    tanggalPengajuan: "2025-11-10",
    status: "Disetujui",
    catatanAdmin: "Sudah bisa diambil di kantor RT",
  },
];

const PengajuanSuratPage: React.FC = () => {
  const [pengajuanList, setPengajuanList] = useState<PengajuanSurat[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusPengajuan | "Semua">("Semua");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<PengajuanSurat | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    namaWarga: "",
    nik: "",
    jenisSurat: JENIS_SURAT_LIST[0],
    keterangan: "",
  });

  // Load data (pakai demo jika kosong)
  useEffect(() => {
    const saved = localStorage.getItem("pengajuanSuratList");
    if (saved && saved !== "[]") {
      setPengajuanList(JSON.parse(saved));
    } else {
      setPengajuanList(DEMO_DATA);
      localStorage.setItem("pengajuanSuratList", JSON.stringify(DEMO_DATA));
    }
  }, []);

  // Simpan setiap ada perubahan
  useEffect(() => {
    if (pengajuanList.length > 0) {
      localStorage.setItem("pengajuanSuratList", JSON.stringify(pengajuanList));
    }
  }, [pengajuanList]);

  // Toast sederhana
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Generate nomor pengajuan otomatis
  const generateNoPengajuan = () => {
    const year = new Date().getFullYear();
    const count = pengajuanList.length + 1;
    return `SURAT-${year}-${count.toString().padStart(3, "0")}`;
  };

  const filteredData = useMemo(() => {
    const query = search.toLowerCase();

    return pengajuanList.filter((item) => {
      const matchesSearch =
        (item.namaWarga ?? "").toLowerCase().includes(query) ||
        (item.nik ?? "").includes(search) ||
        (item.noPengajuan ?? "").includes(search) ||
        (item.jenisSurat ?? "").toLowerCase().includes(query);

      const matchesStatus = filterStatus === "Semua" || item.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [pengajuanList, search, filterStatus]);

  const stats = useMemo(() => ({
    total: pengajuanList.length,
    menunggu: pengajuanList.filter(p => p.status === "Menunggu").length,
    diproses: pengajuanList.filter(p => p.status === "Diproses").length,
    selesai: pengajuanList.filter(p => p.status === "Disetujui" || p.status === "Ditolak").length,
  }), [pengajuanList]);

  const handleSubmit = () => {
    if (!form.namaWarga.trim() || !form.nik.trim() || form.nik.length !== 16) {
      setToast({ message: "Nama dan NIK 16 digit wajib diisi!", type: "error" });
      return;
    }

    const baru: PengajuanSurat = {
      id: Date.now().toString(),
      noPengajuan: generateNoPengajuan(),
      namaWarga: form.namaWarga.trim(),
      nik: form.nik,
      jenisSurat: form.jenisSurat,
      keterangan: form.keterangan.trim(),
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      status: "Menunggu",
    };

    setPengajuanList(prev => [...prev, baru]);
    setShowModal(false);
    setForm({ namaWarga: "", nik: "", jenisSurat: JENIS_SURAT_LIST[0], keterangan: "" });
    setToast({ message: "Pengajuan berhasil diajukan!", type: "success" });
  };

  const updateStatus = (id: string, status: StatusPengajuan, catatan?: string) => {
    setPengajuanList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status, catatanAdmin: catatan || item.catatanAdmin } : item
      )
    );
    setToast({ message: `Status diubah menjadi "${status}"`, type: "success" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Yakin ingin menghapus pengajuan ini?")) {
      setPengajuanList(prev => prev.filter(item => item.id !== id));
      setToast({ message: "Pengajuan dihapus!", type: "success" });
    }
  };

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-medium animate-slide-up ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <MdCheckCircle className="h-6 w-6" /> : <MdWarning className="h-6 w-6" />}
          {toast.message}
        </div>
      )}

      {/* Widget */}
      <div className="mt-3 grid grid-cols-2 gap-5 md:grid-cols-4">
        <Widget icon={<MdMail className="h-7 w-7" />} title="Total" subtitle={stats.total.toString()} />
        <Widget icon={<MdHourglassEmpty className="h-7 w-7" />} title="Menunggu" subtitle={stats.menunggu.toString()} />
        <Widget icon={<MdEdit className="h-7 w-7" />} title="Diproses" subtitle={stats.diproses.toString()} />
        <Widget icon={<MdCheckCircle className="h-7 w-7" />} title="Selesai" subtitle={stats.selesai.toString()} />
      </div>

      {/* Header */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
            <MdMail className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">Pengajuan Surat Online</h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <MdAdd className="h-5 w-5" />
          Ajukan Surat Baru
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, NIK, no pengajuan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-700"
        >
          <option value="Semua">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Diproses">Diproses</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      {/* Tabel */}
      <div className="mt-6">
        <Card extra="w-full p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto min-w-[900px]">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-navy-600">
                  <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">No Pengajuan</th>
                  <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Warga</th>
                  <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Jenis Surat</th>
                  <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Tanggal</th>
                  <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      Belum ada pengajuan surat.
                    </td>
                  </tr>
                ) : (
                  filteredData.map(item => (
                    <tr key={item.id} className="border-b dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition">
                      <td className="py-4 px-4 font-medium">{item.noPengajuan}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-navy-700 dark:text-white">{item.namaWarga}</div>
                          <div className="text-xs text-gray-500">{item.nik}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{item.jenisSurat}</td>
                      <td className="py-4 px-4 text-sm">{item.tanggalPengajuan}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Menunggu" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50" :
                          item.status === "Diproses" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50" :
                          item.status === "Disetujui" ? "bg-green-100 text-green-800 dark:bg-green-900/50" :
                          "bg-red-100 text-red-800 dark:bg-red-900/50"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => setShowDetail(item)} className="text-blue-600 hover:text-blue-800">
                            <MdEdit className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
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

      {/* Modal Ajukan Surat */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.6)]">
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          <Card extra="relative max-w-lg w-full p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <MdClose className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-6">Ajukan Surat Baru</h3>
            <div className="space-y-4">
              <input placeholder="Nama Lengkap" value={form.namaWarga} onChange={e => setForm({ ...form, namaWarga: e.target.value })} className="w-full px-4 py-3 rounded-lg border" />
              <input placeholder="NIK (16 digit)" maxLength={16} value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value.replace(/\D/g, "").slice(0, 16) })} className="w-full px-4 py-3 rounded-lg border" />
              <select value={form.jenisSurat} onChange={e => setForm({ ...form, jenisSurat: e.target.value })} className="w-full px-4 py-3 rounded-lg border">
                {JENIS_SURAT_LIST.map(j => <option key={j}>{j}</option>)}
              </select>
              <textarea placeholder="Keterangan (opsional)" rows={3} value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="w-full px-4 py-3 rounded-lg border" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-lg border">Batal</button>
              <button onClick={handleSubmit} className="px-6 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600">Ajukan</button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Detail */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="absolute inset-0" onClick={() => setShowDetail(null)} />
          <Card extra="relative max-w-lg w-full p-6 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl">
            <button onClick={() => setShowDetail(null)} className="absolute top-4 right-4"><MdClose className="h-6 w-6" /></button>
            <h3 className="text-xl font-bold mb-4">Detail Pengajuan</h3>
            <div className="space-y-3 text-sm">
              <p><strong>No:</strong> {showDetail.noPengajuan}</p>
              <p><strong>Nama:</strong> {showDetail.namaWarga}</p>
              <p><strong>NIK:</strong> {showDetail.nik}</p>
              <p><strong>Jenis:</strong> {showDetail.jenisSurat}</p>
              <p><strong>Tanggal:</strong> {showDetail.tanggalPengajuan}</p>
              {showDetail.keterangan && <p><strong>Keterangan:</strong> {showDetail.keterangan}</p>}
              {showDetail.catatanAdmin && <p className="p-3 bg-gray-100 dark:bg-navy-700 rounded"><strong>Catatan Admin:</strong> {showDetail.catatanAdmin}</p>}
            </div>
            <div className="mt-6">
              <p className="font-medium mb-3">Ubah Status:</p>
              <div className="flex flex-wrap gap-2">
                {(["Menunggu", "Diproses", "Disetujui", "Ditolak"] as StatusPengajuan[]).map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      if (s === "Ditolak") {
                        const alasan = prompt("Alasan penolakan:");
                        if (alasan !== null) {
                          updateStatus(showDetail.id, s, alasan || "Tidak ada alasan");
                          setShowDetail(null);
                        }
                      } else {
                        updateStatus(showDetail.id, s);
                        setShowDetail(null);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition ${showDetail.status === s ? "bg-brand-500 text-white" : "bg-gray-200 hover:bg-gray-300 dark:bg-navy-600"}`}
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