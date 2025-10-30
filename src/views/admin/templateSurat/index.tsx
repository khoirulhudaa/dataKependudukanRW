import Card from "components/card";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import React, { useRef, useState } from "react";
import {
    MdDescription,
    MdDownload,
    MdImage,
    MdPictureAsPdf,
    MdDescription as MdWord
} from "react-icons/md";

// GUNAKAN require() → aman untuk CommonJS
const docx = require("html-docx-js/dist/html-docx");

interface Template {
  id: string;
  title: string;
  category: "rt-rw" | "kelurahan";
  headerHtml: string;
  bodyHtml: string;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Surat Pengantar KTP",
    category: "rt-rw",
    headerHtml: `
      <div style="font-family: 'Times New Roman', serif; text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 16pt; font-weight: bold;">RT 01 / RW 001</h2>
        <p style="margin: 5px 0; font-size: 12pt;">Kelurahan Cihapit, Kecamatan Bandung Wetan</p>
        <p style="margin: 5px 0; font-size: 12pt;">Jl. Cihapit No. 10, Kota Bandung</p>
      </div>
      <hr style="border: 2px solid #000; margin: 20px 0;">
    `,
    bodyHtml: `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; padding: 0 40px;">
        <p style="text-align: right; margin-bottom: 20px;">
          <strong>Nomor:</strong> 001/RT.01/RW.001/2025<br>
          <strong>Lampiran:</strong> -<br>
          <strong>Perihal:</strong> Pengantar Pembuatan KTP
        </p>

        <p style="text-indent: 40px; text-align: justify;">
          Yang bertanda tangan di bawah ini:
        </p>

        <table style="margin-left: 50px; margin-bottom: 20px; font-size: 12pt;">
          <tr><td width="150">Nama</td><td width="10">:</td><td>Ahmad Fauzi</td></tr>
          <tr><td>Jabatan</td><td>:</td><td>Ketua RT 01 / RW 001</td></tr>
          <tr><td>Alamat</td><td>:</td><td>Kel. Cihapit, Kec. Bandung Wetan</td></tr>
        </table>

        <p style="text-indent: 40px; text-align: justify;">
          Dengan ini menerangkan bahwa:
        </p>

        <table style="margin-left: 50px; margin-bottom: 20px; font-size: 12pt;">
          <tr><td width="150">Nama</td><td width="10">:</td><td><strong>[NAMA WARGA]</strong></td></tr>
          <tr><td>NIK</td><td>:</td><td><strong>[NIK]</strong></td></tr>
          <tr><td>Alamat</td><td>:</td><td><strong>[ALAMAT LENGKAP]</strong></td></tr>
        </table>

        <p style="text-indent: 40px; text-align: justify;">
          Adalah benar warga RT 01 / RW 001 Kelurahan Cihapit, Kecamatan Bandung Wetan, Kota Bandung.
        </p>

        <p style="text-indent: 40px; text-align: justify;">
          Demikian surat pengantar ini dibuat untuk dipergunakan sebagaimana mestinya.
        </p>

        <div style="display: flex; justify-content: space-between; margin-top: 50px; font-size: 12pt;">
          <div></div>
          <div style="text-align: center;">
            <p style="margin: 0;">Bandung, 30 Oktober 2025</p>
            <p style="margin: 30px 0 50px;">Ketua RT 01 / RW 001,</p>
            <p style="margin: 0; font-weight: bold;">Ahmad Fauzi</p>
            <div style="margin-top: 5px; height: 1px; width: 200px; background: #000; margin: 0 auto;"></div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "2",
    title: "Surat Keterangan Domisili",
    category: "kelurahan",
    headerHtml: `
      <div style="font-family: 'Times New Roman', serif; text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KOTA BANDUNG</h2>
        <h3 style="margin: 5px 0; font-size: 14pt;">KECAMATAN BANDUNG WETAN</h3>
        <h2 style="margin: 5px 0; font-size: 16pt; font-weight: bold;">KELURAHAN CIHAPIT</h2>
        <p style="margin: 5px 0; font-size: 12pt;">Jl. Cihapit No. 10 Telp. (022) 123456</p>
      </div>
      <hr style="border: 3px double #000; margin: 20px 0;">
    `,
    bodyHtml: `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; padding: 0 50px;">
        <h3 style="text-align: center; text-decoration: underline; margin: 30px 0 20px;">
          SURAT KETERANGAN DOMISILI
        </h3>
        <p style="text-align: right; margin-bottom: 20px;">
          <strong>Nomor:</strong> 470/SKD/XX/2025
        </p>

        <p style="text-indent: 40px; text-align: justify;">
          Yang bertanda tangan di bawah ini Lurah Cihapit Kecamatan Bandung Wetan Kota Bandung, menerangkan dengan sebenarnya bahwa:
        </p>

        <ol style="margin-left: 30px; margin-bottom: 20px;">
          <li>Nama Lengkap: <strong>[NAMA LENGKAP]</strong></li>
          <li>Tempat, Tanggal Lahir: <strong>[TEMPAT, TANGGAL]</strong></li>
          <li>Nomor Induk Kependudukan (NIK): <strong>[NIK]</strong></li>
          <li>Alamat: <strong>[ALAMAT LENGKAP]</strong></li>
        </ol>

        <p style="text-indent: 40px; text-align: justify;">
          Berdasarkan data kependudukan yang ada, benar bahwa nama tersebut di atas berdomisili di wilayah Kelurahan Cihapit.
        </p>

        <p style="text-indent: 40px; text-align: justify;">
          Surat keterangan ini diberikan untuk keperluan <strong>[KEPERLUAN]</strong>.
        </p>

        <div style="display: flex; justify-content: space-between; margin-top: 60px;">
          <div></div>
          <div style="text-align: center;">
            <p style="margin: 0;">Bandung, 30 Oktober 2025</p>
            <p style="margin: 30px 0 50px;">Lurah Cihapit,</p>
            <p style="margin: 0; font-weight: bold;">[NAMA LURAH]</p>
            <div style="margin-top: 5px; height: 1px; width: 200px; background: #000; margin: 0 auto;"></div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "3",
    title: "Surat Pengantar KK Baru",
    category: "rt-rw",
    headerHtml: `<div style="font-family: 'Times New Roman'; text-align: center; margin-bottom: 25px;"><h2>RT 01 / RW 001</h2></div><hr style="border: 2px solid #000;">`,
    bodyHtml: `
      <div style="font-family: 'Times New Roman'; font-size: 12pt; line-height: 1.8; padding: 0 40px;">
        <h3 style="text-align: center; margin: 30px 0;">SURAT PENGANTAR PEMBUATAN KARTU KELUARGA BARU</h3>
        <p style="text-indent: 40px;">
          RT 01 / RW 001 Kelurahan Cihapit dengan ini mengajukan permohonan pembuatan Kartu Keluarga (KK) baru atas nama:
        </p>
        <ul style="margin-left: 50px; margin-bottom: 20px;">
          <li>Nama Kepala Keluarga: <strong>[NAMA]</strong></li>
          <li>Alamat: <strong>[ALAMAT]</strong></li>
          <li>Jumlah Anggota Keluarga: <strong>[JUMLAH]</strong> orang</li>
        </ul>
        <p style="text-indent: 40px;">
          Demikian surat pengantar ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
        </p>
        <div style="display: flex; justify-content: flex-end; margin-top: 50px;">
          <div style="text-align: center;">
            <p>Ketua RT 01 / RW 001,</p>
            <p style="margin: 50px 0;">(________________)</p>
            <p><strong>Ahmad Fauzi</strong></p>
          </div>
        </div>
      </div>
    `,
  },
];

const PAPER_SIZES = {
  a4: { name: "A4", width: 8.27, height: 11.69 },
  letter: { name: "Letter", width: 8.5, height: 11 },
  legal: { name: "Legal", width: 8.5, height: 14 },
} as const;

type PaperSizeKey = keyof typeof PAPER_SIZES;

