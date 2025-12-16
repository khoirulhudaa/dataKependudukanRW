import React, { useEffect, useState } from "react";

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
}

interface RW {
  id: string;
  code: string;
  name: string;
}

interface YouthOrg {
  id: string;
  name: string;
  rwId: string;
  chairmanUserId: string | null;
  secretaryUserId: string | null;
  treasurerUserId: string | null;
  chairmanUser: User | null;
  secretaryUser: User | null;
  treasurerUser: User | null;
  isActive: boolean;
  _count: { users: number };
  rw: RW;
}

interface Profile {
  role: string;
  rw?: RW;
}

const BASE_URL = "https://nitip-api.diwanmotor.com/api/v1";

export default function KarangTarunaPage() {
  const [profile, setProfile] = useState<Profile>({
    role: "RW_CHAIRMAN",
    rw: { id: "f813f3d4-49a7-4f05-9028-eca4f8709957", code: "017", name: "RW 017" },
  });

  const [rws, setRws] = useState<RW[]>([]);
  const [selectedRw, setSelectedRw] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [youthOrgs, setYouthOrgs] = useState<YouthOrg[]>([]);
  const [search, setSearch] = useState<string>("");
  const token = localStorage.getItem("accessToken");
    const [rwDetail, setRwDetail] = useState<RW & { youthOrgs: YouthOrg[] } | null>(null);

  const isSuperAdmin = profile.role === "SUPERADMIN";
  const rwId = isSuperAdmin ? selectedRw : profile.rw?.id;
  console.log('rwId:', rwId)

  /** Fetch RW list (SUPERADMIN only) */
  const fetchRws = async () => {
    if (!token) return;
    const res = await fetch(`${BASE_URL}/rws`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    if (json.success) setRws(json.data);
  };

  const fetchRwById = async (rwIdParam: string) => {
    if (!token || !rwIdParam) return;
    const res = await fetch(`${BASE_URL}/setup/rw/detail/${rwIdParam}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    console.log('detail rw', json)
    if (json.success) {
      // data.rwDetail
      setRwDetail(json.data);
      // set youthOrgs langsung
      setYouthOrgs(json.data.youthOrgs.map((org: any) => ({
        ...org,
        rw: { id: json.data.id, code: json.data.code, name: json.data.name },
        chairmanUserId: json.data.chairmanUserId,
        secretaryUserId: json.data.secretaryUserId,
        treasurerUserId: json.data.treasurerUserId,
        chairmanUser: json.data.chairmanUser,
        secretaryUser: json.data.secretaryUser,
        treasurerUser: json.data.treasurerUser,
        _count: json.data._count,
      })));
    }
  };

  useEffect(() => {
    if (rwId) fetchRwById(rwId);
  }, [rwId]);

  /** Fetch youth org by RW */
  const fetchYouthOrgs = async (rwIdParam: string) => {
    console.log('rwIdParam', rwIdParam)
    if (!token || !rwIdParam) return;
    const res = await fetch(`${BASE_URL}/setup/youth-org/rw/${rwIdParam}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    console.log('json', json)

    if (json.success) setYouthOrgs(Array.isArray(json.data) ? json.data : [json.data]);
  };

  /** Fetch all users for management dropdown */
  const fetchUsers = async () => {
    if (!token) return;
    const res = await fetch(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    if (json.success) setUsers(json.data);
  };

  /** Update management (chairman/secretary/treasurer) */
  const updateManagement = async (
    youthOrgId: string,
    data: { chairmanUserId?: string; secretaryUserId?: string; treasurerUserId?: string }
  ) => {
    if (!token) return;
    const res = await fetch(`${BASE_URL}/setup/youth-org/${youthOrgId}/management`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) fetchYouthOrgs(rwId!);
  };

  // Init
  useEffect(() => {
    if (isSuperAdmin) fetchRws();
    fetchUsers();
  }, []);

  // Fetch youth org when RW changes
  useEffect(() => {
    if (rwId) fetchYouthOrgs(rwId);
  }, [rwId]);

  // Filter youth org by search
  const filteredYouthOrgs = youthOrgs.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Karang Taruna</h1>

      {/* RW select */}
      {isSuperAdmin && (
        <select
          className="border rounded-xl px-4 py-2 mb-4"
          value={selectedRw}
          onChange={(e) => setSelectedRw(e.target.value)}
        >
          <option value="">-- Pilih RW --</option>
          {rws.map((rw) => (
            <option key={rw.id} value={rw.id}>
              {rw.name}
            </option>
          ))}
        </select>
      )}

      {/* Search widget */}
      <input
        type="text"
        placeholder="Cari Karang Taruna..."
        className="border rounded-xl px-4 py-2 mb-6 w-full md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Youth Org cards */}
      {filteredYouthOrgs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredYouthOrgs.map((org) => (
            <div key={org.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
              <h2 className="font-semibold text-lg mb-2">{org.name}</h2>
              <p className="text-sm text-gray-500 mb-4">RW: {org.rw.name}</p>

              <div className="mb-2">
                <label className="block text-sm font-medium">Ketua</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={org.chairmanUserId || ""}
                  onChange={(e) => updateManagement(org.id, { chairmanUserId: e.target.value })}
                >
                  <option value="">-- Pilih Ketua --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Sekretaris</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={org.secretaryUserId || ""}
                  onChange={(e) => updateManagement(org.id, { secretaryUserId: e.target.value })}
                >
                  <option value="">-- Pilih Sekretaris --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Bendahara</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={org.treasurerUserId || ""}
                  onChange={(e) => updateManagement(org.id, { treasurerUserId: e.target.value })}
                >
                  <option value="">-- Pilih Bendahara --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">Data belum ada</p>
      )}
    </div>
  );
}
