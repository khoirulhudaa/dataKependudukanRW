import React, { useState, useEffect, useMemo } from "react";
import Widget from "components/widget/Widget";
import Card from "components/card";
import { MdPeople, MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";

// === TIPE DATA ===
type KtpItem = {
  nik: string;
  nama: string;
  rt: string;
  rw: string;
  alamat: string;
};

type BantuanItem = {
  id: string;
  nik: string;
  nama: string;
  rt: string;
  rw: string;
  jenisBantuan: string;
  tanggal: string;
  status: "Diterima" | "Diproses" | "Ditolak";
};

// === DATA KTP ===
const ktpData: KtpItem[] = [
  { nik: "3275010101900001", nama: "Ahmad Fauzi", rt: "01", rw: "001", alamat: "Jl. Merdeka No. 1" },
  { nik: "3275014102900002", nama: "Siti Aisyah", rt: "01", rw: "001", alamat: "Jl. Merdeka No. 1" },
  { nik: "3275010202850003", nama: "Budi Santoso", rt: "02", rw: "001", alamat: "Jl. Sudirman No. 5" },
  { nik: "3275010303850004", nama: "Citra Lestari", rt: "03", rw: "002", alamat: "Jl. Ahmad Yani No. 10" },
];

// === KOMPONEN UTAMA ===
const PenerimaBantuan: React.FC = () => {
  const [bantuanList, setBantuanList] = useState<BantuanItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterRtRw, setFilterRtRw] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<BantuanItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof BantuanItem | "progress" | "action"; direction: "asc" | "desc" } | null>(null);

  const [form, setForm] = useState<{
    nik: string;
    jenisBantuan: string;
    tanggal: string;
    status: "Diterima" | "Diproses" | "Ditolak";
  }>({
    nik: "",
    jenisBantuan: "",
    tanggal: new Date().toISOString().split("T")[0],
    status: "Diproses",
  });

  // Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bantuanList");
    if (saved) setBantuanList(JSON.parse(saved));
  }, []);

  // Save ke localStorage
  useEffect(() => {
    localStorage.setItem("bantuanList", JSON.stringify(bantuanList));
  }, [bantuanList]);

  // Filter & Search
  const filteredData = useMemo(() => {
    return bantuanList.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.nik.includes(search);
      const matchRtRw = filterRtRw === "all" || `${item.rt}/${item.rw}` === filterRtRw;
      return matchSearch && matchRtRw;
    });
  }, [bantuanList, search, filterRtRw]);

  // Sorting
  const sortedData = useMemo(() => {
    const data = [...filteredData];
    if (sortConfig) {
      data.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof BantuanItem];
        let bVal: any = b[sortConfig.key as keyof BantuanItem];

        if (sortConfig.key === "progress") {
          aVal = a.status === "Diterima" ? 100 : a.status === "Diproses" ? 60 : 20;
          bVal = b.status === "Diterima" ? 100 : b.status === "Diproses" ? 60 : 20;
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [filteredData, sortConfig]);

  // Daftar RT/RW unik
  const rtRwOptions = Array.from(new Set(ktpData.map((k) => `${k.rt}/${k.rw}`))).sort();

  // Handle submit
  const handleSubmit = () => {
    const ktp = ktpData.find((k) => k.nik === form.nik);
    if (!ktp) {
      alert("NIK tidak ditemukan di data KTP!");
      return;
    }

    if (editItem) {
      setBantuanList((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? {
                ...item,
                ...form,
                nama: ktp.nama,
                rt: ktp.rt,
                rw: ktp.rw,
              }
            : item
        )
      );
    } else {
      const newItem: BantuanItem = {
        id: Date.now().toString(),
        nik: form.nik,
        nama: ktp.nama,
        rt: ktp.rt,
        rw: ktp.rw,
        jenisBantuan: form.jenisBantuan,
        tanggal: form.tanggal,
        status: form.status,
      };
      setBantuanList((prev) => [...prev, newItem]);
    }

    setShowModal(false);
    setEditItem(null);
    setForm({
      nik: "",
      jenisBantuan: "",
      tanggal: new Date().toISOString().split("T")[0],
      status: "Diproses",
    });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm("Hapus data penerima bantuan ini?")) {
      setBantuanList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Open edit
  const openEdit = (item: BantuanItem) => {
    setEditItem(item);
    setForm({
      nik: item.nik,
      jenisBantuan: item.jenisBantuan,
      tanggal: item.tanggal,
      status: item.status,
    });
    setShowModal(true);
  };

  // Sorting handler
  const requestSort = (key: keyof BantuanItem | "progress" | "action") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      {/* Widget Summary */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Total Penerima" subtitle={bantuanList.length.toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Diterima" subtitle={bantuanList.filter((b) => b.status === "Diterima").length.toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Diproses" subtitle={bantuanList.filter((b) => b.status === "Diproses").length.toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Ditolak" subtitle={bantuanList.filter((b) => b.status === "Ditolak").length.toString()} />
      </div>

      {/* Header + Tombol Tambah */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 ml-[1px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
            <MdPeople className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">Penerima Bantuan Kelurahan</h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          <MdAdd className="h-5 w-5" />
          Tambah Penerima
        </button>
      </div>

      {/* Filter & Search */}
      <div className="mt-5 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            />
          </div>
        </div>
        <select
          value={filterRtRw}
          onChange={(e) => setFilterRtRw(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
        >
          <option value="all">Semua RT/RW</option>
          {rtRwOptions.map((rtRw) => (
            <option key={rtRw} value={rtRw}>
              RT {rtRw}
            </option>
          ))}
        </select>
      </div>

      {/* TABEL MANUAL (TANPA TANSTACK) */}
      <div className="mt-5">
        <Card extra="w-full p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-navy-600">
                  <th
                    onClick={() => requestSort("nik")}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white"
                  >
                    NIK {sortConfig?.key === "nik" ? (sortConfig.direction === "asc" ? "Up" : "Down") : ""}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">NAMA</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">JENIS BANTUAN</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">STATUS</th>
                  <th
                    onClick={() => requestSort("tanggal")}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white"
                  >
                    TANGGAL {sortConfig?.key === "tanggal" ? (sortConfig.direction === "asc" ? "Up" : "Down") : ""}
                  </th>
                  <th
                    onClick={() => requestSort("progress")}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white"
                  >
                    PROGRESS {sortConfig?.key === "progress" ? (sortConfig.direction === "asc" ? "Up" : "Down") : ""}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      Belum ada data penerima bantuan.
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-navy-700">
                      <td className="px-4 py-3 text-xs text-gray-500">{item.nik}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-navy-700 dark:text-white">{item.nama}</div>
                          <div className="text-xs text-gray-500">RT {item.rt}/RW {item.rw}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.jenisBantuan}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.status === "Diterima"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : item.status === "Diproses"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.tanggal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-navy-600">
                            <div
                              className={`h-full rounded-full ${
                                item.status === "Diterima"
                                  ? "bg-green-500"
                                  : item.status === "Diproses"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${
                                  item.status === "Diterima" ? 100 : item.status === "Diproses" ? 60 : 20
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {item.status === "Diterima" ? 100 : item.status === "Diproses" ? 60 : 20}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <MdEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Hapus"
                          >
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

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          {/* OVERLAY GELAP + BLUR */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setShowModal(false);
              setEditItem(null);
              setForm({
                nik: "",
                jenisBantuan: "",
                tanggal: new Date().toISOString().split("T")[0],
                status: "Diproses",
              });
            }}
          />
          <Card extra="w-full max-w-lg p-6">
            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
              {editItem ? "Edit" : "Tambah"} Penerima Bantuan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">NIK</label>
                <select
                  value={form.nik}
                  onChange={(e) => setForm({ ...form, nik: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                >
                  <option value="">Pilih NIK</option>
                  {ktpData.map((k) => (
                    <option key={k.nik} value={k.nik}>
                      {k.nik} - {k.nama} (RT {k.rt}/RW {k.rw})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Bantuan</label>
                <select
                  value={form.jenisBantuan}
                  onChange={(e) => setForm({ ...form, jenisBantuan: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                >
                  <option value="">Pilih bantuan</option>
                  <option>Bantuan Pangan</option>
                  <option>Bantuan Tunai</option>
                  <option>Bantuan Kesehatan</option>
                  <option>Bantuan Pendidikan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                >
                  <option value="Diproses">Diproses</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditItem(null);
                  setForm({
                    nik: "",
                    jenisBantuan: "",
                    tanggal: new Date().toISOString().split("T")[0],
                    status: "Diproses",
                  });
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.nik || !form.jenisBantuan}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {editItem ? "Simpan" : "Tambah"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PenerimaBantuan;