const TemplateSurat: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [kopSurat, setKopSurat] = useState<string | null>(null);
  const [paperSize, setPaperSize] = useState<PaperSizeKey>("a4");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleKopUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
        setIsImageLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
        setKopSurat(reader.result as string);
        setIsImageLoading(false);
        };
        reader.readAsDataURL(file);
    } else {
        alert("Hanya gambar (PNG/JPG) yang diizinkan.");
    }
    };

  const getFullHtml = () => {
    if (!selectedTemplate) return "";

    const size = PAPER_SIZES[paperSize];
    const header = kopSurat
        ? `
        <div style="width: 100%; text-align: center; margin: 0 0 15px 0; padding: 0; line-height: 0;">
            <img 
            src="${kopSurat}" 
            style="
                width: 100%; 
                max-width: ${size.width - 1.0}in; /* kurangi margin */
                height: auto; 
                display: block; 
                margin: 0 auto;
                object-fit: contain;
            " 
            alt="Kop Surat"
            />
        </div>
        <hr style="border: 1.5px solid #000; margin: 10px 0 15px 0;">
        `
        : selectedTemplate.headerHtml;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${selectedTemplate.title}</title>
            <style>
            * { box-sizing: border-box; }
            html, body { 
                margin: 0; 
                padding: 0; 
                width: 100%; 
                height: 100%;
            }
            .page {
                width: ${size.width}in;
                height: ${size.height}in;
                padding: 0;
                margin: 0 auto;
                background: white;
                font-family: 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 1.7;
                position: relative;
            }
            @page { 
                size: ${size.width}in ${size.height}in; 
                margin: 0;
            }
            img { max-width: 100%; height: auto; }
            hr { border: none; border-top: 1.5px solid #000; margin: 15px 0; }
            table { width: 100%; border-collapse: collapse; }
            td { vertical-align: top; padding: 1px 0; }
            </style>
        </head>
        <body>
            <div class="page">
            ${header}
            <div class="content">
                ${selectedTemplate.bodyHtml}
            </div>
            </div>
        </body>
        </html>
    `;
    };

  // DOWNLOAD HTML
  const downloadHtml = () => {
    if (!selectedTemplate) return;
    const blob = new Blob([getFullHtml()], { type: "text/html" });
    saveAs(blob, `${selectedTemplate.title.replace(/ /g, "_")}.html`);
  };

  // DOWNLOAD PDF
  const downloadPdf = () => {
    if (!selectedTemplate || !previewRef.current) return;

    const size = PAPER_SIZES[paperSize];

    html2pdf()
        .from(previewRef.current)
        .set({
        margin: 0,
        filename: `${selectedTemplate.title.replace(/ /g, "_")}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
            scale: 3, // Naikkan untuk kualitas
            useCORS: true,
            letterRendering: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            logging: false,
            width: previewRef.current.scrollWidth,
            height: previewRef.current.scrollHeight,
        },
        jsPDF: {
            unit: "in",
            format: [size.width, size.height],
            orientation: "portrait",
        },
        })
        .save();
    };

  // DOWNLOAD DOCX
  const downloadDocx = () => {
    if (!selectedTemplate) return;

    const fullHtml = getFullHtml();
    const converted = docx.asBlob(fullHtml, {
      orientation: "portrait",
      margins: { top: 1152, bottom: 1152, left: 1152, right: 1152 }, // 0.8 inch
    });

    saveAs(converted, `${selectedTemplate.title.replace(/ /g, "_")}.docx`);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Daftar Template */}
        <div className="col-span-12 lg:col-span-12">
          <Card extra="h-full p-4">
            <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
              Template Surat Resmi
            </h4>

            {/* Pilihan Ukuran Kertas */}
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-navy-700 dark:text-white">Ukuran Kertas:</label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as PaperSizeKey)}
                className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              >
                {Object.entries(PAPER_SIZES).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-all cursor-pointer ${
                    selectedTemplate?.id === tmpl.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-gray-200 dark:border-navy-600 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate(tmpl)}
                >
                  <div className="flex items-center gap-3">
                    <MdDescription className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium text-navy-700 dark:text-white">{tmpl.title}</p>
                      <p className="text-xs text-gray-500">
                        {tmpl.category === "rt-rw" ? "RT/RW" : "Kelurahan"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(tmpl);
                      setTimeout(() => downloadPdf(), 150);
                    }}
                    className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                    title="Download PDF"
                  >
                    <MdPictureAsPdf className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Kop */}
            <div className="mt-6 border-t pt-4 dark:border-navy-600">
              <h5 className="mb-2 text-sm font-semibold text-navy-700 dark:text-white">
                Upload Kop Surat (Opsional)
              </h5>
              <div
                className="relative rounded-lg border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-gray-400 dark:border-navy-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <MdImage className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {kopSurat ? "Ganti Kop" : "Upload Kop (PNG/JPG)"}
                </p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleKopUpload} className="hidden" />
              </div>
              {kopSurat && (
                <div className="mt-2 flex justify-between rounded bg-green-50 p-2 dark:bg-green-900/20">
                  <span className="text-xs text-green-700 dark:text-green-300">Kop terupload</span>
                  <button onClick={() => setKopSurat(null)} className="text-xs text-red-600 hover:underline">
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Preview + Tombol */}
        <div className="col-span-12 lg:col-span-12">
          <Card extra="h-full p-4">
            <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
              {selectedTemplate ? "Preview Dokumen" : "Pilih Template"}
            </h4>

            {selectedTemplate ? (
              <>
                {/* Tombol Download */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={downloadHtml}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      <MdDownload className="h-5 w-5" /> HTML
                    </button>
                    <button
                      onClick={downloadPdf}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      <MdPictureAsPdf className="h-5 w-5" /> PDF
                    </button>
                    <button
                      onClick={downloadDocx}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                      <MdWord className="h-5 w-5" /> DOCX
                    </button>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ukuran: <strong>{PAPER_SIZES[paperSize].name}</strong>
                  </span>
                </div>

                {/* Preview */}
                <div
                    className="overflow-auto rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 p-4"
                    style={{ maxHeight: "800px" }}
                    >
                    <div
                        style={{
                        width: `${PAPER_SIZES[paperSize].width * 96}px`, // 1in = 96px
                        minHeight: `${PAPER_SIZES[paperSize].height * 96}px`,
                        margin: "0 auto",
                        background: "white",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        padding: "0",
                        position: "relative",
                        fontFamily: "'Times New Roman', serif",
                        fontSize: "12pt",
                        lineHeight: "1.7",
                        }}
                        ref={previewRef}
                        dangerouslySetInnerHTML={{ __html: getFullHtml() }}
                    />
                    </div>
              </>
            ) : (
              <div className="flex h-[700px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-navy-600">
                <p className="text-gray-500">Pilih template untuk melihat preview</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateSurat;