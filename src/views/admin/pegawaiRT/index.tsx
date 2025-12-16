// // src/views/rt/PegawaiRTPage.tsx (atau sesuai path kamu)

// import Card from "components/card";
// import Widget from "components/widget/Widget";
// import React, { useEffect, useMemo, useState } from "react";
// import { FaAddressCard, FaCheck, FaPen, FaTrash } from "react-icons/fa";
// import { MdAdd, MdArrowForwardIos, MdGroup, MdPhone, MdSearch, MdSync, MdUpload } from "react-icons/md";
// import { useProfile } from "utils/useProfile";

// const BASE_URL = "https://nitip-api.diwanmotor.com/api/v1";

// type Pegawai = {
//   nama: string;
//   telepon: string;
//   aktif: boolean;
//   fotoUrl?: string | null;
// };

// type RT = {
//   id: string;
//   code: string;
//   name: string;
//   rwId: string;
//   isActive: boolean;
//   chairmanUserId: string | null;
//   secretaryUserId: string | null;
//   chairmanUser: any | null;   // nanti bisa ditype lebih baik jika ada schema user
//   secretaryUser: any | null;
//   userCount: number;
//   ketua?: Pegawai;            // tetap untuk frontend only
//   sekretaris?: Pegawai;
//   bendahara?: Pegawai;
// };

//   // Type untuk user (sama seperti di RW page)
//   type FullUser = {
//     id: string;
//     fullName: string;
//     email: string | null;
//     phone: string | null;
//     role: string;
//     photoUrl: string;
//     rw: { id: string; code: string; name: string } | null;
//   };

// const PegawaiRTPage: React.FC = () => {
//   const { profile } = useProfile();
//   const [rtList, setRtList] = useState<RT[]>([]);
//   const [pengurusMap, setPengurusMap] = useState<Record<string, { ketua?: Pegawai; sekretaris?: Pegawai; bendahara?: Pegawai }>>({});
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loadingBulk, setLoadingBulk] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [editRT, setEditRT] = useState<RT | null>(null);
//   const [bulkTotal, setBulkTotal] = useState(6);
//   const [rws, setRws] = useState<any[]>([]);
//   const [selectedRwId, setSelectedRwId] = useState<string>("");
//   const [loadingRws, setLoadingRws] = useState(false);
  
//   // Tambahkan state baru setelah state yang sudah ada
//   const [userList, setUserList] = useState<FullUser[]>([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [assigningRT, setAssigningRT] = useState<RT | null>(null);

//   // Activate / Deactivate & Delete
//   const [processingRT, setProcessingRT] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<null | {
//     type: "toggle" | "delete";
//     rt: RT;
//   }>(null);


//   const [assignForm, setAssignForm] = useState({
//     chairmanUserId: "",
//     secretaryUserId: "",
//   });
  
//   const [form, setForm] = useState({
//     ketuaNama: "", ketuaTelepon: "", ketuaAktif: true, ketuaFoto: null as File | null, ketuaFotoUrl: null as string | null,
//     sekretarisNama: "", sekretarisTelepon: "", sekretarisAktif: true, sekretarisFoto: null as File | null, sekretarisFotoUrl: null as string | null,
//     bendaharaNama: "", bendaharaTelepon: "", bendaharaAktif: true, bendaharaFoto: null as File | null, bendaharaFotoUrl: null as string | null,
//   });

//   // Modal create RT single
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [creating, setCreating] = useState(false);

//   const [createForm, setCreateForm] = useState({
//     code: "",
//     name: "",
//     address: "",
//     phone: "",
//   });

//   // Update RT
//   const [showUpdateRTModal, setShowUpdateRTModal] = useState(false);
//   const [updatingRT, setUpdatingRT] = useState(false);
//   const [editingRT, setEditingRT] = useState<RT | null>(null);

//   const [updateRTForm, setUpdateRTForm] = useState({
//     code: "",
//     name: "",
//     address: "",
//     phone: "",
//     isActive: true,
//   });

//   const handleToggleRTActive = async (rt: RT) => {
//     try {
//       setProcessingRT(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rt/${rt.id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal update status RT");

//       alert(json.data?.message || "Status RT diperbarui");
//       fetchRTs();
//     } catch (err: any) {
//       alert(err.message || "Gagal mengubah status RT");
//     } finally {
//       setProcessingRT(false);
//       setConfirmAction(null);
//     }
//   };

//   const handleDeleteRTPermanent = async (rt: RT) => {
//     try {
//       setProcessingRT(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rt/${rt.id}/permanent`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal menghapus RT");

//       alert(json.data?.message || "RT berhasil dihapus permanen");
//       fetchRTs();
//     } catch (err: any) {
//       alert(err.message || "Gagal menghapus RT permanen");
//     } finally {
//       setProcessingRT(false);
//       setConfirmAction(null);
//     }
//   };


//   const openUpdateRTModal = (rt: RT) => {
//     setEditingRT(rt);
//     setUpdateRTForm({
//       code: rt.code,
//       name: rt.name,
//       address: (rt as any).address || "",
//       phone: (rt as any).phone || "",
//       isActive: rt.isActive,
//     });
//     setShowUpdateRTModal(true);
//   };

//   const handleUpdateRT = async () => {
//     if (!editingRT) return;

//     if (!updateRTForm.code || !updateRTForm.name) {
//       return alert("Code dan Nama RT wajib diisi");
//     }

//     try {
//       setUpdatingRT(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rt/detail/${editingRT.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           code: updateRTForm.code,
//           name: updateRTForm.name,
//           address: updateRTForm.address || null,
//           phone: updateRTForm.phone || null,
//           isActive: updateRTForm.isActive,
//         }),
//       });

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal mengupdate RT");

//       alert("RT berhasil diperbarui");

//       // Refresh list
//       fetchRTs();

//       setShowUpdateRTModal(false);
//       setEditingRT(null);
//     } catch (err: any) {
//       alert(err.message || "Gagal memperbarui RT");
//     } finally {
//       setUpdatingRT(false);
//     }
//   };


//   const handleCreateRTSingle = async () => {
//     if (!effectiveRwId) return alert("RW belum dipilih");

//     if (!createForm.code || !createForm.name) {
//       return alert("Code dan Nama RT wajib diisi");
//     }

//     try {
//       setCreating(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rt/${effectiveRwId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           code: createForm.code,
//           name: createForm.name,
//           address: createForm.address || null,
//           phone: createForm.phone || null,
//         }),
//       });

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal membuat RT");

//       alert("RT berhasil dibuat");

//       // refresh list RT
//       fetchRTs();

//       // reset & close modal
//       setCreateForm({
//         code: "",
//         name: "",
//         address: "",
//         phone: "",
//       });
//       setShowCreateModal(false);
//     } catch (err: any) {
//       alert(err.message || "Gagal membuat RT");
//     } finally {
//       setCreating(false);
//     }
//   };

//   const rwId = profile?.rw?.id; // Asumsi user login adalah Ketua RW atau memiliki rw.id
//   const isSuperadmin = profile?.role === "SUPERADMIN";
//   const isRwRole = profile?.role === "RW_CHAIRMAN" || profile?.role === "RW_SECRETARY";

//   // rwId yang akan digunakan untuk fetch RT
//   const effectiveRwId = isSuperadmin ? selectedRwId : profile?.rw?.id;
//   // Fetch semua RW di desa (untuk Superadmin)
//   const fetchRws = async () => {
//     if (!isSuperadmin) return;

