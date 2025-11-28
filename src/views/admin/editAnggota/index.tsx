// components/EditAnggota.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdArrowBack, MdSave, MdAdd } from "react-icons/md";
import Card from "components/card";

type GolonganDarah = "A" | "B" | "AB" | "O" | "Tidak Tahu";
type StatusDesil = "Miskin" | "Rentan Miskin" | "Cukup" | "Mandiri";
type Mutasi = { tanggal: string; jenis: "Masuk" | "Keluar"; keterangan?: string };

type Anggota = {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string;
  statusKeluarga: string;
  pendidikan: string;
  pekerjaan: string;
  bantuan: string[];
  status: "Hidup" | "Meninggal" | "Pindah";
  golonganDarah: GolonganDarah;
  disabilitas: boolean;
  kebutuhanKhusus: string;
  statusDesil: StatusDesil;
  mutasi: Mutasi[];
  ktpUrl?: string;
  statusKawin: "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati";
  agama: "Islam" | "Kristen" | "Katolik" | "Hindu" | "Buddha" | "Konghucu" | "Lainnya";
  keterangan: string;
  kelengkapanArsipRT: string[];
  statusWarga: "Tetap" | "Tidak Tetap";
  yatim: boolean;
  piatu: boolean;
};

const DAFTAR_BANTUAN = ["BST", "BPNT", "PKH", "PIP", "KKS"];
const KEBUTUHAN_KHUSUS = ["Kursi Roda", "Alat Bantu Dengar", "Tongkat", "Prostesis", "Bantuan Sensorik", "Lainnya"];

