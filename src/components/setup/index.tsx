import axios from "axios";
import React, { useState, useCallback } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { MdSave } from "react-icons/md";

interface SetupModalProps {
  onSuccess: () => void;
}

// ====================
// KOMPONEN UTILITY (DI LUAR)
// ====================

interface InputProps {
  label: string;
  name: string;
  [key: string]: any;
}

const Input = ({ label, name, ...props }: InputProps) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      {...props}
      name={name}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

interface StepperProps {
  step: 1 | 2;
}

const Stepper = ({ step }: StepperProps) => (
  <div className="flex items-center justify-between mb-8">
    {/* STEP 1 */}
    <div className="flex items-center w-full">
      <div className="flex gap-2 items-center">
        <div
          className={`flex gap-3 h-max w-max p-2 px-4 items-center justify-center rounded-full font-semibold
            ${
              step >= 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
        >
          <p>1</p>
          <p
            className={`w-max text-sm font-medium
            ${step >= 1 ? "text-white" : "text-gray-400"}`}
          >
            Data Kelurahan
          </p>
        </div>
      </div>

      <div
        className={`flex-1 h-1 mx-4 rounded
          ${step === 2 ? "bg-blue-600" : "bg-gray-200"}`}
      />
    </div>

    {/* STEP 2 */}
    <div className="flex gap-2 items-center">
      <div
        className={`flex h-max w-max py-2 px-4 gap-3 items-center justify-center rounded-full font-semibold
          ${
            step === 2
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
      >
        2
        <p
          className={`w-max text-sm font-medium
            ${step === 2 ? "text-white" : "text-gray-400"}`}
        >
          Akun Admin
        </p>
      </div>
    </div>
  </div>
);

interface StepProps {
  formData: typeof initialFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StepOne = ({ formData, handleChange }: StepProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Input 
      label="Nama Kelurahan" 
      name="villageName" 
      value={formData.villageName} 
      onChange={handleChange} 
      required 
    />
    <Input 
      label="Kecamatan" 
      name="subDistrict" 
      value={formData.subDistrict} 
      onChange={handleChange} 
      required 
    />
    <Input 
      label="Kabupaten / Kota" 
      name="district" 
      value={formData.district} 
      onChange={handleChange} 
      required 
    />
    <Input 
      label="Provinsi" 
      name="province" 
      value={formData.province} 
      onChange={handleChange} 
      required 
    />
    <Input 
      label="Kode Kelurahan" 
      name="villageCode" 
      value={formData.villageCode} 
      onChange={handleChange} 
      required 
    />
    <Input 
      label="Kode Pos" 
      name="postalCode" 
      value={formData.postalCode} 
      onChange={handleChange} 
      required 
    />
    <Input 
      label="Alamat Kelurahan" 
      name="villageAddress" 
      value={formData.villageAddress} 
      onChange={handleChange} 
      required 
    />
    <Input 
      label="Telepon Kelurahan" 
      name="villagePhone" 
      value={formData.villagePhone} 
      onChange={handleChange} 
      required 
    />
    <Input
      label="Jumlah RW"
      name="totalRW"
      type="number"
      value={formData.totalRW}
      onChange={handleChange}
      required
    />
  </div>
);

const StepTwo = ({ formData, handleChange }: StepProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Input
      label="Email Admin"
      name="adminEmail"
      type="email"
      value={formData.adminEmail}
      onChange={handleChange}
      required
    />
    <Input
      label="Username"
      name="adminUsername"
      value={formData.adminUsername}
      onChange={handleChange}
      required
    />
    <Input
      label="Password"
      name="adminPassword"
      type="password"
      value={formData.adminPassword}
      onChange={handleChange}
      required
    />
    <Input
      label="Nama Lengkap"
      name="adminFullName"
      value={formData.adminFullName}
      onChange={handleChange}
      required
    />
    <Input
      label="No. HP Admin"
      name="adminPhone"
      value={formData.adminPhone}
      onChange={handleChange}
      required
    />
  </div>
);

// ====================
// INITIAL FORM DATA
// ====================

const initialFormData = {
  villageName: "",
  subDistrict: "",
  district: "",
  province: "",
  villageCode: "",
  postalCode: "",
  villageAddress: "",
  villagePhone: "",
  totalRW: "",
  adminEmail: "",
  adminUsername: "",
  adminPassword: "",
  adminFullName: "",
  adminPhone: "",
};

// ====================
// KOMPONEN UTAMA
// ====================

const SetupModal = ({ onSuccess }: SetupModalProps) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }, [formData]);

  const validateStep = useCallback(() => {
    if (step === 1) {
      return (
        formData.villageName &&
        formData.subDistrict &&
        formData.district &&
        formData.province &&
        formData.villageCode &&
        formData.postalCode &&
        formData.villageAddress &&
        formData.villagePhone &&
        formData.totalRW
      );
    }

    if (step === 2) {
      return (
        formData.adminEmail &&
        formData.adminUsername &&
        formData.adminPassword &&
        formData.adminFullName &&
        formData.adminPhone
      );
    }

    return false;
  }, [step, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      await axios.post("https://nitip-api.diwanmotor.com/api/v1/setup/initialize", {
        ...formData,
        totalRW: Number(formData.totalRW),
      });

      alert("Sistem berhasil diinisialisasi!");
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.message === "System is already initialized") {
        alert("Sistem sudah diinisialisasi sebelumnya.");
        onSuccess();
      } else {
        alert(
          "Gagal menginisialisasi sistem: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[94vw] md:w-[70vw] h-max rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Setup Awal Sistem Kelurahan
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Lengkapi data berikut untuk menginisialisasi sistem
        </p>

        <Stepper step={step} />

        <form onSubmit={handleSubmit} className="h-full">
          {step === 1 && <StepOne formData={formData} handleChange={handleChange} />}
          {step === 2 && <StepTwo formData={formData} handleChange={handleChange} />}

          <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-4 border-t border-gray-200 w-full mt-6">
            {step === 2 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-full px-6 py-3 flex items-center gap-3 justify-center bg-gray-200 rounded-lg border border-gray-300 text-black/80 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <BsArrowLeft />
                Kembali
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                disabled={!validateStep() || loading}
                onClick={handleNextStep}
                className="w-full px-6 py-3 flex items-center gap-3 justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Lanjut
                <BsArrowRight />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !validateStep()}
                className="w-full px-6 py-3 flex items-center gap-3 justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-4 w-4 duration-1000 ease-linear" />
                ) : (
                  <MdSave />
                )}
                {loading ? "Menyimpan..." : "Inisialisasi"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupModal;