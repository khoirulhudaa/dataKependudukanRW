// src/views/admin/provinsi/index.tsx
import React, { useState, useEffect, useMemo } from "react";
import Widget from "components/widget/Widget";
import Card from "components/card";
import { MdPublic, MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";

type Provinsi = {
  id: string;
  kode: string;
  nama: string;
  ibukota: string;
  pulau: string;
  jumlahKabKota: number;
  luasWilayah: number; // dalam km²
};

const ProvinsiPage: React.FC = () => {
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Provinsi | null>(null);

  const [form, setForm] = useState({
    kode: "",
    nama: "",
    ibukota: "",
    pulau: "",
    jumlahKabKota: 1,
    luasWilayah: 0,
  });

  // Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("provinsiList");
    if (saved) {
      setProvinsiList(JSON.parse(saved));
    } else {
      // Data contoh
      setProvinsiList([
        {
          id: "1",
          kode: "32",
          nama: "Jawa Barat",
          ibukota: "Bandung",
          pulau: "Jawa",
          jumlahKabKota: 27,
          luasWilayah: 35357,
        },
        {
          id: "2",
          kode: "31",
          nama: "DKI Jakarta",
          ibukota: "Jakarta",
          pulau: "Jawa",
          jumlahKabKota: 6,
          luasWilayah: 664,
        },
      ]);
    }
  }, []);

  // Save ke localStorage
  useEffect(() => {
    localStorage.setItem("provinsiList", JSON.stringify(provinsiList));
  }, [provinsiList]);

  // Hitung total kab/kota dari Kelurahan (jika ada)
  const totalKabKota = useMemo(() => {
    const kelurahanData = localStorage.getItem("kelurahanList");
    if (!kelurahanData) return 0;
    const kelurahanList = JSON.parse(kelurahanData);
    const kabKotaSet = new Set(kelurahanList.map((k: any) => k.kotaKab));
    return kabKotaSet.size;
  }, [provinsiList]);

  // Filter data
  const filteredData = useMemo(() => {
    return provinsiList.filter(
      (item) =>
        item.kode.includes(search) ||
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.ibukota.toLowerCase().includes(search.toLowerCase()) ||
        item.pulau.toLowerCase().includes(search.toLowerCase())
    );
  }, [provinsiList, search]);

  // Handle submit
  const handleSubmit = () => {
    if (!form.kode || !form.nama || !form.ibukota || !form.pulau) {
      alert("Kode, Nama, Ibukota, dan Pulau wajib diisi!");
      return;
    }

    if (editItem) {
      setProvinsiList((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? { ...item, ...form, jumlahKabKota: Number(form.jumlahKabKota), luasWilayah: Number(form.luasWilayah) }
            : item
        )
      );
    } else {
      const newItem: Provinsi = {
        id: Date.now().toString(),
        ...form,
        jumlahKabKota: Number(form.jumlahKabKota),
        luasWilayah: Number(form.luasWilayah),
      };
      setProvinsiList((prev) => [...prev, newItem]);
    }

    setShowModal(false);
    setEditItem(null);
    setForm({ kode: "", nama: "", ibukota: "", pulau: "", jumlahKabKota: 1, luasWilayah: 0 });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm("Hapus provinsi ini?")) {
      setProvinsiList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Open edit
  const openEdit = (item: Provinsi) => {
    setEditItem(item);
    setForm({
      kode: item.kode,
      nama: item.nama,
      ibukota: item.ibukota,
      pulau: item.pulau,
      jumlahKabKota: item.jumlahKabKota,
      luasWilayah: item.luasWilayah,
    });
    setShowModal(true);
  };

  return (
    <div>
      {/* Widget Summary */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
        <Widget icon={<MdPublic className="h-7 w-7" />} title="Total Provinsi" subtitle={provinsiList.length.toString()} />
        <Widget icon={<MdPublic className="h-7 w-7" />} title="Total Kab/Kota" subtitle={totalKabKota.toString()} />
        <Widget
          icon={<MdPublic className="h-7 w-7" />}
          title="Luas Rata-rata"
          subtitle={
            provinsiList.length > 0
              ? `${(provinsiList.reduce((a, b) => a + b.luasWilayah, 0) / provinsiList.length).toFixed(0)} km²`
              : "0 km²"
          }
        />
      </div>

      {/* Header + Tombol Tambah */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 ml-[1px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
            <MdPublic className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">Kelola Data Provinsi</h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          <MdAdd className="h-5 w-5" />
          Tambah Provinsi
        </button>
      </div>

      {/* Search */}
      <div className="mt-5">
        <div className="relative">
          <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kode, nama, ibukota, atau pulau..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="mt-5">
        <Card extra="w-full p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-navy-600">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">KODE</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">NAMA PROVINSI</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">IBUKOTA</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">PULAU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">KAB/KOTA</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">LUAS (km²)</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      Belum ada data provinsi.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-navy-700">
                      <td className="px-4 py-3 font-mono text-sm">{item.kode}</td>
                      <td className="px-4 py-3 font-medium text-navy-700 dark:text-white">{item.nama}</td>
                      <td className="px-4 py-3 text-sm">{item.ibukota}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          item.pulau === "Jawa"
                            ? "bg-green-100 text-green-700"
                            : item.pulau === "Sumatera"
                            ? "bg-blue-100 text-blue-700"
                            : item.pulau === "Kalimantan"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.pulau === "Sulawesi"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        } dark:bg-opacity-50`}>
                          {item.pulau}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                          {item.jumlahKabKota}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono">
                        {item.luasWilayah.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(item)} className="text-blue-500 hover:text-blue-700">
                            <MdEdit className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
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
                setForm({ kode: "", nama: "", ibukota: "", pulau: "", jumlahKabKota: 1, luasWilayah: 0 });
            }}
          />
          <Card extra="w-full max-w-xl p-6">
            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
              {editItem ? "Edit" : "Tambah"} Provinsi
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode Provinsi</label>
                <input
                  type="text"
                  value={form.kode}
                  onChange={(e) => setForm({ ...form, kode: e.target.value })}
                  placeholder="32"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Provinsi</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Jawa Barat"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ibukota</label>
                <input
                  type="text"
                  value={form.ibukota}
                  onChange={(e) => setForm({ ...form, ibukota: e.target.value })}
                  placeholder="Bandung"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pulau</label>
                <select
                  value={form.pulau}
                  onChange={(e) => setForm({ ...form, pulau: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                >
                  <option value="">Pilih Pulau</option>
                  <option>Jawa</option>
                  <option>Sumatera</option>
                  <option>Kalimantan</option>
                  <option>Sulawesi</option>
                  <option>Bali & Nusa Tenggara</option>
                  <option>Maluku & Papua</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah Kab/Kota</label>
                <input
                  type="number"
                  min="1"
                  value={form.jumlahKabKota}
                  onChange={(e) => setForm({ ...form, jumlahKabKota: parseInt(e.target.value) || 1 })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Luas Wilayah (km²)</label>
                <input
                  type="number"
                  min="0"
                  value={form.luasWilayah}
                  onChange={(e) => setForm({ ...form, luasWilayah: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditItem(null);
                  setForm({ kode: "", nama: "", ibukota: "", pulau: "", jumlahKabKota: 1, luasWilayah: 0 });
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.kode || !form.nama || !form.ibukota || !form.pulau}
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

export default ProvinsiPage;