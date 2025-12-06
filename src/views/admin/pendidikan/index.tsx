// src/views/admin/sosial-ekonomi/Pendidikan.tsx
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tingkat = [
  "Tidak Sekolah",
  "SD",
  "SMP",
  "SMA",
  "D1/D3",
  "S1",
  "S2/S3",
] as const;

// Warna gradient yang lebih hidup & sesuai tingkat pendidikan
const COLORS = [
  "#dc2626", // Tetap merah untuk "Tidak Sekolah" biar warning-nya kelihatan
  "#3b82f6", // Biru standar      → SD
  "#2563eb", // Biru lebih tua    → SMP
  "#1d4ed8", // Biru tua          → SMA
  "#1e40af", // Biru sangat tua   → D1/D3
  "#1e3a8a", // Navy              → S1
  "#172554", // Navy sangat tua   → S2/S3
];

const generateDummy = () =>
  Array.from({ length: 220 }, () => ({
    anggota: Array.from({ length: Math.floor(Math.random() * 6) + 2 }, () => ({
      pendidikan: tingkat[Math.floor(Math.random() * tingkat.length)],
    })),
  }));

const Pendidikan: React.FC = () => {
  const kkList = useMemo(() => generateDummy(), []);

  const data = useMemo(() => {
    const map = new Map<string, number>();
    kkList.forEach((kk) =>
      kk.anggota.forEach((a) =>
        map.set(a.pendidikan, (map.get(a.pendidikan) || 0) + 1)
      )
    );

    const total = Array.from(map.values()).reduce((a, b) => a + b, 0);

    return tingkat
      .map((level) => {
        const value = map.get(level) || 0;
        return {
          name: level,
          value,
          persen: Number(((value / total) * 100).toFixed(1)),
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [kkList]);

  const totalPenduduk = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8 mt-3">
      {/* Header + Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-black mb-2">Tingkat Pendidikan Penduduk</h2>
          <p className="text-blue-100 text-lg">Data seluruh anggota keluarga (KK)</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl md:text-5xl font-black">{totalPenduduk}</span>
            <span className="text-xl opacity-90">jiwa</span>
          </div>
        </div>

        {/* Top 3 Highlight */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
          {data.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-xl border border-gray-200/50 dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: COLORS[tingkat.indexOf(item.name as any)] }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">({item.persen}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart yang jauh lebih hidup */}
      <div className="bg-white dark:bg-navy-800/90 rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-white/10 backdrop-blur-xl">
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={90}
              tick={{ fill: "#6b7280", fontWeight: 600 }}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
              formatter={(value: number) => [`${value} jiwa`, "Jumlah"]}
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={48}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[tingkat.indexOf(entry.name as any)]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Label persentase di atas bar (opsional, tapi keren) */}
        <div className="flex justify-center gap-8 mt-6 flex-wrap">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[tingkat.indexOf(item.name as any)] }}
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.name}: <strong className="text-gray-900 dark:text-white">{item.persen}%</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus: Statistik kecil */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Lulusan S1 ke atas", value: data.find(d => d.name === "S1")!.value + data.find(d => d.name === "S2/S3")!.value, color: "from-emerald-500 to-teal-600" },
          { label: "Minimal SMA", value: data.slice(3).reduce((a, b) => a + b.value, 0), color: "from-blue-500 to-cyan-600" },
          { label: "Putus Sekolah (SD/SMP)", value: data[1].value + data[2].value, color: "from-blue-500 to-blue-600" },
          { label: "Tidak Pernah Sekolah", value: data[0].value, color: "from-red-600 to-rose-700" },
        ].map((stat, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-navy-800 dark:to-navy-900 p-6 shadow-xl border border-gray-200/50 dark:border-white/10"
          >
            <div className={`absolute inset-0 bg-white opacity-10`} />
            <div className="relative">
              <p className="text-2xl md:text-4xl font-black text-gray-800 dark:text-white">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pendidikan;