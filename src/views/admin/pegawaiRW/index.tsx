import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaPowerOff, FaTrash } from "react-icons/fa";
import {
  MdAdd,
  MdArrowForwardIos,
  MdCancel,
  MdCheckCircle,
  MdClose,
  MdGroup,
  MdHome,
  MdLocationOn,
  MdPeople,
  MdPhone,
  MdSearch
} from "react-icons/md";
import { useProfile } from "utils/useProfile";

type YouthOrg = {
  id: string;
  name: string;
  chairmanUser: { name: string } | null;
  isActive: boolean;
};

type User = {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
} | null;

type FullUser = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string;
  rw: { id: string; code: string; name: string } | null;
};

type RW = {
  id: string;
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  totalRT: number;
  createdAt: string;
  updatedAt: string;
  chairmanUser: User;
  secretaryUser: User;
  treasurerUser: User;
  youthOrgs: YouthOrg[];
  _count: {
    rts: number;
    users: number;
  };
};

const BASE_URL = "https://nitip-api.diwanmotor.com/api/v1";

const PegawaiRWPage: React.FC = () => {
  const { profile } = useProfile();
  const [rwList, setRwList] = useState<RW[]>([]);
  const [userList, setUserList] = useState<FullUser[]>([]); // <-- baru
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedRW, setSelectedRW] = useState<RW | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditManagementModal, setShowEditManagementModal] = useState(false);

  const [form, setForm] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
  });

  const [managementForm, setManagementForm] = useState({
    chairmanUserId: "",
    secretaryUserId: "",
    treasurerUserId: "",
  });

  const isSuperAdmin = profile?.role === "SUPERADMIN";
  const villageId = profile?.village.id || 0;
  const ROLE_MAP = {
    CHAIRMAN: "RW_CHAIRMAN",
    SECRETARY: "RW_SECRETARY",
    TREASURER: "RW_TREASURER",
  } as const;

  const getUsersByRole = (role: string) => {
    return userList.filter((user) => user.role === role);
  };

  // RW Action State
  const [processingRW, setProcessingRW] = useState(false);
  const [showEditRWModal, setShowEditRWModal] = useState(false);

  const [editForm, setEditForm] = useState({
    id: "",
    code: "",
    name: "",
    address: "",
    phone: "",
    isActive: true,
  });

  const [confirmRWAction, setConfirmRWAction] = useState<null | {
    type: "toggle" | "delete";
    rw: RW;
  }>(null);

  const openEditRW = (rw: RW) => {
    setEditForm({
      id: rw.id,
      code: rw.code,
      name: rw.name,
      address: rw.address || "",
      phone: rw.phone || "",
      isActive: rw.isActive,
    });
    setShowEditRWModal(true);
  };

  const handleUpdateRW = async () => {
    try {
      setProcessingRW(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(
        `${BASE_URL}/setup/rw/detail/${editForm.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: editForm.code,
            name: editForm.name,
            address: editForm.address || null,
            phone: editForm.phone || null,
            isActive: editForm.isActive,
          }),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal update RW");

      setRwList((prev) =>
        prev.map((rw) => (rw.id === editForm.id ? { ...rw, ...json.data } : rw))
      );

      setSelectedRW((prev) =>
        prev && prev.id === editForm.id ? { ...prev, ...json.data } : prev
      );

      alert("RW berhasil diperbarui");
      setShowEditRWModal(false);
    } catch (err: any) {
      alert(err.message || "Gagal update RW");
    } finally {
      setProcessingRW(false);
    }
  };

  const handleToggleRW = async (rw: RW) => {
    try {
      setProcessingRW(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${BASE_URL}/setup/rw/${rw.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      alert(json.data?.message);
      fetchRW(); // atau update state manual
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status RW");
    } finally {
      setProcessingRW(false);
      setConfirmRWAction(null);
    }
  };

  const handleDeleteRWPermanent = async (rw: RW) => {
    try {
      setProcessingRW(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `${BASE_URL}/setup/rw/${rw.id}/permanent`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      alert(json.data?.message);
      setRwList((prev) => prev.filter((r) => r.id !== rw.id));
      setSelectedRW(null);
    } catch (err: any) {
      alert(err.message || "Gagal hapus RW");
    } finally {
      setProcessingRW(false);
      setConfirmRWAction(null);
    }
  };

  const fetchRW = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Token tidak ditemukan.");

      const response = await fetch(`${BASE_URL}/setup/rw/${villageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        setRwList(result.data);
      } else {
        alert(result.message || "Gagal mengambil data RW");
      }
    } catch (err) {
      console.error(err);
      alert("Error saat mengambil data RW");
    } finally {
      setLoading(false);
    }
  };


  // Fetch RW
  useEffect(() => {
    fetchRW();
  }, [villageId]);

  // Fetch semua user (untuk dropdown pengurus)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Token tidak ditemukan.");

      const response = await fetch(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        console.log('user', result.data)
        setUserList(result.data);
      } else {
        alert(result.message || "Gagal mengambil daftar user");
      }
    } catch (err) {
      console.error(err);
      alert("Error saat mengambil daftar user");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Buka modal edit pengurus → fetch users + isi form
  const openEditManagement = (rw: RW) => {
    setManagementForm({
      chairmanUserId: rw.chairmanUser?.id || "",
      secretaryUserId: rw.secretaryUser?.id || "",
      treasurerUserId: rw.treasurerUser?.id || "",
    });
    fetchUsers();
    setShowEditManagementModal(true);
  };

  // Submit update pengurus
  const handleUpdateManagement = async () => {
    if (!selectedRW) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/setup/rw/${selectedRW.id}/management`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chairmanUserId:
              managementForm.chairmanUserId || null,
            secretaryUserId:
              managementForm.secretaryUserId || null,
            treasurerUserId:
              managementForm.treasurerUserId || null,
          }),
        }
      );

      const result = await response.json();
      console.log('result data', result.data.chairmanUser)
      if (result.success) {
        // Update rwList lokal
        setRwList((prev) =>
          prev.map((rw) =>
            rw.id === selectedRW.id
              ? {
                  ...rw,
                  chairmanUser: result.data.chairmanUser,
                  secretaryUser: result.data.secretaryUser,
                  treasurerUser: result.data.treasurerUser,
                }
              : rw
          )
        );
        setSelectedRW((prev) =>
          prev
            ? {
                ...prev,
                chairmanUser: result.data.chairmanUser,
                secretaryUser: result.data.secretaryUser,
                treasurerUser: result.data.treasurerUser,
              }
            : null
        );

        alert("Pengurus RW berhasil diperbarui!");
        setShowEditManagementModal(false);
      } else {
        alert(result.message || "Gagal memperbarui pengurus");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan");
    }
  };

  const filteredData = useMemo(() => {
    return rwList.filter(
      (item) =>
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [rwList, search]);

  console.log('selectedRW', selectedRW)

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      alert("Kode dan Nama RW wajib diisi!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/setup/rw/${villageId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          address: form.address || null,
          phone: form.phone || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setRwList((prev) => [...prev, result.data]);
        alert("RW berhasil ditambahkan!");
        setShowModal(false);
        setForm({ code: "", name: "", address: "", phone: "" });
      } else {
        alert(result.message || "Gagal menambahkan RW");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan");
    }
  };

  return (
    <div className="relative">
      {/* Widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget icon={<MdHome className="h-7 w-7" />} title="Total RW" subtitle={rwList.length.toString()} />
        <Widget icon={<MdCheckCircle className="h-7 w-7" />} title="Aktif" subtitle={rwList.filter((r) => r.isActive).length.toString()} />
        <Widget icon={<MdGroup className="h-7 w-7" />} title="Total RT" subtitle={rwList.reduce((acc, r) => acc + r._count.rts, 0).toString()} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title="Total Pengurus" subtitle={rwList.reduce((acc, r) => acc + r._count.users, 0).toString()} />
      </div>

      {/* Header */}
      <div className="mt-8 block md:flex border border-gray-300 rounded-md p-2 gap-4 md:flex-row md:items-center md:justify-between">
        {/* <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
            <MdHome className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">Kelola RW</h3>
        </div> */}

        {isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex w-max items-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-white hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <MdAdd className="h-5 w-5" />
            <p className="w-max">
              Tambah RW
            </p>
          </button>
        )}
        <div className="relative w-full">
          <MdSearch className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kode atau nama RW..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
          />
        </div>
      </div>

      {/* Card Grid */}
      {loading ? (
        <div className="mt-10 text-center text-gray-500">Memuat data RW...</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
          {filteredData.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              <MdHome className="mx-auto h-16 w-16 text-gray-300 mb-3" />
              <p>Belum ada data RW.</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRW(item)}
                className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`h-2 ${item.isActive ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600"}`}
                />

                <div className="p-6">
                  <h4 className="text-xl font-bold text-navy-700 dark:text-white">{item.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Kode: {item.code}</p>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className={`font-medium ${item.isActive ? "text-green-600" : "text-red-500"}`}>
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Jumlah RT</span>
                      <span className="font-medium">{item._count.rts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Pengurus</span>
                      <span className="font-medium">{item._count.users} orang</span>
                    </div>
                    {item.youthOrgs.length > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-navy-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Karang Taruna</p>
                        <p className="text-sm font-medium truncate">{item.youthOrgs[0].name}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedRW(item)}
                    className="
                      group relative w-full px-6 py-4 mt-6
                      bg-gradient-to-r from-brand-500/5 via-brand-500/10 to-brand-500/5
                      hover:from-brand-500/10 hover:via-brand-500/20 hover:to-brand-500/10
                      dark:from-brand-500/10 dark:via-brand-500/20 dark:to-brand-500/10
                      rounded-2xl 
                      border border-brand-200/50 dark:border-brand-700/50
                      backdrop-blur-sm
                      transition-all duration-300 ease-out
                      hover:shadow-lg hover:shadow-brand-500/20
                      hover:border-brand-400/70
                      active:scale-[0.98]
                      overflow-hidden
                    "
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent blur-xl" />
                    </div>

                    <div className="relative flex items-center justify-between">
                      <span className="
                        text-sm font-semibold 
                        text-brand-700 dark:text-brand-300 
                        group-hover:text-brand-800 dark:group-hover:text-brand-200 
                        transition-colors
                      ">
                        Lihat detail RW
                      </span>

                      {/* Panah yang bergerak halus */}
                      <div className="flex items-center gap-2">
                        <MdArrowForwardIos className="
                          w-4 h-4 text-brand-600 dark:text-brand-400 
                          translate-x-0 group-hover:translate-x-2 
                          transition-transform duration-300
                        " />
                      </div>
                    </div>

                    {/* Ripple effect saat klik (opsional, tambah aja kalau suka) */}
                    <span className="absolute inset-0 -z-10">
                      <span className="absolute inset-0 bg-brand-400/20 scale-0 rounded-full transition-transform duration-300 active:scale-150" />
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SIDEBAR DETAIL */}
      {selectedRW && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm"
            onClick={() => setSelectedRW(null)}
          />
          <div className="relative w-full md:w-[40vw] h-full bg-white dark:bg-navy-800 shadow-2xl animate-slide-left">
            <div className="flex flex-col p-6 border-b border-gray-200 dark:border-navy-600">
              <h3 className="text-xl font-bold text-navy-700 dark:text-white">
                Detail {selectedRW.name}
              </h3>
              <div className="grid grid-cols-4 items-center gap-2 mt-4">
                {isSuperAdmin && (
                  <>
                    <button
                      onClick={() => openEditRW(selectedRW)}
                      className="h-10 text-center rounded-lg flex justify-center items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
                      title="Edit RW"
                    >
                      <FaEdit />
                      <p className="relative top-[1px]">
                        {'Perbarui'}
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setConfirmRWAction({ type: "toggle", rw: selectedRW })
                      }
                      className={`h-10 text-center flex items-center gap-2 justify-center rounded-lg ${
                        selectedRW.isActive
                          ? "bg-yellow-500 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      <FaPowerOff />
                      <p className="relative top-[1px]">
                        {selectedRW.isActive ? "Non-aktif" : "Aktifkan"}
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setConfirmRWAction({ type: "delete", rw: selectedRW })
                      }
                      className="h-10 text-center flex items-center gap-2 justify-center rounded-lg bg-red-600 text-white"
                      >
                      <FaTrash />
                      <p className="relative top-[1px]">
                        Hapus
                      </p>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedRW(null)}
                  className="p-2 h-10 flex items-center gap-1 justify-center text-center rounded-lg bg-white text-black border border-gray-400 hover:bg-red-100"
                >
                  <MdClose className="h-5 w-5" />
                  <p className="relative top-[1px]">
                    {'Tutup'}
                  </p>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto h-full pb-24">
              {/* Status Bar */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    selectedRW.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {selectedRW.isActive ? <MdCheckCircle /> : <MdCancel />}
                  {selectedRW.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {/* Pengurus */}
              <div>
                <h4 className="font-semibold text-navy-700 dark:text-white mb-3">Pengurus RW</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Ketua RW</p>
                    <p className="font-medium">{selectedRW.chairmanUser?.fullName || "Belum ditetapkan"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sekretaris</p>
                    <p className="font-medium">{selectedRW.secretaryUser?.fullName || "Belum ditetapkan"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bendahara</p>
                    <p className="font-medium">{selectedRW.treasurerUser?.fullName || "Belum ditetapkan"}</p>
                  </div>
                </div>
              </div>

              {/* Kontak */}
              {(selectedRW.address || selectedRW.phone) && (
                <div>
                  <h4 className="font-semibold text-navy-700 dark:text-white mb-3">Kontak</h4>
                  <div className="space-y-2">
                    {selectedRW.address && (
                      <p className="flex items-center gap-2 text-sm">
                        <MdLocationOn className="h-4 w-4 text-blue-600" />
                        {selectedRW.address}
                      </p>
                    )}
                    {selectedRW.phone && (
                      <p className="flex items-center gap-2 text-sm">
                        <MdPhone className="h-4 w-4 text-green-600" />
                        {selectedRW.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Karang Taruna */}
              {selectedRW.youthOrgs.length > 0 && (
                <div>
                  <h4 className="font-semibold text-navy-700 dark:text-white mb-3">Karang Taruna</h4>
                  {selectedRW.youthOrgs.map((org) => (
                    <div key={org.id} className="bg-gray-50 dark:bg-navy-700 rounded-xl p-4">
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Ketua: {org.chairmanUser?.name || "Belum ditetapkan"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Statistik */}
              <div>
                <h4 className="font-semibold text-navy-700 dark:text-white mb-3">Statistik</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-brand-600">{selectedRW._count.rts}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total RT</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedRW._count.users}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pengurus Terdaftar</p>
                  </div>
                </div>
              </div>

              {/* Tanggal */}
              <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200 dark:border-navy-600">
                <p>Dibuat: {new Date(selectedRW.createdAt).toLocaleDateString("id-ID")}</p>
                <p>Diperbarui: {new Date(selectedRW.updatedAt).toLocaleDateString("id-ID")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditRWModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4">
          <div className="absolute inset-0" onClick={() => setShowEditRWModal(false)} />
          <Card extra="w-full max-w-md p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-5">Edit RW</h3>

            <div className="space-y-4">
              <input
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                placeholder="Kode RW"
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nama RW"
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="Alamat"
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="Telepon"
                className="w-full rounded-xl border px-4 py-3"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isActive: e.target.checked })
                  }
                />
                Aktif
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowEditRWModal(false)}>Batal</button>
              <button
                onClick={handleUpdateRW}
                disabled={processingRW}
                className="bg-brand-500 text-white px-5 py-2 rounded-xl"
              >
                {processingRW ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {confirmRWAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4">
          <Card extra="w-full max-w-md p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">
              {confirmRWAction.type === "delete"
                ? "Hapus RW Permanen"
                : confirmRWAction.rw.isActive
                ? "Nonaktifkan RW"
                : "Aktifkan RW"}
            </h3>

            <p className="text-sm mb-6">
              {confirmRWAction.type === "delete"
                ? "Data RW akan dihapus permanen dan tidak bisa dikembalikan."
                : "Status RW akan diubah."}
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmRWAction(null)}>Batal</button>
              <button
                onClick={() =>
                  confirmRWAction.type === "delete"
                    ? handleDeleteRWPermanent(confirmRWAction.rw)
                    : handleToggleRW(confirmRWAction.rw)
                }
                className="px-5 py-2 rounded-xl bg-red-600 text-white"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </Card>
        </div>
      )}


      {/* Modal Tambah RW */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          <Card extra="w-[96vw] md:max-w-md p-6 rounded-2xl shadow-2xl bg-white dark:bg-navy-800">
            <h3 className="mb-6 text-xl font-bold">Tambah RW Baru</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Kode RW" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700" />
                <input placeholder="Nama RW" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700" />
              </div>
              <input placeholder="Alamat (opsional)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700" />
              <input placeholder="Telepon (opsional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:border-navy-600 dark:bg-navy-700" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium">Batal</button>
              <button onClick={handleSubmit} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-white font-medium shadow-md hover:shadow-lg">Simpan</button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Edit Pengurus */}
      {showEditManagementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowEditManagementModal(false)} />
          <Card extra="w-[96vw] md:max-w-lg p-6 rounded-2xl shadow-2xl bg-white dark:bg-navy-800">
            <h3 className="mb-6 text-xl font-bold">Edit Pengurus {selectedRW?.name}</h3>

            {loadingUsers ? (
              <div className="text-center py-8 text-gray-500">Memuat daftar user...</div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Ketua RW</label>
                  <select
                    value={managementForm.chairmanUserId}
                    onChange={(e) =>
                      setManagementForm({ ...managementForm, chairmanUserId: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">-- Tidak ada / Kosongkan --</option>
                    {getUsersByRole(ROLE_MAP.CHAIRMAN).map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.role || "tanpa role"}) - {user.rw.name || ''} (Kelurahan: {user.village.name || ''})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sekretaris RW</label>
                  <select
                      value={managementForm.secretaryUserId}
                      onChange={(e) =>
                        setManagementForm({ ...managementForm, secretaryUserId: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
                    >
                      <option value="">-- Tidak ada / Kosongkan --</option>
                      {getUsersByRole(ROLE_MAP.SECRETARY).map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.fullName} ({user.role || "tanpa role"}) - {user.rw.name || ''} (Kelurahan: {user.village.name || ''})
                        </option>
                      ))}
                    </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bendahara RW</label>
                  <select
                    value={managementForm.treasurerUserId}
                    onChange={(e) =>
                      setManagementForm({ ...managementForm, treasurerUserId: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">-- Tidak ada / Kosongkan --</option>
                    {getUsersByRole(ROLE_MAP.TREASURER).map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.role || "tanpa role"}) - {user.rw.name || ''} (Kelurahan: {user.village.name || ''})
                      </option>
                    ))}
                  </select> 
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowEditManagementModal(false)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateManagement}
                disabled={loadingUsers}
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-white font-medium shadow-md hover:shadow-lg disabled:opacity-50"
              >
                Simpan Perubahan
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PegawaiRWPage;