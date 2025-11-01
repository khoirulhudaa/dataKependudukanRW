import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useMemo, useState } from "react";
import ApexCharts from "react-apexcharts";
import { IoDocuments } from "react-icons/io5";
import {
  MdAssignment,
  MdBadge,
  MdChildCare,
  MdClose,
  MdDescription,
  MdFavorite,
  MdFemale,
  MdHome,
  MdMale,
  MdOutlineAutoAwesome,
  MdOutlineMail,
  MdOutlineTrendingUp,
  MdPeople,
  MdPerson,
  MdSwapHoriz
} from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";

// === TIPE DATA ===
type KtpKkItem = {
  rt: string;
  rw: string;
  nik?: string;
  no_kk?: string;
  nama?: string;
  kepala_keluarga?: string;
  jenis: "KTP" | "KK";
  alamat?: string;
  anggota?: number;
  jenis_kelamin?: string;
};

type RowObj = {
  name: string;
  status: string;
  date: string;
  progress: number;
};

type GroupedData = Record<
  string,
  { ktp: number; kk: number; penduduk: number; keluarga: number; data: KtpKkItem[] }
>;

// === DATA AWAL + STATISTIK ===
const demoKtpKkData: KtpKkItem[] = [
  { rt: "01", rw: "001", nik: "3275010101900001", nama: "Ahmad Fauzi", jenis: "KTP", alamat: "Jl. Merdeka No. 1", jenis_kelamin: "Laki-laki" },
  { rt: "01", rw: "001", nik: "3275014102900002", nama: "Siti Aisyah", jenis: "KTP", alamat: "Jl. Merdeka No. 1", jenis_kelamin: "Perempuan" },
  { rt: "01", rw: "001", no_kk: "3275010101900001", kepala_keluarga: "Ahmad Fauzi", jenis: "KK", anggota: 4 },
  { rt: "02", rw: "001", nik: "3275010202850003", nama: "Budi Santoso", jenis: "KTP", alamat: "Jl. Sudirman No. 5", jenis_kelamin: "Laki-laki" },
  { rt: "02", rw: "001", no_kk: "3275010202850003", kepala_keluarga: "Budi Santoso", jenis: "KK", anggota: 3 },
  { rt: "03", rw: "002", nik: "3275010303850004", nama: "Citra Lestari", jenis: "KTP", alamat: "Jl. Ahmad Yani No. 10", jenis_kelamin: "Laki-laki" },
  { rt: "03", rw: "002", no_kk: "3275010303850004", kepala_keluarga: "Citra Lestari", jenis: "KK", anggota: 2 },
];

const demoStats = {
  kk_per_rt: { "01": 5, "02": 3, "03": 4, "04": 9, "05": 7, "06": 4, "07": 5, "08": 4, "09": 5, "10": 4 },
  kk_per_rw: { "01": 15, "02": 20, "03": 15 },
  num_kelurahan: 1,
  num_penerima_bantuan: 113,
  total_warga: 153,
  num_pindah: 57,
  num_meninggal: 49,
  Laki_laki: 128,
  Perempuan: 282,
  num_kk_sementara: 23
};

