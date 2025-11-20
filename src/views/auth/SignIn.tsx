// import authImg from "assets/img/auth/auth.jpg";
// import Checkbox from "components/checkbox";
// import InputField from "components/fields/InputField";
// import { Link } from "react-router-dom";

// export default function SignIn() {
//   return (
//     <div className="relative grid grid-cols-1 md:grid-cols-2 h-max overflow-auto md:h-[100vh] overflow-hidden w-full items-center justify-center lg:items-center lg:justify-start bg-gray-100">
//       {/* Sign in section */}
//       <div className="md:flex items-center justify-center py-2 md:py-10 overflow-hidden h-max md:h-full px-2 md:px-14 z-[333]">
//         <div className="h-max relative bg-white h-full p-3 md:p-10 shadow-lg border border-black/30 rounded-lg w-full md:max-w-full flex-col items-center">
//           <Link to="/admin" className="mt-0 w-max lg:pt-10">
//             <div className="mx-auto flex h-fit mb-6 w-screen items-center hover:cursor-pointer">
//               <svg
//                 width="8"
//                 height="12"
//                 viewBox="0 0 8 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z"
//                   fill="#A3AED0"
//                 />
//               </svg>
//               <p className="ml-3 text-sm text-gray-600">
//                 Kembali ke halaman utama
//               </p>
//             </div>
//           </Link>
//           <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
//             Masuk
//           </h4>
//           <p className="mb-9 ml-1 text-base text-gray-600">
//             Masukan email dan kata sandi untuk masuk!
//           </p>
//           {/* Email */}
//           <InputField
//             variant="auth"
//             extra="mb-3"
//             label="Email*"
//             placeholder="mail@simmmple.com"
//             id="email"
//             type="text"
//           />

//           {/* Password */}
//           <InputField
//             variant="auth"
//             extra="mb-3"
//             label="Password*"
//             placeholder="Min. 8 characters"
//             id="password"
//             type="password"
//           />
//           {/* Checkbox */}
//           <div className="mb-4 flex items-center justify-between px-2">
//             <div className="flex items-center">
//               <Checkbox />
//               <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
//                 Ingat saya
//               </p>
//             </div>
//             <a
//               className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//               href=" "
//             >
//               Lupa kata sandi?
//             </a>
//           </div>
//           <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
//             Masuk sekarang
//           </button>
//         </div>
//       </div>

//        <div className="absolute left-0 top-0 w-full md:relative overflow-hidden h-full">
//           <div
//             className="relative flex brightness-50 h-full w-full items-end justify-center bg-cover bg-center"
//             style={{ backgroundImage: `url(${authImg})` }}
//           />
//         </div>
//     </div>
//   );
// }

import { useState } from "react";
import authImg from "assets/img/auth/auth.jpg";
import Checkbox from "components/checkbox";
import InputField from "components/fields/InputField";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // State error message
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Email wajib diisi");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Format email tidak valid");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password wajib diisi");
      hasError = true;
    }

    if (hasError) {
      toast.error("Periksa kembali isian Anda");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (email === "superAdmin@gmail.com" && password === "123123") {
        toast.success("Login berhasil! Selamat datang kembali");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "superadmin");
        navigate("/admin/default");
      } else {
        toast.error("Email atau password salah!");
        setEmailError("Email tidak terdaftar");
        setPasswordError("Password salah");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-navy-900">
      {/* Background */}
      <div
        className="inset-0 bg-cover bg-center bg-no-repeat brightness-50 lg:brightness-100 
                   fixed lg:inset-y-0 lg:right-0 w-full lg:brightness-50"
        style={{ backgroundImage: `url(${authImg})` }}
      />
      <div className="absolute inset-0 bg-navy-900/70 lg:hidden" />

      <div className="relative flex min-h-screen items-center justify-center px-4 pb-8 pt-1 md:pt-12 sm:px-6 md:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button Desktop */}
          <div className="hidden text-center lg:block">
            <Link to="/admin/default" className="flex items-center justify-center text-sm text-white/80 hover:text-white">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="mr-3">
                <path d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997Z" fill="currentColor" />
              </svg>
              Kembali ke halaman utama
            </Link>
          </div>

          {/* Card Form */}
          <div className="relative overflow-hidden rounded-2xl bg-white/95 shadow-2xl backdrop-blur-xl dark:bg-navy-800/95">
            <div className="px-4 py-8 md:p-8">
              {/* Back Button Mobile */}
              <Link to="/admin" className="mb-8 flex items-center justify-center text-sm text-gray-700 hover:text-brand-500 dark:text-gray-400 lg:hidden">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="mr-3">
                  <path d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997Z" fill="currentColor" />
                </svg>
                Kembali ke halaman utama
              </Link>

              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-navy-700 dark:text-white sm:text-4xl">
                  Masuk
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Gunakan akun demo: <strong>superAdmin@gmail.com</strong> / <strong>123123</strong>
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                {/* Email Field + Error Message */}
                <div>
                  <InputField
                    variant="auth"
                    label="Email*"
                    placeholder="superAdmin@gmail.com"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(""); // reset error saat ngetik
                    }}
                    state={emailError ? "error" : undefined}
                  />
                  {emailError && (
                    <div className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                      <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {emailError}
                    </div>
                  )}
                </div>

                {/* Password Field + Error Message */}
                <div>
                  <InputField
                    variant="auth"
                    label="Password*"
                    placeholder="123123"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    state={passwordError ? "error" : undefined}
                  />
                  {passwordError && (
                    <div className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                      <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {passwordError}
                    </div>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                  <div className="flex items-center">
                    <Checkbox />
                    <label className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                      Ingat saya
                    </label>
                  </div>
                  <a href="#" className="text-sm font-medium text-brand-500 hover:text-brand-600">
                    Lupa kata sandi?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl bg-brand-500 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-600 active:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed ${
                    loading ? "cursor-wait" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    "Masuk sekarang"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}