// src/utils/useAdmins.ts
import { useState, useEffect, useCallback } from "react";
import { useProfile } from "./useProfile";

type YouthOrg = {
  id: string;
  name: string;
};

type RW = {
  id: string;
  code: string;
  name: string;
  youthOrg: YouthOrg | null; // Karang Taruna per RW (biasanya hanya 1)
};

export type Admin = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  rw?: { id: string; code: string; name: string } | null;
  village?: { id: string; name: string };
  createdAt: string;
};

// const roleMapping: Record<string, string> = {
//   Superadmin: "SUPERADMIN",
//   "Ketua RW": "RW_CHAIRMAN",
//   "Lurah": "VILLAGE_HEAD",
//   "Sekretaris RW": "RW_SECRETARY",
//   "Kader": "CADRE",
//   "Sekretaris Kader": "YOUTH_SECRETARY",
//   "Ketua RT": "RT_CHAIRMAN",
//   "Bendahara RW": "RW_TREASURER",
//   "Sekretaris RT": "RT_SECRETARY",
//   "Bendahara RT": "RT_TREASURER",
// };

const roleMapping: Record<string, string> = {
  Superadmin: "SUPERADMIN",
  "Lurah": "VILLAGE_HEAD",
  "Ketua RW": "RW_CHAIRMAN",
  "Sekretaris RW": "RW_SECRETARY",
  "Bendahara RW": "RW_TREASURER",
  "Kader": "CADRE",
  "Ketua RT": "RT_CHAIRMAN",
  "Sekretaris RT": "RT_SECRETARY",
  // Hapus yang ini karena tidak ada:
  // "Bendahara RT": "RT_TREASURER",
  // "Sekretaris Kader": "YOUTH_SECRETARY",
  // Ganti dengan satu role untuk Karang Taruna
  "Pengurus Karang Taruna": "YOUTH_ORG", // atau nama yang lebih sesuai di UI
};

// export const reverseRoleMapping: Record<string, string> = {
//   SUPERADMIN: "Superadmin",
//   RW_CHAIRMAN: "Ketua RW",
//   RW_SECRETARY: "Sekretaris RW",
//   RW_TREASURER: "Bendahara RW",
//   CADRE: "Kader",
//   VILLAGE_HEAD: "Lurah",
//   YOUTH_SECRETARY: "Sekretaris Kader",
//   RT_CHAIRMAN: "Ketua RT",
//   RT_SECRETARY: "Sekretaris RT",
//   RT_TREASURER: "Bendahara RT",
// };

// Reverse mapping juga diperbarui
export const reverseRoleMapping: Record<string, string> = {
  SUPERADMIN: "Superadmin",
  VILLAGE_HEAD: "Lurah",
  RW_CHAIRMAN: "Ketua RW",
  RW_SECRETARY: "Sekretaris RW",
  RW_TREASURER: "Bendahara RW",
  CADRE: "Kader",
  RT_CHAIRMAN: "Ketua RT",
  RT_SECRETARY: "Sekretaris RT",
  YOUTH_ORG: "Pengurus Karang Taruna", // sesuaikan tampilan di UI
};

