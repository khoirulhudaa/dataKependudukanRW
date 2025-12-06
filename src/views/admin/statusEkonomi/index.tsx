// src/views/admin/sosial-ekonomi/StatusEkonomi.tsx
import React, { useMemo, useState } from "react";
import {
  MdErrorOutline,
  MdFamilyRestroom,
  MdThumbUp,
  MdTrendingUp,
  MdWarningAmber,
} from "react-icons/md";

const generateDummy = () =>
  Array.from({ length: 218 }, () => ({
    kategori: ["Pra Sejahtera", "Sejahtera I", "Sejahtera II", "Sejahtera III", "Sejahtera IV"][
      Math.floor(Math.random() * 5)
    ],
  }));

type Kategori = "Pra Sejahtera" | "Sejahtera I" | "Sejahtera II" | "Sejahtera III" | "Sejahtera IV";

const StatusEkonomi: React.FC = () => {
  const [filterRT, setFilterRT] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const kkList = useMemo(() => generateDummy(), []);

  const aggregated = useMemo(() => {
    const map = new Map<Kategori, number>();
    kkList.forEach((k: any) => {
      map.set(k.kategori, (map.get(k.kategori) || 0) + 1);
    });
    const total = kkList.length;

    const result = Array.from(map)
      .map(([name, value]) => ({
        label: name,
        count: value,
        percent: Number(((value / total) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);

    return { data: result, total };
  }, [kkList]);

  const { data, total } = aggregated;

  // Definisikan warna & icon per kategori (sama persis kayak StatusKependudukan)
  const kategoriConfig: Record<
    Kategori,
    { icon: React.ElementType; color: string; bg: string; ring: string }
  > = {
    "Pra Sejahtera": {
      icon: MdWarningAmber,
      color: "text-red-600",
      bg: "bg-red-500/10",
      ring: "ring-red-500/20",
    },
    "Sejahtera I": {
      icon: MdErrorOutline,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
      ring: "ring-orange-500/20",
    },
    "Sejahtera II": {
      icon: MdTrendingUp,
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
      ring: "ring-yellow-500/20",
    },
    "Sejahtera III": {
      icon: MdFamilyRestroom,
      color: "text-lime-600",
      bg: "bg-lime-500/10",
      ring: "ring-lime-500/20",
    },
    "Sejahtera IV": {
      icon: MdThumbUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
  };

  const dominan = data[0];
  const praSejahteraCount = data.find((d) => d.label === "Pra Sejahtera")?.count || 0;

  return (
    <div className="space-y-6 mt-3">

      {/* ==================== FILTER SECTION ==================== */}
      <div className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-5">
          Filter Status Kesejahteraan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-4">
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            <option value="all">Semua RT</option>
            {["01", "02", "03", "04", "05", "06"].map((rt) => (
              <option key={rt} value={rt}>RT {rt}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          />
        </div>
      </div>

      {/* ==================== KONTEN UTAMA ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Kolom Kiri: Daftar Kategori (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {data.map((item) => {
            const config = kategoriConfig[item.label as Kategori];
            return (
              <div
                key={item.label}
                className="group flex items-center justify-between p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
              >
                {/* Icon + Label */}
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl ${config.bg} ring-4 ${config.ring} backdrop-blur-xl`}>
                    <config.icon className={`w-7 h-7 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-800 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-2xl font-medium text-slate-900 dark:text-white mt-1">
                      {item.count.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Persentase + Progress Bar */}
                <div className="text-right">
                  <p className={`text-xl md:text-3xl font-medium ${config.color}`}>
                    {item.percent}%
                  </p>
                  <div className="mt-2 bg-gray-100 w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: config.color
                          .replace("text-", "")
                          .replace("red-600", "#ef4444")
                          .replace("orange-600", "#f97316")
                          .replace("yellow-600", "#eab308")
                          .replace("lime-600", "#84cc16")
                          .replace("emerald-600", "#10b981"),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kolom Kanan: Ringkasan Visual (1/3) */}
        <div className="space-y-6">
          {/* Dominan */}
          <div className="p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl">
            <p className="text-sm font-medium uppercase tracking-wider">Dominan</p>
            <p className="text-2xl md:text-4xl font-black mt-2">{dominan.percent}%</p>
            <p className="text-lg font-medium mt-1">{dominan.label}</p>
          </div>
          <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl shadow-xl">
            <p className="text-sm font-medium uppercase tracking-wider">Total Tercatat</p>
            <p className="text-2xl md:text-4xl font-black mt-2">{total.toLocaleString("id-ID")}</p>
            <p className="text-lg font-medium mt-1">Kepala Keluarga</p>
          </div>
          {/* Pra Sejahtera (jika ada) */}
          {praSejahteraCount > 0 && (
            <div className="p-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl">
              <p className="text-sm font-medium uppercase tracking-wider">Perlu Perhatian</p>
              <p className="text-2xl md:text-4xl font-black mt-2">{praSejahteraCount}</p>
              <p className="text-lg font-medium mt-1">KK Pra Sejahtera</p>
            </div>
          )}

        </div>
      </div>

      {/* Footer Insight */}
      <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Mayoritas keluarga berada di kategori <span className="font-bold text-emerald-600">{dominan.label}</span>. 
          {praSejahteraCount > 0 ? (
            <> Terdapat <span className="font-bold text-red-600">{praSejahteraCount} KK Pra Sejahtera</span> yang perlu intervensi segera.</>
          ) : (
            <> Seluruh keluarga sudah berada di atas garis sejahtera. Kondisi sangat baik!</>
          )}
        </p>
      </div>
    </div>
  );
};

export default StatusEkonomi;