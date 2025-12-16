// src/views/admin/profile/components/General.tsx
import Card from "components/card";
import React from "react";
import { useProfile } from "utils/useProfile";

const General: React.FC = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <Card extra="p-8 text-center">
    <p>
      Memuat...
    </p>
    </Card>;
  if (error || !profile) return <Card extra="p-8 text-center text-red-500">
    <p>
      {error || "Data tidak tersedia"}
    </p>
    </Card>;

  const isAdmin = profile.role === "admin";

  return (
    <Card extra="w-full h-full p-3">
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Informasi {isAdmin ? "RT/RW" : "Lurah"}
        </h4>
        <p className="mt-2 px-2 text-base text-gray-600">
          {isAdmin
            ? "Data identitas dan wilayah tanggung jawab RT/RW."
            : "Data identitas dan wilayah administrasi Lurah."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-2 md:grid-cols-2">
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 border border-black/30 dark:!bg-navy-700 dark:border-navy-600">
          <p className="text-sm text-gray-600">Nama Lengkap</p>
          <p className="text-base font-medium text-navy-700 dark:text-white">{profile.nama}</p>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 border border-black/30 dark:!bg-navy-700 dark:border-navy-600">
          <p className="text-sm text-gray-600">No. Telepon</p>
          <p className="text-base font-medium text-navy-700 dark:text-white">{profile.noTelp || "-"}</p>
        </div>

        {isAdmin ? (
          <>
            {profile.rt && (
              <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 border border-black/30 dark:!bg-navy-700 dark:border-navy-600">
                <p className="text-sm text-gray-600">RT</p>
                <p className="text-base font-medium text-navy-700 dark:text-white">{profile.rt}</p>
              </div>
            )}
            {profile.rw && (
              <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 border border-black/30 dark:!bg-navy-700 dark:border-navy-600">
                <p className="text-sm text-gray-600">RW</p>
                <p className="text-base font-medium text-navy-700 dark:text-white">{profile.rw}</p>
              </div>
            )}
          </>
        ) : (
          <>
            {profile.kelurahan && (
              <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 border border-black/30 dark:!bg-navy-700 dark:border-navy-600">
                <p className="text-sm text-gray-600">Kelurahan</p>
                <p className="text-base font-medium text-navy-700 dark:text-white">{profile.kelurahan}</p>
              </div>
            )}
            {profile.provinsi && (
              <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 border border-black/30 dark:!bg-navy-700 dark:border-navy-600">
                <p className="text-sm text-gray-600">Provinsi</p>
                <p className="text-base font-medium text-navy-700 dark:text-white">{profile.provinsi}</p>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default General;