export const useAdmins = () => {
  const { profile } = useProfile();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [rws, setRws] = useState<RW[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRws, setLoadingRws] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const villageId = profile?.village?.id;

  // Fetch daftar RW + youthOrg (Karang Taruna)
  useEffect(() => {
    if (!villageId) {
      setRws([]);
      setLoadingRws(false);
      return;
    }

    const fetchRWs = async () => {
      try {
        setLoadingRws(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Token tidak ditemukan");

        const res = await fetch(
          `https://nitip-api.diwanmotor.com/api/v1/setup/rw/${villageId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Gagal mengambil data RW");

        setRws(
          json.data.map((rw: any) => ({
            id: rw.id,
            code: rw.code,
            name: rw.name,
            youthOrg:
              rw.youthOrgs && rw.youthOrgs.length > 0
                ? { id: rw.youthOrgs[0].id, name: rw.youthOrgs[0].name }
                : null,
          }))
        );
      } catch (err: any) {
        setError(err.message);
        setRws([]);
      } finally {
        setLoadingRws(false);
      }
    };

    fetchRWs();
  }, [villageId]);

  // Fetch daftar admin
  const fetchAdmins = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      let url = "https://nitip-api.diwanmotor.com/api/v1/users?limit=100";
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mengambil data admin");

      setAdmins(json.data || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create admin - FULL SESUAI API
  const createAdmin = async ({
    fullName,
    email,
    phone,
    role,
    rwId,
    rtId, // ← tambah
  }: {
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    rwId?: string;
    rtId?: string; // ← tambah
  }) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Token tidak ditemukan");
    if (!villageId) throw new Error("Village ID tidak ditemukan");

    const username = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");

    const body: any = {
      email: email.toLowerCase(),
      username,
      password: "Admin@12345",
      fullName: fullName.trim(),
      phone: phone?.trim() || null,
      role: roleMapping[role],
      villageId,
    };

    // Ganti baris needsRw dengan:
    // const rolesNeedingRw = [
    //   "Ketua RW",
    //   "Sekretaris RW",
    //   "Bendahara RW",
    //   "Ketua RT",
    //   "Sekretaris RT",
    //   "Bendahara RT", // hapus jika role ini tidak ada di backend
    //   "Ketua Kader",
    //   "Sekretaris Kader",
    // ];

    const rolesNeedingRw = [
      "Ketua RW",
      "Sekretaris RW",
      "Bendahara RW",
      "Kader",
      "Ketua RT",
      "Sekretaris RT",
      "Pengurus Karang Taruna", // role baru untuk YOUTH_ORG
    ];

    const needsRw = rolesNeedingRw.includes(role);

    if (needsRw && !rwId) {
      throw new Error("RW harus dipilih untuk role ini.");
    }

    if (needsRw && rwId) {
      body.rwId = rwId;

      // Jika role Kader, tambahkan youthOrgId dari RW yang dipilih
      // if (["Ketua Kader", "Sekretaris Kader"].includes(role)) {
      //   const selectedRw = rws.find((r) => r.id === rwId);
      //   if (selectedRw?.youthOrg) {
      //     body.youthOrgId = selectedRw.youthOrg.id;
      //   } else {
      //     throw new Error("RW yang dipilih belum memiliki organisasi Karang Taruna.");
      //   }
      // }

      // if (["Ketua RT", "Sekretaris RT", "Bendahara RT"].includes(role) && rtId) {
      //   body.rtId = rtId;
      // }

      // Khusus untuk role RT (Ketua/Sekretaris RT)
      if (["Ketua RT", "Sekretaris RT"].includes(role) && rtId) {
        body.rtId = rtId;
      }

      // Khusus untuk Pengurus Karang Taruna → butuh youthOrgId
      if (role === "Pengurus Karang Taruna") {
        const selectedRw = rws.find((r) => r.id === rwId);
        if (selectedRw?.youthOrg) {
          body.youthOrgId = selectedRw.youthOrg.id;
        } else {
          throw new Error("RW yang dipilih belum memiliki organisasi Karang Taruna.");
        }
      }
    }

    const res = await fetch("https://nitip-api.diwanmotor.com/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!json.success) {
      let msg = json.message || "Gagal membuat admin";
      if (typeof json.message === "object") {
        msg = Object.values(json.message).flat().join(", ");
      }
      throw new Error(msg);
    }

    await fetchAdmins();
    return json.data;
  };

  // Update admin
const updateAdmin = async (
  userId: string,
  data: {
    fullName?: string;
    phone?: string | null;
    isActive?: boolean;
  }
) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Token tidak ditemukan");

    const res = await fetch(
      `https://nitip-api.diwanmotor.com/api/v1/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const json = await res.json();

    if (!json.success) {
      let msg = json.message || "Gagal memperbarui admin";
      if (typeof json.message === "object") {
        msg = Object.values(json.message).flat().join(", ");
      }
      throw new Error(msg);
    }

    await fetchAdmins(); // refresh list
    return json.data;
  } catch (err: any) {
    throw new Error(err.message || "Gagal memperbarui admin");
  }
};

// Delete admin
const deleteAdmin = async (userId: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Token tidak ditemukan");

    const res = await fetch(
      `https://nitip-api.diwanmotor.com/api/v1/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    if (!json.success) {
      let msg = json.message || "Gagal menghapus admin";
      if (typeof json.message === "object") {
        msg = Object.values(json.message).flat().join(", ");
      }
      throw new Error(msg);
    }

    await fetchAdmins(); // refresh list
    return json.data;
  } catch (err: any) {
    throw new Error(err.message || "Gagal menghapus admin");
  }
};

// Toggle Activation / Deactivation user
const toggleActivation = async (userId: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Token tidak ditemukan");

    const res = await fetch(
      `https://nitip-api.diwanmotor.com/api/v1/users/${userId}/activation`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    if (!json.success) {
      let msg = json.message || "Gagal mengubah status aktivasi";
      if (typeof json.message === "object") {
        msg = Object.values(json.message).flat().join(", ");
      }
      throw new Error(msg);
    }

    await fetchAdmins(); // refresh daftar admin secara otomatis
    return json.data;
  } catch (err: any) {
    throw new Error(err.message || "Gagal mengubah status aktivasi");
  }
};

  // Initial fetch
  useEffect(() => {
    if (profile && villageId) {
      fetchAdmins();
    }
  }, [profile, villageId, fetchAdmins]);

  return {
    admins,
    updateAdmin,
    deleteAdmin,
    rws,
    loading,
    loadingRws,
    error,
    toggleActivation,
    fetchAdmins,
    createAdmin,
    reverseRoleMapping,
  };
};