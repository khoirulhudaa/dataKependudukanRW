// src/views/admin/AdminPage.tsx
import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdPeople,
  MdPerson,
  MdPowerSettingsNew,
  MdSearch,
} from "react-icons/md";
import { reverseRoleMapping, useAdmins } from "utils/useAdmins";
import { useProfile } from "utils/useProfile";

const roleOptions = [
  { value: "Superadmin", label: "Superadmin" },
  { value: "Ketua RW", label: "Ketua RW" },
  { value: "Sekretaris RW", label: "Sekretaris RW" },
  { value: "Bendahara RW", label: "Bendahara RW" },
  { value: "Ketua Kader", label: "Ketua Kader" },
  { value: "Sekretaris Kader", label: "Sekretaris Kader" },
  { value: "Ketua RT", label: "Ketua RT" },
  { value: "Sekretaris RT", label: "Sekretaris RT" },
  { value: "Bendahara RT", label: "Bendahara RT" },
];

interface Admin {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  rw?: { code: string; name: string };
  isActive: boolean;
}

const AdminPage: React.FC = () => {
  const { profile, loading: loadingProfile } = useProfile();
  const {
    admins,
    rws,
    loading,
    loadingRws,
    error,
    fetchAdmins,
    createAdmin,
    updateAdmin, // baru
    deleteAdmin, // baru
    toggleActivation
  } = useAdmins();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Admin | null>(null);
  const [rts, setRts] = useState<{ id: string; code: string; name: string }[]>([]);
  const [loadingRts, setLoadingRts] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    noHp: "",
    role: "Ketua RT",
    rwId: "",
    rtId: "", // ← tambah ini
  });
  const [submitting, setSubmitting] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchAdmins]);

  useEffect(() => {
    if (!form.rwId) {
      setRts([]);
      return;
    }

    const roleNeedsRt = ["Ketua RT", "Sekretaris RT", "Bendahara RT"].includes(form.role);

    if (!roleNeedsRt) {
      setRts([]);
      return;
    }

    const fetchRts = async () => {
      try {
        setLoadingRts(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Token tidak ditemukan");

        const res = await fetch(
          `https://nitip-api.diwanmotor.com/api/v1/setup/rt/${form.rwId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Gagal mengambil data RT");

        setRts(json.data || []);
      } catch (err: any) {
        alert(err.message || "Gagal memuat daftar RT");
        setRts([]);
      } finally {
        setLoadingRts(false);
      }
    };

    fetchRts();
  }, [form.rwId, form.role]);

  const handleToggleActivation = async (user: Admin) => {
    const action = user.isActive ? "menonaktifkan" : "mengaktifkan";
    if (!window.confirm(`Apakah Anda yakin ingin ${action} akun "${user.fullName}"?`)) {
      return;
    }

    try {
      await toggleActivation(user.id);
      alert(`Akun berhasil ${user.isActive ? "dinonaktifkan" : "diaktifkan"}!`);
      fetchAdmins(search); // refresh data
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status akun");
    }
  };

  // const handleCreate = async () => {
  //   if (!form.nama.trim() || !form.email.trim()) {
  //     alert("Nama dan Email wajib diisi!");
  //     return;
  //   }


  //   const needsRw = ["Ketua RW", "Sekretaris RW", "Bendahara RW", "Ketua Kader", "Sekretaris Kader"].includes(form.role);
  //   if (needsRw && !form.rwId) {
  //     alert("Pilih RW untuk role ini!");
  //     return;
  //   }

  //   setSubmitting(true);
  //   try {
  //     await createAdmin({
  //       fullName: form.nama.trim(),
  //       email: form.email.trim().toLowerCase(),
  //       phone: form.noHp.trim() || undefined,
  //       role: form.role,
  //       rwId: needsRw ? form.rwId : undefined,
  //     });

  //     alert(
  //       "Admin berhasil ditambahkan!\n\nPassword default: Admin@12345\nHarap ubah password saat login pertama."
  //     );
  //     setShowCreateModal(false);
  //     resetForm();
  //     fetchAdmins(search);
  //   } catch (err: any) {
  //     alert(err.message || "Gagal menambahkan admin");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleUpdate = async () => {
    if (!editingUser) return;

    setSubmitting(true);
    try {
      await updateAdmin(editingUser.id, {
        fullName: form.nama.trim(),
        phone: form.noHp.trim() || undefined,
      });

      alert("Data admin berhasil diperbarui!");
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
      fetchAdmins(search);
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string, fullName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus admin "${fullName}"?`)) return;

    try {
      await deleteAdmin(userId);
      alert("Admin berhasil dihapus!");
      fetchAdmins(search);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus admin");
    }
  };

  const openEditModal = (user: Admin) => {
    setEditingUser(user);
    setForm({
      nama: user.fullName,
      email: user.email,
      noHp: user.phone || "",
      role: "", // role tidak diubah di edit
      rwId: "",
      rtId: ""
    });
    setShowEditModal(true);
  };

  
  const handleSubmit = async () => {
    if (!form.nama.trim() || !form.email.trim()) {
      alert("Nama dan Email wajib diisi!");
      return;
    }
    
    const isRwRole = ["Ketua RW", "Sekretaris RW", "Bendahara RW"].includes(form.role);
    if (isRwRole && !form.rwId) {
      alert("Pilih RW untuk role ini!");
      return;
    }

    setSubmitting(true);
    try {
      await createAdmin({
        fullName: form.nama.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.noHp.trim() || undefined,
        role: form.role,
        rwId: isRwRole ? form.rwId : undefined,
      });

      alert(
        "Admin berhasil ditambahkan!\n\nPassword default: Admin@12345\nHarap ubah password saat login pertama."
      );
      setShowCreateModal(false);
      setForm({ nama: "", email: "", noHp: "", role: "Ketua RT", rwId: "", rtId: "" });
    } catch (err: any) {
      alert(err.message || "Gagal menambahkan admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (!form.nama.trim() || !form.email.trim()) {
      alert("Nama dan Email wajib diisi!");
      return;
    }

    // Daftar role yang MEMBUTUHKAN RW
    const rolesNeedingRw = [
      "Ketua RW",
      "Sekretaris RW",
      "Bendahara RW",
      "Ketua RT",
      "Sekretaris RT",
      "Ketua Kader",
      "Sekretaris Kader",
      "Bendahara RT"
      // Tambahkan "Bendahara RT" hanya jika memang ada di backend
    ];

    if (rolesNeedingRw.includes(form.role) && !form.rwId) {
      alert("Pilih RW untuk role ini!");
      return;
    }

    setSubmitting(true);
    try {
      await createAdmin({
        fullName: form.nama.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.noHp.trim() || undefined,
        role: form.role,
        rwId: rolesNeedingRw.includes(form.role) ? form.rwId : undefined,
        rtId: ["Ketua RT", "Sekretaris RT", "Bendahara RT"].includes(form.role) ? form.rtId : undefined,
      });

      alert(
        "Admin berhasil ditambahkan!\n\nPassword default: Admin@12345\nHarap ubah password saat login pertama."
      );
      setShowCreateModal(false);
      resetForm();
      fetchAdmins(search);
    } catch (err: any) {
      alert(err.message || "Gagal menambahkan admin");
    } finally {
      setSubmitting(false);
    }
  };


  const resetForm = () => {
    setForm({ nama: "", email: "", noHp: "", role: "Ketua RT", rwId: "", rtId: "" });
  };

  const rolesRequiringRw = [
    "Ketua RW",
    "Sekretaris RW",
    "Bendahara RW",
    "Ketua RT",
    "Sekretaris RT",
    "Bendahara RT", // hapus jika tidak ada di backend
    "Ketua Kader",
    "Sekretaris Kader",
  ];

  const needsRw = rolesRequiringRw.includes(form.role);
  const selectedRw = rws.find((r) => r.id === form.rwId);

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* Widget Statistik */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Total Admin" subtitle={admins.length.toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Aktif" subtitle={admins.filter((a: any) => a.isActive).length.toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Nonaktif" subtitle={admins.filter((a: any) => !a.isActive).length.toString()} />
        <Widget icon={<MdPerson className="h-7 w-7" />} title="Superadmin" subtitle={admins.filter((a: any) => a.role === "SUPERADMIN").length.toString()} />
      </div>

      {/* Header + Tambah */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
                <MdPeople className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-700 dark:text-white">Kelola Admin Data</h3>
            </div> */}
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 transition-colors"
        >
          <MdAdd className="h-5 w-5" />
          Tambah Admin
        </button>
      </div>

      {/* Pencarian */}
      <div className="mt-5">
        <div className="relative">
          <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-navy-600 dark:bg-navy-700 dark:text-white"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="mt-5">
        <Card extra="w-full p-5">
          <div className="overflow-x-auto">
            {loading || loadingProfile ? (
              <div className="py-12 flex justify-center items-center gap-3">
                <FaSpinner className="animate-spin text-xl" />
                <p className="text-gray-600 dark:text-gray-400">Memuat data admin...</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] table-auto">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-navy-600">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">NAMA</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">EMAIL</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">NO. HP</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">ROLE</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">RW</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-white">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                        Belum ada admin terdaftar.
                      </td>
                    </tr>
                  ) : (
                    admins.map((item: Admin) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-navy-700 dark:text-white">{item.fullName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.phone || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.role === "SUPERADMIN"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                : item.role.includes("CHAIRMAN")
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {reverseRoleMapping[item.role] || item.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {item.rw ? `${item.rw.code} - ${item.rw.name}` : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.isActive
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {item.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <MdEdit className="h-5 w-5" />
                            </button>
                            {/* Toggle Activation */}
                            {item.role !== "SUPERADMIN" && (
                              <button
                                onClick={() => handleToggleActivation(item)}
                                className={`${
                                  item.isActive
                                    ? "text-orange-600 hover:text-orange-800 dark:text-orange-400"
                                    : "text-green-600 hover:text-green-800 dark:text-green-400"
                                }`}
                                title={item.isActive ? "Nonaktifkan" : "Aktifkan"}
                              >
                                <MdPowerSettingsNew className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(item.id, item.fullName)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Hapus"
                            >
                              <MdDelete className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Modal Tambah Admin */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <Card extra="w-full max-w-lg p-6 relative">
            <h3 className="mb-5 text-xl font-bold text-navy-700 dark:text-white">
              Tambah Admin Baru
            </h3>

            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e: any) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                  placeholder="Budi Santoso"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e: any) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                  placeholder="ketua.rw01@baleendah.com"
                />
              </div>

              {/* No HP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  No. HP (Opsional)
                </label>
                <input
                  type="text"
                  value={form.noHp}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      noHp: e.target.value.replace(/[^0-9+]/g, ""),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                  placeholder="081234567890"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role *
                </label>
                <select
                  value={form.role}
                  onChange={(e: any) =>
                    setForm({ ...form, role: e.target.value, rwId: "" })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilih RW (khusus role RW) */}
              {needsRw && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pilih RW *
                  </label>
                  {loadingRws ? (
                    <p className="text-sm text-gray-500">Memuat daftar RW...</p>
                  ) : rws.length === 0 ? (
                    <p className="text-sm text-red-500">
                      Tidak ada RW tersedia. Hubungi superadmin.
                    </p>
                  ) : (
                    <select
                      value={form.rwId}
                      onChange={(e: any) => setForm({ ...form, rwId: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                    >
                      <option value="">-- Pilih RW --</option>
                      {rws.map((rw) => (
                        <option key={rw.id} value={rw.id}>
                          {rw.code} - {rw.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {["Ketua RT", "Sekretaris RT", "Bendahara RT"].includes(form.role) && needsRw && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pilih RT *
                  </label>
                  {loadingRts ? (
                    <p className="text-sm text-gray-500">Memuat daftar RT...</p>
                  ) : rts.length === 0 ? (
                    <p className="text-sm text-red-500">
                      Tidak ada RT di RW ini. Hubungi superadmin.
                    </p>
                  ) : (
                    <select
                      value={form.rtId}
                      onChange={(e) => setForm({ ...form, rtId: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                    >
                      <option value="">-- Pilih RT --</option>
                      {rts.map((rt) => (
                        <option key={rt.id} value={rt.id}>
                          {rt.code} - {rt.name || "RT " + rt.code}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Info Password Default */}
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/30 p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Password default:</strong> Admin@12345
                  <br />
                  User <strong>wajib mengganti password</strong> saat login pertama kali.
                </p>
              </div>
            </div>

            {/* Tombol */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white dark:hover:bg-navy-700"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={
                  submitting ||
                  !form.nama.trim() ||
                  !form.email.trim() ||
                  (needsRw && !form.rwId)
                }
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Menyimpan..." : "Tambah Admin"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Edit Admin */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <Card extra="w-full max-w-lg p-6 relative">
            <h3 className="mb-5 text-xl font-bold text-navy-700 dark:text-white">Edit Admin</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm dark:bg-navy-800 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. HP</label>
                <input
                  type="text"
                  value={form.noHp}
                  onChange={(e) => setForm({ ...form, noHp: e.target.value.replace(/[^0-9+]/g, "") })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
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
                onClick={handleUpdate}
                disabled={submitting || !form.nama.trim()}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPage;