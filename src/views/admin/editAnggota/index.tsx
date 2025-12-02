// src/views/admin/anggota/EditAnggota.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdArrowBack, MdSave, MdAdd, MdArrowForwardIos } from "react-icons/md";
import Card from "components/card";

type GolonganDarah = "A" | "B" | "AB" | "O" | "Tidak Tahu";
type StatusDesil = "Sangat Miskin" | "Miskin" | "Rentan Miskin" | "Menengah" | "Mampu";
type Mutasi = { tanggal: string; jenis: "Masuk" | "Keluar"; keterangan?: string };

type Anggota = {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatLahir?: string;
  tanggalLahir?: string;
  statusKeluarga?: string;
  pendidikan?: string;
  pekerjaan?: string;
  bantuan?: string[];
  golonganDarah?: GolonganDarah;
  disabilitas?: boolean;
  kebutuhanKhusus?: string;
  statusDesil?: StatusDesil;
  statusKawin?: string;
  agama?: string;
  keterangan?: string;
  mutasi?: Mutasi[];
  yatim?: boolean;
  piatu?: boolean;
  statusKesehatan?: string;
  kepesertaanBPJS?: string;
  partisipasiLingkungan?: string[];
  kerentananSosial?: string[];
};

const DAFTAR_BANTUAN = [
  { id: "pkh", nama: "PKH" },
  { id: "bpnt", nama: "BPNT / Sembako" },
  { id: "blt-dd", nama: "BLT Dana Desa" },
  { id: "blt-umkm", nama: "BLT UMKM" },
  { id: "bsu", nama: "BSU Gaji" },
  { id: "kip", nama: "KIP (Siswa)" },
  { id: "kis", nama: "KIS / JKN PBI" },
  { id: "prakerja", nama: "Kartu Prakerja" },
  { id: "rutilahu", nama: "Bedah Rumah" },
];

const PENDIDIKAN_OPTIONS = [
  "Tidak Sekolah",
  "Belum Tamat SD/Sederajat",
  "Tamat SD/Sederajat",
  "SMP/Sederajat",
  "SMA/Sederajat",
  "Diploma I/II",
  "Diploma III",
  "Diploma IV/Strata I",
  "Strata II",
  "Strata III",
];

const PEKERJAAN_OPTIONS = [
  "Belum/Tidak Bekerja",
  "Pelajar/Mahasiswa",
  "Mengurus Rumah Tangga",
  "Petani/Pekebun",
  "Peternak",
  "Nelayan/Perikanan",
  "Buruh Harian Lepas",
  "Karyawan Swasta",
  "Wiraswasta",
  "PNS/TNI/Polri",
  "Pedagang",
  "Pengrajin",
  "Transportasi",
  "Konstruksi",
  "Lainnya",
];

const PARTISIPASI = ["Aktif RW/RT", "Siskamling", "Bank Sampah", "Posyandu Balita", "Posyandu Lansia", "PKK", "Karang Taruna", "Tidak Aktif"];
const KERENTANAN = ["Yatim", "Piatu", "Yatim Piatu", "Janda", "Duda", "Korban PHK", "Korban Bencana", "ODGJ", "Terlantar"];

