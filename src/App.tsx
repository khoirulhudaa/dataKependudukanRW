import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import SetupModal from "components/setup";
import AdminLayout from "layouts/admin";
import EditAnggota from "views/admin/editAnggota";
import SignIn from "views/auth/SignIn";

const App = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  // Helper: cek apakah user sudah login dari localStorage
  const isLoggedIn = () => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    return !!user && !!accessToken;
  };

  useEffect(() => {
    const checkInitialization = async () => {
      try {
        const response = await axios.get(
          "https://nitip-api.diwanmotor.com/api/v1/setup/check"
        );

        console.log(response);

        // Jika status 200 DAN sistem sudah diinisialisasi
        if (response.status === 200 && response?.data?.data?.isInitialized) {
          setIsInitialized(true);
          setShowSetup(false); // Pastikan modal tidak muncul
        } else {
          setIsInitialized(false);
          setShowSetup(true);
        }
      } catch (error: any) {
        console.log("Gagal cek inisialisasi → tampilkan setup:", error);
        setIsInitialized(false);
        setShowSetup(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkInitialization();
  }, []);

  const handleSetupSuccess = () => {
    setShowSetup(false);
    setIsInitialized(true);
    // Setelah setup selesai, langsung ke login (karena belum ada token)
    window.location.href = "/auth/sign-in";
  };

  // Loading saat cek backend
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-medium">Memeriksa status sistem...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hanya tampilkan SetupModal jika BELUM initialized */}
      {showSetup && <SetupModal onSuccess={handleSetupSuccess} />}

      {/* Routing utama - ini yang mengatur redirect berdasarkan status */}
      <Routes>
        <Route path="auth/*" element={<SignIn />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/anggota/:id" element={<EditAnggota />} />

        {/* Root path: logika redirect utama */}
        <Route
          path="/"
          element={
            isInitialized ? (
              // Sistem sudah siap → cek status login
              !showSetup ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/auth/sign-in" replace />
              )
            ) : (
              // Belum initialized → kosong (modal setup sudah ditampilkan di atas)
              <div className="h-screen bg-gray-50" />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;