//     try {
//       setLoadingRws(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       // Ganti dengan endpoint yang benar untuk ambil semua RW di desa
//       const villageId = profile?.village?.id;
//       if (!villageId) throw new Error("Village ID tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rw/${villageId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal mengambil daftar RW");

//       setRws(json.data || []);
//       if (json.data.length > 0 && !selectedRwId) {
//         setSelectedRwId(json.data[0].id); // default pilih RW pertama
//       }
//     } catch (err: any) {
//       alert(err.message || "Gagal memuat daftar RW");
//     } finally {
//       setLoadingRws(false);
//     }
//   };

//   useEffect(() => {
//     if (isSuperadmin && profile?.village?.id) {
//       fetchRws();
//     }
//   }, [isSuperadmin, profile?.village?.id]);

//   // Fetch daftar RT dari backend - endpoint yang benar
//   const fetchRTs = async () => {
//     if (!effectiveRwId) {
//       setRtList([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rt/${effectiveRwId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal mengambil data RT");
//       console.log('rt list', json.data)
//       setRtList(json.data.map((rt: any) => ({
//         id: rt.id,
//         code: rt.code,
//         name: rt.name,
//         rwId: rt.rwId,
//         isActive: rt.isActive,
//         chairmanUserId: rt.chairmanUserId,
//         secretaryUserId: rt.secretaryUserId,
//         chairmanUser: rt.chairmanUser,
//         secretaryUser: rt.secretaryUser,
//         userCount: rt._count?.users || 0,
//       })));
//     } catch (err: any) {
//       alert(err.message || "Gagal memuat data RT");
//       setRtList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch RT ketika effectiveRwId berubah
//   useEffect(() => {
//     if (effectiveRwId) {
//       fetchRTs();
//     }
//   }, [effectiveRwId]);

//   useEffect(() => {
//     if (rwId) fetchRTs();
//   }, [rwId]);

//   const RT_ROLE_MAP = {
//     CHAIRMAN: "RT_CHAIRMAN",
//     SECRETARY: "RT_SECRETARY",
//   } as const;

//   const rtUsersByRole = useMemo(() => {
//     return {
//       chairman: userList.filter(u => u.role === RT_ROLE_MAP.CHAIRMAN),
//       secretary: userList.filter(u => u.role === RT_ROLE_MAP.SECRETARY),
//     };
//   }, [userList]);

//   // Bulk create RT
//   const handleBulkCreate = async () => {
//     if (!effectiveRwId) return alert("Pilih RW terlebih dahulu");
//     if (!rwId) return alert("RW tidak ditemukan");
//     if (bulkTotal < 1 || bulkTotal > 50) return alert("Jumlah RT harus antara 1-50");

//     try {
//       setLoadingBulk(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rw/${rwId}/rt/bulk`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ totalRT: bulkTotal }),
//       });

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal membuat RT");

//       alert(`Berhasil membuat ${json.data.length} RT!`);
//       setShowBulkModal(false);
//       fetchRTs();
//     } catch (err: any) {
//       alert(err.message || "Gagal membuat RT");
//     } finally {
//       setLoadingBulk(false);
//     }
//   };

//   const filteredData = useMemo(() => {
//     return rtList.filter((rt) => {
//       const pengurus = pengurusMap[rt.id] || {};
//       const searchLower = search.toLowerCase();
//       return (
//         rt.name.toLowerCase().includes(searchLower) ||
//         rt.code.includes(searchLower) ||
//         pengurus.ketua?.nama.toLowerCase().includes(searchLower) ||
//         pengurus.sekretaris?.nama.toLowerCase().includes(searchLower) ||
//         pengurus.bendahara?.nama.toLowerCase().includes(searchLower)
//       );
//     });
//   }, [rtList, pengurusMap, search]);

//   const getTotalAkt = () => {
//     let count = 0;
//     Object.values(pengurusMap).forEach(p => {
//       if (p.ketua?.aktif) count++;
//       if (p.sekretaris?.aktif) count++;
//       if (p.bendahara?.aktif) count++;
//     });
//     return count;
//   };

//   const openModal = (rt: RT) => {
//     setEditRT(rt);
//     const data = pengurusMap[rt.id] || {};

//     setForm({
//       ketuaNama: data.ketua?.nama || "",
//       ketuaTelepon: data.ketua?.telepon || "",
//       ketuaAktif: data.ketua?.aktif ?? true,
//       ketuaFoto: null,
//       ketuaFotoUrl: data.ketua?.fotoUrl || null,

//       sekretarisNama: data.sekretaris?.nama || "",
//       sekretarisTelepon: data.sekretaris?.telepon || "",
//       sekretarisAktif: data.sekretaris?.aktif ?? true,
//       sekretarisFoto: null,
//       sekretarisFotoUrl: data.sekretaris?.fotoUrl || null,

//       bendaharaNama: data.bendahara?.nama || "",
//       bendaharaTelepon: data.bendahara?.telepon || "",
//       bendaharaAktif: data.bendahara?.aktif ?? true,
//       bendaharaFoto: null,
//       bendaharaFotoUrl: data.bendahara?.fotoUrl || null,
//     });

//     // Fetch user saat modal dibuka
//     fetchUsers();
//     setShowModal(true);
//   };

//   const handleFileChange = (posisi: "ketua" | "sekretaris" | "bendahara", file: File) => {
//     if (file.size > 5 * 1024 * 1024) return alert("File maksimal 5MB");
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setForm(prev => ({ ...prev, [`${posisi}Foto`]: file, [`${posisi}FotoUrl`]: reader.result as string }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSelectUser = (posisi: "ketua" | "sekretaris" | "bendahara", userId: string) => {
//     if (!userId) {
//       // Kosongkan jika pilih "-- Pilih User --"
//       setForm(prev => ({
//         ...prev,
//         [`${posisi}Nama`]: "",
//         [`${posisi}Telepon`]: "",
//         [`${posisi}FotoUrl`]: null,
//       }));
//       return;
//     }

//     const user = userList.find(u => u.id === userId);
//     if (user) {
//       setForm(prev => ({
//         ...prev,
//         [`${posisi}Nama`]: user.fullName || "",
//         [`${posisi}Telepon`]: user.phone || "",
//         [`${posisi}FotoUrl`]: user.photoUrl || null, // jika user punya foto, sesuaikan fieldnya
//       }));
//     }
//   };

//   const handleSubmit = () => {
//     if (!editRT) return;

//     const updatedPengurus = {
//       ketua: form.ketuaNama ? { nama: form.ketuaNama, telepon: form.ketuaTelepon, aktif: form.ketuaAktif, fotoUrl: form.ketuaFotoUrl } : undefined,
//       sekretaris: form.sekretarisNama ? { nama: form.sekretarisNama, telepon: form.sekretarisTelepon, aktif: form.sekretarisAktif, fotoUrl: form.sekretarisFotoUrl } : undefined,
//       bendahara: form.bendaharaNama ? { nama: form.bendaharaNama, telepon: form.bendaharaTelepon, aktif: form.bendaharaAktif, fotoUrl: form.bendaharaFotoUrl } : undefined,
//     };

//     setPengurusMap(prev => ({ ...prev, [editRT.id]: updatedPengurus }));
//     setShowModal(false);
//   };

//   const getPosisiColor = (posisi: string) => {
//     switch (posisi) {
//       case "Ketua": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
//       case "Sekretaris": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
//       case "Bendahara": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
//       default: return "bg-gray-100 text-gray-700";
//     }
//   };

//   // Fetch daftar user (mirip seperti di PegawaiRWPage)
//   const fetchUsers = async () => {
//     setLoadingUsers(true);
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal mengambil daftar user");

//       setUserList(json.data || []);
//     } catch (err: any) {
//       alert(err.message || "Gagal memuat daftar user");
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   // Buka modal assign pengurus resmi
//   const openAssignModal = (rt: RT) => {
//     setAssigningRT(rt);
//     setAssignForm({
//       chairmanUserId: rt.chairmanUser?.id || "",
//       secretaryUserId: rt.secretaryUser?.id || "",
//     });
//     fetchUsers();
//     setShowAssignModal(true);
//   };

//   // Submit assign pengurus resmi ke backend
//   const handleAssignManagement = async () => {
//     if (!assigningRT) return;

//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(`${BASE_URL}/setup/rt/${assigningRT.id}/management`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           chairmanUserId: assignForm.chairmanUserId || null,
//           secretaryUserId: assignForm.secretaryUserId || null,
//         }),
//       });

//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Gagal mengupdate pengurus");

//       // Update rtList dengan data terbaru dari response
//       setRtList(prev =>
//         prev.map(rt =>
//           rt.id === assigningRT.id
//             ? {
//                 ...rt,
//                 chairmanUserId: json.data.chairmanUserId,
//                 secretaryUserId: json.data.secretaryUserId,
//                 chairmanUser: json.data.chairmanUser,
//                 secretaryUser: json.data.secretaryUser,
//               }
//             : rt
//         )
//       );

//       alert("Pengurus resmi RT berhasil diperbarui!");
//       setShowAssignModal(false);
//     } catch (err: any) {
//       alert(err.message || "Gagal menyimpan pengurus resmi");
//     }
//   };

//   return (
//     <div>
//       {/* Widget */}
//       <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3">
//         <Widget icon={<MdGroup className="h-7 w-7" />} title="Total RT" subtitle={rtList.length.toString()} />
//         <Widget icon={<MdGroup className="h-7 w-7" />} title="RT Aktif" subtitle={filteredData.filter((e: any) => e.isActive).length} />
//         <Widget icon={<MdGroup className="h-7 w-7" />} title="RT Non-Aktif" subtitle={filteredData.filter((e: any) => !e.isActive).length} />
//         {/* <Widget icon={<MdSync className="h-7 w-7" />} title="Generate RT" subtitle="Bulk Create" onClick={() => setShowBulkModal(true)} extraClass="cursor-pointer hover:bg-brand-50 dark:hover:bg-navy-700" /> */}
//       </div>

//       {/* Header */}
//       <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         {/* <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500/20 text-brand-500">
//             <MdGroup className="h-6 w-6" />
//           </div>
//           <h3 className="text-xl font-bold text-navy-700 dark:text-white">Kelola Pengurus RT</h3>
//         </div> */}
//         <div className="w-full border border-gray-300 rounded-md p-2 md:flex block items-center gap-4">
//           <button
//               onClick={() => setShowCreateModal(true)}
//               className="w-max flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
//             >
//               <MdAdd className="h-5 w-5" />
//               <p className="w-max">
//                 Tambah 1 RT
//               </p>
//           </button>
//           <button onClick={() => setShowBulkModal(true)} className="w-max flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-white hover:shadow-lg transform hover:scale-105 transition-all">
//             <MdAdd className="h-5 w-5" />
//             <p className="w-max">
//               Generate Massal RT
//             </p>
//           </button>
//           <div className="relative w-full">
//             <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input type="text" placeholder="Cari RT atau nama pengurus..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
//           </div>
//           {/* Pilih RW - Hanya untuk Superadmin */}
//           {isSuperadmin && (
//             <div>
//               {loadingRws ? (
//                 <p className="text-sm text-gray-500">Memuat daftar RW...</p>
//               ) : rws.length === 0 ? (
//                 <p className="text-sm text-red-500">Tidak ada RW tersedia.</p>
//               ) : (
//                 <select
//                   value={selectedRwId}
//                   onChange={(e) => setSelectedRwId(e.target.value)}
//                   className="w-max rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
//                 >
//                   <option value="">-- Pilih RW --</option>
//                   {rws.map((rw) => (
//                     <option key={rw.id} value={rw.id}>
//                       {rw.code} - {rw.name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               {/* {selectedRwId && (
//                 <p className="mt-2 text-sm text-green-600 dark:text-green-400">
//                   Sedang menampilkan RT untuk RW: {rws.find(r => r.id === selectedRwId)?.name || ""}
//                 </p>
//               )} */}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Search */}


//         {/* Jika RW Chairman, tampilkan info RW */}
//         {!isSuperadmin && isRwRole && profile?.rw && (
//           <div className="mt-5 mb-6">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Mengelola RT di RW: <span className="font-medium text-navy-700 dark:text-white">{profile.rw.code} - {profile.rw.name}</span>
//             </p>
//           </div>
//         )}

//       {/* Loading */}
//       {loading ? (
//         <div className="mt-10 text-center py-20">
//           <MdSync className="mx-auto h-12 w-12 animate-spin text-brand-500" />
//           <p className="mt-4 text-gray-500">Memuat data RT...</p>
//         </div>
//       ) : (

//         /* CARD GRID */
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
//           {!isSuperadmin && !rwId ? (
//             <div className="p-8 text-center text-red-500">Anda tidak memiliki akses RW.</div>
//           ):
//             <>
//               {filteredData.length === 0 ? (
//                 <div className="col-span-full text-center py-16 text-gray-500">
//                   <MdGroup className="mx-auto h-16 w-16 text-gray-300 mb-3" />
//                   <p>Belum ada RT. Klik "Generate RT" untuk membuat.</p>
//                 </div>
//               ) : (
//                 filteredData.map((rt) => {
//                   const pengurus = pengurusMap[rt.id] || {};
//                   return (
//                     <div key={rt.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-lg hover:shadow-2xl transform transition-all duration-300 cursor-pointer" onClick={() => openModal(rt)}>
//                       <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
//                       <div className="p-6">
//                         <div className="flex flex-col mb-4">
//                           <div className="w-full flex items-center justify-between border-b border-gray-300 mb-1 pb-4">
//                             <h4 className="text-xl font-bold text-navy-700 dark:text-white">{rt.name}</h4>
//                             <div className={`relative top-[-3px] text-sm ${rt.isActive ? 'bg-green-500 text-white rounded-md p-1 px-3 flex items-center justify-center' : 'bg-red-500 text-white rounded-md p-1 px-3 flex items-center justify-center'}`}>
//                               {`${rt.isActive ? 'Aktif' : 'Non-aktif'}`}
//                             </div>
//                           </div>
//                           {(isSuperadmin || isRwRole) && (
//                             <div className="w-full grid md:grid-cols-4 mt-4 items-center gap-3">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   openUpdateRTModal(rt);
//                                 }}
//                                 className="flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs font-medium bg-green-500 text-white dark:bg-navy-600 rounded-lg"
//                               >
//                                 <FaPen />
//                                 Ubah RT
//                               </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     setConfirmAction({ type: "toggle", rt });
//                                   }}
//                                   className={`flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs rounded-lg ${
//                                     rt.isActive
//                                       ? "bg-yellow-500 text-white"
//                                       : "bg-green-500 text-white"
//                                   }`}
//                                 >
//                                   <FaCheck />
//                                   {rt.isActive ? "Non-aktif" : "Aktifkan"}
//                                 </button>

//                                 {isSuperadmin && (
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setConfirmAction({ type: "delete", rt });
//                                     }}
//                                     className="flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs bg-red-500 text-white rounded-lg"
//                                   >
//                                     <FaTrash />
//                                     Hapus
//                                   </button>
//                                 )}

//                               <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     openAssignModal(rt);
//                                   }}
//                                   className="flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
//                                 >
//                                   <FaAddressCard />
//                                   Tambah
//                                 </button>
//                             </div>
//                             )}
//                         </div>

//                         <div className="space-y-4">
//                           {[
//                             { posisi: "Ketua", pegawai: pengurus.ketua },
//                             { posisi: "Sekretaris", pegawai: pengurus.sekretaris },
//                             { posisi: "Bendahara", pegawai: pengurus.bendahara },
//                           ].map(({ posisi, pegawai }) => (
//                             <div key={posisi} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-300 dark:bg-navy-700">
//                               {pegawai?.fotoUrl ? (
//                                 <img src={pegawai.fotoUrl} alt={pegawai.nama} className="h-10 w-10 rounded-full object-cover shadow-sm" />
//                               ) : (
//                                 <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-navy-600 flex items-center justify-center">
//                                   <MdGroup className="h-6 w-6 text-gray-400" />
//                                 </div>
//                               )}
//                               <div className="flex-1">
//                                 <div className="flex items-center justify-between">
//                                   {pegawai ? (
//                                     <>
//                                       <p className="font-medium text-navy-700 dark:text-white text-sm">{pegawai.nama}</p>
//                                       <div className="flex items-center gap-2">
//                                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPosisiColor(posisi)}`}>{posisi}</span>
//                                         <span className={`text-xs px-2 py-0.5 rounded-full ${pegawai.aktif ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700"}`}>
//                                           {pegawai.aktif ? "Aktif" : "Nonaktif"}
//                                         </span>
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <p className="text-sm text-gray-500 italic">Belum ada {posisi.toLowerCase()}</p>
//                                   )}
//                                 </div>
//                                 {pegawai?.telepon && <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center mt-1"><MdPhone className="h-3 w-3 mr-1" />{pegawai.telepon}</p>}
//                               </div>
//                             </div>
//                           ))}
//                           <button
//                             onClick={() => openModal(rt)}
//                             className="
//                               group relative w-full px-6 py-4 
//                               bg-gradient-to-r from-brand-500/5 via-brand-500/10 to-brand-500/5
//                               hover:from-brand-500/10 hover:via-brand-500/20 hover:to-brand-500/10
//                               dark:from-brand-500/10 dark:via-brand-500/20 dark:to-brand-500/10
//                               rounded-2xl 
//                               border border-brand-200/50 dark:border-brand-700/50
//                               backdrop-blur-sm
//                               transition-all duration-300 ease-out
//                               hover:shadow-lg hover:shadow-brand-500/20
//                               hover:border-brand-400/70
//                               active:scale-[0.98]
//                               overflow-hidden
//                             "
//                           >
//                             {/* Background glow effect */}
//                             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                               <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent blur-xl" />
//                             </div>

//                             <div className="relative flex items-center justify-between">
//                               <span className="
//                                 text-sm font-semibold 
//                                 text-brand-700 dark:text-brand-300 
//                                 group-hover:text-brand-800 dark:group-hover:text-brand-200 
//                                 transition-colors
//                               ">
//                                 Assign Pengurus RT
//                               </span>

//                               {/* Panah yang bergerak halus */}
//                               <div className="flex items-center gap-2">
//                                 <MdArrowForwardIos className="
//                                   w-4 h-4 text-brand-600 dark:text-brand-400 
//                                   translate-x-0 group-hover:translate-x-2 
//                                   transition-transform duration-300
//                                 " />
//                               </div>
//                             </div>

//                             {/* Ripple effect saat klik (opsional, tambah aja kalau suka) */}
//                             <span className="absolute inset-0 -z-10">
//                               <span className="absolute inset-0 bg-brand-400/20 scale-0 rounded-full transition-transform duration-300 active:scale-150" />
//                             </span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </>
//           }
//         </div>
//       )}

//       {confirmAction && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="absolute inset-0" onClick={() => setConfirmAction(null)} />
//           <Card extra="w-full max-w-md p-6 rounded-2xl">
//             <h3 className="text-xl font-bold mb-4">
//               {confirmAction.type === "toggle"
//                 ? confirmAction.rt.isActive
//                   ? "Nonaktifkan RT"
//                   : "Aktifkan RT"
//                 : "Hapus RT Permanen"}
//             </h3>

//             <p className="text-sm text-gray-600 mb-6">
//               {confirmAction.type === "toggle" ? (
//                 <>
//                   Apakah Anda yakin ingin{" "}
//                   <b>{confirmAction.rt.isActive ? "menonaktifkan" : "mengaktifkan"}</b>{" "}
//                   <b>{confirmAction.rt.name}</b>?
//                 </>
//               ) : (
//                 <>
//                   <b className="text-red-600">PERINGATAN!</b> RT{" "}
//                   <b>{confirmAction.rt.name}</b> akan dihapus{" "}
//                   <b>permanen</b> dan tidak bisa dikembalikan.
//                 </>
//               )}
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setConfirmAction(null)}
//                 className="px-5 py-3 rounded-xl border"
//               >
//                 Batal
//               </button>

//               <button
//                 disabled={processingRT}
//                 onClick={() =>
//                   confirmAction.type === "toggle"
//                     ? handleToggleRTActive(confirmAction.rt)
//                     : handleDeleteRTPermanent(confirmAction.rt)
//                 }
//                 className={`px-5 py-3 rounded-xl text-white ${
//                   confirmAction.type === "delete"
//                     ? "bg-red-600 hover:bg-red-700"
//                     : confirmAction.rt.isActive
//                     ? "bg-yellow-500 hover:bg-yellow-600"
//                     : "bg-green-600 hover:bg-green-700"
//                 }`}
//               >
//                 {processingRT ? "Memproses..." : "Ya, Lanjutkan"}
//               </button>
//             </div>
//           </Card>
//         </div>
//       )}


//       {showUpdateRTModal && editingRT && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="absolute inset-0" onClick={() => setShowUpdateRTModal(false)} />
//           <Card extra="w-full max-w-md p-6 rounded-2xl">
//             <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
//               Edit RT
//             </h3>

//             <div className="space-y-4">
//               <input
//                 placeholder="Kode RT"
//                 value={updateRTForm.code}
//                 onChange={(e) =>
//                   setUpdateRTForm({ ...updateRTForm, code: e.target.value })
//                 }
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />

//               <input
//                 placeholder="Nama RT"
//                 value={updateRTForm.name}
//                 onChange={(e) =>
//                   setUpdateRTForm({ ...updateRTForm, name: e.target.value })
//                 }
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />

//               <input
//                 placeholder="Alamat"
//                 value={updateRTForm.address}
//                 onChange={(e) =>
//                   setUpdateRTForm({ ...updateRTForm, address: e.target.value })
//                 }
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />

//               <input
//                 placeholder="No. Telepon"
//                 value={updateRTForm.phone}
//                 onChange={(e) =>
//                   setUpdateRTForm({ ...updateRTForm, phone: e.target.value })
//                 }
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />

//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={updateRTForm.isActive}
//                   onChange={(e) =>
//                     setUpdateRTForm({
//                       ...updateRTForm,
//                       isActive: e.target.checked,
//                     })
//                   }
//                   className="h-5 w-5 rounded text-brand-500"
//                 />
//                 <span className="text-sm font-medium">RT Aktif</span>
//               </label>
//             </div>

//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowUpdateRTModal(false)}
//                 className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-navy-600"
//               >
//                 Batal
//               </button>
//               <button
//                 onClick={handleUpdateRT}
//                 disabled={updatingRT}
//                 className="px-5 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-70"
//               >
//                 {updatingRT ? "Menyimpan..." : "Simpan Perubahan"}
//               </button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Modal Edit Pengurus */}
//       {showModal && editRT && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4 overflow-y-auto">
//           <div className="absolute inset-0" onClick={() => setShowModal(false)} />
//           <Card extra="w-full max-w-[80vw] p-6 rounded-2xl">
//             <h3 className="mb-6 text-2xl font-bold text-navy-700 dark:text-white">Pengurus {editRT.name}</h3>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {(["Ketua", "Sekretaris", "Bendahara"] as const).map((posisi) => {
//                 const key = posisi.toLowerCase() as "ketua" | "sekretaris" | "bendahara";
//                 const isResmi = posisi === "Ketua" || posisi === "Sekretaris"; // hanya ketua & sekretaris bisa assign resmi

//                 return (
//                   <div key={posisi} className="p-5 border border-gray-200 dark:border-navy-600 rounded-xl">
//                     <h4 className="font-bold mb-4 flex items-center justify-between">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPosisiColor(posisi)}`}>
//                         {posisi}
//                       </span>
//                       {isResmi && (
//                         <span className="text-xs text-brand-600 font-medium">Bisa di-assign resmi</span>
//                       )}
//                     </h4>

//                     {/* Dropdown User - Hanya untuk Ketua & Sekretaris */}
//                     {isResmi && (
//                       <div className="mb-4">
//                         <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                           Pilih dari User Sistem
//                         </label>
//                         <select
//                           onChange={(e) => handleSelectUser(key, e.target.value)}
//                           className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
//                           value={userList.find(u => u.fullName === form[`${key}Nama`] && u.phone === form[`${key}Telepon`])?.id || ""}
//                         >
//                           <option value="">-- Pilih User (Opsional) --</option>
//                           {rtUsersByRole.chairman.length === 0 && (
//                             <p className="text-xs text-red-500 mt-1">
//                               Tidak ada user dengan role Ketua RT
//                             </p>
//                           )}

//                           {rtUsersByRole.secretary.length === 0 && (
//                             <p className="text-xs text-red-500 mt-1">
//                               Tidak ada user dengan role Sekretaris RT
//                             </p>
//                           )}

//                           {key === "ketua" &&
//                             rtUsersByRole.chairman.map((user) => (
//                               <option key={user.id} value={user.id}>
//                                 {user.fullName} ({user.rw.name || user.email || "tanpa kontak"})
//                               </option>
//                           ))}
//                           {key === "sekretaris" &&
//                             rtUsersByRole.secretary.map((user) => (
//                               <option key={user.id} value={user.id}>
//                                 {user.fullName} ({user.rw.name || user.email || "tanpa kontak"})
//                               </option>
//                           ))}
//                         </select>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Memilih user akan otomatis isi nama & telepon. Foto tetap bisa diupload manual.
//                         </p>
//                       </div>
//                     )}

//                     {/* Upload Foto */}
//                     <div className="mb-4">
//                       <div
//                         className="border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-xl p-6 text-center cursor-pointer hover:border-brand-500 transition-colors"
//                         onClick={() => document.getElementById(`${key}FotoInput`)?.click()}
//                       >
//                         {form[`${key}FotoUrl`] ? (
//                           <div>
//                             <img src={form[`${key}FotoUrl`]} alt={posisi} className="mx-auto h-28 w-28 rounded-full object-cover shadow-lg" />
//                             <button onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, [`${key}FotoUrl`]: null, [`${key}Foto`]: null })); }} className="mt-2 text-red-600 text-sm">Hapus</button>
//                           </div>
//                         ) : (
//                           <div className="text-gray-500">
//                             <MdUpload className="mx-auto h-12 w-12 mb-2" />
//                             <p className="text-sm">Upload foto</p>
//                           </div>
//                         )}
//                         <input id={`${key}FotoInput`} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileChange(key, e.target.files[0])} />
//                       </div>
//                     </div>

//                     {/* Nama & Telepon */}
//                     <input
//                       placeholder="Nama Lengkap"
//                       value={form[`${key}Nama`]}
//                       onChange={(e) => setForm({ ...form, [`${key}Nama`]: e.target.value })}
//                       className="w-full mb-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//                     />
//                     <input
//                       placeholder="No. Telepon"
//                       value={form[`${key}Telepon`]}
//                       onChange={(e) => setForm({ ...form, [`${key}Telepon`]: e.target.value })}
//                       className="w-full mb-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//                     />

//                     <label className="flex items-center gap-3 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={form[`${key}Aktif`]}
//                         onChange={(e) => setForm({ ...form, [`${key}Aktif`]: e.target.checked })}
//                         className="h-5 w-5 rounded text-brand-500"
//                       />
//                       <span className="text-sm font-medium">Aktif sebagai pengurus</span>
//                     </label>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="mt-8 flex justify-end gap-4">
//               <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-navy-600">Batal</button>
//               <button onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg">Simpan Pengurus</button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {showCreateModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4">
//           <div className="absolute inset-0" onClick={() => setShowCreateModal(false)} />
//           <Card extra="w-full max-w-md p-6 rounded-2xl">
//             <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
//               Tambah RT Baru
//             </h3>

//             <div className="space-y-4">
//               <input
//                 placeholder="Kode RT (contoh: 001)"
//                 value={createForm.code}
//                 onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />

//               <input
//                 placeholder="Nama RT (contoh: RT 001)"
//                 value={createForm.name}
//                 onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />

//               <input
//                 placeholder="Alamat (opsional)"
//                 value={createForm.address}
//                 onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />

//               <input
//                 placeholder="No. Telepon (opsional)"
//                 value={createForm.phone}
//                 onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
//               />
//             </div>

//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowCreateModal(false)}
//                 className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-navy-600"
//               >
//                 Batal
//               </button>
//               <button
//                 onClick={handleCreateRTSingle}
//                 disabled={creating}
//                 className="px-5 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-70"
//               >
//                 {creating ? "Menyimpan..." : "Simpan RT"}
//               </button>
//             </div>
//           </Card>
//         </div>
//       )}


//       {/* Modal Assign Pengurus Resmi (Ketua & Sekretaris dari sistem) */}
//       {showAssignModal && assigningRT && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4 overflow-y-auto">
//           <div className="absolute inset-0" onClick={() => setShowAssignModal(false)} />
//           <Card extra="w-full max-w-2xl p-6 rounded-2xl">
//             <h3 className="mb-6 text-2xl font-bold text-navy-700 dark:text-white">
//               Assign Pengurus Resmi - {assigningRT.name}
//             </h3>

//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
//               Pilih user dari sistem untuk dijadikan Ketua atau Sekretaris RT. Bendahara hanya disimpan di lokal (tidak tersinkron ke backend).
//             </p>

//             {loadingUsers ? (
//               <div className="text-center py-8 text-gray-500">Memuat daftar user...</div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-navy-700 dark:text-white">
//                     Ketua RT (Resmi)
//                   </label>
//                   <select
//                     value={assignForm.chairmanUserId}
//                     onChange={(e) => setAssignForm(prev => ({ ...prev, chairmanUserId: e.target.value }))}
//                     className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
//                   >
//                     <option value="">-- Kosongkan / Tidak ada --</option>
//                     {userList.map((user) => (
//                       <option key={user.id} value={user.id}>
//                         {user.fullName} ({user.phone || user.email || "tanpa kontak"})
//                       </option>
//                     ))}
//                   </select>
//                   {assignForm.chairmanUserId && userList.find(u => u.id === assignForm.chairmanUserId) && (
//                     <p className="mt-2 text-xs text-green-600">
//                       Saat ini: {userList.find(u => u.id === assignForm.chairmanUserId)?.fullName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-navy-700 dark:text-white">
//                     Sekretaris RT (Resmi)
//                   </label>
//                   <select
//                     value={assignForm.secretaryUserId}
//                     onChange={(e) => setAssignForm(prev => ({ ...prev, secretaryUserId: e.target.value }))}
//                     className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
//                   >
//                     <option value="">-- Kosongkan / Tidak ada --</option>
//                     {userList.map((user) => (
//                       <option key={user.id} value={user.id}>
//                         {user.fullName} ({user.phone || user.email || "tanpa kontak"})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 onClick={() => setShowAssignModal(false)}
//                 className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-navy-600"
//               >
//                 Batal
//               </button>
//               <button
//                 onClick={handleAssignManagement}
//                 disabled={loadingUsers}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg disabled:opacity-70"
//               >
//                 Simpan Pengurus Resmi
//               </button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Modal Bulk Generate RT */}
//       {showBulkModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm">
//           <div className="absolute inset-0" onClick={() => setShowBulkModal(false)} />
//           <Card extra="w-full max-w-md p-6">
//             <h3 className="text-xl font-bold mb-4">Generate RT Secara Massal</h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Masukkan jumlah RT yang ingin dibuat (misal: 6 akan membuat RT 001 sampai RT 006)</p>
//             <input
//               type="number"
//               min="1"
//               max="50"
//               value={bulkTotal}
//               onChange={(e) => setBulkTotal(parseInt(e.target.value) || 1)}
//               className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-medium text-center focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
//             />
//             <div className="mt-6 flex justify-end gap-3">
//               <button onClick={() => setShowBulkModal(false)} className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-navy-600">Batal</button>
//               <button onClick={handleBulkCreate} disabled={loadingBulk} className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white disabled:opacity-70">
//                 {loadingBulk ? "Membuat..." : "Buat RT"}
//               </button>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PegawaiRTPage;


// src/views/rt/PegawaiRTPage.tsx

import Card from "components/card";
import Widget from "components/widget/Widget";
import React, { useEffect, useMemo, useState } from "react";
import { FaAddressCard, FaCheck, FaPen, FaTrash } from "react-icons/fa";
import { MdAdd, MdArrowForwardIos, MdGroup, MdPhone, MdSearch, MdSync } from "react-icons/md";
import { useProfile } from "utils/useProfile";

const BASE_URL = "https://nitip-api.diwanmotor.com/api/v1";

type RT = {
  id: string;
  code: string;
  name: string;
  rwId: string;
  isActive: boolean;
  chairmanUserId: string | null;
  secretaryUserId: string | null;
  chairmanUser: {
    id: string;
    fullName: string;
    phone: string | null;
    photoUrl?: string | null;
  } | null;
  secretaryUser: {
    id: string;
    fullName: string;
    phone: string | null;
    photoUrl?: string | null;
  } | null;
  userCount: number;
};

type FullUser = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string;
  photoUrl: string | null;
  rw: { id: string; code: string; name: string } | null;
};

const PegawaiRTPage: React.FC = () => {
  const { profile } = useProfile();
  const [rtList, setRtList] = useState<RT[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Assign Pengurus Resmi (satu-satunya cara assign)
  const [userList, setUserList] = useState<FullUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningRT, setAssigningRT] = useState<RT | null>(null);
  const [assignForm, setAssignForm] = useState({
    chairmanUserId: "",
    secretaryUserId: "",
  });

  // Action confirmation
  const [processingRT, setProcessingRT] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | {
    type: "toggle" | "delete";
    rt: RT;
  }>(null);

  // Create RT Single
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
  });

  // Bulk Create RT
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkTotal, setBulkTotal] = useState(6);
  const [loadingBulk, setLoadingBulk] = useState(false);

  // Update RT
  const [showUpdateRTModal, setShowUpdateRTModal] = useState(false);
  const [updatingRT, setUpdatingRT] = useState(false);
  const [editingRT, setEditingRT] = useState<RT | null>(null);
  const [updateRTForm, setUpdateRTForm] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
    isActive: true,
  });

  // RW selection for Superadmin
  const [rws, setRws] = useState<any[]>([]);
  const [selectedRwId, setSelectedRwId] = useState<string>("");
  const [loadingRws, setLoadingRws] = useState(false);

  const rwId = profile?.rw?.id;
  const isSuperadmin = profile?.role === "SUPERADMIN";
  const isRwRole = profile?.role === "RW_CHAIRMAN" || profile?.role === "RW_SECRETARY";
  const effectiveRwId = isSuperadmin ? selectedRwId : profile?.rw?.id;

  // Fetch RWs (Superadmin only)
  const fetchRws = async () => {
    if (!isSuperadmin) return;
    try {
      setLoadingRws(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const villageId = profile?.village?.id;
      if (!villageId) throw new Error("Village ID tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rw/${villageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mengambil daftar RW");

      setRws(json.data || []);
      if (json.data.length > 0 && !selectedRwId) {
        setSelectedRwId(json.data[0].id);
      }
    } catch (err: any) {
      alert(err.message || "Gagal memuat daftar RW");
    } finally {
      setLoadingRws(false);
    }
  };

  useEffect(() => {
    if (isSuperadmin && profile?.village?.id) fetchRws();
  }, [isSuperadmin, profile?.village?.id]);

  // Fetch RTs
  const fetchRTs = async () => {
    if (!effectiveRwId) {
      setRtList([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rt/${effectiveRwId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mengambil data RT");

      setRtList(json.data.map((rt: any) => ({
        id: rt.id,
        code: rt.code,
        name: rt.name,
        rwId: rt.rwId,
        isActive: rt.isActive,
        chairmanUserId: rt.chairmanUserId,
        secretaryUserId: rt.secretaryUserId,
        chairmanUser: rt.chairmanUser,
        secretaryUser: rt.secretaryUser,
        userCount: rt._count?.users || 0,
      })));
    } catch (err: any) {
      alert(err.message || "Gagal memuat data RT");
      setRtList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveRwId) fetchRTs();
  }, [effectiveRwId]);

  // Fetch Users for Assign
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mengambil daftar user");

      setUserList(json.data || []);
    } catch (err: any) {
      alert(err.message || "Gagal memuat daftar user");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Open Assign Modal
  const openAssignModal = (rt: RT) => {
    setAssigningRT(rt);
    setAssignForm({
      chairmanUserId: rt.chairmanUser?.id || "",
      secretaryUserId: rt.secretaryUser?.id || "",
    });
    fetchUsers();
    setShowAssignModal(true);
  };

  // Submit Assign Pengurus Resmi
  const handleAssignManagement = async () => {
    if (!assigningRT) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rt/${assigningRT.id}/management`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chairmanUserId: assignForm.chairmanUserId || null,
          secretaryUserId: assignForm.secretaryUserId || null,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mengupdate pengurus");

      setRtList(prev =>
        prev.map(rt =>
          rt.id === assigningRT.id
            ? {
                ...rt,
                chairmanUserId: json.data.chairmanUserId,
                secretaryUserId: json.data.secretaryUserId,
                chairmanUser: json.data.chairmanUser,
                secretaryUser: json.data.secretaryUser,
              }
            : rt
        )
      );

      alert("Pengurus resmi RT berhasil diperbarui!");
      setShowAssignModal(false);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan pengurus resmi");
    }
  };

  const filteredData = useMemo(() => {
    return rtList.filter((rt) => {
      const searchLower = search.toLowerCase();
      return (
        rt.name.toLowerCase().includes(searchLower) ||
        rt.code.includes(searchLower) ||
        rt.chairmanUser?.fullName.toLowerCase().includes(searchLower) ||
        rt.secretaryUser?.fullName.toLowerCase().includes(searchLower)
      );
    });
  }, [rtList, search]);

  const getPosisiColor = (posisi: string) => {
    switch (posisi) {
      case "Ketua": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Sekretaris": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Fungsi toggle, delete, update, create, bulk (sama seperti kode asli)
  const handleToggleRTActive = async (rt: RT) => {
    try {
      setProcessingRT(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rt/${rt.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal update status RT");

      alert(json.data?.message || "Status RT diperbarui");
      fetchRTs();
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status RT");
    } finally {
      setProcessingRT(false);
      setConfirmAction(null);
    }
  };

  const handleDeleteRTPermanent = async (rt: RT) => {
    try {
      setProcessingRT(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rt/${rt.id}/permanent`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal menghapus RT");

      alert(json.data?.message || "RT berhasil dihapus permanen");
      fetchRTs();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus RT permanen");
    } finally {
      setProcessingRT(false);
      setConfirmAction(null);
    }
  };

  const openUpdateRTModal = (rt: RT) => {
    setEditingRT(rt);
    setUpdateRTForm({
      code: rt.code,
      name: rt.name,
      address: (rt as any).address || "",
      phone: (rt as any).phone || "",
      isActive: rt.isActive,
    });
    setShowUpdateRTModal(true);
  };

  const handleUpdateRT = async () => {
    if (!editingRT) return;

    if (!updateRTForm.code || !updateRTForm.name) {
      return alert("Code dan Nama RT wajib diisi");
    }

    try {
      setUpdatingRT(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rt/detail/${editingRT.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: updateRTForm.code,
          name: updateRTForm.name,
          address: updateRTForm.address || null,
          phone: updateRTForm.phone || null,
          isActive: updateRTForm.isActive,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mengupdate RT");

      alert("RT berhasil diperbarui");
      fetchRTs();
      setShowUpdateRTModal(false);
      setEditingRT(null);
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui RT");
    } finally {
      setUpdatingRT(false);
    }
  };

  const handleCreateRTSingle = async () => {
    if (!effectiveRwId) return alert("RW belum dipilih");

    if (!createForm.code || !createForm.name) {
      return alert("Code dan Nama RT wajib diisi");
    }

    try {
      setCreating(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rt/${effectiveRwId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: createForm.code,
          name: createForm.name,
          address: createForm.address || null,
          phone: createForm.phone || null,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal membuat RT");

      alert("RT berhasil dibuat");
      fetchRTs();
      setCreateForm({ code: "", name: "", address: "", phone: "" });
      setShowCreateModal(false);
    } catch (err: any) {
      alert(err.message || "Gagal membuat RT");
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!effectiveRwId) return alert("Pilih RW terlebih dahulu");
    if (bulkTotal < 1 || bulkTotal > 50) return alert("Jumlah RT harus antara 1-50");

    try {
      setLoadingBulk(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`${BASE_URL}/setup/rw/${effectiveRwId}/rt/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ totalRT: bulkTotal }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal membuat RT");

      alert(`Berhasil membuat ${json.data.length} RT!`);
      setShowBulkModal(false);
      fetchRTs();
    } catch (err: any) {
      alert(err.message || "Gagal membuat RT");
    } finally {
      setLoadingBulk(false);
    }
  };

  return (
    <div>
      {/* Widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3">
        <Widget icon={<MdGroup className="h-7 w-7" />} title="Total RT" subtitle={rtList.length.toString()} />
        <Widget icon={<MdGroup className="h-7 w-7" />} title="RT Aktif" subtitle={filteredData.filter((e: any) => e.isActive).length} />
        <Widget icon={<MdGroup className="h-7 w-7" />} title="RT Non-Aktif" subtitle={filteredData.filter((e: any) => !e.isActive).length} />
      </div>

      {/* Header */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full border border-gray-300 rounded-md p-2 md:flex block items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-max flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            <MdAdd className="h-5 w-5" />
            <p className="w-max">Tambah 1 RT</p>
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="w-max flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-white hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <MdAdd className="h-5 w-5" />
            <p className="w-max">Generate Massal RT</p>
          </button>
          <div className="relative w-full">
            <MdSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari RT atau nama pengurus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            />
          </div>
          {isSuperadmin && (
            <div>
              {loadingRws ? (
                <p className="text-sm text-gray-500">Memuat daftar RW...</p>
              ) : rws.length === 0 ? (
                <p className="text-sm text-red-500">Tidak ada RW tersedia.</p>
              ) : (
                <select
                  value={selectedRwId}
                    onChange={(e) => setSelectedRwId(e.target.value)}
                  className="w-max rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
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
        </div>
      </div>

      {/* Info RW */}
      {!isSuperadmin && isRwRole && profile?.rw && (
        <div className="mt-5 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mengelola RT di RW: <span className="font-medium text-navy-700 dark:text-white">{profile.rw.code} - {profile.rw.name}</span>
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="mt-10 text-center py-20">
          <MdSync className="mx-auto h-12 w-12 animate-spin text-brand-500" />
          <p className="mt-4 text-gray-500">Memuat data RT...</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredData.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              <MdGroup className="mx-auto h-16 w-16 text-gray-300 mb-3" />
              <p>Belum ada RT. Klik "Generate RT" untuk membuat.</p>
            </div>
          ) : (
            filteredData.map((rt) => (
              <div key={rt.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-lg hover:shadow-2xl transform transition-all duration-300 cursor-pointer">
                <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
                <div className="p-6">
                  <div className="flex flex-col mb-4">
                    <div className="w-full flex items-center justify-between border-b border-gray-300 mb-1 pb-4">
                      <h4 className="text-xl font-bold text-navy-700 dark:text-white">{rt.name}</h4>
                      <div className={`relative top-[-3px] text-sm ${rt.isActive ? 'bg-green-500 text-white rounded-md p-1 px-3 flex items-center justify-center' : 'bg-red-500 text-white rounded-md p-1 px-3 flex items-center justify-center'}`}>
                        {`${rt.isActive ? 'Aktif' : 'Non-aktif'}`}
                      </div>
                    </div>
                    {(isSuperadmin || isRwRole) && (
                      <div className="w-full grid md:grid-cols-4 mt-4 items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpdateRTModal(rt);
                          }}
                          className="flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs font-medium bg-green-500 text-white dark:bg-navy-600 rounded-lg"
                        >
                          <FaPen />
                          Ubah RT
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmAction({ type: "toggle", rt });
                          }}
                          className={`flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs rounded-lg ${
                            rt.isActive
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          <FaCheck />
                          {rt.isActive ? "Non-aktif" : "Aktifkan"}
                        </button>

                        {isSuperadmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmAction({ type: "delete", rt });
                            }}
                            className="flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs bg-red-500 text-white rounded-lg"
                          >
                            <FaTrash />
                            Hapus
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssignModal(rt);
                          }}
                          className="flex items-center justify-center gap-2 hover:brightness-[90%] px-3 py-2.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
                        >
                          <FaAddressCard />
                          Tambah
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {[
                      { posisi: "Ketua", pegawai: rt.chairmanUser ? { nama: rt.chairmanUser.fullName, telepon: rt.chairmanUser.phone, fotoUrl: rt.chairmanUser.photoUrl, aktif: true } : null },
                      { posisi: "Sekretaris", pegawai: rt.secretaryUser ? { nama: rt.secretaryUser.fullName, telepon: rt.secretaryUser.phone, fotoUrl: rt.secretaryUser.photoUrl, aktif: true } : null },
                    ].map(({ posisi, pegawai }) => (
                      <div key={posisi} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-300 dark:bg-navy-700">
                        {pegawai?.fotoUrl ? (
                          <img src={pegawai.fotoUrl} alt={pegawai.nama} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-navy-600 flex items-center justify-center">
                            <MdGroup className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            {pegawai ? (
                              <>
                                <p className="font-medium text-navy-700 dark:text-white text-sm">{pegawai.nama}</p>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPosisiColor(posisi)}`}>{posisi}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${pegawai.aktif ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700"}`}>
                                    {pegawai.aktif ? "Aktif" : "Nonaktif"}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 italic">Belum ada {posisi.toLowerCase()}</p>
                            )}
                          </div>
                          {pegawai?.telepon && <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center mt-1"><MdPhone className="h-3 w-3 mr-1" />{pegawai.telepon}</p>}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAssignModal(rt);
                      }}
                      className="
                        group relative w-full px-6 py-4 
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
                          Assign Pengurus RT
                        </span>

                        <div className="flex items-center gap-2">
                          <MdArrowForwardIos className="
                            w-4 h-4 text-brand-600 dark:text-brand-400 
                            translate-x-0 group-hover:translate-x-2 
                            transition-transform duration-300
                          " />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setConfirmAction(null)} />
          <Card extra="w-full max-w-md p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">
              {confirmAction.type === "toggle"
                ? confirmAction.rt.isActive
                  ? "Nonaktifkan RT"
                  : "Aktifkan RT"
                : "Hapus RT Permanen"}
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              {confirmAction.type === "toggle" ? (
                <>
                  Apakah Anda yakin ingin{" "}
                  <b>{confirmAction.rt.isActive ? "menonaktifkan" : "mengaktifkan"}</b>{" "}
                  <b>{confirmAction.rt.name}</b>?
                </>
              ) : (
                <>
                  <b className="text-red-600">PERINGATAN!</b> RT{" "}
                  <b>{confirmAction.rt.name}</b> akan dihapus{" "}
                  <b>permanen</b> dan tidak bisa dikembalikan.
                </>
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-5 py-3 rounded-xl border"
              >
                Batal
              </button>

              <button
                disabled={processingRT}
                onClick={() =>
                  confirmAction.type === "toggle"
                    ? handleToggleRTActive(confirmAction.rt)
                    : handleDeleteRTPermanent(confirmAction.rt)
                }
                className={`px-5 py-3 rounded-xl text-white ${
                  confirmAction.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.rt.isActive
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {processingRT ? "Memproses..." : "Ya, Lanjutkan"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Update RT */}
      {showUpdateRTModal && editingRT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowUpdateRTModal(false)} />
          <Card extra="w-full max-w-md p-6 rounded-2xl">
            <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
              Edit RT
            </h3>

            <div className="space-y-4">
              <input
                placeholder="Kode RT"
                value={updateRTForm.code}
                onChange={(e) => setUpdateRTForm({ ...updateRTForm, code: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />

              <input
                placeholder="Nama RT"
                value={updateRTForm.name}
                onChange={(e) => setUpdateRTForm({ ...updateRTForm, name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />

              <input
                placeholder="Alamat"
                value={updateRTForm.address}
                onChange={(e) => setUpdateRTForm({ ...updateRTForm, address: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />

              <input
                placeholder="No. Telepon"
                value={updateRTForm.phone}
                onChange={(e) => setUpdateRTForm({ ...updateRTForm, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updateRTForm.isActive}
                  onChange={(e) => setUpdateRTForm({ ...updateRTForm, isActive: e.target.checked })}
                  className="h-5 w-5 rounded text-brand-500"
                />
                <span className="text-sm font-medium">RT Aktif</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUpdateRTModal(false)}
                className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-navy-600"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateRT}
                disabled={updatingRT}
                className="px-5 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-70"
              >
                {updatingRT ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Create Single RT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowCreateModal(false)} />
          <Card extra="w-full max-w-md p-6 rounded-2xl">
            <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
              Tambah RT Baru
            </h3>

            <div className="space-y-4">
              <input
                placeholder="Kode RT (contoh: 001)"
                value={createForm.code}
                onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />

              <input
                placeholder="Nama RT (contoh: RT 001)"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />

              <input
                placeholder="Alamat (opsional)"
                value={createForm.address}
                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />

              <input
                placeholder="No. Telepon (opsional)"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm dark:bg-navy-700 dark:border-navy-600"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-navy-600"
              >
                Batal
              </button>
              <button
                onClick={handleCreateRTSingle}
                disabled={creating}
                className="px-5 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-70"
              >
                {creating ? "Menyimpan..." : "Simpan RT"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Bulk Generate RT */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowBulkModal(false)} />
          <Card extra="w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Generate RT Secara Massal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Masukkan jumlah RT yang ingin dibuat (misal: 6 akan membuat RT 001 sampai RT 006)</p>
            <input
              type="number"
              min="1"
              max="50"
              value={bulkTotal}
              onChange={(e) => setBulkTotal(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-medium text-center focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowBulkModal(false)} className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-navy-600">Batal</button>
              <button onClick={handleBulkCreate} disabled={loadingBulk} className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white disabled:opacity-70">
                {loadingBulk ? "Membuat..." : "Buat RT"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Assign Pengurus Resmi */}
      {showAssignModal && assigningRT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm p-4 overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setShowAssignModal(false)} />
          <Card extra="w-full max-w-2xl p-6 rounded-2xl">
            <h3 className="mb-6 text-2xl font-bold text-navy-700 dark:text-white">
              Assign Pengurus Resmi - {assigningRT.name}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Pilih user dari sistem untuk dijadikan Ketua atau Sekretaris RT.
            </p>

            {loadingUsers ? (
              <div className="text-center py-8 text-gray-500">Memuat daftar user...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-navy-700 dark:text-white">
                    Ketua RT (Resmi)
                  </label>
                  <select
                    value={assignForm.chairmanUserId}
                    onChange={(e) => setAssignForm(prev => ({ ...prev, chairmanUserId: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
                  >
                    <option value="">-- Kosongkan / Tidak ada --</option>
                    {userList
                      .filter(u => u.role === "RT_CHAIRMAN")
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullName} ({user.phone || user.email || "tanpa kontak"})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-navy-700 dark:text-white">
                    Sekretaris RT (Resmi)
                  </label>
                  <select
                    value={assignForm.secretaryUserId}
                    onChange={(e) => setAssignForm(prev => ({ ...prev, secretaryUserId: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600"
                  >
                    <option value="">-- Kosongkan / Tidak ada --</option>
                    {userList
                      .filter(u => u.role === "RT_SECRETARY")
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullName} ({user.phone || user.email || "tanpa kontak"})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-navy-600"
              >
                Batal
              </button>
              <button
                onClick={handleAssignManagement}
                disabled={loadingUsers}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg disabled:opacity-70"
              >
                Simpan Pengurus Resmi
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PegawaiRTPage;