// === KOMPONEN UTAMA ===
const Dashboard: React.FC = () => {
  const [ktpKkData, setKtpKkData] = useState<KtpKkItem[]>(demoKtpKkData);
  const [stats, setStats] = useState(demoStats);
  const [selectedRtRw, setSelectedRtRw] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const rawData = [
    { month: 1, year: 2024, hidup: 120, pindah: 5, meninggal: 2, label: "Jan 2024" },
    { month: 2, year: 2024, hidup: 122, pindah: 3, meninggal: 1, label: "Feb 2024" },
    { month: 3, year: 2024, hidup: 125, pindah: 8, meninggal: 3, label: "Mar 2024" },
    { month: 4, year: 2024, hidup: 128, pindah: 7, meninggal: 2, label: "Apr 2024" },
    { month: 5, year: 2024, hidup: 130, pindah: 10, meninggal: 4, label: "Mei 2024" },
    { month: 1, year: 2025, hidup: 132, pindah: 6, meninggal: 1, label: "Jan 2025" },
  ];

  const filteredData = rawData.filter(d => {
    if (selectedMonth && d.month !== parseInt(selectedMonth)) return false;
    if (selectedYear && d.year !== parseInt(selectedYear)) return false;
    return true;
  });

  const safeFilteredData = filteredData ?? []; // atau (filteredData || [])

  // Load dari localStorage
  useEffect(() => {
    const savedKtpKk = localStorage.getItem("ktpKkData");
    const savedStats = localStorage.getItem("statistikData");
    if (savedKtpKk) setKtpKkData(JSON.parse(savedKtpKk));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Simpan ke localStorage
  useEffect(() => {
    localStorage.setItem("ktpKkData", JSON.stringify(ktpKkData));
    localStorage.setItem("statistikData", JSON.stringify(stats));
  }, [ktpKkData, stats]);
  
  // === KELOMPOKAN USIA ===
  const ageGroups = [
    { label: "0-1 tahun", min: 0, max: 1 },
    { label: "1-2 tahun", min: 1, max: 2 },
    { label: "2-3 tahun", min: 2, max: 3 },
    { label: "4-5 tahun", min: 4, max: 5 },
    { label: "6-9 tahun", min: 6, max: 9 },
    { label: "10-12 tahun", min: 10, max: 12 },
    { label: "13-15 tahun", min: 13, max: 15 },
    { label: "16-18 tahun", min: 16, max: 18 },
    { label: "19-24 tahun", min: 19, max: 24 },
    { label: "25-59 tahun", min: 25, max: 59 },
    { label: "60-63 tahun", min: 60, max: 63 },
    { label: "> 64 tahun", min: 64, max: 200 },
  ];

  // === DATA DEMO PENGAJUAN SURAT (10 data) ===
  const demoPengajuanSurat = [
    { id: "1", jenisSurat: "SKTM", tanggal: "2025-10-15", nama: "Ahmad Fauzi", status: "Selesai" },
    { id: "2", jenisSurat: "Domisili", tanggal: "2025-10-16", nama: "Siti Aisyah", status: "Diproses" },
    { id: "3", jenisSurat: "Kelahiran", tanggal: "2025-10-17", nama: "Budi Santoso", status: "Selesai" },
    { id: "4", jenisSurat: "Kematian", tanggal: "2025-10-18", nama: "Citra Lestari", status: "Selesai" },
    { id: "5", jenisSurat: "SKTM", tanggal: "2025-10-19", nama: "Dian Permata", status: "Diproses" },
    { id: "6", jenisSurat: "Domisili", tanggal: "2025-10-20", nama: "Eko Prasetyo", status: "Selesai" },
    { id: "7", jenisSurat: "Kelahiran", tanggal: "2025-10-21", nama: "Fajar Nugroho", status: "Diproses" },
    { id: "8", jenisSurat: "SKTM", tanggal: "2025-10-22", nama: "Gina Melinda", status: "Selesai" },
    { id: "9", jenisSurat: "Domisili", tanggal: "2025-10-23", nama: "Hadi Wijaya", status: "Diproses" },
    { id: "10", jenisSurat: "Kematian", tanggal: "2025-10-24", nama: "Indah Sari", status: "Selesai" },
  ];

  // === GROUPING DATA ===
  const groupedData = useMemo(() => {
    const grouped: GroupedData = {};
    ktpKkData.forEach((item) => {
      const key = `RT ${item.rt}/RW ${item.rw}`;
      if (!grouped[key]) {
        grouped[key] = { ktp: 0, kk: 0, penduduk: 0, keluarga: 0, data: [] };
      }
      grouped[key].data.push(item);
      if (item.jenis === "KTP") {
        grouped[key].ktp += 1;
        grouped[key].penduduk += 1;
      } else {
        grouped[key].kk += 1;
        grouped[key].keluarga += 1;
      }
    });
    return grouped;
  }, [ktpKkData]);

  // === TRANSFORM DATA UNTUK TABEL ===
  const transformToRowObj = (data: KtpKkItem[], type: "KTP" | "KK"): RowObj[] => {
    return data
      .filter((item) => item.jenis === type)
      .map((item) => {
        if (type === "KTP") {
          return {
            name: item.nama || "Tidak Diketahui",
            status: "KTP",
            date: item.nik?.substring(6, 14).replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3") || "-",
            progress: 100,
          };
        } else {
          return {
            name: item.kepala_keluarga || "KK Tanpa Nama",
            status: "KK",
            date: `Anggota: ${item.anggota || 0}`,
            progress: Math.min((item.anggota || 0) * 25, 100),
          };
        }
      });
  };

  const filteredKtpData = useMemo(() => {
    if (selectedRtRw === "all") return transformToRowObj(ktpKkData, "KTP");
    const group = groupedData[selectedRtRw];
    return group ? transformToRowObj(group.data, "KTP") : [];
  }, [selectedRtRw, ktpKkData, groupedData]);

  const filteredKkData = useMemo(() => {
    if (selectedRtRw === "all") return transformToRowObj(ktpKkData, "KK");
    const group = groupedData[selectedRtRw];
    return group ? transformToRowObj(group.data, "KK") : [];
  }, [selectedRtRw, ktpKkData, groupedData]);

  // === HITUNGAN STATISTIK ===
  const totalKK = Object.values(stats.kk_per_rt).reduce((a, b) => a + b, 0);
  const wargaHidup = stats.total_warga - stats.num_pindah - stats.num_meninggal;

  // === HITUNG USIA DARI NIK ===
  const getAgeFromNik = (nik: string): number | null => {
    if (!nik || nik.length < 12) return null;
    const day = parseInt(nik.substring(6, 8), 10);
    const month = parseInt(nik.substring(8, 10), 10);
    const year = parseInt(nik.substring(10, 12), 10);
    const fullYear = year < 25 ? 2000 + year : 1900 + year;
    const birthDate = new Date(fullYear, month - 1, day);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // === HITUNG DISTRIBUSI USIA ===
  const ageDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    ageGroups.forEach((g) => (dist[g.label] = 0));

    const dataToUse = selectedRtRw === "all"
      ? ktpKkData
      : groupedData[selectedRtRw]?.data || [];

    dataToUse
      .filter((d) => d.jenis === "KTP" && d.nik)
      .forEach((item) => {
        const age = getAgeFromNik(item.nik!);
        if (age !== null) {
          const group = ageGroups.find((g) => age >= g.min && age <= g.max);
          if (group) dist[group.label] += 1;
        }
      });

    return dist;
  }, [ktpKkData, selectedRtRw, groupedData]);

  // === HITUNG DISTRIBUSI JENIS KELAMIN ===
  const genderDistribution = useMemo(() => {
    const dist = { "Laki-laki": 0, "Perempuan": 0 };
    const dataToUse = demoKtpKkData;
    dataToUse
      .filter((d) => d.jenis === "KTP" && d.jenis_kelamin)
      .forEach((item) => {
        if (item.jenis_kelamin === "Laki-laki") dist["Laki-laki"] += 1;
        else if (item.jenis_kelamin === "Perempuan") dist["Perempuan"] += 1;
      });
    return dist;
  }, [ktpKkData, selectedRtRw, groupedData]);

  // === DATA PENGAJUAN SURAT ===
  const pengajuanSuratData = useMemo(() => {
    const saved = localStorage.getItem("pengajuanSuratList");
    if (saved && JSON.parse(saved).length > 0) {
      return JSON.parse(saved);
    } else {
      // Simpan demo data jika belum ada
      localStorage.setItem("pengajuanSuratList", JSON.stringify(demoPengajuanSurat));
      return demoPengajuanSurat;
    }
  }, []);

  // Simpan hanya jika ada perubahan (opsional)
  useEffect(() => {
    localStorage.setItem("pengajuanSuratList", JSON.stringify(pengajuanSuratData));
  }, [pengajuanSuratData]);

  const pengajuanByJenis = useMemo(() => {
    const count: Record<string, number> = {};
    pengajuanSuratData.forEach((item: any) => {
      count[item.jenisSurat] = (count[item.jenisSurat] || 0) + 1;
    });
    return count;
  }, [pengajuanSuratData]);

  // === DATA KATEGORI KHUSUS PENDUDUK (DUMMY) ===
  const kategoriPenduduk = {
    SKTM: 45,
    "Yatim & Piatu": 18,
    Lansia: 62,
    Balita: 38,
  };

  const CHART_COLORS = {
    primary: "#6366F1",    // Indigo
    secondary: "#8B5CF6",  // Purple
    success: "#10B981",    // Emerald
    danger: "#EF4444",     // Red
    gray: "#94A3B8",
    light: "#E2E8F0",
    bg: "#F8FAFC",         // Light background
  };

  return (
    <div>
      {/* ==================== WIDGET GRID ==================== */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6">
        <Widget icon={<MdHome className="h-7 w-7" />} title="Total RT/RW" subtitle={Object.keys(groupedData).length.toString()} />
        <Widget icon={<MdPerson className="h-7 w-7" />} title="Total KTP" subtitle={ktpKkData.filter(d => d.jenis === "KTP").length.toString()} />
        <Widget icon={<IoDocuments className="h-6 w-6" />} title="Total KK" subtitle={ktpKkData.filter(d => d.jenis === "KK").length.toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Penduduk Hidup" subtitle={wargaHidup.toString()} />
        <Widget icon={<MdSwapHoriz className="h-7 w-7" />} title="Pindah" subtitle={stats.num_pindah.toString()} />
        <Widget icon={<MdAssignment className="h-7 w-7" />} title="Penerima Bantuan" subtitle={stats.num_penerima_bantuan.toString()} />
        <Widget icon={<MdMale className="h-7 w-7" />} title="Laki-Laki" subtitle={stats.Laki_laki.toString()} />
        <Widget icon={<MdFemale className="h-7 w-7" />} title="Perempuan" subtitle={stats.Perempuan.toString()} />
      </div>

      {/* ==================== CHARTS GRID – MODERN & VARIATIF ==================== */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">

     {/* 1. KK PER RT – ORB ELEGAN */}
      <Card extra="p-6 xl:col-span-12 bg-white dark:bg-navy-900 rounded-3xl shadow-lg">
        <div className="w-full border-b border-gray-200 dark:border-navy-700 mb-6 pb-4">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">Jumlah KK per RT</h4>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
          {Object.entries(stats.kk_per_rt).map(([rt, jumlah], index) => {
            const size = 70;

            return (
              <div key={rt} className="flex flex-col items-center">
                <div
                  className="relative rounded-full shadow-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-navy-700"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    background: `radial-gradient(circle at 30% 30%, 
                      ${index % 2 === 0 ? '#818CF8' : '#C4B5FD'}, 
                      ${index % 2 === 0 ? '#6366F1' : '#8B5CF6'})`,
                    boxShadow: `0 6px 16px rgba(99, 102, 241, 0.15), 
                                inset 0 1px 3px rgba(255,255,255,0.4)`,
                  }}
                >
                  <span className="text-lg font-bold text-white drop-shadow-sm">
                    {jumlah}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-300">RT {rt}</p>
              </div>
            );
          })}
        </div>
      </Card>

     {/* 2. STATUS PENDUDUK – GROUPED BAR CHART + FILTER */}
      <Card
        extra="p-6 xl:col-span-12 bg-white dark:from-navy-900 dark:via-navy-800 dark:to-navy-700 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h4 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            Status Penduduk per Bulan
          </h4>

          {/* FILTER BULAN & TAHUN */}
          <div className="flex gap-2">
            <select
              className="px-3 py-1.5 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Semua Bulan</option>
              {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"].map((m,i)=>
                <option key={i} value={i+1}>{m}</option>
              )}
            </select>

            <select
              className="px-3 py-1.5 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Semua Tahun</option>
              {[2023,2024,2025].map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* GROUPED BAR CHART */}
          <div className="h-64">
           <ApexCharts
              type="bar"
              height={256}
              series={[
                { name: "Hidup", data: safeFilteredData.map(d => d.hidup) },
                { name: "Pindah", data: safeFilteredData.map(d => d.pindah) },
                { name: "Meninggal", data: safeFilteredData.map(d => d.meninggal) }
              ]}
              options={{
                chart: { toolbar: { show: false }, animations: { enabled: true } },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "70%",
                    borderRadius: 8,
                    dataLabels: { position: "top" }
                  }
                },
                colors: [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.danger],
                dataLabels: {
                  enabled: true,
                  offsetY: -20,
                  style: { fontSize: "11px", colors: ["#1E293B"] }
                },
                stroke: { width: 2, colors: ["transparent"] },
                xaxis: {
                  categories: safeFilteredData.map(d => d.label),
                  labels: { style: { fontSize: "11px", colors: CHART_COLORS.gray } }
                },
                yaxis: { labels: { style: { colors: CHART_COLORS.gray } } },
                grid: { strokeDashArray: 6, borderColor: "#E2E8F0" },
                tooltip: { theme: "light", y: { formatter: val => `${val} orang` } },
                legend: { show: false },
              }}
            />
        </div>
        </Card>

       
        {/* 4. PENGAJUAN SURAT – LIQUID RADIAL GAUGES (UNIK & MODERN) */}
        <Card
          extra="p-6 xl:col-span-12 bg-white dark:from-navy-900 dark:via-navy-800 dark:to-navy-700 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-2xl font-bold text-navy-700 dark:text-white tracking-tight">
              Pengajuan Surat
            </h4>
          </div>

          {Object.keys(pengajuanByJenis).length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <div className="relative">
                <MdOutlineMail className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4 opacity-30" />
                <div className="absolute inset-0 blur-xl bg-brand-500 opacity-20 animate-pulse"></div>
              </div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Belum ada pengajuan</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Sistem siap menerima pengajuan warga</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(pengajuanByJenis).map(([jenis, jumlah], index) => {
                const total = Object.values(pengajuanByJenis).reduce((a, b) => a + b, 0);
                const percentage = Math.round((jumlah / total) * 100);

                // Ikon unik per jenis surat
                const iconMap: Record<string, () => JSX.Element> = {
                  SKTM: () => <MdAssignment className="h-6 w-6" />,
                  Domisili: () => <MdHome className="h-6 w-6" />,
                  "Kelahiran": () => <MdChildCare className="h-6 w-6" />,
                  "Kematian": () => <MdClose className="h-6 w-6" />,
                  default: () => <MdDescription className="h-6 w-6" />,
                };

                const Icon = iconMap[jenis] || iconMap.default;

                // Warna unik per jenis
                const colors = [
                  ["#8B5CF6", "#A78BFA"], // Ungu
                  ["#EC4899", "#F472B6"], // Pink
                  ["#10B981", "#34D399"], // Hijau
                  ["#F59E0B", "#FBBF24"], // Kuning
                  ["#3B82F6", "#60A5FA"], // Biru
                  ["#EF4444", "#F87171"], // Merah
                ];

                const [primary, light] = colors[index % colors.length];

                return (
                  <div
                    key={jenis}
                    className="group relative transform transition-all duration-300 hover:-translate-y-1.5"
                    style={{ perspective: "1000px" }}
                  >
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>

                    {/* Card Gauge */}
                    <div className="relative bg-white dark:bg-navy-800 rounded-3xl p-5 shadow-xl border border-black/70 dark:border-navy-600">
                      {/* Liquid Fill Radial */}
                      <div className="relative w-full h-32 mx-auto">
                        <ApexCharts
                          type="radialBar"
                          height={128}
                          series={[percentage]}
                          options={{
                            chart: {
                              animations: { enabled: true, speed: 1200, easing: "easeinout" },
                              toolbar: { show: false },
                            },
                            plotOptions: {
                              radialBar: {
                                startAngle: -90,
                                endAngle: 270,
                                hollow: { size: "75%", background: "transparent" },
                                track: { background: "#E5E7EB", strokeWidth: "100%" },
                                dataLabels: {
                                  show: true,
                                  name: { show: false },
                                  value: {
                                    offsetY: 8,
                                    fontSize: "20px",
                                    fontWeight: 800,
                                    color: primary,
                                    formatter: () => jumlah.toString(),
                                  },
                                },
                              },
                            },
                            colors: [primary],
                            fill: {
                              type: "gradient",
                              gradient: {
                                shade: "dark",
                                type: "vertical",
                                shadeIntensity: 0.8,
                                gradientToColors: [light],
                                inverseColors: false,
                                opacityFrom: 1,
                                opacityTo: 0.8,
                                stops: [0, 100],
                              },
                            },
                            stroke: { lineCap: "round" },
                          }}
                        />

                        {/* Ikon di Tengah */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-navy-700 shadow-2xl border-4 border-white dark:border-navy-700 transform transition-transform group-hover:scale-110">
                            <Icon />
                          </div>
                        </div>

                        {/* Liquid Wave Effect (CSS) */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden opacity-40">
                          <div
                            className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent dark:from-navy-800"
                            style={{
                              clipPath: "ellipse(60% 50% at 50% 100%)",
                              animation: `wave 3s ease-in-out infinite ${index * 0.3}s`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Label */}
                      <div className="mt-4 text-center">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider truncate">
                          {jenis.length > 12 ? jenis.substring(0, 12) + "..." : jenis}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage}% dari total</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* 3. Distribusi Usia – Area Chart */}
        <Card extra="p-6 xl:col-span-12">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Distribusi Usia Penduduk</h4>
          <ApexCharts
            type="area"
            height={300}
            series={[{ name: "Penduduk", data: Object.values(ageDistribution) }]}
            options={{
              chart: { toolbar: { show: false }, zoom: { enabled: false }, background: "rgba(99, 102, 241, 0.05)" },
              dataLabels: { enabled: false },
              stroke: { curve: "smooth", width: 3 },
              xaxis: {
                categories: Object.keys(ageDistribution),
                labels: { rotate: -45, style: { colors: "#9CA3AF", fontSize: "10px" } },
              },
              yaxis: { labels: { style: { colors: "#9CA3AF" } } },
              fill: { opacity: 0.8, type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
              colors: ["#8B5CF6"],
              tooltip: { theme: "dark", y: { formatter: val => `${val} orang` } },
              grid: { show: true, strokeDashArray: 4, borderColor: "#E5E7EB" },
            }}
          />
        </Card>
        
        {/* 8. KATEGORI KHUSUS PENDUDUK – MODERN RADIAL BARS (100% Type-Safe) */}
        <Card
          extra="p-6 xl:col-span-12 bg-white dark:to-navy-800 rounded-2xl shadow-xl"
        >
          <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-6 text-left">
            Kategori Khusus Penduduk
          </h4>

          {/* TIPE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(kategoriPenduduk).map(([kategori, jumlah]) => {
              const maxValue = Math.max(...Object.values(kategoriPenduduk), 1);
              const percentage = Math.round((jumlah / maxValue) * 100);

              // === ICON MAP (langsung kategori → komponen) ===
              type IconComponent = () => JSX.Element;

              const iconMap: Record<keyof typeof kategoriPenduduk, IconComponent> = {
                SKTM: () => <MdAssignment className="h-5 w-5" />,
                "Yatim & Piatu": () => <MdFavorite className="h-5 w-5" />,
                Lansia: () => <MdPeople className="h-5 w-5" />,
                Balita: () => <MdOutlineAutoAwesome className="h-5 w-5" />,
              };

              const IconComponent = iconMap[kategori as keyof typeof kategoriPenduduk];

              // === WARNA ===
              const colors = {
                SKTM: ["#8B5CF6", "#A78BFA"],
                "Yatim & Piatu": ["#EC4899", "#F472B6"],
                Lansia: ["#F59E0B", "#FBBF24"],
                Balita: ["#10B981", "#34D399"],
              } as const;

              const [primary, secondary] = colors[kategori as keyof typeof colors];

              return (
                <div key={kategori} className="flex flex-col items-center group">
                  {/* Radial Bar */}
                  <div className="relative w-32 h-32">
                    <ApexCharts
                      type="radialBar"
                      height={128}
                      width={128}
                      series={[percentage]}
                      options={{
                        chart: {
                          animations: { enabled: true, easing: "easeinout", speed: 800 },
                          toolbar: { show: false },
                        },
                        plotOptions: {
                          radialBar: {
                            startAngle: -135,
                            endAngle: 225,
                            hollow: { size: "68%", background: "transparent" },
                            track: { background: "#E5E7EB", strokeWidth: "100%" },
                            dataLabels: {
                              show: true,
                              name: { show: false },
                              value: {
                                offsetY: 8,
                                fontSize: "18px",
                                fontWeight: 700,
                                color: primary,
                                formatter: () => jumlah.toString(),
                              },
                            },
                          },
                        },
                        colors: [primary],
                        fill: {
                          type: "gradient",
                          gradient: {
                            shade: "dark",
                            type: "horizontal",
                            shadeIntensity: 0.5,
                            gradientToColors: [secondary],
                            inverseColors: true,
                            opacityFrom: 1,
                            opacityTo: 1,
                            stops: [0, 100],
                          },
                        },
                        stroke: { lineCap: "round" },
                        labels: [""],
                      }}
                    />

                    {/* Ikon di Tengah */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-navy-700 shadow-lg border-4 border-white dark:border-navy-700">
                        <IconComponent />
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <p className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {kategori}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{percentage}% dari total</p>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-12 border-t border-black/50 pt-6 flex justify-center gap-4 flex-wrap">
            {Object.entries(kategoriPenduduk).map(([kategori, jumlah]) => (
              <div key={kategori} className="flex items-center gap-2 text-xs">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: {
                      SKTM: "#8B5CF6",
                      "Yatim & Piatu": "#EC4899",
                      Lansia: "#F59E0B",
                      Balita: "#10B981",
                    }[kategori as keyof typeof kategoriPenduduk],
                  }}
                />
                <span className="text-md text-gray-600 dark:text-gray-400">
                  {kategori}: <strong className="text-navy-700 dark:text-white">{jumlah}</strong>
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* 5. Jenis Kelamin – Minimal Card */}
        <Card extra="p-6 xl:col-span-12">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-6">Jenis Kelamin</h4>
          <div className="gap-4 flex justify-between">
            <div className="border border-blue-300 rounded-lg p-2 w-1/2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900">
                  <MdMale className="h-7 w-7 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-navy-700 dark:text-white">{genderDistribution["Laki-laki"]}</p>
                  <p className="text-sm text-blue-500">Laki-laki</p>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900">
                <p className="text-xs text-blue-900">
                  {Math.round((genderDistribution["Laki-laki"] / (genderDistribution["Laki-laki"] + genderDistribution["Perempuan"])) * 100)}%
                </p>
              </div>
            </div>
            <div className="border border-pink-300 rounded-lg p-2 w-1/2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900">
                  <MdFemale className="h-7 w-7 text-pink-600 dark:text-pink-300" />
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-navy-700 dark:text-white">{genderDistribution["Perempuan"]}</p>
                  <p className="text-sm text-pink-500">Perempuan</p>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900">
                <p className="text-xs text-pink-900">
                  {Math.round((genderDistribution["Perempuan"] / (genderDistribution["Laki-laki"] + genderDistribution["Perempuan"])) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 6. KK Sementara – Radial Progress */}
        <Card extra="p-6 xl:col-span-4">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">KK Sementara</h4>
          <div className="flex flex-col items-center">
            <ApexCharts
              type="radialBar"
              height={180}
              series={[Math.round((stats.num_kk_sementara / totalKK) * 100)]}
              options={{
                plotOptions: {
                  radialBar: {
                    hollow: { size: "60%" },
                    track: { background: "#E5E7EB", strokeWidth: "100%" },
                    dataLabels: {
                      show: true,
                      name: { show: false },
                      value: { fontSize: "22px", fontWeight: 700, color: "#8B5CF6" },
                    },
                  },
                },
                colors: ["#8B5CF6"],
                labels: [""],
              }}
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {stats.num_kk_sementara} dari {totalKK} KK
            </p>
          </div>
        </Card>

        {/* 7. Trend Pengajuan */}
        <Card extra="p-6 xl:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">Trend Pengajuan Surat (7 Hari)</h4>
            <MdOutlineTrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <ApexCharts
            type="line"
            height={200}
            series={[{ name: "Pengajuan", data: [12, 19, 15, 25, 22, 30, 28] }]}
            options={{
              chart: { 
                toolbar: { show: false },
                animations: { enabled: true, easing: "easeinout", speed: 800 }
              },
              stroke: { 
                curve: "smooth",
                width: 5, // LEBIH TEBAL & JELAS
                colors: ["#8B5CF6"],
                lineCap: "round",
              },
              markers: { 
                size: 7, // LEBIH BESAR
                colors: ["#8B5CF6"],
                strokeColors: "#FFFFFF",
                strokeWidth: 3, // BORDER PUTIH TEBAL
                hover: { size: 8 }
              },
              xaxis: { 
                categories: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"], 
                labels: { 
                  style: { 
                    colors: "#94A3B8", 
                    fontSize: "11px",
                    fontWeight: 500
                  } 
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
              },
              yaxis: { 
                labels: { 
                  style: { colors: "#94A3B8", fontSize: "11px" } 
                },
                min: 0,
                max: 35,
                tickAmount: 5
              },
              colors: ["#8B5CF6"],
              fill: {
                type: "gradient",
                gradient: {
                  shade: "light",
                  type: "vertical",
                  shadeIntensity: 0.3,
                  gradientToColors: ["#C4B5FD"],
                  opacityFrom: 0.4,
                  opacityTo: 0.1,
                  stops: [0, 100]
                }
              },
              tooltip: { 
                theme: "dark",
                y: { formatter: (val) => `${val} pengajuan` }
              },
              grid: { 
                show: true, 
                strokeDashArray: 6, 
                borderColor: "#E2E8F0",
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: true } }
              },
            }}
          />
        </Card>

      </div>

      {/* ==================== TABEL KTP & KK ==================== */}
      <div className="mt-8">
        <div className="border-t border-black pt-4 mb-3 flex items-baseline justify-between px-5">
          <h2 className="text-[18px]">Data Kependudukan</h2>
          <select
            value={selectedRtRw}
            onChange={(e) => setSelectedRtRw(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-navy-700 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
          >
            <option value="all">Semua RT/RW</option>
            {Object.keys(groupedData).map((key) => (
              <option key={key} value={key}>
                {key} ({groupedData[key].penduduk} penduduk)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-navy-800 p-5 rounded-xl shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <MdBadge className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                Data KTP {selectedRtRw !== "all" && <span className="text-sm font-normal text-gray-600">— {selectedRtRw}</span>}
              </h3>
            </div>
            <ComplexTable tableData={filteredKtpData} />
          </div>

          <div className="bg-white dark:bg-navy-800 p-5 rounded-xl shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                <IoDocuments className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                Data KK {selectedRtRw !== "all" && <span className="text-sm font-normal text-gray-600">— {selectedRtRw}</span>}
              </h3>
            </div>
            <ComplexTable tableData={filteredKkData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;