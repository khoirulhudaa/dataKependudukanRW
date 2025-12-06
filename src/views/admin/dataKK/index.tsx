import Card from "components/card";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MdAccessibilityNew,
  MdAdd,
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdChildCare, MdClearAll, MdClose,
  MdDone,
  MdElderly, MdFamilyRestroom,
  MdFileDownload,
  MdHome,
  MdLocationOn,
  MdPhotoCamera,
  MdPictureAsPdf,
  MdSave,
  MdSchool, MdSearch,
  MdUpload,
  MdWarning
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { generateSingleKKPdf } from "utils/generatePDFKK";

type GolonganDarah = "A" | "B" | "AB" | "O" | "Tidak Tahu";
type KebutuhanKhusus = "" | "Kursi Roda" | "Alat Bantu Dengar" | "Tongkat" | "Prostesis" | "Bantuan Sensorik" | "Lainnya";
type StatusDesil = "Sangat Miskin" | "Miskin" | "Rentan Miskin" | "Menengah" | "Mampu";
type StatusKependudukan = "Warga Tetap" | "Warga Tidak Tetap" | "Pendatang Baru" | "Perantau" | "Perantau Tidak Diketahui" | "Pindah Keluar" | "Tidak Diketahui";
type StatusHunian = any;
type Mutasi = { tanggal: string; jenis: "Masuk" | "Keluar"; keterangan?: string };
type KondisiRumah = {
  lantai: "Keramik" | "Ubin/Tegel" | "Semen/Plester" | "Tanah";
  dinding: "Tembok/Bata" | "Kayu/Papan" | "Bambu/GRC" | "Lainnya";
  atap: "Genteng/Beton" | "Asbes" | "Seng" | "Lainnya";
  air: "PDAM" | "Sumur Bor/Pompa" | "Sumur Gali" | "Sungai/Mata Air" | "Lainnya";
  sanitasi: "Jamban Sendiri + Septic Tank" | "Jamban Sendiri Tanpa Septic" | "Jamban Umum" | "Tidak Ada";
  listrik: "PLN 450VA" | "PLN 900VA" | "PLN 1300VA+" | "Genset/Solar Cell" | "Tidak Ada";
  kepemilikanAset: string[];
};
type StatusAnggota = "Hidup" | "Meninggal" | "Pindah";

type Anggota = {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatLahir?: string;
  tanggalLahir?: string;
  statusKeluarga?: any;
  pendidikan?: string;
  pekerjaan?: string;
  bantuan?: string[];
  status?: StatusAnggota;
  golonganDarah?: GolonganDarah;
  disabilitas: boolean;
  jenisDisabilitas?: string;
  kebutuhanKhusus?: KebutuhanKhusus;
  statusDesil?: StatusDesil;
  statusKependudukan: StatusKependudukan;
  mutasi?: Mutasi[];
  ktpUrl?: string;
  ktpName?: string;
  ktpType?: string;
  statusKawin: "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati";
  agama: "Islam" | "Kristen" | "Katolik" | "Hindu" | "Buddha" | "Konghucu" | "Lainnya";
  keterangan?: string;
  kelengkapanArsipRT?: string[];
  yatim?: boolean;
  piatu?: boolean;
  yatimPiatu?: boolean;
  statusKesehatan?: "Sehat" | "Ibu Hamil" | "Ibu Menyusui" | "Stunting" | "Penyakit Kronis" | "ODGJ" | "TBC" | "Lainnya";
  jandaDuda?: boolean;
  kepesertaanBPJS?: "Aktif PBI" | "Aktif Mandiri" | "Tidak Aktif" | "Belum Punya";
  partisipasiLingkungan?: string[];
  kerentananSosial?: string[]; // BARU: multi-select
};

type KKItem = {
  id: string;
  noKK: string;
  kepalaKeluarga: string;
  alamat: string;
  noRumah?: string;
  rt: string;
  rw: string;
  anggota: Anggota[];
  isSementara?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  koordinat?: string;
  alamatLengkap?: string;
  statusHunian: StatusHunian;
  pemilikRumah?: string;
  kondisiRumah: KondisiRumah;
  fotoRumahUrl?: string;
  fotoRumahName?: string;
  fotoRumahType?: string;
  kategoriKesejahteraan?: "Pra Sejahtera" | "Sejahtera I" | "Sejahtera II" | "Sejahtera III" | "Sejahtera III+";
  kepemilikanDokumenLengkap?: boolean;  
};

// === DAFTAR BANTUAN LENGKAP ===
const DAFTAR_BANTUAN = [
  { id: "pkh", nama: "PKH", color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300" },
  { id: "bpnt", nama: "BPNT / Sembako", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  { id: "blt-dd", nama: "BLT Dana Desa", color: "bg-purple-100 text stripe-purple-700" },
  { id: "blt-umkm", nama: "BLT UMKM (BPUM)", color: "bg-orange-100 text-orange-700" },
  { id: "bsu", nama: "BSU / Subsidi Gaji", color: "bg-yellow-100 text-yellow-700" },
  { id: "kip", nama: "KIP (Siswa)", color: "bg-green-100 text-green-700" },
  { id: "kis", nama: "KIS / JKN PBI", color: "bg-teal-100 text-teal-700" },
  { id: "prakerja", nama: "Kartu Prakerja", color: "bg-indigo-100 text-indigo-700" },
  { id: "rutilahu", nama: "Rutilahu / Bedah Rumah", color: "bg-red-100 text-red-700" },
  { id: "non-bansos", nama: "Penerima Non-Bansos", color: "bg-gray-100 text-gray-700 dark:bg-gray-800" },
];

// === KERENTANAN SOSIAL ===
const KERENTANAN_SOSIAL = [
  "Yatim",
  "Piatu",
  "Yatim Piatu",
  "Janda",
  "Duda",
  "Korban PHK",
  "Korban Bencana",
  "Komorbid Serius",
  "Terlantar"
];

// === PILIHAN PENDIDIKAN ===
const PILIHAN_PENDIDIKAN = [
  "Tidak Sekolah",
  "SD / MI",
  "SMP / MTs",
  "SMA / SMK / MA",
  "Mahasiswa / Akademi",
  "Lulus Tapi Tidak Bekerja"
];

// === PILIHAN PEKERJAAN ===
const PILIHAN_PEKERJAAN = [
  "Bekerja",
  "Tidak Bekerja",
  "Ibu Rumah Tangga",
  "Wirausaha / UMKM",
  "Petani / Buruh Tani",
  "Buruh Harian Lepas (BHL)",
  "Karyawan Swasta",
  "PNS / TNI / POLRI",
  "Pekerja Migran / TKI",
  "Ojek Online",
  "Pelajar",
  "Mahasiswa",
  "Difabel Tidak Bekerja"
];

const ARSIP_RT = ["KTP", "KK", "Akta Lahir", "Akta Nikah", "Akta Cerai", "Surat Keterangan Domisili", "Surat Kematian"];
// DEMO DATA (dengan field baru)
const DEMO_DATA: KKItem[] = [
  // 1. KK Sejahtera – Keluarga Lengkap (RT 01)
  {
    id: "kk001",
    noKK: "3275010101200001",
    kepalaKeluarga: "Dr. H. Ahmad Fauzi, M.Pd",
    alamat: "Jl. Merdeka No. 10",
    noRumah: "10",
    rt: "01",
    rw: "001",
    statusHunian: "Milik Sendiri",
    pemilikRumah: "Ahmad Fauzi",
    koordinat: "-6.2088,106.8456",
    fotoRumahUrl: "/demo/rumah1.jpg",
    kondisiRumah: {
      lantai: "Keramik",
      dinding: "Tembok/Bata",
      atap: "Genteng/Beton",
      air: "PDAM",
      sanitasi: "Jamban Sendiri + Septic Tank",
      listrik: "PLN 1300VA+",
      kepemilikanAset: ["Mobil", "Motor", "TV LED", "AC", "Kulkas 2 Pintu"],
    },
    kategoriKesejahteraan: "Sejahtera III+",
    anggota: [
      {
        id: "a1", nik: "3275011507750001", nama: "Ahmad Fauzi", jenisKelamin: "L",
        tempatLahir: "Bandung", tanggalLahir: "1975-07-15", statusKeluarga: "Kepala Keluarga",
        pendidikan: "S3", pekerjaan: "Dosen / PNS", bantuan: [], status: "Hidup",
        golonganDarah: "O", disabilitas: false, statusKependudukan: "Warga Tetap",
        statusKawin: "Kawin", agama: "Islam", partisipasiLingkungan: ["Aktif Kegiatan RW/RT", "Siskamling"],
        kerentananSosial: [],
      },
      {
        id: "a2", nik: "3275015509800002", nama: "Siti Aisyah", jenisKelamin: "P",
        tempatLahir: "Jakarta", tanggalLahir: "1980-09-05", statusKeluarga: "Istri",
        pendidikan: "S2", pekerjaan: "Guru Swasta", bantuan: [], status: "Hidup",
        golonganDarah: "A", disabilitas: false, statusKependudukan: "Warga Tetap",
        statusKawin: "Kawin", agama: "Islam", partisipasiLingkungan: ["PKK"],
        kerentananSosial: [],
      },
      {
        id: "a3", nik: "3275012312080015", nama: "Naufal Ahmad", jenisKelamin: "L",
        tanggalLahir: "2008-12-23", statusKeluarga: "Anak", pendidikan: "SMP / MTs",
        pekerjaan: "Pelajar", bantuan: ["kip"], status: "Hidup", disabilitas: false,
        statusKependudukan: "Warga Tetap", statusKawin: "Belum Kawin", agama: "Islam",
        partisipasiLingkungan: [], kerentananSosial: [],
      },
      {
        id: "a4", nik: "3275016405130020", nama: "Aisyah Putri", jenisKelamin: "P",
        tanggalLahir: "2013-05-04", statusKeluarga: "Anak", pendidikan: "SD / MI",
        pekerjaan: "Pelajar", bantuan: [], status: "Hidup", disabilitas: false,
        statusKependudukan: "Warga Tetap", statusKawin: "Belum Kawin", agama: "Islam",
        partisipasiLingkungan: [], kerentananSosial: [],
      },
    ],
  },

  // 2. KK Miskin + Disabilitas (RT 02)
  {
    id: "kk002",
    noKK: "3275010203200002",
    kepalaKeluarga: "Slamet Riyadi",
    alamat: "Gg. H. Yani No. 25",
    rt: "02",
    rw: "001",
    statusHunian: "Kontrak/Sewa",
    pemilikRumah: "H. Maman",
    kondisiRumah: {
      lantai: "Semen/Plester",
      dinding: "Kayu/Papan",
      atap: "Asbes",
      air: "Sumur Gali",
      sanitasi: "Jamban Sendiri Tanpa Septic",
      listrik: "PLN 450VA",
      kepemilikanAset: ["TV Tabung", "Motor Bekas"],
    },
    kategoriKesejahteraan: "Pra Sejahtera",
    anggota: [
      {
        id: "b1", nik: "3275010505680003", nama: "Slamet Riyadi", jenisKelamin: "L",
        tanggalLahir: "1968-05-05", statusKeluarga: "Kepala Keluarga",
        pendidikan: "SD / MI", pekerjaan: "Tidak Bekerja", bantuan: ["pkh", "bpnt", "kis"],
        status: "Hidup", golonganDarah: "B", disabilitas: true, jenisDisabilitas: "Tuna Daksa",
        kebutuhanKhusus: "Kursi Roda", statusKependudukan: "Warga Tetap",
        statusKawin: "Kawin", agama: "Islam", partisipasiLingkungan: [],
        kerentananSosial: ["Difabel", "Tidak Bekerja"],
      },
      {
        id: "b2", nik: "3275014412750004", nama: "Siti Aminah", jenisKelamin: "P",
        tanggalLahir: "1975-12-04", statusKeluarga: "Istri",
        pendidikan: "Tidak Sekolah", pekerjaan: "Ibu Rumah Tangga", bantuan: ["pkh", "bpnt"],
        status: "Hidup", disabilitas: false, statusKependudukan: "Warga Tetap",
        statusKawin: "Kawin", agama: "Islam", partisipasiLingkungan: ["PKK"],
        kerentananSosial: [],
      },
      {
        id: "b3", nik: "3275016003100012", nama: "Rudi Setiawan", jenisKelamin: "L",
        tanggalLahir: "2010-03-20", statusKeluarga: "Anak", pendidikan: "SMP / MTs",
        pekerjaan: "Pelajar", bantuan: ["kip"], status: "Hidup", disabilitas: false,
        statusKependudukan: "Warga Tetap", statusKawin: "Belum Kawin", agama: "Islam",
        partisipasiLingkungan: [], kerentananSosial: ["Yatim"],
      },
    ],
  },

  // 3. Lansia Sendirian + ODGJ (RT 03)
  {
    id: "kk003",
    noKK: "3275010304200003",
    kepalaKeluarga: "Nenek Suminah",
    alamat: "Jl. Cempaka No. 7",
    rt: "03",
    rw: "001",
    statusHunian: "Milik Sendiri",
    kondisiRumah: {
      lantai: "Tanah",
      dinding: "Bambu/GRC",
      atap: "Seng",
      air: "Sumur Gali",
      sanitasi: "Tidak Ada",
      listrik: "PLN 450VA",
      kepemilikanAset: ["TV Tabung"],
    },
    kategoriKesejahteraan: "Pra Sejahtera",
    anggota: [
      {
        id: "c1", nik: "3275016901400005", nama: "Suminah", jenisKelamin: "P",
        tanggalLahir: "1940-01-29", statusKeluarga: "Kepala Keluarga",
        pendidikan: "Tidak Sekolah", pekerjaan: "Tidak Bekerja", bantuan: ["pkh", "blt-dd", "kis"],
        status: "Hidup", golonganDarah: "B", disabilitas: true, jenisDisabilitas: "Gangguan Jiwa (ODGJ)",
        kebutuhanKhusus: "Bantuan Sensorik", statusKependudukan: "Warga Tetap",
        statusKawin: "Kawin", agama: "Islam", partisipasiLingkungan: [],
        kerentananSosial: ["Lansia", "Janda", "ODGJ"],
      },
    ],
  },

  // 4. Kos Mahasiswa (RT 04)
  {
    id: "kk004",
    noKK: "3275010405200004",
    kepalaKeluarga: "Indra Gunawan (Penanggung Jawab Kos)",
    alamat: "Jl. Gatot Subroto Kos Putra No. 88",
    rt: "04",
    rw: "002",
    statusHunian: "Kos/Asrama",
    isSementara: true,
    kondisiRumah: {
      lantai: "Keramik",
      dinding: "Tembok/Bata",
      atap: "Genteng/Beton",
      air: "PDAM",
      sanitasi: "Jamban Sendiri + Septic Tank",
      listrik: "PLN 900VA",
      kepemilikanAset: ["TV", "Kulkas", "WiFi"],
    },
    kategoriKesejahteraan: "Pra Sejahtera",
    anggota: [
      {
        id: "d1", nik: "3174012310010006", nama: "Rizky Pratama", jenisKelamin: "L",
        tanggalLahir: "2001-10-23", statusKeluarga: "Penghuni", pendidikan: "Mahasiswa / Akademi",
        pekerjaan: "Mahasiswa", bantuan: ["kip"], status: "Hidup", disabilitas: false,
        statusKependudukan: "Pendatang Baru", statusKawin: "Belum Kawin", agama: "Islam",
        partisipasiLingkungan: [], kerentananSosial: [],
      },
      {
        id: "d2", nik: "3376021503020007", nama: "Aditya Nugraha", jenisKelamin: "L",
        tanggalLahir: "2002-03-15", statusKeluarga: "Penghuni", pendidikan: "Mahasiswa / Akademi",
        pekerjaan: "Mahasiswa", bantuan: [], status: "Hidup", disabilitas: false,
        statusKependudukan: "Pendatang Baru", statusKawin: "Belum Kawin", agama: "Kristen",
        partisipasiLingkungan: [], kerentananSosial: [],
      },
      {
        id: "d3", nik: "3275044404030008", nama: "Putri Ayu Lestari", jenisKelamin: "P",
        tanggalLahir: "2003-04-04", statusKeluarga: "Penghuni", pendidikan: "Mahasiswa / Akademi",
        pekerjaan: "Mahasiswa", bantuan: ["kip"], status: "Hidup", disabilitas: false,
        statusKependudukan: "Pendatang Baru", statusKawin: "Belum Kawin", agama: "Islam",
        partisipasiLingkungan: [], kerentananSosial: [],
      },
    ],
  },

  // 5. Perantau + Rumah Tidak Layak Huni (RT 05)
  {
    id: "kk005",
    noKK: "3275010506200005",
    kepalaKeluarga: "Bambang Suryono (Perantau)",
    alamat: "Gg. Surya Kencana Lorong 3",
    rt: "05",
    rw: "002",
    statusHunian: "Rumah Tidak Layak Huni",
    kondisiRumah: {
      lantai: "Tanah",
      dinding: "Bambu/GRC",
      atap: "Seng",
      air: "Sungai/Mata Air",
      sanitasi: "Tidak Ada",
      listrik: "Tidak Ada",
      kepemilikanAset: [],
    },
    kategoriKesejahteraan: "Pra Sejahtera",
    anggota: [
      {
        id: "e1", nik: "3275011208800009", nama: "Bambang Suryono", jenisKelamin: "L",
        tanggalLahir: "1980-08-12", statusKeluarga: "Kepala Keluarga",
        pekerjaan: "Pekerja Migran / TKI", bantuan: [], status: "Hidup",
        disabilitas: false, statusKependudukan: "Perantau Tidak Diketahui",
        statusKawin: "Kawin", agama: "Islam", partisipasiLingkungan: [],
        kerentananSosial: ["Perantau Tak Terlacak"],
      },
      {
        id: "e2", nik: "3275015309850010", nama: "Sri Mulyati", jenisKelamin: "P",
        tanggalLahir: "1985-09-13", statusKeluarga: "Istri",
        pekerjaan: "Buruh Harian Lepas", bantuan: ["pkh", "bpnt"], status: "Hidup",
        disabilitas: false, statusKependudukan: "Warga Tetap",
        statusKawin: "Kawin", agama: "Islam", partisipasiLingkungan: ["PKK"],
        kerentananSosial: ["Istri Perantau"],
      },
      {
        id: "e3", nik: "3275016110150021", nama: "Rina Andini", jenisKelamin: "P",
        tanggalLahir: "2015-10-01", statusKeluarga: "Anak", pendidikan: "SD / MI",
        pekerjaan: "Pelajar", bantuan: [], status: "Hidup", disabilitas: false,
        statusKependudukan: "Warga Tetap", statusKawin: "Belum Kawin", agama: "Islam",
        kerentananSosial: ["Anak Perantau"],
      },
      {
        id: "e4", nik: "3275015507100033", nama: "Joko Santoso", jenisKelamin: "L",
        tanggalLahir: "2010-07-05", statusKeluarga: "Anak", pendidikan: "SMP / MTs",
        pekerjaan: "Pelajar", bantuan: ["kip"], status: "Hidup",
        disabilitas: true, jenisDisabilitas: "Tuna Rungu", kebutuhanKhusus: "Alat Bantu Dengar",
        statusKependudukan: "Warga Tetap", statusKawin: "Belum Kawin", agama: "Islam",
        kerentananSosial: ["Difabel", "Anak Perantau"],
      },
    ],
  },
];

const DataKK: React.FC = () => {
  const [kkFile, setKKFile] = useState<File | null>(null);
  const [kkFileUrl, setKKFileUrl] = useState<string | null>(null);
  const [fotoRumahFile, setFotoRumahFile] = useState<File | null>(null);
  const [fotoRumahUrl, setFotoRumahUrl] = useState<string | null>(null);
  const [kkList, setKKList] = useState<KKItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedKK, setSelectedKK] = useState<KKItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpFileUrl, setKtpFileUrl] = useState<string | null>(null);
  const [showKKZoom, setShowKKZoom] = useState(false);
  const [showModalKK, setShowModalKK] = useState(false);
  const [editKK, setEditKK] = useState<KKItem | null>(null);
  const [showModalAnggota, setShowModalAnggota] = useState(false);
  const [editAnggota, setEditAnggota] = useState<Anggota | null>(null);
  const [showModalBantuan, setShowModalBantuan] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState<Anggota | null>(null);
  const [filterNoKK, setFilterNoKK] = useState<string>("all");
  const [filterRT, setFilterRT] = useState<string>("all");
  const [selectedAnggotaDetail, setSelectedAnggotaDetail] = useState<Anggota | null>(null);
  const [formKK, setFormKK] = useState<{
    noKK: string;
    kepalaKeluarga: string;
    alamat: string;
    rt: string;
    noRumah: string;
    rw: string;
    isSementara: boolean;
    koordinat: string;
    alamatLengkap: string;
    statusHunian: StatusHunian;
    pemilikRumah: string;
    kondisiRumah: KondisiRumah;
    kategoriKesejahteraan?: "Pra Sejahtera" | "Sejahtera I" | "Sejahtera II" | "Sejahtera III" | "Sejahtera III+";
    kepemilikanDokumenLengkap?: boolean;
  }>({
    noKK: "",
    kepalaKeluarga: "",
    noRumah: "",
    alamat: "",
    rt: "",
    rw: "",
    isSementara: false,
    koordinat: "",
    alamatLengkap: "",
    statusHunian: "Milik Sendiri",
    pemilikRumah: "",
    kondisiRumah: {
      lantai: "Keramik",
      dinding: "Tembok/Bata",
      atap: "Genteng/Beton",
      air: "PDAM",
      sanitasi: "Jamban Sendiri + Septic Tank",
      listrik: "PLN 900VA",
      kepemilikanAset: [],
    },
    kategoriKesejahteraan: "Sejahtera II",
    kepemilikanDokumenLengkap: true,
  });
  const [formAnggota, setFormAnggota] = useState<Partial<Anggota>>({
    nik: "", nama: "", jenisKelamin: "L", tempatLahir: "", tanggalLahir: "",
    statusKeluarga: "Anak", pendidikan: "", pekerjaan: "", bantuan: [], status: "Hidup",
    golonganDarah: "Tidak Tahu", disabilitas: false, jenisDisabilitas: "", kebutuhanKhusus: "",
    statusDesil: "Menengah", statusKependudukan: "Warga Tetap",
    mutasi: [], statusKawin: "Belum Kawin", agama: "Islam", keterangan: "",
    kelengkapanArsipRT: [], yatim: false, piatu: false,
    statusKesehatan: "Sehat", jandaDuda: false, kepesertaanBPJS: "Aktif Mandiri",
    partisipasiLingkungan: [],
    kerentananSosial: [] // default
  });
  const [filterGender, setFilterGender] = useState("all");
  const [filterUsia, setFilterUsia] = useState("all");

  // Tambahkan state ini di dalam komponen DataKK
  const [dropdownOpen, setDropdownOpen] = useState({
    partisipasi: false,
    kerentanan: false,
    bantuan: false,     // ← ditambahkan
  });
  const [filterStatusHunian, setFilterStatusHunian] = useState<string>("all");
  const [filterDesil, setFilterDesil] = useState<string>("all");

  // Tambahkan ref untuk mendeteksi klik di luar
  const partisipasiRef = useRef<HTMLDivElement>(null);
  const kerentananRef = useRef<HTMLDivElement>(null);

  // Tempatkan di dalam komponen DataKK, setelah semua useState
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen.partisipasi ||
        dropdownOpen.kerentanan ||
        dropdownOpen.bantuan
      ) {
        setDropdownOpen({ partisipasi: false, kerentanan: false, bantuan: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Load & Save
  useEffect(() => {
    setKKList(DEMO_DATA);
    // const saved = localStorage.getItem("dataKK");
    // if (saved?.length > 0) {
    //   console.log('saved', saved)
    //   setKKList(JSON.parse(saved));
    // } else {
    //   localStorage.setItem("dataKK", JSON.stringify(DEMO_DATA));
    // }
  }, []);

  useEffect(() => {
    localStorage.setItem("dataKK", JSON.stringify(kkList));
  }, []);

  // === OTOMATIS ISI FORM SAAT EDIT KK ===
  useEffect(() => {
    if (editKK && showModalKK) {
      setFormKK({
        noKK: editKK.noKK || "",
        kepalaKeluarga: editKK.kepalaKeluarga || "",
        alamat: editKK.alamat || "",
        noRumah: editKK.noRumah || "",
        rt: editKK.rt || "",
        rw: editKK.rw || "",
        isSementara: editKK.isSementara || false,
        koordinat: editKK.koordinat || "",
        alamatLengkap: editKK.alamatLengkap || "",
        statusHunian: editKK.statusHunian || "Milik Sendiri",
        pemilikRumah: editKK.pemilikRumah || "",
        kondisiRumah: {
          lantai: editKK.kondisiRumah?.lantai || "Keramik",
          dinding: editKK.kondisiRumah?.dinding || "Tembok/Bata",
          atap: editKK.kondisiRumah?.atap || "Genteng/Beton",
          air: editKK.kondisiRumah?.air || "PDAM",
          sanitasi: editKK.kondisiRumah?.sanitasi || "Jamban Sendiri + Septic Tank",
          listrik: editKK.kondisiRumah?.listrik || "PLN 900VA",
          kepemilikanAset: editKK.kondisiRumah?.kepemilikanAset || [],
        },
        kategoriKesejahteraan: editKK.kategoriKesejahteraan || "Sejahtera II",
        kepemilikanDokumenLengkap: editKK.kepemilikanDokumenLengkap ?? true,
      });

      // Juga isi preview file KK & Foto Rumah
      setKKFileUrl(editKK.fileUrl || null);
      setFotoRumahUrl(editKK.fotoRumahUrl || null);
    } else if (!showModalKK) {
      // Reset form saat modal ditutup
      resetFormKK();
    }
  }, [editKK, showModalKK]);

  // Filter utama
  const filteredData = useMemo(() => {
    return kkList.filter(kk => {
      // Search
      const matchesSearch = search === "" ||
        kk.noKK.includes(search) ||
        kk.kepalaKeluarga.toLowerCase().includes(search.toLowerCase()) ||
        kk.alamat.toLowerCase().includes(search.toLowerCase());

      // Filter RT
      const matchesRT = filterRT === "all" || kk.rt === filterRT;

      // Filter Gender & Usia (dihitung dari semua anggota)
      let matchesGenderUsia = true;
      if (filterGender !== "all" || filterUsia !== "all") {
        const anggotaMatch = kk.anggota.some(a => {
          const matchGender = filterGender === "all" || a.jenisKelamin === filterGender;
          let matchUsia = true;
          if (filterUsia !== "all") {
            const usia = hitungUsia(a.tanggalLahir || "");
            if (filterUsia === "0-17") matchUsia = usia <= 17;
            if (filterUsia === "18-59") matchUsia = usia >= 18 && usia <= 59;
            if (filterUsia === "60+") matchUsia = usia >= 60;
          }
          return matchGender && matchUsia;
        });
        matchesGenderUsia = anggotaMatch;
      }

      return matchesSearch && matchesRT && matchesGenderUsia;
    });
  }, [kkList, search, filterRT, filterGender, filterUsia]);

  const isAnyFilterActive = useMemo(() => {
    return (
      search.trim() !== "" ||
      filterRT !== "all" ||
      filterStatusHunian !== "all" ||
      filterDesil !== "all"
    );
  }, [search, filterRT, filterStatusHunian, filterDesil]);

  const hitungUsia = (tanggalLahir: string): number => {
    if (!tanggalLahir) return 0;
    const birth = new Date(tanggalLahir);
    const today = new Date();
    if (isNaN(birth.getTime())) return 0;
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age < 0 ? 0 : age;
  };
  const kelompokUsia = (usia: number) => {
    if (usia < 1) return { nama: "Bayi", icon: <MdChildCare className="h-4 w-4" />, color: "text-pink-600" };
    if (usia < 6) return { nama: "Balita", icon: <MdChildCare className="h-4 w-4" />, color: "text-pink-500" };
    if (usia < 13) return { nama: "Anak-anak", icon: <MdChildCare className="h-4 w-4" />, color: "text-blue-600" };
    if (usia < 18) return { nama: "Remaja", icon: <MdSchool className="h-4 w-4" />, color: "text-green-600" };
    if (usia < 56) return { nama: "Usia Produktif", icon: <MdAccessibilityNew className="h-4 w-4" />, color: "text-indigo-600" };
    if (usia < 70) return { nama: "Lansia", icon: <MdElderly className="h-4 w-4" />, color: "text-yellow-700" };
    return { nama: "Lansia Risiko Tinggi", icon: <MdWarning className="h-4 w-4" />, color: "text-red-700" };
  };
  const getBantuanSummary = (kk: KKItem) => {
    const allBantuan = kk.anggota.flatMap(a => a.bantuan);
    const unique = [...new Set(allBantuan)];
    return unique.map(id => {
      const b = DAFTAR_BANTUAN.find(x => x.id === id)!;
      const count = allBantuan.filter(x => x === id).length;
      return { ...b, count };
    });
  };
  // === KK CRUD ===
  const handleSubmitKK = () => {
    if (!formKK.noKK.trim() || !formKK.kepalaKeluarga.trim() || !formKK.alamat.trim()) {
      alert("No KK, Kepala Keluarga, dan Alamat wajib diisi!");
      return;
    }
    const newKK: KKItem = {
      id: editKK?.id || Date.now().toString(),
      noKK: formKK.noKK.trim(),
      kepalaKeluarga: formKK.kepalaKeluarga.trim(),
      alamat: formKK.alamat.trim(),
      rt: formKK.rt,
      rw: formKK.rw,
      anggota: editKK?.anggota || [],
      noRumah: formKK.noRumah?.trim() ? formKK.noRumah.trim() : undefined,
      isSementara: formKK.isSementara,
      fileUrl: kkFileUrl || editKK?.fileUrl,
      fileName: kkFile?.name || editKK?.fileName,
      fileType: kkFile?.type || editKK?.fileType,
      koordinat: formKK.koordinat || undefined,
      alamatLengkap: formKK.alamatLengkap || undefined,
      statusHunian: formKK.statusHunian,
      pemilikRumah: formKK.pemilikRumah || undefined,
      kondisiRumah: formKK.kondisiRumah,
      fotoRumahUrl: fotoRumahUrl || editKK?.fotoRumahUrl,
      fotoRumahName: fotoRumahFile?.name || editKK?.fotoRumahName,
      fotoRumahType: fotoRumahFile?.type || editKK?.fotoRumahType,
      kategoriKesejahteraan: formKK.kategoriKesejahteraan,
      kepemilikanDokumenLengkap: formKK.kepemilikanDokumenLengkap,
    };
    if (editKK) {
      setKKList(prev => prev.map(i => (i.id === editKK.id ? newKK : i)));
      setSelectedKK(newKK);
    } else {
      setKKList(prev => [...prev, newKK]);
    }
    setShowModalKK(false);
    setEditKK(null);
    setKKFile(null); setKKFileUrl(null);
    setFotoRumahFile(null); setFotoRumahUrl(null);
  };
  const resetFormKK = () => {
    setFormKK({
      noKK: "",
      kepalaKeluarga: "",
      alamat: "",
      rt: "",
      rw: "",
      isSementara: false,
      koordinat: "",
      noRumah: "",
      alamatLengkap: "",
      statusHunian: "Milik Sendiri",
      pemilikRumah: "",
      kondisiRumah: {
        lantai: "Keramik",
        dinding: "Tembok/Bata",
        atap: "Genteng/Beton",
        air: "PDAM",
        sanitasi: "Jamban Sendiri + Septic Tank",
        listrik: "PLN 900VA",
        kepemilikanAset: [],
      },
      kategoriKesejahteraan: "Sejahtera II",
      kepemilikanDokumenLengkap: true,
    });
    setKKFile(null);
    setKKFileUrl(null);
    setFotoRumahFile(null);
    setFotoRumahUrl(null);
    setEditKK(null);
    setShowModalKK(false);
  };
  const handleDeleteKK = (id: string) => {
    if (window.confirm("Hapus KK ini beserta semua anggota?")) {
      setKKList(prev => prev.filter(i => i.id !== id));
      if (selectedKK?.id === id) {
        setSelectedKK(null);
        setShowSidebar(false);
      }
    }
  };
  const openDetail = (kk: KKItem) => {
    const safeKK = {
      ...kk,
      anggota: Array.isArray(kk.anggota) ? kk.anggota : []
    };
    console.log(safeKK)
    setSelectedKK(safeKK);
    setShowSidebar(true);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => setSelectedKK(null), 300);
  };
  // === Anggota CRUD ===
  const openTambahAnggota = () => {
    setEditAnggota(null);
    setFormAnggota({
      nik: "", nama: "", jenisKelamin: "L", tempatLahir: "", tanggalLahir: "",
      statusKeluarga: "Anak", pendidikan: "", pekerjaan: "", bantuan: [], status: "Hidup",
      golonganDarah: "Tidak Tahu", disabilitas: false, jenisDisabilitas: "", kebutuhanKhusus: "",
      statusDesil: "Menengah", statusKependudukan: "Warga Tetap",
      mutasi: [], statusKawin: "Belum Kawin", agama: "Islam", keterangan: "",
      kelengkapanArsipRT: [], yatim: false, piatu: false,
      statusKesehatan: "Sehat", jandaDuda: false, kepesertaanBPJS: "Aktif Mandiri",
      partisipasiLingkungan: []
    });
    setKtpFileUrl(null);
    setShowModalAnggota(true);
  };
  const navigate = useNavigate();

  const openEditAnggota = (anggota: Anggota) => {
    navigate(`/admin/anggota/edit/${anggota.id}`);
  };

  const openEditAnggotaFromSidebar = (anggota: Anggota) => {
    setEditAnggota(anggota);
    setFormAnggota({
      ...anggota,
      // pastikan array tidak null
      bantuan: anggota.bantuan || [],
      partisipasiLingkungan: anggota.partisipasiLingkungan || [],
      kerentananSosial: anggota.kerentananSosial || [],
      kelengkapanArsipRT: anggota.kelengkapanArsipRT || [],
      mutasi: anggota.mutasi || [],
    });
    setKtpFileUrl(anggota.ktpUrl || null);
    setShowModalAnggota(true);
  };

  const openProfilAnggota = (anggota: Anggota) => {
    setSelectedAnggotaDetail(anggota);
    setShowSidebar(true); // pakai sidebar yang sama, tapi isi beda
  };
  
  const handleSubmitAnggota = () => {
    if (!formAnggota.nik?.trim() || !formAnggota.nama?.trim()) {
      alert("NIK dan Nama wajib diisi!");
      return;
    }
    if (!selectedKK) return;
    const newAnggota: Anggota = {
      id: editAnggota?.id || Date.now().toString(),
      nik: formAnggota.nik!,
      nama: formAnggota.nama!,
      jenisKelamin: formAnggota.jenisKelamin || "L",
      tempatLahir: formAnggota.tempatLahir || "",
      tanggalLahir: formAnggota.tanggalLahir || "",
      statusKeluarga: formAnggota.statusKeluarga || "Anak",
      pendidikan: formAnggota.pendidikan || "",
      pekerjaan: formAnggota.pekerjaan || "",
      bantuan: formAnggota.bantuan || [],
      status: formAnggota.status || "Hidup",
      golonganDarah: formAnggota.golonganDarah || "Tidak Tahu",
      disabilitas: formAnggota.disabilitas || false,
      jenisDisabilitas: formAnggota.jenisDisabilitas || "",
      kebutuhanKhusus: formAnggota.kebutuhanKhusus || "",
      statusDesil: formAnggota.statusDesil || "Menengah",
      statusKependudukan: formAnggota.statusKependudukan || "Warga Tetap",
      mutasi: formAnggota.mutasi || [],
      ktpUrl: ktpFileUrl || editAnggota?.ktpUrl,
      ktpName: ktpFile?.name || editAnggota?.ktpName,
      ktpType: ktpFile?.type || editAnggota?.ktpType,
      statusKawin: formAnggota.statusKawin || "Belum Kawin",
      agama: formAnggota.agama || "Islam",
      keterangan: formAnggota.keterangan || "",
      kelengkapanArsipRT: formAnggota.kelengkapanArsipRT || [],
      yatim: formAnggota.yatim || false,
      piatu: formAnggota.piatu || false,
      yatimPiatu: (formAnggota.yatim && formAnggota.piatu) || false,
      statusKesehatan: formAnggota.statusKesehatan || "Sehat",
      jandaDuda: formAnggota.jandaDuda || false,
      kepesertaanBPJS: formAnggota.kepesertaanBPJS || "Aktif Mandiri",
      partisipasiLingkungan: formAnggota.partisipasiLingkungan || [],
    };
    const updatedKK = {
      ...selectedKK,
      anggota: editAnggota
        ? selectedKK.anggota.map(a => (a.id === editAnggota.id ? newAnggota : a))
        : [...selectedKK.anggota, newAnggota],
    };
    setKKList(prev => prev.map(k => (k.id === selectedKK.id ? updatedKK : k)));
    setSelectedKK(updatedKK);
    setShowModalAnggota(false);
    setEditAnggota(null);
    setKtpFile(null);
    setKtpFileUrl(null);
    // Reset form anggota setelah simpan
    setFormAnggota({
      nik: "", nama: "", jenisKelamin: "L", tempatLahir: "", tanggalLahir: "",
      statusKeluarga: "Anak", pendidikan: "", pekerjaan: "", bantuan: [], status: "Hidup",
      golonganDarah: "Tidak Tahu", disabilitas: false, jenisDisabilitas: "", kebutuhanKhusus: "",
      statusDesil: "Menengah", statusKependudukan: "Warga Tetap",
      mutasi: [], statusKawin: "Belum Kawin", agama: "Islam", keterangan: "",
      kelengkapanArsipRT: [], yatim: false, piatu: false,
      statusKesehatan: "Sehat", jandaDuda: false, kepesertaanBPJS: "Aktif Mandiri",
      partisipasiLingkungan: []
    });
  };
  const handleDeleteAnggota = (anggotaId: string) => {
    if (!selectedKK || !window.confirm("Hapus anggota ini?")) return;
    const updated = {
      ...selectedKK,
      anggota: selectedKK.anggota.filter(a => a.id !== anggotaId),
    };
    setKKList(prev => prev.map(k => (k.id === selectedKK.id ? updated : k)));
    setSelectedKK(updated);
  };
  const openTagging = (anggota: Anggota) => {
    setSelectedAnggota(anggota);
    setFormAnggota(prev => ({ ...prev, bantuan: anggota.bantuan }));
    setShowModalBantuan(true);
  };

  const saveBantuan = () => {
    if (!selectedKK || !selectedAnggota) return;
    const updatedAnggota = { ...selectedAnggota, bantuan: formAnggota.bantuan || [] };
    const updatedKK = {
      ...selectedKK,
      anggota: selectedKK.anggota.map(a => (a.id === selectedAnggota.id ? updatedAnggota : a)),
    };
    setKKList(prev => prev.map(k => (k.id === selectedKK.id ? updatedKK : k)));
    setSelectedKK(updatedKK);
    setShowModalBantuan(false);
  };

  const handleFileChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { alert("File KK maks 5MB"); return; }
    setKKFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setKKFileUrl(reader.result as string);
    reader.readAsDataURL(file);
  };
  
  const handleFotoRumahChange = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { alert("Foto rumah maks 10MB"); return; }
    setFotoRumahFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFotoRumahUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleKtpChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { alert("File KTP maks 5MB"); return; }
    setKtpFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setKtpFileUrl(reader.result as string);
    reader.readAsDataURL(file);
  };
  const handleSaveAll = () => {
    alert("Semua perubahan berhasil disimpan ke localStorage!");
  };
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowKKZoom(false);
      }
    };
    if (showKKZoom) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [showKKZoom]);
  
  // === DAFTAR RT YANG ADA ===
  const daftarRT = useMemo(() => {
    const set = new Set(kkList.map(k => k.rt));
    return Array.from(set).sort();
  }, []);


  // Utils: Format tanggal Indonesia (contoh: 15 Agustus 1945)
  const formatTanggal = (dateString: string): string => {
    if (!dateString) return "—";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // kalau sudah format manual

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  const ExportToExcel = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diekspor!");
      return;
    }

    const headers = [
      "No KK",
      "Kepala Keluarga",
      "Alamat Lengkap",
      "RT",
      "RW",
      "Nomor Rumah",
      "Status Hunian",
      "Pemilik Rumah",
      "Kategori Kesejahteraan",
      "Jumlah Anggota KK",
      "Anggota Hidup",
      "Anggota Meninggal",
      "Penerima Bantuan",
      "Jenis Bantuan yang Diterima",
    ];

    const rows = filteredData.map((kk) => {
      const hidup = kk.anggota.filter(a => a.status === "Hidup").length;
      const meninggal = kk.anggota.filter(a => a.status === "Meninggal").length;
      const penerima = kk.anggota.filter(a => a.bantuan && a.bantuan.length > 0).length;

      const daftarBantuan = [...new Set(
        kk.anggota.flatMap(a => a.bantuan || [])
      )]
        .map(id => DAFTAR_BANTUAN.find(b => b.id === id)?.nama || id)
        .filter(Boolean)
        .join("; ") || "Tidak ada";

      return [
        kk.noKK || "",
        kk.kepalaKeluarga || "",
        kk.alamat || "",
        kk.rt || "",
        kk.rw || "",
        kk.noRumah || "",
        kk.statusHunian || "",
        kk.pemilikRumah || "",
        kk.kategoriKesejahteraan || "",
        kk.anggota.length,
        hidup,
        meninggal,
        penerima,
        daftarBantuan,
      ];
    });

    // Baris TOTAL
    const totalKK = filteredData.length;
    const totalAnggota = filteredData.reduce((acc, kk) => acc + kk.anggota.length, 0);
    rows.push(["", "", "", "", "", "", "", "", "TOTAL", totalKK, totalAnggota, "", "", ""]);

    // PAKAI SEMICOLON (;) + Quote → WAJIB untuk Indonesia!
    const csvRows = [
      headers.map(h => `"${h}"`),
      ...rows.map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`)
      )
    ].map(e => e.join(";")).join("\r\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvRows], {
      type: "text/csv;charset=utf-8;"
    });

    const tanggal = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");
    const rt = filterRT !== "all" ? `RT${filterRT}` : "SemuaRT";
    const rw = kkList[0]?.rw || "XX";
    const fileName = `Data_KK_${rt}_RW${rw}_${tanggal}.csv`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // === FUNGSI UNTUK MENGHASILKAN TAG ANGGOTA YANG RAPIH & MODERN ===
const renderTagsAnggota = (anggota: any, usia: number) => {
  const tags: { label: string; color: string }[] = [];

  // 1. Kelompok Usia
  const kelompok = kelompokUsia(usia);
  tags.push({
    label: kelompok.nama,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  });

  // 2. Pekerjaan / Status Khusus
  if (anggota.pekerjaan) {
    tags.push({
      label: anggota.pekerjaan,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    });
  }
  if (anggota.statusKeluarga === "Istri") {
    tags.push({ label: "Ibu Rumah Tangga", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" });
  }
  if (anggota.statusKeluarga === "Anak" && usia >= 15 && usia <= 24) {
    tags.push({ label: "Remaja", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" });
  }

  // 3. Bantuan Sosial
  anggota.bantuan?.forEach((id: any) => {
    const b = DAFTAR_BANTUAN.find((x) => x.id === id);
    if (b) {
      tags.push({
        label: `Penerima ${b.nama}`,
        color: b.color.replace("bg-", "bg-").includes("yellow")
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      });
    }
  });

  // 4. Kondisi Kesehatan (kecuali Sehat)
  if (anggota.statusKesehatan && anggota.statusKesehatan !== "Sehat") {
    tags.push({
      label: anggota.statusKesehatan,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    });
  }

  // 5. Dokumen Lengkap
  if (anggota.kelengkapanArsipRT?.includes("KTP")) {
    tags.push({ label: "KTP ✓", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" });
  }
  if (anggota.kelengkapanArsipRT?.includes("Akta Lahir")) {
    tags.push({ label: "Akta ✓", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" });
  }

  // 6. Partisipasi Masyarakat
  if (anggota.partisipasiLingkungan?.includes("Aktif Kegiatan RW/RT")) {
    tags.push({ label: "Aktif PKK", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" });
  }
  if (anggota.partisipasiLingkungan?.includes("Posyandu Balita")) {
    tags.push({ label: "Aktif Posyandu", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" });
  }

  // 7. Khusus Balita
  if (usia <= 5) {
    tags.push({ label: "Balita", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" });
  }

  // 8. Belum Akte / KTP
  if (usia >= 17 && !anggota.kelengkapanArsipRT?.includes("KTP")) {
    tags.push({ label: "Belum KTP", color: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" });
  }

  return tags;
};

  return (
    <div className="relative min-h-screen">

      {/* === BARU: HEADER FILTER & SEARCH YANG LEBIH CANTIK & FUNGSIONAL === */}
      <div className="mt-3 bg-white dark:bg-navy-800 p-6 rounded-2xl shadow-lg space-y-5">
        {/* BARIS 1: Search + Filter Utama (RT & Desil) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          {/* Search – lebar penuh di mobile, 1 kolom di desktop */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pencarian
            </label>
            <div className="relative">
              <MdSearch className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="No KK / Nama Kepala Keluarga / Alamat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Filter RT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              RT
            </label>
            <select
              value={filterRT}
              onChange={(e) => setFilterRT(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-2 focus:ring-brand-500 transition-all"
            >
              <option value="all">Semua RT</option>
              {daftarRT.map((rt) => (
                <option key={rt} value={rt}>RT {rt}</option>
              ))}
            </select>
          </div>

          {/* Filter Desil */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Kategori Kesejahteraan
            </label>
            <select
              value={filterDesil}
              onChange={(e) => setFilterDesil(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-2 focus:ring-brand-500 transition-all"
            >
              <option value="all">Semua Desil</option>
              <option value="Pra Sejahtera">Pra Sejahtera</option>
              <option value="Sejahtera I">Sejahtera I</option>
              <option value="Sejahtera II">Sejahtera II</option>
              <option value="Sejahtera III">Sejahtera III</option>
              <option value="Sejahtera III+">Sejahtera III+</option>
            </select>
          </div>

          {/* Filter Status Hunian – tetap di baris pertama kalau muat, kalau tidak akan turun otomatis */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Status Hunian
            </label>
            <select
              value={filterStatusHunian}
              onChange={(e) => setFilterStatusHunian(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-2 focus:ring-brand-500 transition-all"
            >
              <option value="all">Semua Status</option>
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Kontrak/Sewa">Kontrak/Sewa</option>
              <option value="Numpang">Numpang</option>
              <option value="Kos/Asrama">Kos/Asrama</option>
              <option value="Rumah Tidak Layak Huni">Rumah Tidak Layak Huni</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* BARIS 2: Tombol Aksi – selalu di bawah, rata kanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-navy-700">
          <button
            onClick={() => {
              setSearch("");
              setFilterRT("all");
              setFilterStatusHunian("all");
              setFilterDesil("all");
            }}
            disabled={!isAnyFilterActive}
            className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${
              isAnyFilterActive
                ? "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg active:scale-98"
                : "bg-gray-100 dark:bg-navy-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            {isAnyFilterActive ? (
              <>
                <MdClearAll className="w-5 h-5" />
                Reset Filter
              </>
            ) : (
              <>
                <MdDone className="w-5 h-5" />
                Tidak Ada Filter
              </>
            )}
          </button>

          <button
            onClick={() => ExportToExcel()}
            className="px-6 py-3 rounded-xl bg-green-500 hover:brightness-95 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <MdFileDownload />
            Export Excel
          </button>

          <button
            onClick={() => {
              setEditKK(null);
              setSelectedKK(null); 
              resetFormKK();
              setShowModalKK(true);
            }}
            className="px-6 py-2 justify-center bg-blue-600 text-white rounded-lg flex items-center gap-2 text-base font-medium shadow hover:bg-blue-700 transition whitespace-nowrap"
          >
            <MdAdd /> Tambah KK
          </button>
        </div>
      </div>
   
      <div className="mt-5">
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500">
            <MdFamilyRestroom className="mx-auto h-16 w-16 text-gray-300 mb-3" />
            <p>Belum ada data KK.</p>
          </div>
        ) : (
            filteredData.map((item) => {
              const hidup = item.anggota.filter(a => a.status === "Hidup").length;
              const kepala = item.anggota.find(a => a.statusKeluarga === "Kepala Keluarga") || item.anggota[0];
              const usiaKepala = kepala ? hitungUsia(kepala.tanggalLahir || "") : 0;

              return (
                <div
                  key={item.id}
                  onClick={() => openDetail(item)}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Gradient atas */}
                  <div className={`h-2 ${item.isSementara ? "bg-gradient-to-r from-orange-400 to-orange-600" : "bg-gradient-to-r from-brand-400 to-brand-600"}`} />

                  <div className="p-6">
                    {/* Baris 1: No KK + RT + Alamat */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-extrabold text-navy-700 dark:text-white">
                          No KK: {item.noKK}
                          {item.isSementara && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs font-bold text-orange-700 bg-orange-100 rounded-full">
                              Sementara
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                          RT: {item.rt} <span className="mx-1">|</span> {item.alamat}
                        </p>
                      </div>
                    </div>

                    {/* Baris 2: Kepala KK + Jumlah Anggota */}
                    <div className="mb-3">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Kepala KK: {item.kepalaKeluarga}
                        {usiaKepala > 0 && <span className="text-gray-500"> ({usiaKepala} th)</span>}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Anggota: {item.anggota.length} orang ({hidup} hidup)
                      </p>
                    </div>

                    {/* Baris 3: Status Hunian + Desil */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="flex rounded-md p-2 bg-gray-100/50 border items-center gap-1">
                        <span className="text-brand-600 dark:text-brand-400">{item.statusHunian || "—"}</span>
                      </span>
                      <span className="text-gray-400">│</span>
                      <span className="flex rounded-md p-2 bg-gray-100/50 border items-center gap-1">
                        {' '}
                        <span className={`font-bold ${item.kategoriKesejahteraan?.includes('Pra') || item.kategoriKesejahteraan?.includes('I') ? 'text-red-600' : 'text-green-600'}`}>
                          {item.kategoriKesejahteraan || "—"}
                        </span>
                      </span>
                      {/* Rumah Tidak Layak Huni */}
                      {/* {item.statusHunian === "Rumah Tidak Layak Huni" && (
                        <span className="text-red-600 font-bold">Tidak Layak</span>
                      )} */}
                    </div>

                    {/* Tombol Lihat Detail */}
                    <div className="mt-6 pt-5 border-t border-gray-200 dark:border-navy-700">
                      <button
                        onClick={() => openDetail(item)}
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
                            text-sm font-semibold 
                            text-brand-700 dark:text-brand-300 
                            group-hover:text-brand-800 dark:group-hover:text-brand-200 
                            transition-colors
                          ">
                            Lihat Detail KK
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
                </div>
              );
            })
        )}
      </div>

      {/* SIDEBAR SMART — BISA DETAIL KK ATAU DETAIL ANGGOTA (SATU SIDEBAR SAJA!) */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[60vw] max-w-[100vw] md:pb-0 pb-8 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-500 ease-out z-50 overflow-y-auto ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* === MODE: DETAIL ANGGOTA (kalau selectedAnggotaDetail ada) === */}
        {selectedAnggotaDetail ? (
          <>
            {/* Header Profil Anggota */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 z-10">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedAnggotaDetail(null);
                    // Kembali ke detail KK, bukan tutup sidebar
                  }}
                  className="flex items-center gap-3 text-lg font-semibold text-brand-600 hover:text-brand-700 transition"
                >
                  <MdArrowBackIosNew className="w-5 h-5" />
                  Kembali ke KK
                </button>
                <button onClick={closeSidebar} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MdClose className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 px-6 py-8 space-y-10 overflow-y-auto">
              {/* Avatar + Nama Besar */}
              <div className="text-center">
                <div className="w-36 h-36 mx-auto bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-6xl font-black shadow-2xl">
                  {selectedAnggotaDetail.nama.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-4xl font-black text-gray-800 dark:text-white mt-6">
                  {selectedAnggotaDetail.nama}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                  {hitungUsia(selectedAnggotaDetail.tanggalLahir || "")} tahun •{" "}
                  {selectedAnggotaDetail.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-3">
                  {selectedAnggotaDetail.statusKeluarga} • NIK: {selectedAnggotaDetail.nik}
                </p>
              </div>

              {/* Info Lengkap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-5 border border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tempat, Tanggal Lahir</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                    {selectedAnggotaDetail.tempatLahir || "—"}, {formatTanggal(selectedAnggotaDetail.tanggalLahir || "")}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-5 border border-purple-200 dark:border-purple-700">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Golongan Darah</p>
                  <p className="text-3xl font-black text-gray-800 dark:text-white mt-1">
                    {selectedAnggotaDetail.golonganDarah || "—"}
                  </p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-700">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pendidikan</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                    {selectedAnggotaDetail.pendidikan || "—"}
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-700">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Pekerjaan</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                    {selectedAnggotaDetail.pekerjaan || "—"}
                  </p>
                </div>
              </div>

              {/* Foto KTP */}
              {selectedAnggotaDetail.ktpUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Foto KTP</p>
                  <img
                    src={selectedAnggotaDetail.ktpUrl}
                    alt="KTP"
                    className="w-full rounded-2xl shadow-lg border-4 border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition"
                    onClick={() => window.open(selectedAnggotaDetail.ktpUrl, "_blank")}
                  />
                </div>
              )}

              {/* Tags Kerentanan, Bantuan, Partisipasi */}
              <div className="space-y-6">
                {renderTagsAnggota(selectedAnggotaDetail, hitungUsia(selectedAnggotaDetail.tanggalLahir || "")).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Status Sosial</p>
                    <div className="flex flex-wrap gap-2">
                      {renderTagsAnggota(selectedAnggotaDetail, hitungUsia(selectedAnggotaDetail.tanggalLahir || "")).map((tag, idx) => (
                        <span key={idx} className={`px-3 py-1.5 rounded-full text-xs font-bold ${tag.color}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : 
        /* === MODE: DETAIL KK (default, sama persis seperti kode lama kamu) === */
        selectedKK && (
         <>
            {/* Header dengan tombol kembali */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 z-10">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeSidebar}
                  className="flex items-center gap-3 text-lg font-semibold text-brand-600 hover:text-brand-700 transition"
                >
                  <MdArrowBackIosNew className="w-5 h-5" />
                  Kembali ke Daftar
                </button>
                <button onClick={closeSidebar} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MdClose className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 px-6 py-8 space-y-10">
              {/* Nomor KK - Judul Utama */}
              <div className="text-center">
                <p className="text-md text-black/80 dark:text-gray-400 tracking-widest uppercase">Kartu Keluarga</p>
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mt-2 tracking-tight">
                  {selectedKK.noKK}
                </h1>
              </div>

              {/* Info Utama */}
              <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <MdLocationOn className="w-6 h-6 text-brand-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alamat Lengkap</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {selectedKK.alamat} No. {selectedKK.noRumah || "-"} RT {selectedKK.rt} / RW {selectedKK.rw}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Status Rumah</p>
                    <p className="font-bold text-green-600">{selectedKK.statusHunian}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Kondisi Rumah</p>
                    <p className="font-bold text-red-600 dark:text-red-400">
                      Tidak Layak Huni
                      <span className="block text-xs font-medium mt-1 text-red-700 dark:text-red-300">
                        Layak Program Rutilahu
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Status Ekonomi</p>
                  <p className="text-xl font-black text-orange-600 dark:text-orange-400">Desil 3 (Miskin)</p>
                </div>
              </div>

              {/* Foto Rumah + Peta */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Foto Rumah</p>
                  {selectedKK.fotoRumahUrl ? (
                    <img
                      src={selectedKK.fotoRumahUrl}
                      alt="Rumah"
                      className="w-full h-56 object-cover rounded-2xl shadow-lg"
                    />
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-400 rounded-2xl h-56 flex items-center justify-center">
                      <MdHome className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex">
                  {selectedKK.koordinat ? (
                    <a
                      href={`https://maps.google.com/?q=${selectedKK.koordinat}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-tansparent text-black/80 border-2 border-[rgba(0,0,0,0.5)] font-normal py-3 rounded-lg text-center transform hover:brightness-[95%]"
                    >
                      Lihat di Peta
                    </a>
                  ) : (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 py-5 rounded-2xl text-center">
                      Koordinat belum tersedia
                    </div>
                  )}
                </div>
              </div>

              {/* Anggota Keluarga */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Anggota Keluarga
                  </h2>
                  <span className="text-3xl font-black text-brand-600">
                    {selectedKK.anggota.filter(a => a.status === "Hidup").length}
                  </span>
                </div>

                <div className="space-y-5">
                  {selectedKK.anggota
                    .filter(a => a.status === "Hidup")
                    .map((anggota, i) => {
                      const usia = hitungUsia(anggota.tanggalLahir || "");
                      const tags = renderTagsAnggota(anggota, usia); // pastikan fungsi ini sudah ada & mengembalikan array tag

                      return (
                        <div
                          key={anggota.id}
                          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
                        >
                          {/* Header - Nama + Status Keluarga */}
                          <div className={`px-5 py-4 ${anggota.statusKeluarga === "Kepala Keluarga"
                              ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"}`}
                          >
                            <p className="text-lg font-bold">
                              {i + 1}. {anggota.nama.toUpperCase()} ({usia} th, {anggota.jenisKelamin === "L" ? "L" : "P"})
                              {anggota.statusKeluarga === "Kepala Keluarga" && " — Kepala Keluarga"}
                            </p>
                          </div>

                          {/* Body */}
                          <div className="p-5 space-y-4">
                            <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                              NIK : {anggota.nik}
                            </p>

                            {/* Tags */}
                            {tags.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  Status & Tags :
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${tag.color}`}
                                    >
                                      {tag.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* DUA TOMBOL: Profil & Edit */}
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-5">

                            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-navy-700">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();            // supaya tidak buka sidebar KK lagi
                                  setSelectedAnggotaDetail(anggota);
                                }}
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
                                    text-sm font-semibold 
                                    text-brand-700 dark:text-brand-300 
                                    group-hover:text-brand-800 dark:group-hover:text-brand-200 
                                    transition-colors
                                  ">
                                    Lihat Profil Lengkap
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

                            <div className="md:mt-6 md:pt-5 md:border-t border-gray-200 dark:border-navy-700">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditAnggotaFromSidebar(anggota);
                                }}
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
                                    text-sm font-semibold 
                                    text-brand-700 dark:text-brand-300 
                                    group-hover:text-brand-800 dark:group-hover:text-brand-200 
                                    transition-colors
                                  ">
                                    Perbarui data
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
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 pb-10">
                <button
                  onClick={() => {
                    setEditKK(selectedKK);
                    setShowModalKK(true);
                    setKKFileUrl(selectedKK?.fileUrl || null);
                    setFotoRumahUrl(selectedKK?.fotoRumahUrl || null);
                  }}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-105"
                >
                  Edit Data KK
                </button>
                <button
                  onClick={openTambahAnggota}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-105"
                >
                  Tambah Anggota
                </button>
                <button
                  onClick={() => generateSingleKKPdf(selectedKK, selectedKK.anggota)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <MdPictureAsPdf className="w-5 h-5" />
                  Cetak Rekap
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {showSidebar && <div onClick={closeSidebar} className="fixed inset-0 backdrop-blur-md bg-[rgba(0,0,0,0.6)] z-40 transition-opacity" />}
     
      {/* === MODAL TAMBAH/EDIT KK === */}
      {showModalKK && (
        <div className="fixed right inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
          {/* DIV INI TIDAK DIUBAH */}
          <div className="absolute w-[90vw] mx-auto right-0 h-screen overflow-auto md:w-[44vw] bg-white dark:bg-navy-800 rounded-2xl shadow-2xl pb-6">
            {/* HEADER TIDAK DIUBAH */}
            <div className="sticky top-0 bg-white  dark:bg-navy-800 z-10 border-b border-gray-200 dark:border-navy-700 px-6 py-6 mb-5 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editKK ? "Edit Kartu Keluarga" : "Tambah Kartu Keluarga Baru"}
                {editKK && selectedKK && (
                  <span className="text-brand-600 dark:text-brand-400 font-medium ml-3">
                    – {selectedKK.noKK}
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowModalKK(false);
                  setEditAnggota(null);
                  setKtpFile(null);
                  setKtpFileUrl("");
                  setFotoRumahUrl("");
                }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-700 transition-all group"
              >
                <MdClose className="w-7 h-7 text-gray-500 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* ISI YANG DIPERCAntik — TANPA MENYENTUH 3 DIV UTAMA */}
            <div className="px-6">
              <div className="grid lg:grid-cols-1 gap-10">
                {/* KOLOM KIRI – Form */}
                <div className="space-y-8">
                  {/* Section: Data KK */}
                  <section className="space-y-5">
                    <h4 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-gray-100">
                      Data Kartu Keluarga
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <input
                        placeholder="No. KK"
                        value={formKK.noKK}
                        onChange={(e) => setFormKK({ ...formKK, noKK: e.target.value })}
                        className="px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                      />
                      <input
                        placeholder="Kepala Keluarga"
                        value={formKK.kepalaKeluarga}
                        onChange={(e) => setFormKK({ ...formKK, kepalaKeluarga: e.target.value })}
                        className="px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                      />
                    </div>
                  </section>

                  {/* Section: Alamat */}
                  <section className="space-y-5">
                    <h4 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-gray-100">
                      Alamat & Lokasi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Alamat Singkat"
                        value={formKK.alamat}
                        onChange={(e) => setFormKK({ ...formKK, alamat: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                      />
                      <input placeholder="No. Rumah" value={formKK.noRumah} onChange={e => setFormKK({ ...formKK, noRumah: e.target.value })} className="px-5 py-3 rounded-xl border" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input placeholder="RT" value={formKK.rt} onChange={(e) => setFormKK({ ...formKK, rt: e.target.value })} className="text-center px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all" />
                      <input placeholder="RW" value={formKK.rw} onChange={(e) => setFormKK({ ...formKK, rw: e.target.value })} className="text-center px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all" />
                      <input placeholder="Koordinat (lat,lng)" value={formKK.koordinat} onChange={(e) => setFormKK({ ...formKK, koordinat: e.target.value })} className="col-span-1 text-xs px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all" />
                    </div>
                    <textarea
                      placeholder="Alamat Lengkap"
                      rows={3}
                      value={formKK.alamatLengkap}
                      onChange={(e) => setFormKK({ ...formKK, alamatLengkap: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all shadow-sm resize-none"
                    />
                  </section>

                  {/* Status Hunian */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <select
                      value={formKK.statusHunian}
                      onChange={(e) => setFormKK({ ...formKK, statusHunian: e.target.value })}
                      className="px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    >
                      <option value="Milik Sendiri">Milik Sendiri</option>
                      <option value="Kontrak/Sewa">Kontrak/Sewa</option>
                      <option value="Numpang">Numpang</option>
                      <option value="Kos/Asrama">Kos/Asrama</option>
                      <option value="Rumah Tidak Layak Huni">Rumah Tidak Layak Huni</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <input
                      placeholder="Pemilik Rumah (jika bukan KK)"
                      value={formKK.pemilikRumah}
                      onChange={(e) => setFormKK({ ...formKK, pemilikRumah: e.target.value })}
                      className="px-5 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    />
                  </div>

                  {/* Kondisi Rumah – Card Soft */}
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-navy-700/50 dark:to-navy-800/50 rounded-3xl border border-gray-200/70 dark:border-navy-600/50 shadow-inner">
                    <h4 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                      Kondisi Rumah (Desil)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: "lantai", opts: ["Keramik", "Ubin/Tegel", "Semen/Plester", "Tanah"] },
                        { key: "dinding", opts: ["Tembok/Bata", "Kayu/Papan", "Bambu/GRC", "Lainnya"] },
                        { key: "atap", opts: ["Genteng/Beton", "Asbes", "Seng", "Lainnya"] },
                        { key: "air", opts: ["PDAM", "Sumur Bor/Pompa", "Sumur Gali", "Sungai/Mata Air", "Lainnya"] },
                        { key: "sanitasi", opts: ["Jamban Sendiri + Septic Tank", "Jamban Sendiri Tanpa Septic", "Jamban Umum", "Tidak Ada"] },
                        { key: "listrik", opts: ["PLN 1300VA+", "PLN 900VA", "PLN 450VA", "Genset/Solar Cell", "Tidak Ada"] },
                      ].map((item) => (
                        <select
                          key={item.key}
                          value={formKK.kondisiRumah[item.key as keyof typeof formKK.kondisiRumah]}
                          onChange={(e) => setFormKK({ ...formKK, kondisiRumah: { ...formKK.kondisiRumah, [item.key]: e.target.value } })}
                          className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 focus:ring-4 focus:ring-brand-500/30 focus:border-brand-500 transition-all shadow-sm text-sm"
                        >
                          {item.opts.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN – Upload */}
                <div className="space-y-8">
                  <h4 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-gray-100">
                    Dokumen Pendukung
                  </h4>

                  {/* Upload KK */}
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-4">Dokumen KK <span className="text-red-500">*</span></label>
                    <div
                      className="group border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-3xl p-10 text-center cursor-pointer hover:border-brand-500 dark:hover:border-brand-400 transition-all bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-navy-700/30"
                      onClick={() => document.getElementById("kkInput")?.click()}
                      onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0]); }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {kkFileUrl || editKK?.fileUrl ? (
                        <img src={kkFileUrl || editKK?.fileUrl} alt="KK" className="mx-auto max-h-80 rounded-2xl shadow-xl group-hover:scale-[1.02] transition-transform" />
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 rounded-full flex items-center justify-center shadow-lg">
                            <MdUpload className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Unggah Dokumen KK</p>
                          <p className="text-sm text-gray-500">PDF atau gambar</p>
                        </div>
                      )}
                      <input id="kkInput" type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                    </div>
                  </div>

                  {/* Upload Foto Rumah */}
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-4">Foto Rumah (opsional)</label>
                    <div
                      className="group border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-3xl p-10 text-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-all bg-gradient-to-br from-emerald-50/30 to-white/30 dark:from-emerald-900/20"
                      onClick={() => document.getElementById("fotoRumahInput")?.click()}
                      onDrop={(e) => { e.preventDefault(); handleFotoRumahChange(e.dataTransfer.files[0]); }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {fotoRumahUrl || editKK?.fotoRumahUrl ? (
                        <img src={fotoRumahUrl || editKK?.fotoRumahUrl} alt="Rumah" className="mx-auto max-h-80 rounded-2xl shadow-xl group-hover:scale-[1.02] transition-transform" />
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-emerald-900/40 rounded-full flex items-center justify-center shadow-lg">
                            <MdPhotoCamera className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Foto Rumah</p>
                        </div>
                      )}
                      <input id="fotoRumahInput" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFotoRumahChange(e.target.files[0])} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-navy-700">
                <button
                  onClick={() => setShowModalKK(false)}
                  className="px-8 py-3 rounded-2xl border-2 border-gray-300 dark:border-navy-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-navy-700 transition-all shadow-lg"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitKK}
                  className="px-10 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold shadow-xl hover:shadow-2xl hover:brightness-[90%] active:scale-[0.98] transition-all flex items-center gap-3"
                >
                  <MdSave className="w-6 h-6" />
                  {editKK ? "Simpan Perubahan" : "Tambah KK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ==================== MODAL TAMBAH / EDIT ANGGOTA KELUARGA ==================== */}
      {showModalAnggota && selectedKK && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4 overflow-y-auto">
            <div className="w-full md:w-[44vw] absolute right-0 h-screen overflow-auto bg-white dark:bg-navy-800 rounded-2xl shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-navy-800 z-10 border-b border-gray-200 dark:border-navy-700 px-8 py-5 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                  {editAnggota ? "Edit" : "Tambah"} Anggota Keluarga
                </h3>
                <button
                  onClick={() => {
                    setShowModalAnggota(false);
                    setEditAnggota(null);
                    setKtpFile(null);
                    setKtpFileUrl("");
                  }}
                  className="text-gray-500 hover:brightness-95 p-2 bg-white rounded-md hover:text-red-600"
                >
                  <MdClose className="w-7 h-7" />
                </button>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-1 gap-8">

                  {/* ==================== KOLOM KIRI ==================== */}
                  <div className="space-y-6">

                    {/* NIK & Nama */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">NIK</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={formAnggota.nik || ""}
                        onChange={(e) => setFormAnggota({ ...formAnggota, nik: e.target.value })}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500"
                        placeholder="16 digit NIK"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        value={formAnggota.nama || ""}
                        onChange={(e) => setFormAnggota({ ...formAnggota, nama: e.target.value })}
                        className="w-full px-4 py-3 border rounded-xl"
                        placeholder="Nama sesuai KTP"
                      />
                    </div>

                    {/* Jenis Kelamin & Status Keluarga */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Jenis Kelamin</label>
                        <select
                          value={formAnggota.jenisKelamin || "L"}
                          onChange={(e) => setFormAnggota({ ...formAnggota, jenisKelamin: e.target.value as "L" | "P" })}
                          className="w-full px-4 py-3 border rounded-xl"
                        >
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Hubungan Keluarga</label>
                        <select
                          value={formAnggota.statusKeluarga || "Anak"}
                          onChange={(e) => setFormAnggota({ ...formAnggota, statusKeluarga: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl"
                        >
                          <option value="Kepala Keluarga">Kepala Keluarga</option>
                          <option value="Suami">Suami</option>
                          <option value="Istri">Istri</option>
                          <option value="Anak">Anak</option>
                          <option value="Menantu">Menantu</option>
                          <option value="Cucu">Cucu</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Famili Lain">Famili Lain</option>
                        </select>
                      </div>
                    </div>

                    {/* Tempat & Tanggal Lahir */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Tempat Lahir</label>
                        <input
                          type="text"
                          value={formAnggota.tempatLahir || ""}
                          onChange={(e) => setFormAnggota({ ...formAnggota, tempatLahir: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Tanggal Lahir</label>
                        <input
                          type="date"
                          value={formAnggota.tanggalLahir || ""}
                          onChange={(e) => setFormAnggota({ ...formAnggota, tanggalLahir: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      </div>
                    </div>

                    {/* PENDIDIKAN & PEKERJAAN */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Pendidikan Terakhir</label>
                      <select
                        value={formAnggota.pendidikan || ""}
                        onChange={(e) => setFormAnggota({ ...formAnggota, pendidikan: e.target.value })}
                        className="w-full px-4 py-3 border rounded-xl"
                      >
                        {["Tidak Sekolah", "SD / MI", "SMP / MTs", "SMA / SMK / MA", "Mahasiswa / Akademi", "Lulus Tapi Tidak Bekerja"].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Pekerjaan / Status Ekonomi</label>
                      <select
                        value={formAnggota.pekerjaan || ""}
                        onChange={(e) => setFormAnggota({ ...formAnggota, pekerjaan: e.target.value })}
                        className="w-full px-4 py-3 border rounded-xl"
                      >
                        {[
                          "Bekerja", "Tidak Bekerja", "Ibu Rumah Tangga", "Wirausaha / UMKM",
                          "Petani / Buruh Tani", "Buruh Harian Lepas (BHL)", "Karyawan Swasta",
                          "PNS / TNI / POLRI", "Pekerja Migran / TKI", "Ojek Online",
                          "Pelajar", "Mahasiswa", "Difabel Tidak Bekerja"
                        ].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                  {/* PARTISIPASI LINGKUNGAN - DROPDOWN YANG BENAR-BENAR JALAN */}
                    <div ref={partisipasiRef} className="relative">
                      <label className="block text-sm font-bold text-brand-600 mb-2">
                        Partisipasi Lingkungan
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen({ ...dropdownOpen, partisipasi: !dropdownOpen.partisipasi });
                        }}
                        className="w-full px-4 py-3 border rounded-xl text-left flex justify-between items-center bg-white dark:bg-navy-700 hover:bg-gray-50 dark:hover:bg-navy-600 transition"
                      >
                        <span className="truncate">
                          {formAnggota.partisipasiLingkungan?.length === 0
                            ? "Pilih partisipasi..."
                            : formAnggota.partisipasiLingkungan?.join(", ")}
                        </span>
                        <MdArrowForwardIos className={`w-5 h-5 transition-transform ${dropdownOpen.partisipasi ? "rotate-90" : ""}`} />
                      </button>

                      {dropdownOpen.partisipasi && (
                        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {[
                            "Aktif Kegiatan RW/RT",
                            "Tidak Aktif",
                            "Siskamling",
                            "Bank Sampah",
                            "Posyandu Balita",
                            "Posyandu Lansia",
                            "PKK"
                          ].map((item) => (
                            <label
                              key={item}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 dark:hover:bg-navy-600 cursor-pointer transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={formAnggota.partisipasiLingkungan?.includes(item) || false}
                                onChange={(e) => {
                                  setFormAnggota((prev) => ({
                                    ...prev,
                                    partisipasiLingkungan: e.target.checked
                                      ? [...(prev.partisipasiLingkungan || []), item]
                                      : (prev.partisipasiLingkungan || []).filter((x) => x !== item),
                                  }));
                                }}
                                className="w-4 h-4 text-brand-600 rounded focus:ring-2 focus:ring-brand-500"
                              />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* KERENTANAN SOSIAL - DROPDOWN YANG BENAR-BENAR JALAN */}
                    <div ref={kerentananRef} className="relative">
                      <label className="block text-sm font-bold text-red-600 mb-2">
                        Status Kerentanan Sosial
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen({ ...dropdownOpen, kerentanan: !dropdownOpen.kerentanan });
                        }}
                        className="w-full px-4 py-3 border rounded-xl text-left flex justify-between items-center bg-white dark:bg-navy-700 hover:bg-gray-50 dark:hover:bg-navy-600 transition"
                      >
                        <span className="truncate">
                          {formAnggota.kerentananSosial?.length === 0
                            ? "Tidak ada kerentanan"
                            : formAnggota.kerentananSosial?.join(", ")}
                        </span>
                        <MdArrowForwardIos className={`w-5 h-5 transition-transform ${dropdownOpen.kerentanan ? "rotate-90" : ""}`} />
                      </button>

                      {dropdownOpen.kerentanan && (
                        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                          {[
                            "Yatim", "Piatu", "Yatim Piatu", "Janda", "Duda",
                            "Korban PHK", "Korban Bencana", "Komorbid Serius", "Terlantar"
                          ].map((item) => (
                            <label
                              key={item}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-navy-600 cursor-pointer transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={formAnggota.kerentananSosial?.includes(item) || false}
                                onChange={(e) => {
                                  setFormAnggota((prev) => ({
                                    ...prev,
                                    kerentananSosial: e.target.checked
                                      ? [...(prev.kerentananSosial || []), item]
                                      : (prev.kerentananSosial || []).filter((x) => x !== item),
                                  }));
                                }}
                                className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                              />
                              <span className="text-sm font-medium">{item}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    
                  </div>

                  {/* ==================== KOLOM KANAN ==================== */}
                  <div className="space-y-6">

                    {/* BANTUAN YANG DITERIMA */}
                    <div className="relative">
                      <label className="block text-sm font-bold mb-2 text-green-600">Bantuan yang Diterima</label>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(prev => ({ ...prev, bantuan: !prev.bantuan }))}
                        className="w-full px-4 py-3.5 border border-gray-300 dark:border-navy-600 rounded-xl text-left flex justify-between items-center bg-white dark:bg-navy-700 hover:bg-gray-50 dark:hover:bg-navy-600 transition"
                      >
                        <span className={`truncate ${formAnggota.bantuan?.length === 0 ? "text-gray-500" : ""}`}>
                          {formAnggota.bantuan?.length === 0
                            ? "Pilih bantuan..."
                            : formAnggota.bantuan
                                ?.map(id => DAFTAR_BANTUAN.find(b => b.id === id)?.nama || id)
                                .join(", ")}
                        </span>
                        <MdArrowForwardIos className={`w-5 h-5 transition-transform ${dropdownOpen.bantuan ? "rotate-90" : ""}`} />
                      </button>

                      {dropdownOpen.bantuan && (
                        <div className="absolute z-30 w-full mt-2 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                          {DAFTAR_BANTUAN.map((b) => {
                            const checked = formAnggota.bantuan?.includes(b.id) || false;
                            return (
                              <label key={b.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    setFormAnggota(prev => ({
                                      ...prev,
                                      bantuan: checked
                                        ? prev.bantuan?.filter(x => x !== b.id) || []
                                        : [...(prev.bantuan || []), b.id]
                                    }));
                                  }}
                                  className="w-4 h-4 rounded text-green-600 focus:ring-2 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium">{b.nama}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Upload Foto KTP */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Foto KTP (opsional)</label>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-500 transition"
                        onClick={() => document.getElementById("ktp-upload")?.click()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files[0]) handleKtpChange(e.dataTransfer.files[0]);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        {ktpFileUrl || editAnggota?.ktpUrl ? (
                          <img src={ktpFileUrl || editAnggota?.ktpUrl} alt="KTP" className="mx-auto max-h-64 rounded-lg" />
                        ) : (
                          <>
                            <MdPhotoCamera className="mx-auto w-16 h-16 text-gray-400" />
                            <p className="mt-3 text-sm text-gray-600">Klik atau seret foto KTP ke sini</p>
                          </>
                        )}
                        <input
                          id="ktp-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleKtpChange(e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-navy-700">
                  <button
                    onClick={() => {
                      setShowModalAnggota(false);
                      setEditAnggota(null);
                      setKtpFile(null);
                      setKtpFileUrl("");
                    }}
                    className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitAnggota}
                    className="px-10 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-semibold shadow-lg"
                  >
                    Simpan Anggota
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      {/* === MODAL ZOOM DOKUMEN KK === */}
      {showKKZoom && selectedKK?.fileUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4" onClick={() => setShowKKZoom(false)}>
          <div className="relative w-full max-w-5xl max-h-full bg-white dark:bg-navy-800 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
              <p className="text-sm font-medium text-white truncate max-w-md">{selectedKK.fileName}</p>
              <button onClick={() => setShowKKZoom(false)} className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                <MdClose className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="h-full max-h-[90vh] overflow-auto">
              {selectedKK.fileType?.startsWith("image/") ? (
                <img src={selectedKK.fileUrl} alt="KK Zoom" className="w-full h-auto max-h-[90vh] object-contain" />
              ) : (
                <iframe src={selectedKK.fileUrl} className="w-full h-[90vh] border-0" title="KK PDF" />
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent text-right">
              <p className="text-xs text-white/80">Klik di luar atau tekan <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-xs">ESC</kbd> untuk keluar</p>
            </div>
          </div>
        </div>
      )}
      {/* === MODAL TAGGING BANTUAN === */}
      {showModalBantuan && selectedAnggota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4">
          <div className="absolute inset-0 bg-black backdrop-blur-md" onClick={() => setShowModalBantuan(false)} />
          <Card extra="w-full max-w-md p-6 rounded-2xl shadow-xl relative z-10">
            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">Tag Bantuan - {selectedAnggota.nama}</h3>
            <div className="space-y-2 mb-6">
              {DAFTAR_BANTUAN.map(b => (
                <label key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAnggota.bantuan?.includes(b.id) || false}
                    onChange={e => {
                      setFormAnggota(prev => ({
                        ...prev,
                        bantuan: e.target.checked
                          ? [...(prev.bantuan || []), b.id]
                          : (prev.bantuan || []).filter(x => x !== b.id),
                      }));
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm">{b.nama}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-navy-600 pt-4">
              <button onClick={() => setShowModalBantuan(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white font-medium">
                Batal
              </button>
              <button onClick={saveBantuan} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-white font-medium shadow-md hover:shadow-lg">
                Simpan
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default DataKK;