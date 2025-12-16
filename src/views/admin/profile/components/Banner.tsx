// src/views/admin/profile/components/Banner.tsx
import React, { useState, useRef } from "react";
import Card from "components/card";
import banner from "assets/img/profile/banner.png";
import { MdEdit, MdCameraAlt, MdVisibilityOff, MdVisibility } from "react-icons/md";
import { useProfile } from "utils/useProfile";

interface BannerProps {
  onUpdate: () => void;
}

const Banner: React.FC<BannerProps> = ({ onUpdate }) => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    noTelp: "",
    foto: null as string | null,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading state
  if (loading) return <Card extra="p-8 text-center">
    <p>
      Memuat profile...
    </p>
  </Card>;
  if (error || !profile) return <Card extra="p-8 text-center text-red-500">
    <p>
      {error || "Profile tidak ditemukan"}
    </p>
  </Card>;

  const isAdmin = profile.role === "admin";

  // Buka modal edit profile
  const openEdit = () => {
    setForm({
      nama: profile.nama,
      noTelp: profile.noTelp,
      foto: profile.foto,
    });
    setShowEditModal(true);
  };

  // Upload foto → base64
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Simpan perubahan profile
  const handleSaveProfile = async () => {
    if (!form.nama.trim()) {
      alert("Nama wajib diisi!");
      return;
    }

    // Validasi format nomor telepon
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (form.noTelp && !phoneRegex.test(form.noTelp.replace(/\s/g, ""))) {
      alert(
        "Format nomor telepon tidak valid!\n\nContoh yang benar:\n• 081234567890\n• 81234567890\n• 6281234567890\n• +6281234567890"
      );
      return;
    }

    try {
      await updateProfile({
        fullName: form.nama.trim(),
        phone: form.noTelp.trim(),
        avatar: form.foto,
      });
      setShowEditModal(false);
      onUpdate();
      alert("Profile berhasil diperbarui!");
    } catch (err: any) {
      const errorMessage =
        err.message.includes("regular expression")
          ? "Format nomor telepon salah. Gunakan format Indonesia yang valid (contoh: 081234567890)"
          : err.message || "Gagal menyimpan perubahan";
      alert(errorMessage);
    }
  };

  // Simpan perubahan password
  const handleSavePassword = async () => {
    if (!passwordForm.oldPassword.trim() || !passwordForm.newPassword.trim()) {
      alert("Kedua kolom password wajib diisi!");
      return;
    }

    // Validasi password baru di frontend
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      alert(
        "Password baru harus mengandung setidaknya satu huruf besar, satu huruf kecil, dan satu angka."
      );
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch("https://nitip-api.diwanmotor.com/api/v1/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        const msg = Array.isArray(json.message) ? json.message.join(", ") : json.message;
        throw new Error(msg || "Gagal mengganti password");
      }

      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "" });
      alert("Password berhasil diubah!");
    } catch (err: any) {
      alert(
        err.message.includes("incorrect")
          ? "Password saat ini salah!"
          : err.message.includes("uppercase")
          ? "Password baru harus mengandung huruf besar, huruf kecil, dan angka"
          : err.message || "Gagal mengganti password"
      );
    }
  };

  // Hitung statistik
  const countWarga = () => {
    const ktp = JSON.parse(localStorage.getItem("dataKTP") || "[]");
    return ktp.filter((k: any) => k.rt === profile.rt && k.rw === profile.rw).length;
  };

  const countRTRW = () => {
    const kk = JSON.parse(localStorage.getItem("dataKK") || "[]");
    const rtSet = new Set(kk.map((k: any) => `${k.rt}-${k.rw}`));
    return rtSet.size;
  };

  return (
    <>
      <Card extra="items-center w-full h-full p-[16px] bg-cover relative">
        <div className="w-max flex items-center gap-5 absolute top-8 right-8">
          {/* Tombol Edit Profile */}
          <button
            onClick={openEdit}
            className="relative z-10 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs text-black hover:brightness-[90%] active:scale-[0.98] duration-200 transition-colors"
          >
            <MdEdit className="h-4 w-4" />
            Edit Profile
          </button>

          {/* Tombol Change Password */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="relative z-10 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs text-black hover:brightness-[90%] active:scale-[0.98] duration-200 transition-colors"
          >
            <MdEdit className="h-4 w-4" />
            Ganti Password
          </button>
        </div>

        {/* Background */}
        <div
          className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-brand-500 dark:!border-navy-700 overflow-hidden">
            {profile.foto ? (
              <img src={profile.foto} alt="Foto Profil" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                {profile.nama.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Nama & Jabatan */}
        <div className="mt-16 flex flex-col items-center">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">{profile.nama}</h4>
          <p className="text-base font-normal text-gray-600">
            {isAdmin ? `Ketua RT ${profile.rt || "-"}/RW ${profile.rw || "-"}` : "Lurah"}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 mb-3 flex gap-8 md:!gap-14">
          {isAdmin ? (
            <>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{profile.rt || "-"}</p>
                <p className="text-sm font-normal text-gray-600">RT</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{profile.rw || "-"}</p>
                <p className="text-sm font-normal text-gray-600">RW</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{countWarga()}</p>
                <p className="text-sm font-normal text-gray-600">Warga</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{profile.kelurahan || "-"}</p>
                <p className="text-sm font-normal text-gray-600">Kelurahan</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{profile.provinsi || "-"}</p>
                <p className="text-sm font-normal text-gray-600">Provinsi</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{countRTRW()}</p>
                <p className="text-sm font-normal text-gray-600">RT/RW</p>
              </div>
            </>
          )}
        </div>

        {/* Role Badge */}
        <div className="mt-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isAdmin
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            }`}
          >
            {isAdmin ? "Admin RT/RW" : "Super Admin (Lurah)"}
          </span>
        </div>
      </Card>

      {/* MODAL EDIT PROFILE */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative z-[333] w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl dark:bg-navy-800 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">Edit Profile</h3>

            {/* Foto Profil */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg">
                  {form.foto ? (
                    <img src={form.foto} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-4xl font-bold text-gray-500">
                      {form.nama.charAt(0)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white shadow-md hover:bg-brand-600"
                >
                  <MdCameraAlt className="h-5 w-5" />
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              <p className="mt-2 text-xs text-gray-500">Klik ikon kamera untuk ganti foto</p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap *</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon</label>
                <input
                  type="text"
                  value={form.noTelp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+]/g, "");
                    setForm({ ...form, noTelp: value });
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white dark:hover:bg-navy-700"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProfile}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
                disabled={!form.nama.trim()}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHANGE PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative z-[333] w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-navy-800">
            <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">Ganti Password</h3>

            <div className="grid grid-cols-1 gap-4">
             <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Lama *
          </label>
          <div className="relative mt-1">
            <input
              type={showOldPassword ? "text" : "password"}
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              placeholder="Masukkan password lama"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showOldPassword ? (
                <MdVisibilityOff className="h-5 w-5" />
              ) : (
                <MdVisibility className="h-5 w-5" />
              )}
            </button>
          </div>
              </div>

              {/* Password Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password Baru *
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showNewPassword ? (
                      <MdVisibilityOff className="h-5 w-5" />
                    ) : (
                      <MdVisibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Password harus mengandung huruf besar, huruf kecil, dan angka.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white dark:hover:bg-navy-700"
              >
                Batal
              </button>
              <button
                onClick={handleSavePassword}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
                disabled={!passwordForm.oldPassword.trim() || !passwordForm.newPassword.trim()}
              >
                Simpan Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;