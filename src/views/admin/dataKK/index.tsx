import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MdAccessibilityNew, MdAdd,
  MdAddAPhoto,
  MdArchive,
  MdArrowForwardIos,
  MdCardGiftcard,
  MdCheck, MdCheckCircle,
  MdChildCare, MdClose, MdDelete, MdDescription, MdDownload, MdEdit, MdElderly, MdFamilyRestroom,
  MdFemale,
  MdFileDownload,
  MdHome,
  MdHomeWork,
  MdInfo,
  MdInfoOutline,
  MdLocalOffer,
  MdLocationPin,
  MdMale,
  MdMap,
  MdNotes,
  MdOutlineLogout,
  MdOutlinePersonOff,
  MdPeople,
  MdPerson,
  MdPersonAdd,
  MdPhotoCamera,
  MdPictureAsPdf,
  MdSave,
  MdSchool, MdSearch,
  MdShield,
  MdUpload,
  MdVerifiedUser,
  MdWarning, MdZoomIn
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { generateAllKKPdf, generateSingleKKPdf } from "utils/generatePDFKK";

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
  // KK 1
  {
    id: "1",
    noKK: "3275010101900001",
    kepalaKeluarga: "Ahmad Fauzi",
    alamat: "Jl. Merdeka No. 10",
    rt: "01",
    rw: "001",
    isSementara: false,
    koordinat: "-6.2088,106.8456",
    alamatLengkap: "Jl. Merdeka No. 10 RT 01 RW 001 Kel. Kebon Jeruk, Kec. Andir, Kota Bandung",
    statusHunian: "Milik Sendiri",
    pemilikRumah: "Ahmad Fauzi",
    kondisiRumah: {
      lantai: "Keramik",
      dinding: "Tembok/Bata",
      atap: "Genteng/Beton",
      air: "PDAM",
      sanitasi: "Jamban Sendiri + Septic Tank",
      listrik: "PLN 900VA",
      kepemilikanAset: ["TV", "Kulkas", "Motor"]
    },
    kategoriKesejahteraan: "Sejahtera II",
    kepemilikanDokumenLengkap: true,
    anggota: [
      {
        id: "a1",
        nik: "3275010101900001",
        nama: "Ahmad Fauzi",
        jenisKelamin: "L",
        tempatLahir: "Bandung",
        tanggalLahir: "1990-01-01",
        statusKeluarga: "Kepala Keluarga",
        pendidikan: "SMA / SMK / MA",
        pekerjaan: "Wirausaha / UMKM",
        bantuan: ["pkh", "bpnt"],
        status: "Hidup",
        golonganDarah: "O",
        disabilitas: true,
        jenisDisabilitas: "Rungu",
        kebutuhanKhusus: "Alat Bantu Dengar",   // wajib diisi karena disabilitas: true
        statusDesil: "Rentan Miskin",
        statusKependudukan: "Warga Tetap",
        mutasi: [{ tanggal: "2020-01-15", jenis: "Masuk", keterangan: "Pindah dari Jakarta" }],
        statusKawin: "Kawin",
        agama: "Islam",
        keterangan: "Ketua RT 01",
        kelengkapanArsipRT: ["KTP", "KK", "Akta Nikah"],
        yatim: false,
        piatu: false,
        statusKesehatan: "Sehat",
        kepesertaanBPJS: "Aktif Mandiri",
        partisipasiLingkungan: ["Aktif Kegiatan RW/RT", "Siskamling", "PKK"],
        kerentananSosial: []
      },
      {
        id: "a2",
        nik: "3275016502950002",
        nama: "Siti Nurhaliza",
        jenisKelamin: "P",
        tempatLahir: "Bandung",
        tanggalLahir: "1995-02-15",
        statusKeluarga: "Istri",
        pendidikan: "SMA / SMK / MA",
        pekerjaan: "Ibu Rumah Tangga",
        bantuan: ["pkh", "kis"],
        status: "Hidup",
        golonganDarah: "A",
        disabilitas: false,
        jenisDisabilitas: undefined,
        kebutuhanKhusus: "",   // kosong karena tidak disabilitas
        statusDesil: "Miskin",
        statusKependudukan: "Warga Tetap",
        mutasi: [],
        statusKawin: "Kawin",
        agama: "Islam",
        keterangan: "",
        kelengkapanArsipRT: ["KTP", "KK", "Akta Nikah"],
        yatim: false,
        piatu: false,
        statusKesehatan: "Ibu Hamil",
        kepesertaanBPJS: "Aktif PBI",
        partisipasiLingkungan: ["PKK", "Posyandu Balita"],
        kerentananSosial: []
      },
      {
        id: "a3",
        nik: "3275015512100003",
        nama: "Muhammad Rizky",
        jenisKelamin: "L",
        tempatLahir: "Bandung",
        tanggalLahir: "2012-10-05",
        statusKeluarga: "Anak",
        pendidikan: "SD / MI",
        pekerjaan: "Pelajar",
        bantuan: ["kip"],
        status: "Hidup",
        golonganDarah: "O",
        disabilitas: false,
        jenisDisabilitas: undefined,
        kebutuhanKhusus: "",
        statusDesil: "Miskin",
        statusKependudukan: "Warga Tetap",
        mutasi: [],
        statusKawin: "Belum Kawin",
        agama: "Islam",
        keterangan: "",
        kelengkapanArsipRT: ["KTP", "KK", "Akta Lahir"],
        yatim: false,
        piatu: false,
        statusKesehatan: "Sehat",
        kepesertaanBPJS: "Aktif PBI",
        partisipasiLingkungan: [],
        kerentananSosial: []
      }
    ]
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

  // Tambahkan state ini di dalam komponen DataKK
  const [dropdownOpen, setDropdownOpen] = useState({
    partisipasi: false,
    kerentanan: false,
    bantuan: false,     // ← ditambahkan
  });

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
    const saved = localStorage.getItem("dataKK");
    if (saved?.length > 0) {
      setKKList(JSON.parse(saved));
    } else {
      setKKList(DEMO_DATA);
      localStorage.setItem("dataKK", JSON.stringify(DEMO_DATA));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("dataKK", JSON.stringify(kkList));
  }, [kkList]);
  const filteredData = useMemo(() => {
    let data = kkList;
    // Filter RT
    if (filterRT !== "all") {
      data = data.filter(k => k.rt === filterRT);
    }
    // Filter No KK
    if (filterNoKK !== "all") {
      data = data.filter(k => k.noKK === filterNoKK);
    }
    // Search
    if (search) {
      data = data.filter(
        (item) =>
          item.noKK.toLowerCase().includes(search.toLowerCase()) ||
          item.kepalaKeluarga.toLowerCase().includes(search.toLowerCase()) ||
          item.alamat.toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [kkList, search, filterNoKK, filterRT]);
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
    const rtSet = new Set<string>();
    kkList.forEach(kk => {
      if (kk.rt) rtSet.add(kk.rt);
    });
    return Array.from(rtSet).sort();
  }, [kkList]);


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

  return (
    <div className="relative min-h-screen">
      {/* Widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget icon={<MdFamilyRestroom className="h-7 w-7" />} title="Total KK" subtitle={kkList.length.toString()} />
        <Widget icon={<MdFamilyRestroom className="h-7 w-7" />} title="Resmi" subtitle={kkList.filter(k => !k.isSementara).length.toString()} />
        <Widget icon={<MdFamilyRestroom className="h-7 w-7" />} title="Sementara" subtitle={kkList.filter(k => k.isSementara).length.toString()} />
        <Widget icon={<MdPerson className="h-7 w-7" />} title="Total Anggota" subtitle={kkList.reduce((a, b) => a + b.anggota.length, 0).toString()} />
      </div>
      {/* Header + Filter + Simpan */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filter RT */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Filter berdasarkan RT</label>
              <select
                value={filterRT}
                onChange={(e) => setFilterRT(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Semua RT</option>
                {daftarRT.map(rt => (
                  <option key={rt} value={rt}>RT {rt}</option>
                ))}
              </select>
            </div>
            {/* Filter No KK */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Filter berdasarkan No. KK</label>
              <select
                value={filterNoKK}
                onChange={(e) => setFilterNoKK(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Semua KK</option>
                {kkList.map((kk) => (
                  <option key={kk.noKK} value={kk.noKK}>
                    {kk.noKK} ({kk.alamat.split(",")[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => generateAllKKPdf(kkList)} // kkList = state kamu
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold flex items-center gap-3 transition-all hover:brightness-90 active:scale-[0.98]"
          >
            <MdPictureAsPdf className="w-6 h-6" />
            Export Semua KK ke PDF
          </button>
          <button
            onClick={() => {
              setEditKK(null);
              setSelectedKK(null); // ← PENTING! Kosongkan selectedKK
              resetFormKK(); // fungsi reset lengkap yang sudah kita buat
              setShowModalKK(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-base font-medium shadow hover:bg-blue-700 transition whitespace-nowrap"
          >
            <MdAdd /> Tambah KK
          </button>
        </div>
      {/* Search */}
      <div className="mt-5">
        <div className="relative">
          <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari No KK, nama, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
          />
        </div>
      </div>
      {/* CARD LIST */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500">
            <MdFamilyRestroom className="mx-auto h-16 w-16 text-gray-300 mb-3" />
            <p>Belum ada data KK.</p>
          </div>
        ) : (
          filteredData.map((item) => {
            const bantuanSummary = getBantuanSummary(item);
            const penerimaBantuan = item.anggota.filter(a => a.bantuan.length > 0).length;
            const hidup = item.anggota.filter(a => a.status === "Hidup").length;
            const meninggal = item.anggota.filter(a => a.status === "Meninggal").length;
            const yatimPiatu = item.anggota.filter(a => a.yatim || a.piatu).length;
            return (
              <div key={item.id} onClick={() => openDetail(item)} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {/* <p className="flex items-center gap-2">
                  <MdHome className="h-4 w-4" />
                  {item.noRumah ? `${item.noRumah}, ${item.alamat}` : item.alamat}
                </p> */}
                <div className={`h-2 ${item.isSementara ? "bg-gradient-to-r from-orange-400 to-orange-600" : "bg-gradient-to-r from-brand-400 to-brand-600"}`} />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-navy-700 dark:text-white flex items-center gap-2">
                        {item.noKK}
                        {item.isSementara && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                            Sementara
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1"><strong>Kepala:</strong> {item.kepalaKeluarga}</p>
                    </div>
                    <MdArrowForwardIos className="h-5 w-5 text-gray-400 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <p className="flex items-center gap-2"><MdPerson className="h-4 w-4" /> {item.alamat}</p>
                    <p className="flex items-center gap-2"><MdCheckCircle className="h-4 w-4" /> RT {item.rt} / RW {item.rw}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["Bayi", "Balita", "Anak-anak", "Remaja", "Usia Produktif", "Lansia", "Lansia Risiko Tinggi"].map(k => {
                      const count = item.anggota.filter(a => {
                        if (a.status !== "Hidup") return false;
                        const usia = hitungUsia(a.tanggalLahir);
                        if (k === "Bayi") return usia < 1;
                        if (k === "Balita") return usia < 6;
                        if (k === "Anak-anak") return usia < 13;
                        if (k === "Remaja") return usia < 18;
                        if (k === "Usia Produktif") return usia < 56;
                        if (k === "Lansia") return usia < 70;
                        return usia >= 70;
                      }).length;
                      if (count === 0) return null;
                      const { icon, color } = kelompokUsia(k === "Bayi" ? 0 : k === "Balita" ? 3 : k === "Anak-anak" ? 10 : k === "Remaja" ? 15 : k === "Usia Produktif" ? 30 : k === "Lansia" ? 60 : 70);
                      return (
                        <span key={k} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300`}>
                          {icon} {count} {k}
                        </span>
                      );
                    })}
                    {yatimPiatu > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        <MdInfo className="h-3 w-3" /> {yatimPiatu} Yatim/Piatu
                      </span>
                    )}
                  </div>
                  <div className="border-t border-gray-200 dark:border-navy-600 pt-3 mb-3">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Bantuan: {penerimaBantuan} penerima</p>
                    {bantuanSummary.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">Tidak ada bantuan</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {bantuanSummary.map(b => (
                          <span key={b.id} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${b.color}`}>
                            {b.nama} ×{b.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 text-green-600"><MdCheckCircle /> {hidup} Hidup</span>
                      {meninggal > 0 && <span className="flex items-center gap-1 text-red-600"><MdWarning /> {meninggal} Meninggal</span>}
                    </div>
                    <span className="font-bold text-brand-600 dark:text-brand-400">{item.anggota.length} anggota</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* === SIDEBAR DETAIL – VERSI MODERN & SOFT === */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[82vw] bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out z-50 ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {selectedKK && (
          <>
            {/* Header dengan gradient soft */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-white/80 to-white dark:from-navy-900/90 dark:to-navy-900 backdrop-blur-md border-b border-gray-200/60 dark:border-navy-700/60 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    KK {selectedKK.noKK}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedKK.kepalaKeluarga}
                  </p>
                </div>
                <button
                  onClick={closeSidebar}
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 transition-all duration-200 group"
                >
                  <MdClose className="w-6 h-6 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
              {/* Dokumen KK – Card dengan glass effect */}
              <div className="group">
                <p className="text-xs font-semibold text-black dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MdDescription className="w-4 h-4" />
                  Dokumen Kartu Keluarga
                </p>
                {selectedKK.fileUrl ? (
                  <div
                    onClick={() => setShowKKZoom(true)}
                    className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200/80 dark:border-navy-700/60 overflow-hidden cursor-pointer transition-all duration-300"
                  >
                    <div className="p-5 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-700 border-2 border-dashed border-gray-300 dark:border-navy-600 flex-shrink-0">
                        {selectedKK.fileType?.startsWith("image/") ? (
                          <img src={selectedKK.fileUrl} alt="KK" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <MdPictureAsPdf className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {selectedKK.fileName || "Dokumen KK"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedKK.fileType?.includes("pdf") ? "PDF" : "Gambar"}
                        </p>
                      </div>
                      <MdZoomIn className="w-9 h-9 text-gray-400 group-hover:text-brand-500 transition-colors" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/70 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-center">
                    <MdWarning className="w-10 h-10 mx-auto mb-3 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">Belum ada dokumen KK</p>
                  </div>
                )}
              </div>

              {/* Info Rumah – Card elegan */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/40">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <MdHome className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Informasi Rumah
                </h4>
                <div className="space-y-3 md:space-y-0 md:gap-4 md:flex items-center justify-start text-sm">
                  {selectedKK.fotoRumahUrl && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-700 border-2 border-dashed border-gray-300 dark:border-navy-600 flex-shrink-0">
                    <img
                      src={selectedKK.fotoRumahUrl}
                      alt="Rumah"
                      className="rounded-xl w-full object-cover max-h-64 shadow-md"
                    />
                  </div>
                  )}
                  {/* TAMPILKAN NO. RUMAH DI SINI */}
                  {selectedKK.noRumah && (
                    <p className="bg-white border rounded-lg p-3 border-blue-200 flex items-center gap-2 whitespace-nowrap">
                      <MdHomeWork className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-blue-700 dark:text-blue-300">
                        No. {selectedKK.noRumah}
                      </span>
                    </p>
                  )}
                  {selectedKK.alamat && (
                    <p className="bg-white border rounded-lg p-3 border-blue-200 flex items-start gap-2">
                      <MdLocationPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedKK.alamat} RT {selectedKK.rt}/RW {selectedKK.rw}
                      </span>
                    </p>
                  )}
                  {selectedKK.koordinat && (
                    <p className="bg-white border rounded-lg p-3 border-blue-200 flex items-center gap-2">
                      <MdMap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <a
                        href={`https://maps.google.com/?q=${selectedKK.koordinat}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                      >
                        {selectedKK.koordinat}
                      </a>
                    </p>
                  )}
                  <p className="bg-white border rounded-lg p-3 border-blue-200 flex items-center gap-2">
                    <MdHomeWork className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>
                      <strong>{selectedKK.statusHunian}</strong>
                      {selectedKK.pemilikRumah && ` • Pemilik: ${selectedKK.pemilikRumah}`}
                    </span>
                  </p>
                </div>
              </div>

              {/* Aksi Utama */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setEditKK(selectedKK);
                    setFormKK({
                      noKK: selectedKK.noKK,
                      kepalaKeluarga: selectedKK.kepalaKeluarga,
                      alamat: selectedKK.alamat,
                      rt: selectedKK.rt,
                      noRumah: selectedKK.noRumah || "",
                      rw: selectedKK.rw,
                      isSementara: selectedKK.isSementara || false,
                      koordinat: selectedKK.koordinat || "",
                      alamatLengkap: selectedKK.alamatLengkap || "",
                      statusHunian: selectedKK.statusHunian || "Milik Sendiri",
                      pemilikRumah: selectedKK.pemilikRumah || "",
                      kondisiRumah: selectedKK.kondisiRumah || {
                        lantai: "Keramik",
                        dinding: "Tembok/Bata",
                        atap: "Genteng/Beton",
                        air: "PDAM",
                        sanitasi: "Jamban Sendiri + Septic Tank",
                        listrik: "PLN 900VA",
                        kepemilikanAset: [],
                      },
                      kategoriKesejahteraan: selectedKK.kategoriKesejahteraan || "Sejahtera II",
                      kepemilikanDokumenLengkap: selectedKK.kepemilikanDokumenLengkap || true,
                    });
                    setKKFileUrl(selectedKK.fileUrl || null);
                    setFotoRumahUrl(selectedKK.fotoRumahUrl || null);
                    setShowModalKK(true);
                  }}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-medium shadow-lg hover:shadow-xl hover:brightness-[90%] active:scale-[0.98] transition-all duration-300"
          >
            <MdEdit className="w-6 h-6" />
            <span className="text-xs">Perbarui</span>
          </button>

          <button
            onClick={() => generateSingleKKPdf(selectedKK, selectedKK.anggota)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl hover:brightness-[90%] active:scale-[0.98] transition-all duration-300"
          >
            <MdFileDownload className="w-6 h-6" />
            <span className="text-xs">Unduh PDF</span>
          </button>

          <button
            onClick={() => handleDeleteKK(selectedKK.id)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white font-medium shadow-lg hover:shadow-xl hover:brightness-[90%] active:scale-[0.98] transition-all duration-300"
          >
            <MdDelete className="w-6 h-6" />
            <span className="text-xs">Hapus</span>
          </button>

          <button
            onClick={openTambahAnggota}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white font-medium shadow-lg hover:shadow-xl hover:brightness-[90%] active:scale-[0.98] transition-all duration-300"
          >
            <MdPersonAdd className="w-6 h-6" />
            <span className="text-xs">Tambah Anggota</span>
          </button>
        </div>

        {/* Daftar Anggota Keluarga */}
        <div>
          {(!selectedKK.anggota || selectedKK.anggota.length === 0) ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-navy-800/50 rounded-2xl">
              <MdPeople className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Belum ada anggota</p>
              <button
                onClick={openTambahAnggota}
                className="mt-4 text-brand-600 dark:text-brand-400 font-medium hover:underline"
              >
                + Tambah anggota pertama
              </button>
            </div>
          ) : (
            <div className="space-y-5 md:space-y-0 md:gap-6 grid grid-cols-1 md:grid-cols-2">
              {selectedKK.anggota.map((a) => {
                const usia = hitungUsia(a.tanggalLahir || "");
                const { icon: iconUsia, color: colorUsia } = kelompokUsia(usia);
                const isMeninggal = a.status === "Meninggal";

                return (
                 <div
                    key={a.id}
                    className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      isMeninggal
                        ? "border-red-200/80 bg-gradient-to-br from-red-50/70 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20"
                        : "border-gray-200/70 bg-white/95 dark:border-navy-700/60 dark:bg-navy-800/90"
                    }`}
                  >
                    {/* === HEADER: Status Overlay & Foto KTP === */}
                    <div className="relative">
                      {/* Status Overlay untuk Meninggal/Pindah */}
                      {isMeninggal && (
                        <div className="absolute inset-0 bg-gradient-to-t from-red-600/70 via-red-600/20 to-transparent backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="text-white font-bold text-2xl tracking-wider px-4 py-2 bg-red-700/90 rounded-lg shadow-lg">
                            <MdOutlinePersonOff className="inline w-5 h-5 mr-1" /> MENINGGAL
                          </span>
                        </div>
                      )}
                      {a.status === "Pindah" && (
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/70 via-yellow-600/20 to-transparent backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="text-white font-bold text-2xl tracking-wider px-4 py-2 bg-yellow-700/90 rounded-lg shadow-lg">
                            <MdOutlineLogout className="inline w-5 h-5 mr-1" /> PINDAH
                          </span>
                        </div>
                      )}

                      {/* Foto KTP Container */}
                      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-navy-700 dark:to-navy-800">
                        {a.ktpUrl ? (
                          a.ktpType?.startsWith("image/") ? (
                            <img 
                              src={a.ktpUrl} 
                              alt={`KTP ${a.nama}`} 
                              className="w-full h-full rounded-t-2xl object-cover group hover:brightness-[90%] active:scale-[0.98] transition-transform duration-300" 
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/30">
                              <a 
                                href={a.ktpUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group text-center transform hover:scale-110 transition-all duration-200"
                              >
                                <div className="p-4 bg-white/80 dark:bg-navy-900/80 rounded-2xl shadow-lg">
                                  <MdPictureAsPdf className="w-12 h-12 text-red-500 mx-auto mb-2" />
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{a.ktpName || "KTP.pdf"}</p>
                                  <p className="text-xs text-gray-500 mt-1">Klik untuk lihat</p>
                                </div>
                              </a>
                            </div>
                          )
                        ) : (
                          <div
                            onClick={() => openEditAnggota(a)}
                            className="flex h-full flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white/50 dark:hover:bg-navy-700/50 transition-all duration-200 rounded-t-2xl"
                          >
                            <div className="w-16 h-16 bg-gray-200 dark:bg-navy-600 rounded-lg flex items-center justify-center mb-3 shadow-md">
                              <MdAddAPhoto className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-sm font-medium">Upload KTP</p>
                            <p className="text-xs text-gray-400 mt-1">Opsional tapi disarankan</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* === BODY: Informasi Lengkap === */}
                    <div className="p-6 space-y-6">
                      {/* === SECTION 1: Identitas Utama === */}
                      <div className="border-b border-gray-200/50 dark:border-navy-700/50 pb-4">
                        <div className="md:flex justify-between items-start gap-4">
                          {/* Identitas */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2.5 rounded-xl shadow-sm ${
                              a.jenisKelamin === "L" 
                                ? "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30" 
                                : "bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30"
                            }`}>
                              {a.jenisKelamin === "L" ? (
                                <MdMale className="w-6 h-6 text-blue-600" />
                              ) : (
                                <MdFemale className="w-6 h-6 text-pink-600" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{a.nama}</h3>
                              <p className="text-xs text-gray-500 bg-gray-100 dark:bg-navy-700 px-2 py-1 rounded-lg w-fit">
                                NIK: {a.nik}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="md:flex gap-2 md:gap-1.5 md:mt-0 mt-4 grid grid-cols-3">
                            <button 
                              onClick={() => openTagging(a)}
                              className="flex items-center justify-center p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 transition-all duration-200 shadow-sm"
                              title="Tag Bantuan"
                            >
                              <MdLocalOffer className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => openEditAnggota(a)}
                              className="flex items-center justify-center p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-600 transition-all duration-200 shadow-sm"
                              title="Edit Data"
                            >
                              <MdEdit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAnggota(a.id)}
                              className="flex items-center justify-center p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 transition-all duration-200 shadow-sm"
                              title="Hapus Anggota"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* === SECTION 2: Data Demografi === */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 uppercase tracking-wide">
                          <MdInfo className="w-4 h-4" />
                          Data Demografi
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1 border p-3 rounded-md">
                            <span className="text-xs text-gray-500 block">Tempat/Tanggal Lahir</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {a.tempatLahir}, {formatTanggal(a.tanggalLahir)}
                            </p>
                          </div>
                          
                          <div className="space-y-1 border p-3 rounded-md">
                            <span className="text-xs text-gray-500 block">Usia</span>
                            <div className="flex items-center gap-2">
                              <strong className="text-gray-900 dark:text-white">{usia} tahun</strong>
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colorUsia}`}>
                                {iconUsia}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-1 border p-3 rounded-md">
                            <span className="text-xs text-gray-500 block">Agama</span>
                            <p className="font-medium capitalize text-gray-900 dark:text-white">
                              {a.agama || "—"}
                            </p>
                          </div>
                          
                          <div className="space-y-1 border p-3 rounded-md">
                            <span className="text-xs text-gray-500 block">Status Perkawinan</span>
                            <p className="font-medium capitalize text-gray-900 dark:text-white">
                              {a.statusKawin}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* === SECTION 3: Status Khusus === */}
                      {(a.yatim || a.piatu || a.statusKependudukan) && (
                        <div className="space-y-3 pt-4 border-t border-gray-200/30 dark:border-navy-700/40">
                          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 uppercase tracking-wide">
                            <MdShield className="w-4 h-4" />
                            Status Khusus
                          </h4>
                          
                          <div className="flex flex-wrap gap-2">
                            {a.yatim && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm">
                                <MdChildCare className="w-3.5 h-3.5" />
                                Yatim
                              </span>
                            )}
                            
                            {a.piatu && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm">
                                <MdChildCare className="w-3.5 h-3.5" />
                                Piatu
                              </span>
                            )}
                            
                            {a.statusKependudukan && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-navy-700/60 text-gray-700 dark:text-gray-300 shadow-sm">
                                <MdVerifiedUser className="w-3.5 h-3.5" />
                                {a.statusKependudukan}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* === SECTION 4: Bantuan & Arsip === */}
                      <div className="space-y-3 pt-4 border-t border-gray-200/30 dark:border-navy-700/40">
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 uppercase tracking-wide">
                          <MdLocalOffer className="w-4 h-4" />
                          Bantuan & Dokumentasi
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {/* Bantuan */}
                          {a.bantuan?.length > 0 ? (
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MdCardGiftcard className="w-3.5 h-3.5" />
                                Program Bantuan ({a.bantuan.length})
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {a.bantuan.map((bId) => {
                                  const b = DAFTAR_BANTUAN.find(x => x.id === bId);
                                  return b ? (
                                    <span 
                                      key={bId} 
                                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm ${
                                        b.color.includes('blue') ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/40 dark:text-blue-300' :
                                        b.color.includes('green') ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/40 dark:text-green-300' :
                                        b.color.includes('red') ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 dark:from-red-900/40 dark:text-red-300' :
                                        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-navy-700/60 dark:text-gray-300'
                                      }`}
                                    >
                                      <MdCheckCircle className="w-3.5 h-3.5" />
                                      {b.nama}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic flex items-center gap-1">
                              <MdInfoOutline className="w-3.5 h-3.5" />
                              Belum ada program bantuan
                            </p>
                          )}

                          {/* Arsip RT */}
                          {(a.kelengkapanArsipRT?.length || 0) > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MdArchive className="w-3.5 h-3.5" />
                                Dokumen Arsip RT ({a.kelengkapanArsipRT?.length || 0})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {a.kelengkapanArsipRT?.map((doc, idx) => (
                                  <span 
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 dark:from-emerald-900/40 dark:text-emerald-300 shadow-sm"
                                  >
                                    <MdCheck className="w-3.5 h-3.5" />
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* === FOOTER: Catatan (Opsional) === */}
                      {a.keterangan && (
                        <div className="pt-4 border-t border-gray-200/30 dark:border-navy-700/40">
                          <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                            <MdNotes className="w-3.5 h-3.5" />
                            Catatan Tambahan
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-navy-700/50 p-3 rounded-xl">
                            "{a.keterangan}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )}
</div>
      {showSidebar && <div onClick={closeSidebar} className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-40 transition-opacity" />}
     
      {/* === MODAL TAMBAH/EDIT KK === */}
      {showModalKK && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
          {/* DIV INI TIDAK DIUBAH */}
          <div className="w-[90vw] mx-auto md:w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-navy-800 rounded-2xl shadow-2xl pb-6">
            {/* HEADER TIDAK DIUBAH */}
            <div className="sticky top-0 bg-white dark:bg-navy-800 z-10 border-b border-gray-200 dark:border-navy-700 px-6 py-6 mb-5 flex justify-between items-center">
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
              <div className="grid lg:grid-cols-2 gap-10">
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
            <div className="w-full max-w-6xl bg-white dark:bg-navy-800 rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
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
                  className="text-gray-500 hover:text-red-600"
                >
                  <MdClose className="w-8 h-8" />
                </button>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">

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