const EditAnggota: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [form, setForm] = useState<Partial<Anggota>>({});
  const [mutasiBaru, setMutasiBaru] = useState({ tanggal: "", jenis: "Masuk" as const, keterangan: "" });
  const [open, setOpen] = useState({ partisipasi: false, kerentanan: false, bantuan: false });

  // Load data
  useEffect(() => {
    if (!id) return;
    const dataKK = JSON.parse(localStorage.getItem("dataKK") || "[]");
    let found: Anggota | null = null;
    for (const kk of dataKK) {
      found = kk.anggota.find((a: Anggota) => a.id === id) || null;
      if (found) break;
    }
    if (found) {
      setAnggota(found);
      setForm(found);
    } else {
      alert("Anggota tidak ditemukan!");
      navigate("/admin/data-kk");
    }
  }, [id, navigate]);

  const save = () => {
    if (!form.nik || !form.nama) return alert("NIK dan Nama wajib diisi!");

    const dataKK = JSON.parse(localStorage.getItem("dataKK") || "[]");
    const updated = dataKK.map((kk: any) => ({
      ...kk,
      anggota: kk.anggota.map((a: Anggota) => (a.id === anggota?.id ? { ...a, ...form } : a)),
    }));
    localStorage.setItem("dataKK", JSON.stringify(updated));
    alert("Berhasil disimpan!");
    navigate(-1);
  };

  const toggleDropdown = (key: keyof typeof open) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleItem = (key: "partisipasiLingkungan" | "kerentananSosial" | "bantuan", value: string) => {
    setForm(prev => {
      const arr = prev[key] as string[] | undefined;
      if (arr?.includes(value)) {
        return { ...prev, [key]: arr.filter(x => x !== value) };
      }
      return { ...prev, [key]: [...(arr || []), value] };
    });
  };

  if (!anggota) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="mt-3 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
        <MdArrowBack className="text-xl" /> Kembali
      </button>

      <Card extra="p-8">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white mb-8">
          Edit Data: <span className="text-brand-600">{anggota.nama}</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* ========== KOLOM KIRI ========== */}
          <div className="space-y-7">
            {/* Identitas Dasar */}
            <Section title="Identitas Dasar">
              <Input label="NIK" value={form.nik || ""} onChange={v => setForm({ ...form, nik: v })} />
              <Input label="Nama Lengkap" value={form.nama || ""} onChange={v => setForm({ ...form, nama: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Jenis Kelamin" value={form.jenisKelamin || "L"} onChange={v => setForm({ ...form, jenisKelamin: v as "L" | "P" })}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </Select>
                <Input label="Tanggal Lahir" type="date" value={form.tanggalLahir || ""} onChange={v => setForm({ ...form, tanggalLahir: v })} />
              </div>
              <Input label="Tempat Lahir" value={form.tempatLahir || ""} onChange={v => setForm({ ...form, tempatLahir: v })} />
            </Section>

            {/* Partisipasi & Kerentanan */}
            <Section title="Keterlibatan Sosial" className="bg-blue-50/50 dark:bg-navy-800/50 px-6 py-5 rounded-2xl">
              <MultiSelect
              label="Partisipasi Lingkungan"
              options={PARTISIPASI}
              selected={form.partisipasiLingkungan || []}
              onToggle={(v) => toggleItem("partisipasiLingkungan", v)}
              open={open.partisipasi}
              onOpen={() => toggleDropdown("partisipasi")}
              color="blue"
            />
            <MultiSelect
              label="Kerentanan Sosial"
              options={KERENTANAN}
              selected={form.kerentananSosial || []}
              onToggle={(v) => toggleItem("kerentananSosial", v)}
              open={open.kerentanan}
              onOpen={() => toggleDropdown("kerentanan")}
              color="red"
            />
            </Section>

            {/* Bantuan Sosial */}
            <Section title="Bantuan yang Diterima" className="bg-green-50/10 dark:bg-navy-800/50 px-6 py-5 rounded-2xl">
              <div className="relative">
                <label className="block text-sm font-bold mb-2 text-green-600">
                  Penerima Bantuan Sosial
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown("bantuan")}
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-navy-600 rounded-xl text-left flex justify-between items-center bg-white dark:bg-navy-700 hover:bg-gray-50 dark:hover:bg-navy-600 transition shadow-sm"
                >
                  <span className={`truncate ${!form.bantuan?.length ? "text-gray-500" : "text-gray-800 dark:text-white"}`}>
                    {form.bantuan?.length
                      ? form.bantuan
                          .map(id => DAFTAR_BANTUAN.find(b => b.id === id)?.nama || id)
                          .join(", ")
                      : "Pilih bantuan yang diterima..."}
                  </span>
                  <MdArrowForwardIos className={`w-5 h-5 transition-transform text-green-600 ${open.bantuan ? "rotate-90" : ""}`} />
                </button>

                {open.bantuan && (
                  <div className="absolute z-40 w-full mt-2 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-xl shadow-xl shadow-xl max-h-64 overflow-y-auto">
                    {DAFTAR_BANTUAN.map(b => {
                      const isChecked = form.bantuan?.includes(b.id) || false;
                      return (
                        <label
                          key={b.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy-700 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem("bantuan", b.id)}
                            className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm font-medium">{b.nama}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </Section>

            {/* Kesehatan & BPJS */}
            <Section title="Status Kesehatan">
              <div className="flex gap-8">
                <Checkbox label="Yatim" checked={form.yatim || false} onChange={v => setForm({ ...form, yatim: v })} />
                <Checkbox label="Piatu" checked={form.piatu || false} onChange={v => setForm({ ...form, piatu: v })} />
              </div>
              <Select label="Kondisi Kesehatan" value={form.statusKesehatan || "Sehat"} onChange={v => setForm({ ...form, statusKesehatan: v })}>
                <option value="Sehat">Sehat</option>
                <option value="Ibu Hamil">Ibu Hamil</option>
                <option value="Ibu Menyusui">Ibu Menyusui</option>
                <option value="Stunting">Stunting</option>
                <option value="Penyakit Kronis">Penyakit Kronis</option>
                <option value="ODGJ">ODGJ</option>
                <option value="TBC">TBC</option>
              </Select>
              <Select label="Kepesertaan BPJS" value={form.kepesertaanBPJS || "Aktif Mandiri"} onChange={v => setForm({ ...form, kepesertaanBPJS: v })}>
                <option value="Aktif PBI">Aktif PBI</option>
                <option value="Aktif Mandiri">Aktif Mandiri</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Belum Punya">Belum Punya</option>
              </Select>
            </Section>
          </div>

          {/* ========== KOLOM KANAN ========== */}
          <div className="space-y-7">
            <Section title="Data Keluarga">
              <Select label="Status dalam Keluarga" value={form.statusKeluarga || "Anak"} onChange={v => setForm({ ...form, statusKeluarga: v })}>
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Menantu">Menantu</option>
                <option value="Cucu">Cucu</option>
                <option value="Lainnya">Lainnya</option>
              </Select>
              <Select label="Status Perkawinan" value={form.statusKawin || "Belum Kawin"} onChange={v => setForm({ ...form, statusKawin: v })}>
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </Select>
              <Select label="Agama" value={form.agama || "Islam"} onChange={v => setForm({ ...form, agama: v })}>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
                <option value="Lainnya">Lainnya</option>
              </Select>
            </Section>

            <Section title="Pendidikan & Pekerjaan">
              <Select
                label="Pendidikan Terakhir"
                value={form.pendidikan || ""}
                onChange={v => setForm({ ...form, pendidikan: v })}
              >
                <option value="">Pilih pendidikan</option>
                {PENDIDIKAN_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Select>

              <Select
                label="Pekerjaan Utama"
                value={form.pekerjaan || ""}
                onChange={v => setForm({ ...form, pekerjaan: v })}
              >
                <option value="">Pilih pekerjaan</option>
                {PEKERJAAN_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Select>
            </Section>

            {/* Mutasi */}
            <Section title="Riwayat Mutasi" className="bg-amber-100/50 dark:bg-navy-800/50 px-6 py-5 rounded-2xl">
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {(form.mutasi || []).length === 0 && <p className="text-gray-500 text-sm">Belum ada mutasi</p>}
                {(form.mutasi || []).map((m, i) => (
                  <div key={i} className="flex justify-between items-center bg-white dark:bg-navy-900 px-4 py-2 rounded-lg text-sm shadow-sm">
                    <span><strong>{m.jenis}</strong> — {m.tanggal} {m.keterangan && `(${m.keterangan})`}</span>
                    <button onClick={() => setForm(p => ({ ...p, mutasi: p.mutasi?.filter((_, idx) => idx !== i) }))} className="text-red-600 hover:text-red-800">Hapus</button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input type="date" value={mutasiBaru.tanggal} onChange={v => setMutasiBaru({ ...mutasiBaru, tanggal: v })} />
                <select value={mutasiBaru.jenis} onChange={e => setMutasiBaru({ ...mutasiBaru, jenis: e.target.value as any })} className="input text-sm">
                  <option value="Masuk">Masuk</option>
                  <option value="Keluar">Keluar</option>
                </select>
              </div>
              <Input placeholder="Keterangan (opsional)" value={mutasiBaru.keterangan} onChange={v => setMutasiBaru({ ...mutasiBaru, keterangan: v })} className="mt-2" />
              <button onClick={() => {
                if (!mutasiBaru.tanggal) return alert("Tanggal wajib diisi");
                setForm(p => ({ ...p, mutasi: [...(p.mutasi || []), mutasiBaru] }));
                setMutasiBaru({ tanggal: "", jenis: "Masuk", keterangan: "" });
              }} className="mt-3 w-full bg-brand-400 hover:bg-brand-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                <MdAdd className="text-lg" /> Tambah Mutasi
              </button>
            </Section>

            <Section title="Catatan Tambahan">
              <textarea
                placeholder="Keterangan umum / catatan khusus..."
                value={form.keterangan || ""}
                onChange={e => setForm({ ...form, keterangan: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-navy-700 min-h-32 resize-none focus:ring-2 focus:ring-brand-500"
              />
            </Section>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-5 mt-12 pt-8 border-t border-gray-200 dark:border-navy-600">
          <button onClick={() => navigate(-1)} className="px-10 py-3 border border-gray-300 dark:border-navy-600 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-700 transition">
            Batal
          </button>
          <button onClick={save} className="px-12 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl flex items-center gap-3 shadow-lg transition font-medium">
            <MdSave className="text-xl" /> Simpan Perubahan
          </button>
        </div>
      </Card>
    </div>
  );
};

/* === KOMPONEN BANTUAN KECIL === */
const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`space-y-5 ${className}`}>
    <h3 className="text-lg font-bold text-navy-700 dark:text-white -mb-2">{title}</h3>
    {children}
  </div>
);

const Input: React.FC<{
  label?: string;           // ← jadi opsional
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}> = ({ label, value, onChange, type = "text", placeholder, className = "" }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || (label ? `Masukkan ${label.toLowerCase()}...` : "")}
      className={`w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-700 focus:ring-2 focus:ring-brand-500 outline-none transition ${label ? "" : "mt-0"}`}
    />
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-700 focus:ring-2 focus:ring-brand-500">
      {children}
    </select>
  </div>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" />
    <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
  </label>
);

const MultiSelect: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  open: boolean;
  onOpen: () => void;
  color: "blue" | "red" | "green";
}> = ({ label, options, selected, onToggle, open, onOpen, color }) => {
  const colorClass = color === "blue" ? "text-brand-600" : color === "red" ? "text-red-600" : "text-green-600";
  return (
    <div className="relative">
      <label className={`block text-sm font-bold mb-2 ${colorClass}`}>{label}</label>
      <button
        type="button"
        onClick={onOpen}
        className="w-full px-4 py-3.5 border border-gray-300 dark:border-navy-600 rounded-xl text-left flex justify-between items-center bg-white dark:bg-navy-700 hover:bg-gray-50 dark:hover:bg-navy-600 transition shadow-sm"
      >
        <span className={`truncate ${selected.length === 0 ? "text-gray-500" : "text-gray-800 dark:text-gray-200"}`}>
          {selected.length === 0 ? `Pilih ${label.toLowerCase()}...` : selected.join(", ")}
        </span>
        <MdArrowForwardIos className={`w-5 h-5 transition-transform ${open ? "rotate-90" : ""} ${colorClass}`} />
      </button>
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className={`w-4 h-4 rounded ${color === "blue" ? "text-brand-600" : color === "red" ? "text-red-600" : "text-green-600"}`}
              />
              <span className="text-sm font-medium">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditAnggota;