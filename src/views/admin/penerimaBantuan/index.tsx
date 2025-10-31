import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useMemo, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdPeople, MdSearch } from "react-icons/md";

type Anggota = {
  id: string;
  nik: string;
  nama: string;
  rt: string;
  rw: string;
  bantuan: string[];
};

type KKItem = {
  id: string;
  rt: string;
  rw: string;
  anggota: Anggota[];
};

type BantuanItem = {
  id: string;
  anggotaId: string;
  nik: string;
  nama: string;
  rt: string;
  rw: string;
  jenisBantuan: string;
  tanggal: string;
  status: "Diterima" | "Diproses" | "Ditolak";
};

// === DAFTAR JENIS BANTUAN ===
const JENIS_BANTUAN_MAP: Record<string, string> = {
  bst: "BST",
  bpnt: "BPNT",
  pkh: "PKH",
  pip: "PIP",
  kks: "KKS",
};

const PenerimaBantuan: React.FC = () => {
  const [bantuanList, setBantuanList] = useState<BantuanItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterRtRw, setFilterRtRw] = useState("all");
  const [filterJenisBantuan, setFilterJenisBantuan] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<BantuanItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof BantuanItem | "action"; direction: "asc" | "desc" } | null>(null);

  const [form, setForm] = useState<{
    anggotaId: string; // ID anggota di KK
    jenisBantuan: string;
    tanggal: string;
    status: "Diterima" | "Diproses" | "Ditolak";
  }>({
    anggotaId: "",
    jenisBantuan: "",
    tanggal: new Date().toISOString().split("T")[0],
    status: "Diproses",
  });

  // === AMBIL DATA KK DARI LOCALSTORAGE ===
  const kkList: KKItem[] = useMemo(() => {
    const saved = localStorage.getItem("dataKK");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  }, []);

  // === EKSTRAK SEMUA PENERIMA BANTUAN DARI KK ===
  const semuaPenerima = useMemo(() => {
    const penerima: BantuanItem[] = [];
    kkList.forEach((kk) => {
      kk.anggota.forEach((anggota) => {
        anggota.bantuan.forEach((bantuanId) => {
          const existing = penerima.find(
            (p) => p.anggotaId === anggota.id && p.jenisBantuan === JENIS_BANTUAN_MAP[bantuanId]
          );
          if (!existing) {
            penerima.push({
              id: `${anggota.id}-${bantuanId}`,
              nik: anggota.nik,
              nama: anggota.nama,
              rt: kk.rt,
              rw: kk.rw,
              jenisBantuan: JENIS_BANTUAN_MAP[bantuanId],
              tanggal: new Date().toISOString().split("T")[0], // default
              status: "Diproses",
              anggotaId: anggota.id,
            });
          }
        });
      });
    });
    return penerima;
  }, [kkList]);

  // === LOAD DATA BANTUAN DARI LOCALSTORAGE (jika ada custom edit) ===
  useEffect(() => {
    const saved = localStorage.getItem("bantuanList");
    if (saved && JSON.parse(saved).length > 0) {
      setBantuanList(JSON.parse(saved));
    } else {
      setBantuanList(semuaPenerima);
    }
  }, [semuaPenerima]);

  // === SIMPAN KE LOCALSTORAGE ===
  useEffect(() => {
    localStorage.setItem("bantuanList", JSON.stringify(bantuanList));
  }, [bantuanList]);

  // === DAFTAR RT/RW UNIK ===
  const rtRwOptions = Array.from(new Set(kkList.map((k) => `${k.rt}/${k.rw}`))).sort();

  // === DAFTAR JENIS BANTUAN UNIK ===
  const jenisBantuanOptions = Array.from(
    new Set(bantuanList.map((b) => b.jenisBantuan))
  ).sort();

  // === DAFTAR ANGGOTA YANG BISA DITAMBAH (hanya yang punya bantuan) ===
  const daftarAnggotaPenerima = useMemo(() => {
    const list: { id: string; nik: string; nama: string; rt: string; rw: string; jenis: string }[] = [];
    kkList.forEach((kk) => {
      kk.anggota.forEach((a) => {
        a.bantuan.forEach((bId) => {
          list.push({
            id: a.id,
            nik: a.nik,
            nama: a.nama,
            rt: kk.rt,
            rw: kk.rw,
            jenis: JENIS_BANTUAN_MAP[bId],
          });
        });
      });
    });
    return list;
  }, [kkList]);

  // === FILTER & SEARCH ===
  const filteredData = useMemo(() => {
    return bantuanList.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.nik.includes(search);
      const matchRtRw = filterRtRw === "all" || `${item.rt}/${item.rw}` === filterRtRw;
      const matchJenis = filterJenisBantuan === "all" || item.jenisBantuan === filterJenisBantuan;
      return matchSearch && matchRtRw && matchJenis;
    });
  }, [bantuanList, search, filterRtRw, filterJenisBantuan]);

  // === SORTING ===
  const sortedData = useMemo(() => {
    const data = [...filteredData];
    if (sortConfig && sortConfig.key !== "action") {
      data.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof BantuanItem];
        let bVal: any = b[sortConfig.key as keyof BantuanItem];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [filteredData, sortConfig]);

  // === SUBMIT (Tambah/Edit) ===
  const handleSubmit = () => {
    const anggota = daftarAnggotaPenerima.find((a) => a.id === form.anggotaId);
    if (!anggota) {
      alert("Pilih penerima bantuan!");
      return;
    }
    if (!form.jenisBantuan) {
      alert("Pilih jenis bantuan!");
      return;
    }

    if (editItem) {
      setBantuanList((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? { ...item, ...form, nama: anggota.nama, rt: anggota.rt, rw: anggota.rw }
            : item
        )
      );
    } else {
      const newItem: BantuanItem = {
        id: Date.now().toString(),
        nik: anggota.nik,
        nama: anggota.nama,
        rt: anggota.rt,
        rw: anggota.rw,
        jenisBantuan: form.jenisBantuan,
        tanggal: form.tanggal,
        status: form.status,
        anggotaId: form.anggotaId,
      };
      setBantuanList((prev) => [...prev, newItem]);
    }
    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setEditItem(null);
    setForm({
      anggotaId: "",
      jenisBantuan: "",
      tanggal: new Date().toISOString().split("T")[0],
      status: "Diproses",
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Hapus data penerima bantuan ini?")) {
      setBantuanList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openEdit = (item: BantuanItem) => {
    const anggota = daftarAnggotaPenerima.find((a) => a.nik === item.nik && a.jenis === item.jenisBantuan);
    if (anggota) {
      setEditItem(item);
      setForm({
        anggotaId: anggota.id,
        jenisBantuan: item.jenisBantuan,
        tanggal: item.tanggal,
        status: item.status,
      });
      setShowModal(true);
    }
  };

  const requestSort = (key: keyof BantuanItem | "action") => {
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
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white min-w-[140px]"
        >
          <option value="all">Semua RT/RW</option>
          {rtRwOptions.map((rtRw) => (
            <option key={rtRw} value={rtRw}>
              RT {rtRw}
            </option>
          ))}
        </select>

        <select
          value={filterJenisBantuan}
          onChange={(e) => setFilterJenisBantuan(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white min-w-[160px]"
        >
          <option value="all">Semua Jenis Bantuan</option>
          {jenisBantuanOptions.map((jenis) => (
            <option key={jenis} value={jenis}>
              {jenis}
            </option>
          ))}
        </select>
      </div>

      {/* TABEL */}
      <div className="mt-5">
        <Card extra="w-full p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-navy-600">
                  <th
                    onClick={() => requestSort("nik")}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white hover:text-brand-500"
                  >
                    NIK {sortConfig?.key === "nik" && (sortConfig.direction === "asc" ? "Up" : "Down")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">NAMA</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">JENIS BANTUAN</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">STATUS</th>
                  <th
                    onClick={() => requestSort("tanggal")}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white hover:text-brand-500"
                  >
                    TANGGAL {sortConfig?.key === "tanggal" && (sortConfig.direction === "asc" ? "Up" : "Down")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Edit"
                          >
                            <MdEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetModal} />
          <Card extra="relative w-full max-w-lg p-6">
            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
              {editItem ? "Edit" : "Tambah"} Penerima Bantuan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penerima</label>
                <select
                  value={form.anggotaId}
                  onChange={(e) => setForm({ ...form, anggotaId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                >
                  <option value="">Pilih penerima</option>
                  {daftarAnggotaPenerima.map((a) => (
                    <option key={`${a.id}-${a.jenis}`} value={a.id}>
                      {a.nik} - {a.nama} ({a.jenis}) - RT {a.rt}/RW {a.rw}
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
                  {Object.values(JENIS_BANTUAN_MAP).map((jenis) => (
                    <option key={jenis} value={jenis}>
                      {jenis}
                    </option>
                  ))}
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
                onClick={resetModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white dark:hover:bg-navy-700"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.anggotaId || !form.jenisBantuan}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
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