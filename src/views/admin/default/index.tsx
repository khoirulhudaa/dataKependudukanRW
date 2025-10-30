import React, { useState, useMemo, useEffect } from "react";
import Widget from "components/widget/Widget";
import ComplexTable from "views/admin/default/components/ComplexTable";
import {
  MdPeople,
  MdHome,
  MdFamilyRestroom,
  MdPerson,
  MdBadge,
  MdArticle,
  MdAssignment,
  MdLocationCity,
  MdSwapHoriz,
  MdWarning,
  MdMale,
  MdFemale,
} from "react-icons/md";
import { IoDocuments } from "react-icons/io5";
import ApexCharts from "react-apexcharts";
import Card from "components/card";

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

  const currentStats = selectedRtRw === "all"
    ? { penduduk: ktpKkData.filter(d => d.jenis === "KTP").length, keluarga: ktpKkData.filter(d => d.jenis === "KK").length }
    : groupedData[selectedRtRw] || { penduduk: 0, keluarga: 0 };

  // === HITUNGAN STATISTIK ===
  const totalKK = Object.values(stats.kk_per_rt).reduce((a, b) => a + b, 0);
  const wargaHidup = stats.total_warga - stats.num_pindah - stats.num_meninggal;
  const kkResmi = totalKK - stats.num_kk_sementara;

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

  // === HITUNG DISTRIBUSI JENIS KELAMIN (BERDASARKAN FILTER RT/RW) ===
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

  console.log('genderDistribution', genderDistribution["Laki-laki"])

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

      {/* ==================== CHARTS GRID ==================== */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
        {/* 1. KK per RT – Bar */}
        <Card extra="p-6 xl:col-span-4">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Jumlah KK per RT</h4>
          <ApexCharts
            type="bar"
            height={280}
            series={[{ name: "KK", data: Object.values(stats.kk_per_rt) }]}
            options={{
              chart: { toolbar: { show: false } },
              plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
              dataLabels: { enabled: false },
              xaxis: { categories: Object.keys(stats.kk_per_rt).map(rt => `RT ${rt}`), labels: { style: { colors: "#9CA3AF" } } },
              yaxis: { labels: { style: { colors: "#9CA3AF" } } },
              colors: ["#3B82F6"],
              tooltip: { theme: "dark" },
            }}
          />
        </Card>

        {/* 2. KK per RW – Donut */}
        <Card extra="p-6 xl:col-span-4">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Jumlah KK per RW</h4>
          <ApexCharts
            type="donut"
            height={280}
            series={Object.values(stats.kk_per_rw)}
            options={{
              labels: Object.keys(stats.kk_per_rw).map(rw => `RW ${rw}`),
              colors: ["#10B981", "#F59E0B", "#EF4444"],
              legend: { position: "bottom", labels: { colors: "#9CA3AF" } },
              dataLabels: { enabled: false },
              plotOptions: { pie: { donut: { size: "65%" } } },
              tooltip: { theme: "dark" },
            }}
          />
        </Card>

        {/* 3. Status Penduduk – Pie */}
        <Card extra="p-6 xl:col-span-4">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Status Penduduk</h4>
          <ApexCharts
            type="pie"
            height={280}
            series={[wargaHidup, stats.num_pindah, stats.num_meninggal]}
            options={{
              labels: ["Hidup", "Pindah", "Meninggal"],
              colors: ["#10B981", "#F59E0B", "#EF4444"],
              legend: { position: "bottom", labels: { colors: "#9CA3AF" } },
              dataLabels: { enabled: true, style: { colors: ["#fff"] } },
              tooltip: { theme: "dark" },
            }}
          />
        </Card>

        {/* 4. KK Sementara – Radial */}
        <Card extra="p-6 xl:col-span-4">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">KK NIK Sementara</h4>
          <ApexCharts
            type="radialBar"
            height={280}
            series={[Math.round((stats.num_kk_sementara / totalKK) * 100)]}
            options={{
              plotOptions: {
                radialBar: {
                  hollow: { size: "65%" },
                  track: { background: "#E5E7EB" },
                  dataLabels: { show: true, name: { show: false }, value: { fontSize: "20px", color: "#EF4444" } },
                },
              },
              labels: ["Sementara"],
              colors: ["#EF4444"],
              tooltip: { enabled: false },
            }}
          />
          <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
            {stats.num_kk_sementara} dari {totalKK} KK
          </p>
        </Card>

        {/* 5. Distribusi Penduduk per RT/RW – Donut */}
        <Card extra="p-6 xl:col-span-4">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Distribusi Penduduk</h4>
          <div className="mb-auto flex h-[220px] w-full items-center justify-center">
            <ApexCharts
              type="donut"
              height={220}
              series={Object.values(groupedData).map(g => g.penduduk)}
              options={{
                labels: Object.keys(groupedData),
                colors: ["#4318FF", "#6AD2FF", "#D224FF", "#F59E0B", "#10B981"],
                legend: { show: false },
                dataLabels: { enabled: false },
                plotOptions: { pie: { donut: { size: "65%" } } },
                tooltip: { theme: "dark" },
              }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 px-4 py-2">
            {Object.entries(groupedData).map(([key, val], i) => (
              <div key={key} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ["#4318FF", "#6AD2FF", "#D224FF", "#F59E0B", "#10B981"][i % 5] }} />
                <span className="text-xs text-gray-600 dark:text-gray-300">{key}: {val.penduduk}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 7. Distribusi Jenis Kelamin – Donut */}
        <Card extra="p-6 xl:col-span-4">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Distribusi Jenis Kelamin</h4>
          <ApexCharts
            type="donut"
            height={300}
            series={[genderDistribution["Laki-laki"], genderDistribution["Perempuan"]]}
            options={{
              labels: ["Laki-laki", "Perempuan"],
              colors: ["#3B82F6", "#EC4899"],
              legend: { position: "bottom", labels: { colors: "#9CA3AF" } },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${Math.round(val)}%`,
                style: { colors: ["#fff"], fontSize: "14px" },
              },
              plotOptions: { pie: { donut: { size: "65%" } } },
              tooltip: {
                y: { formatter: (val: number) => `${val} orang` },
                theme: "dark",
              },
            }}
          />
          <div className="mt-3 flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Laki-laki: {genderDistribution["Laki-laki"]}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-pink-500"></div>
              <span>Perempuan: {genderDistribution["Perempuan"]}</span>
            </div>
          </div>
        </Card>
      </div>

       {/* 6. Distribusi Usia – Bar */}
      <Card extra="mt-6 p-6 xl:col-span-6">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">Distribusi Penduduk Berdasarkan Usia</h4>
        <ApexCharts
          type="bar"
          height={300}
          series={[{ name: "Jumlah Penduduk", data: Object.values(ageDistribution) }]}
          options={{
            chart: { toolbar: { show: false } },
            plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
            dataLabels: { enabled: false },
            xaxis: {
              categories: Object.keys(ageDistribution),
              labels: { rotate: -45, style: { colors: "#9CA3AF", fontSize: "10px" } },
            },
            yaxis: { labels: { style: { colors: "#9CA3AF" } }, title: { text: "Jumlah", style: { color: "#9CA3AF" } } },
            colors: ["#6366F1"],
            tooltip: { theme: "dark" },
          }}
        />
      </Card>

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
          {/* Tabel KTP */}
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

          {/* Tabel KK */}
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