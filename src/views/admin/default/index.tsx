import React, { useState, useMemo } from "react";
import Widget from "components/widget/Widget";
import ComplexTable from "views/admin/default/components/ComplexTable";
import { MdPeople, MdHome, MdFamilyRestroom, MdPerson, MdBadge } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

import PieChart from "components/charts/PieChart";
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

// === DATA CONTOH ===
const ktpKkData: KtpKkItem[] = [
  { rt: "01", rw: "001", nik: "3275010101900001", nama: "Ahmad Fauzi", jenis: "KTP", alamat: "Jl. Merdeka No. 1" },
  { rt: "01", rw: "001", nik: "3275014102900002", nama: "Siti Aisyah", jenis: "KTP", alamat: "Jl. Merdeka No. 1" },
  { rt: "01", rw: "001", no_kk: "3275010101900001", kepala_keluarga: "Ahmad Fauzi", jenis: "KK", anggota: 4 },
  { rt: "02", rw: "001", nik: "3275010202850003", nama: "Budi Santoso", jenis: "KTP", alamat: "Jl. Sudirman No. 5" },
  { rt: "02", rw: "001", no_kk: "3275010202850003", kepala_keluarga: "Budi Santoso", jenis: "KK", anggota: 3 },
  { rt: "03", rw: "002", nik: "3275010303850004", nama: "Citra Lestari", jenis: "KTP", alamat: "Jl. Ahmad Yani No. 10" },
  { rt: "03", rw: "002", no_kk: "3275010303850004", kepala_keluarga: "Citra Lestari", jenis: "KK", anggota: 2 },
];

// === FUNGSI BANTU ===
const groupByRtRw = (): GroupedData => {
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
};

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

// === PIE CHART CARD ===
const RtRwPieChartCard: React.FC = () => {
  const groupedData = groupByRtRw();
  const pieChartData: number[] = Object.values(groupedData).map((g) => g.penduduk);
  const labels: string[] = Object.keys(groupedData);

  const pieChartOptions: any = {
    labels,
    colors: ["#4318FF", "#6AD2FF", "#D224FF"],
    chart: { width: "50px" },
    states: { hover: { filter: { type: "none" } } },
    legend: { show: false },
    dataLabels: { enabled: false },
    hover: { mode: null as null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: { labels: { show: false } },
      },
    },
    fill: { colors: ["#4318FF", "#6AD2FF", "#D224FF"] },
    tooltip: { enabled: true, theme: "dark" },
  };

  const totalPenduduk = pieChartData.reduce((a, b) => a + b, 0);
  const legendData = labels.map((label, i) => ({
    name: label,
    value: pieChartData[i],
    percent: totalPenduduk > 0 ? ((pieChartData[i] / totalPenduduk) * 100).toFixed(0) : "0",
  }));

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Distribusi Penduduk
          </h4>
        </div>
        <div className="mb-6 flex items-center justify-center">
          <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
            <option>RT/RW</option>
          </select>
        </div>
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        <PieChart chartOptions={pieChartOptions} chartData={pieChartData} />
      </div>

      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        {legendData.map((item, index) => (
          <React.Fragment key={item.name}>
            {index > 0 && <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: pieChartOptions.fill.colors[index] }}
                />
                <p className="ml-1 text-sm font-normal text-gray-600">{item.name}</p>
              </div>
              <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
                {item.percent}%
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

// === KOMPONEN UTAMA ===
const Dashboard: React.FC = () => {
  const groupedData = groupByRtRw();
  const [selectedRtRw, setSelectedRtRw] = useState<string>("all");

  const totalKtp = ktpKkData.filter((d) => d.jenis === "KTP").length;
  const totalKk = ktpKkData.filter((d) => d.jenis === "KK").length;

  // Filter data berdasarkan RT/RW
  const filteredKtpData = useMemo(() => {
    if (selectedRtRw === "all") return transformToRowObj(ktpKkData, "KTP");
    const group = groupedData[selectedRtRw];
    return group ? transformToRowObj(group.data, "KTP") : [];
  }, [selectedRtRw]);

  const filteredKkData = useMemo(() => {
    if (selectedRtRw === "all") return transformToRowObj(ktpKkData, "KK");
    const group = groupedData[selectedRtRw];
    return group ? transformToRowObj(group.data, "KK") : [];
  }, [selectedRtRw]);

  const currentStats = selectedRtRw === "all"
    ? { penduduk: totalKtp, keluarga: totalKk }
    : groupedData[selectedRtRw] || { penduduk: 0, keluarga: 0 };

  return (
    <div>
      {/* Widget Summary */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget icon={<MdHome className="h-7 w-7" />} title="Total RT/RW" subtitle={Object.keys(groupedData).length.toString()} />
        <Widget icon={<MdPerson className="h-7 w-7" />} title="Total KTP" subtitle={totalKtp.toString()} />
        <Widget icon={<IoDocuments className="h-6 w-6" />} title="Total KK" subtitle={totalKk.toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Penduduk Saat Ini" subtitle={currentStats.penduduk.toString()} />
        <Widget icon={<MdFamilyRestroom className="h-6 w-6" />} title="Keluarga Saat Ini" subtitle={currentStats.keluarga.toString()} />
      </div>

      {/* Filter Dropdown */}
      <div className="border-t border-black mt-7 pt-4 mb-3 flex items-baseline justify-between px-5">
        <h2 className="text-[18px]">Data kependudukan tingkat RT/RW</h2>
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

      {/* 2 Tabel + Pie Chart */}
      <div className="my-5 space-y-5">
        {/* Tabel KTP */}
        <div className="bg-white dark:bg-navy-800 p-5 rounded-xl shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20 text-green-500">
              <MdBadge className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
              Data KTP
              {selectedRtRw !== "all" && (
                <span className="ml-2 text-sm font-normal text-gray-600">— {selectedRtRw}</span>
              )}
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
              Data KK
              {selectedRtRw !== "all" && (
                <span className="ml-2 text-sm font-normal text-gray-600">— {selectedRtRw}</span>
              )}
            </h3>
          </div>
          <ComplexTable tableData={filteredKkData} />
        </div>

        {/* Pie Chart */}
        <div className="xl:col-span-2">
          <RtRwPieChartCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;