const EditAnggota: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [form, setForm] = useState<Partial<Anggota>>({});

  // Untuk mutasi
  const [mutasiBaru, setMutasiBaru] = useState({ tanggal: "", jenis: "Masuk" as "Masuk" | "Keluar", keterangan: "" });

  useEffect(() => {
    if (id) {
      const dataKK = JSON.parse(localStorage.getItem("dataKK") || "[]");
      let found: Anggota | null = null;
      for (const kk of dataKK) {
        found = kk.anggota.find((a: Anggota) => a.id === id);
        if (found) break;
      }
      if (found) {
        setAnggota(found);
        setForm(found);
      } else {
        alert("Anggota tidak ditemukan!");
        navigate("/admin/data-kk");
      }
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (!anggota || !form.nik || !form.nama) {
      alert("NIK dan Nama wajib diisi!");
      return;
    }

    const dataKK = JSON.parse(localStorage.getItem("dataKK") || "[]");
    const updated = dataKK.map((kk: any) => ({
      ...kk,
      anggota: kk.anggota.map((a: Anggota) =>
        a.id === anggota.id ? { ...a, ...form } : a
      ),
    }));
    localStorage.setItem("dataKK", JSON.stringify(updated));
    alert("Data anggota berhasil diperbarui!");
    navigate(-1);
  };

  const tambahMutasi = () => {
    if (!mutasiBaru.tanggal) return alert("Tanggal mutasi wajib diisi!");
    setForm({
      ...form,
      mutasi: [...(form.mutasi || []), { ...mutasiBaru }],
    });
    setMutasiBaru({ tanggal: "", jenis: "Masuk", keterangan: "" });
  };

  const hapusMutasi = (index: number) => {
    setForm({
      ...form,
      mutasi: (form.mutasi || []).filter((_, i) => i !== index),
    });
  };

  if (!anggota) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="mt-3 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-brand-500 hover:underline"
      >
        <MdArrowBack /> Kembali ke Data KK
      </button>

      <Card extra="p-8">
        <h2 className="text-2xl font-bold mb-8 text-navy-700 dark:text-white">
          Edit Anggota: {anggota.nama}
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* KOLOM KIRI */}
          <div className="space-y-5">
            <input placeholder="NIK" value={form.nik || ""} onChange={e => setForm({ ...form, nik: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
            <input placeholder="Nama Lengkap" value={form.nama || ""} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />

            <div className="grid grid-cols-2 gap-4">
              <select value={form.jenisKelamin || "L"} onChange={e => setForm({ ...form, jenisKelamin: e.target.value as "L" | "P" })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              <input type="date" value={form.tanggalLahir || ""} onChange={e => setForm({ ...form, tanggalLahir: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
            </div>

            <input placeholder="Tempat Lahir" value={form.tempatLahir || ""} onChange={e => setForm({ ...form, tempatLahir: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
            <input placeholder="Pendidikan Terakhir" value={form.pendidikan || ""} onChange={e => setForm({ ...form, pendidikan: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
            <input placeholder="Pekerjaan" value={form.pekerjaan || ""} onChange={e => setForm({ ...form, pekerjaan: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />

            {/* GOLONGAN DARAH */}
            <select value={form.golonganDarah || "Tidak Tahu"} onChange={e => setForm({ ...form, golonganDarah: e.target.value as GolonganDarah })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
              <option value="Tidak Tahu">Tidak Tahu</option>
            </select>

            {/* DISABILITAS */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.disabilitas || false}
                onChange={e => setForm({ ...form, disabilitas: e.target.checked, kebutuhanKhusus: e.target.checked ? form.kebutuhanKhusus : "" })}
                className="h-5 w-5 rounded border-gray-300 text-brand-500"
              />
              <label className="font-medium">Memiliki Disabilitas</label>
            </div>

            {form.disabilitas && (
              <select value={form.kebutuhanKhusus || ""} onChange={e => setForm({ ...form, kebutuhanKhusus: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
                <option value="">Pilih Kebutuhan Khusus</option>
                {KEBUTUHAN_KHUSUS.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            )}

            {/* STATUS DESIL */}
            <select value={form.statusDesil || "Cukup"} onChange={e => setForm({ ...form, statusDesil: e.target.value as StatusDesil })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
              <option value="Miskin">Miskin</option>
              <option value="Rentan Miskin">Rentan Miskin</option>
              <option value="Cukup">Cukup</option>
              <option value="Mandiri">Mandiri</option>
            </select>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-5">
            <select value={form.statusKeluarga || "Anak"} onChange={e => setForm({ ...form, statusKeluarga: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
              <option value="Kepala Keluarga">Kepala Keluarga</option>
              <option value="Istri">Istri</option>
              <option value="Anak">Anak</option>
              <option value="Orang Tua">Orang Tua</option>
              <option value="Menantu">Menantu</option>
              <option value="Cucu">Cucu</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <select value={form.statusKawin || "Belum Kawin"} onChange={e => setForm({ ...form, statusKawin: e.target.value as any })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
              <option value="Belum Kawin">Belum Kawin</option>
              <option value="Kawin">Kawin</option>
              <option value="Cerai Hidup">Cerai Hidup</option>
              <option value="Cerai Mati">Cerai Mati</option>
            </select>

            <select value={form.agama || "Islam"} onChange={e => setForm({ ...form, agama: e.target.value as any })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            {/* MUTASI */}
            <div className="p-4 border rounded-xl bg-gray-50 dark:bg-navy-700">
              <p className="font-medium mb-3">Riwayat Mutasi</p>
              <div className="space-y-2 mb-3">
                {(form.mutasi || []).map((m, i) => (
                  <div key={i} className="flex justify-between items-center bg-white dark:bg-navy-800 p-2 rounded">
                    <span className="text-sm">
                      <strong>{m.jenis}</strong> - {m.tanggal} {m.keterangan && `(${m.keterangan})`}
                    </span>
                    <button onClick={() => hapusMutasi(i)} className="text-red-500 text-xs">Hapus</button>
                  </div>
                ))}
                {(!form.mutasi || form.mutasi.length === 0) && <p className="text-gray-500 text-xs">Belum ada mutasi</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={mutasiBaru.tanggal} onChange={e => setMutasiBaru({ ...mutasiBaru, tanggal: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white text-xs" />
                <select value={mutasiBaru.jenis} onChange={e => setMutasiBaru({ ...mutasiBaru, jenis: e.target.value as any })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white text-xs">
                  <option value="Masuk">Masuk</option>
                  <option value="Keluar">Keluar</option>
                </select>
              </div>
              <input placeholder="Keterangan (opsional)" value={mutasiBaru.keterangan} onChange={e => setMutasiBaru({ ...mutasiBaru, keterangan: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white text-xs mt-2" />
              <button onClick={tambahMutasi} className="mt-2 w-full py-2 bg-brand-500 text-white text-xs rounded-lg hover:bg-brand-600 flex items-center justify-center gap-1">
                <MdAdd /> Tambah Mutasi
              </button>
            </div>

            <textarea placeholder="Keterangan Umum" value={form.keterangan || ""} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white min-h-32" />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-300 dark:border-navy-600">
          <button onClick={() => navigate(-1)} className="px-8 py-3 border rounded-xl hover:bg-gray-50">
            Batal
          </button>
          <button onClick={handleSave} className="px-10 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 flex items-center gap-2">
            <MdSave /> Simpan Perubahan
          </button>
        </div>
      </Card>
    </div>
  );
};

export default EditAnggota;