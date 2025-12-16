// src/hooks/useProfile.ts
import { useState, useEffect } from "react";

type ProfileData = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone: string;
  avatar: string | null;
  role: "ADMIN" | "SUPERADMIN";
  village?: {
    name: string;
    province: string;
  };
  rt?: string | null;
  rw?: string | null;
};

type MappedUser = {
  nama: string;
  noTelp: string;
  foto: string | null;
  role: "admin" | "superadmin";
  kelurahan?: string;
  provinsi?: string;
  rt?: string;
  rw?: string;
};

export const useProfile = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      const res = await fetch("https://nitip-api.diwanmotor.com/api/v1/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Gagal mengambil profile");
        setLoading(false);
        return;
      }

      setProfile(json.data);
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: {
    fullName?: string;
    phone?: string;
    avatar?: string | null;
  }) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Token tidak ada");

    const res = await fetch("https://nitip-api.diwanmotor.com/api/v1/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const json = await res.json();

    if (!json.success) {
      const msg = Array.isArray(json.message) ? json.message.join(", ") : json.message;
      throw new Error(msg || "Gagal update profile");
    }

    // Refresh setelah update berhasil
    await fetchProfile();
    return json.data;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile, updateProfile };
};