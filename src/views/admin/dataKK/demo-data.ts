// src/components/data-kk/demo-data.ts
import { KKItem } from "./types";

export const DEMO_DATA: KKItem[] = [
  {
    id: "1",
    noKK: "3275010101900001",
    kepalaKeluarga: "Ahmad Fauzi",
    alamat: "Jl. Merdeka No. 10",
    rt: "01",
    rw: "001",
    isSementara: false,
    koordinat: "-6.2088,106.8456",
    alamatLengkap: "Jl. Merdeka No. 10 RT 01 RW 001 Kel. Kebon Jeruk, Kec. Andir, Kota Bandung",
    statusHunian: "Milik Sendiri",
    pemilikRumah: "Ahmad Fauzi",
    kondisiRumah: {
      lantai: "Keramik",
      dinding: "Tembok/Bata",
      atap: "Genteng/Beton",
      air: "PDAM",
      sanitasi: "Jamban Sendiri + Septic Tank",
      listrik: "PLN 900VA",
      kepemilikanAset: ["TV", "Kulkas", "Motor"]
    },
    kategoriKesejahteraan: "Sejahtera II",
    kepemilikanDokumenLengkap: true,
    anggota: [
      {
        id: "1",
        nik: "3275010101900001",
        nama: "Ahmad Fauzi",
        jenisKelamin: "L",
        tempatLahir: "Bandung",
        tanggalLahir: "1990-01-01",
        statusKeluarga: "Kepala Keluarga",
        pendidikan: "SMA / SMK / MA",
        pekerjaan: "Wirausaha / UMKM",
        bantuan: ["pkh", "bpnt"],
        status: "Hidup",
        golonganDarah: "O",
        disabilitas: true,
        jenisDisabilitas: "Rungu",
        kebutuhanKhusus: "Alat Bantu Dengar",
        statusDesil: "Rentan Miskin",
        statusKependudukan: "Warga Tetap",
        statusKawin: "Kawin",
        agama: "Islam",
        kelengkapanArsipRT: ["KTP", "KK", "Akta Nikah"],
        partisipasiLingkungan: ["Aktif Kegiatan RW/RT", "Siskamling", "PKK"],
        kerentananSosial: []
      }
    ]
  }
];