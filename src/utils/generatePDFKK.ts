// components/KKPdfGenerator.tsx
import jsPDF from "jspdf";

// components/KKPdfGenerator.tsx → GANTI FUNGSI INI SAJA

export const generateSingleKKPdf = async (kk: any, anggotaList: any[] = []) => {
  const pdf = new jsPDF("l", "mm", "a4"); // Landscape = muat banyak kolom
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Header Resmi
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("KARTU KELUARGA", pageWidth / 2, 18, { align: "center" });
  
  let y = 36;
  pdf.setFontSize(15);
  pdf.text(`No. KK: ${kk.noKK}`, pageWidth / 2, 26, { align: "center" });
  y += 16;


  // Informasi KK (2 kolom biar rapi)
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");

  const left = 20;
  const right = pageWidth / 2 + 15;

  pdf.text(`Kepala Keluarga : ${kk.kepalaKeluarga}`, left, y);
  pdf.text(`No. Rumah       : ${kk.noRumah || "-"}`, right, y);
  y += 8;
  pdf.text(`Alamat          : ${kk.alamat} RT ${kk.rt}/RW ${kk.rw}`, left, y);
  pdf.text(`Status Hunian   : ${kk.statusHunian}`, right, y);
  y += 8;
  if (kk.pemilikRumah) {
    pdf.text(`Pemilik Rumah   : ${kk.pemilikRumah}`, left, y);
    y += 12;
  } else {
    y += 8;
  }

  // Judul Tabel Anggota
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("DAFTAR ANGGOTA KELUARGA", left, y);
  y += 12;

  // TABEL BARU — HANYA 5 KOLOM YANG PENTING!
  const headers = ["No", "NIK", "Nama Lengkap", "JK", "Tempat, Tgl Lahir"];
  const colWidths = [14, 45, 70, 14, 70]; // Total ≈ 213 mm → sangat nyaman di A4 landscape

  let startX = 20;
  const rowHeight = 8;
  let currentY = y;

  // Header Tabel (biru elegan)
  pdf.setFillColor(30, 64, 175);
  pdf.rect(20, currentY - 7, pageWidth - 40, 10, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");

  headers.forEach((h, i) => {
    pdf.text(h, startX + 2, currentY);
    startX += colWidths[i];
  });

  // Reset untuk isi
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10.5);
  currentY += 10;

  // Isi Tabel
  anggotaList.forEach((anggota, index) => {
    if (currentY > pageHeight - 30) {
      pdf.addPage();
      currentY = 25;

      // Ulangi header di halaman baru
      pdf.setFillColor(30, 64, 175);
      pdf.rect(20, currentY - 7, pageWidth - 40, 10, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      startX = 20;
      headers.forEach((h, i) => {
        pdf.text(h, startX + 2, currentY);
        startX += colWidths[i];
      });
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      currentY += 10;
    }

    startX = 20;

    const tglLahir = anggota.tanggalLahir
      ? new Date(anggota.tanggalLahir).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

    const row = [
      (index + 1).toString(),
      anggota.nik || "-",
      (anggota.nama || "-").slice(0, 30),
      anggota.jenisKelamin === "L" ? "L" : "P",
      `${anggota.tempatLahir || "-"}, ${tglLahir}`,
    ];

    row.forEach((cell, i) => {
      pdf.text(cell, startX + 2, currentY);
      startX += colWidths[i];
    });

    // Garis bawah halus
    pdf.setDrawColor(230, 230, 230);
    pdf.line(20, currentY + 3, pageWidth - 20, currentY + 3);

    currentY += rowHeight;
  });

  // Footer
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Dicetak pada: ${new Date().toLocaleString("id-ID")}`, 20, pageHeight - 12);
  pdf.text(`Total Anggota: ${anggotaList.length} orang`, pageWidth / 2, pageHeight - 12, { align: "center" });

  pdf.save(`KK_${kk.noKK}.pdf`);
};

// components/KKPdfGenerator.tsx → GANTI FUNGSI INI

export const generateAllKKPdf = async (allKK: any[]) => {
  const pdf = new jsPDF("l", "mm", "a4"); // Landscape
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Header
  let y = 35;
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("DAFTAR KARTU KELUARGA", pageWidth / 2, 18, { align: "center" });

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, pageWidth / 2, 25, { align: "center" });

  y += 16;

  // HEADER TABEL — ALAMAT SUDAH DIHAPUS!
  const headers = ["No", "No. KK", "Kepala Keluarga", "No. Rumah", "RT/RW", "Anggota", "Status Hunian"];
  const colWidths = [14, 52, 70, 30, 25, 20, 43]; // Total ≈ 254mm → sangat lega!

  let startX = 15;

  // Background header
  pdf.setFillColor(30, 64, 175);
  pdf.rect(15, y - 7, pageWidth - 30, 10, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");

  headers.forEach((h, i) => {
    pdf.text(h, startX + 2, y);
    startX += colWidths[i];
  });

  // Reset warna
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10.5);
  y += 10;

  // Isi data
  allKK.forEach((kk, index) => {
    if (y > pageHeight - 25) {
      pdf.addPage();
      y = 25;

      // Ulangi header di halaman baru
      pdf.setFillColor(30, 64, 175);
      pdf.rect(15, y - 7, pageWidth - 30, 10, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      startX = 15;
      headers.forEach((h, i) => {
        pdf.text(h, startX + 2, y);
        startX += colWidths[i];
      });
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      y += 10;
    }

    startX = 15;
    const jumlahAnggota = kk.anggota?.length || 0;

    const row = [
      (index + 1).toString(),
      kk.noKK,
      (kk.kepalaKeluarga || "-").slice(0, 32),
      kk.noRumah || "-",
      `${kk.rt}/${kk.rw}`,
      jumlahAnggota.toString(),
      kk.statusHunian || "-",
    ];

    row.forEach((cell, i) => {
      const alignX = [0, 4, 5].includes(i) ? startX + colWidths[i] / 2 : startX + 2; // center: No, RT/RW, Anggota
      pdf.text(cell, alignX, y, { align: [0, 4, 5].includes(i) ? "center" : "left" });
      startX += colWidths[i];
    });

    // Garis pemisah
    pdf.setDrawColor(220, 220, 220);
    pdf.line(15, y + 3, pageWidth - 15, y + 3);

    y += 8;
  });

  // Footer
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(`TOTAL: ${allKK.length} KARTU KELUARGA`, pageWidth / 2, pageHeight - 15, { align: "center" });

  pdf.setFontSize(9);
  pdf.text("Sistem Informasi Data Kependudukan RT/RW", pageWidth / 2, pageHeight - 8, { align: "center" });

  pdf.save(`Daftar_Semua_KK_${new Date().toISOString().slice(0,10)}.pdf`);
};