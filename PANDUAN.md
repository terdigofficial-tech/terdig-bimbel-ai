# 📚 Panduan Penggunaan Bimbel AI Admin

Selamat datang di sistem manajemen Bimbel AI! Panduan ini akan membantu Anda menggunakan semua fitur sistem dengan mudah.

---

## 🔐 1. Login

### Cara Masuk Sistem

1. Buka browser dan akses: `http://localhost:3000/login` (atau URL yang sudah di-deploy)
2. Anda akan melihat halaman login dengan logo Bimbel AI
3. Masukkan password: **`bimbelai2025`**
4. Klik tombol **"Masuk"**
5. Jika password benar, Anda akan diarahkan ke Dashboard
6. Jika password salah, tampilan error "Password salah" akan muncul

**Tips:** Password akan berlaku selama 24 jam. Setelah itu, Anda perlu login ulang.

---

## 📊 2. Dashboard

Dashboard adalah halaman utama yang menampilkan ringkasan sistem Anda.

### Penjelasan 5 Metrik Utama

Setelah login, Anda akan melihat 5 kartu informasi:

#### 🔵 **Total Modul** (Biru)
- Menunjukkan **jumlah modul pembelajaran yang sudah diupload** ke sistem
- Contoh: Jika ada 5 modul (Fotosintesis, Pencernaan, Pernapasan, dll), angkanya akan "5"
- Fungsi: Tracking berapa banyak materi yang tersedia

#### 🟢 **Siap Produksi** (Hijau)
- Menunjukkan **berapa modul yang sudah ditandai "Ready"** dan siap diproduksi menjadi video
- Contoh: Dari 5 modul, mungkin 3 sudah ready dan 2 masih draft
- Fungsi: Tracking progress penyelesaian modul

#### 🟣 **Siswa Aktif** (Ungu/Indigo)
- Menunjukkan **jumlah siswa yang terdaftar dan aktif** dalam sistem
- Contoh: Jika ada 10 siswa dengan status "Aktif", angkanya akan "10"
- Fungsi: Tracking jumlah siswa yang mengikuti bimbingan

#### 🟡 **Kehadiran (30hr)** (Kuning/Amber)
- Menunjukkan **persentase kehadiran rata-rata siswa dalam 30 hari terakhir**
- Dihitung dari: (Jumlah siswa hadir atau terlambat / Total kehadiran yang direkam) × 100%
- Contoh: "87%" berarti 87% siswa hadir atau terlambat dalam sebulan terakhir
- Fungsi: Monitoring kehadiran siswa secara keseluruhan

#### 🟣 **Naik Level (Bln Ini)** (Ungu)
- Menunjukkan **berapa banyak siswa yang naik level bulan ini**
- Dihitung otomatis berdasarkan kriteria: kehadiran ≥85% + rata-rata nilai ≥80%
- Contoh: Jika 2 siswa memenuhi kriteria, angkanya akan "2"
- Fungsi: Tracking prestasi siswa

### Tombol Download Laporan

Di bawah kartu metrik, ada tombol **"📥 Download Laporan (.md)"**
- Klik untuk mengunduh semua laporan yang sudah dibuat
- File akan disimpan dengan nama `laporan-bimbel.md`
- Format: Markdown (bisa dibuka dengan Word, Notepad, atau aplikasi lain)

---

## 📖 3. Manajemen Materi

Kelola modul pembelajaran di sini.

### 3.1 Upload File Modul Baru

**Menu:** Sidebar kiri → **"Upload Baru"**

**Format File yang Didukung:**
- ✅ File `.docx` (Microsoft Word 2007+)
- ❌ PDF, Excel, image, atau format lain TIDAK didukung

**Struktur Modul yang Direkomendasikan:**

```
MODUL PEMBELAJARAN IDENTITAS MODUL
Judul: Mengenal Proses Fotosintesis
Kelas: Kelas 5
Mata Pelajaran: IPAS
Durasi: 60 menit

TUJUAN PEMBELAJARAN
1. memahami proses fotosintesis dengan lengkap

KEGIATAN AWAL
Instruksi (5 menit)
Pahami proses fotosintesis dengan lengkap, ikuti instruksi di setiap aktivitas, dan jawab pertanyaan dengan jelas.

KEGIATAN INTI
Aktivitas (45 menit)
1. Analisis Proses Fotosintesis: Baca dan analisislah...
2. Bandingkan dan Kontraskan: Bandingkan fotosintesis...
3. Evaluasi Faktor yang Mempengaruhi: Evaluasi faktor-faktor...
4. Buatlah Diagram: Buatlah diagram proses...

KEGIATAN PENUTUP
Refleksi (10 menit)
Apa yang sudah kamu pelajari tentang proses fotosintesis...
```

**Langkah Upload:**

1. Klik **"Upload Baru"** di sidebar
2. Halaman upload akan muncul dengan area drag-drop
3. Pilih file `.docx` Anda dengan cara:
   - **Drag-drop:** Seret file ke area yang bertulisan "Seret & lepas file .docx di sini"
   - **Atau klik:** Tombol **"Pilih File"** untuk browse file di komputer Anda
4. Setelah file dipilih, tampilan akan berubah menjadi hijau dengan nama file terlihat
5. Klik tombol **"Upload & Generate"** (biru)
6. Tunggu proses loading (spinner akan berputar dengan teks "Memproses dengan AI...")
7. Jika berhasil, Anda akan melihat notifikasi hijau "Berhasil diproses!" dan otomatis redirect ke halaman Daftar Materi
8. Jika error, notifikasi merah akan muncul dengan pesan error

**Apa yang Terjadi di Belakang Layar:**
- File diupload dan diparsing (teks diambil)
- AI Groq menganalisis teks dan membuat scene-by-scene breakdown
- Setiap scene mendapat:
  - **Image Prompt:** Deskripsi gambar untuk dibuat di CapCut
  - **Voice Script:** Naskah voice-over untuk tutor record
  - **CapCut Note:** Catatan teknis untuk editing video

---

### 3.2 Melihat Daftar Materi

**Menu:** Sidebar kiri → **"Materi"**

**Tampilan Tabel:**
- **Kolom File:** Nama file modul yang diupload
- **Kolom Status:** 
  - 📝 **Draft** (kuning) = Modul baru, belum siap diproduksi
  - ✅ **Ready** (hijau) = Modul sudah ditinjau dan siap produksi
- **Kolom Tanggal:** Kapan modul diupload (format: DD Mon YYYY)
- **Kolom Aksi:** Tombol **"Edit"** untuk melihat detail

**Contoh:**
```
File               | Status        | Tanggal        | Aksi
Fotosintesis.docx  | 📝 Draft      | 26 May 2025    | Edit
Pencernaan.docx    | ✅ Ready      | 24 May 2025    | Edit
```

---

### 3.3 Melihat Detail Modul & Scene

**Cara Akses:**

1. Di halaman **"Materi"**, klik tombol **"Edit"** pada modul yang ingin dilihat
2. Atau akses langsung: `/admin/materials/[id]`

**Tampilan Detail:**

**Header Info:**
- Nama file modul
- Status (Draft / Siap Produksi)
- Metadata: Kelas dan Mata Pelajaran

**Scene List (daftar scene):**
- Setiap scene ditampilkan dalam format accordion (bisa diklik untuk membuka/tutup)
- Contoh: "Scene 1 - Pengenalan Fotosintesis" | "Scene 2 - Proses Reaksi Cahaya"

**Dalam Setiap Scene:**

Saat Anda membuka/expand sebuah scene, akan terlihat:

#### 🖼️ **Image Prompt** (Background Indigo)
- Deskripsi detail untuk background image
- Contoh: "Daun pohon hijau dengan sinar matahari terik menerangi, tampak sel klorofil yang bersinar"
- Fungsi: Referensi untuk tim design/CapCut membuat visual

#### 🎙️ **Voice Script** (Background Kuning)
- Naskah voice-over yang akan direcord oleh tutor/narrator
- Contoh: "Fotosintesis adalah proses di mana tumbuhan mengubah cahaya matahari menjadi energi kimia..."
- Fungsi: Tutor baca naskah ini saat recording voice-over

#### 🎬 **CapCut Note** (Background Merah Muda)
- Catatan teknis untuk editing di CapCut (timing, transisi, musik, dll)
- Contoh: "Transisi fade 0.5s, musik energik 0:00-0:30, text overlay di 0:15"
- Fungsi: Panduan editor saat membuat video di CapCut

---

### 3.4 Menandai Modul "Ready"

**Kapan Dilakukan:**
- Setelah Anda review semua scene di halaman detail
- Ketika Anda yakin modul sudah siap untuk diproduksi menjadi video

**Cara:**

1. Buka detail modul (klik Edit di halaman Materi)
2. Scroll ke bawah
3. Klik tombol **"Tandai Siap Produksi"** (berwarna hijau)
4. Status di halaman Materi akan berubah dari **📝 Draft** menjadi **✅ Ready**

**Catatan:**
- Sekali ditandai Ready, tidak bisa dikembalikan ke Draft (jika perlu undo, hubungi developer)
- Modul Ready akan masuk ke tahap produksi video

---

## 👥 4. Manajemen Siswa

Kelola data siswa yang terdaftar.

### 4.1 Menambah Siswa Baru

**Menu:** Sidebar kiri → **"Siswa"** → Tombol **"Tambah Siswa"** (atau akses `/admin/students/add`)

**Form Input:**

| Field | Tipe | Keterangan | Contoh |
|-------|------|-----------|---------|
| **Nama Lengkap** | Text | Wajib diisi | Ahmad Ridho |
| **Nama Wali** | Text | Nama orang tua/wali | Budi Santoso |
| **Telepon Wali** | Text | Nomor WA orang tua | 6281234567890 |
| **Level Awal** | Number | Level pembelajaran siswa | 5 |

**Langkah:**

1. Isi semua field (semuanya wajib kecuali "Nama Wali")
2. Klik tombol **"Simpan"**
3. Jika berhasil, notifikasi hijau "Siswa berhasil ditambahkan" akan muncul
4. Anda akan otomatis diarahkan ke halaman daftar siswa
5. Siswa baru muncul di tabel dengan status **"Aktif"**

**Contoh Skenario:**
```
Nama Lengkap: Siti Nurhaliza
Nama Wali: Rini Wijaya
Telepon Wali: 6287654321098
Level Awal: 4
→ Klik Simpan
→ ✅ Siswa berhasil ditambahkan!
→ Siti Nurhaliza muncul di daftar dengan status Aktif
```

---

### 4.2 Melihat Daftar Siswa

**Menu:** Sidebar kiri → **"Siswa"**

**Tampilan Tabel:**

| Kolom | Keterangan |
|-------|-----------|
| **Nama** | Nama lengkap siswa |
| **Level** | Level pembelajaran saat ini (bisa berubah saat naik level) |
| **Wali** | Nama orang tua/wali |
| **Telepon** | Nomor WA wali |
| **Status** | Aktif (hijau) / Nonaktif (merah) |

**Contoh:**
```
Nama              | Level | Wali           | Telepon        | Status
Ahmad Ridho       | 5     | Budi Santoso   | 6281234567890  | Aktif
Siti Nurhaliza    | 4     | Rini Wijaya    | 6287654321098  | Aktif
Bima Kusuma       | 3     | Sunarto        | 6282468135790  | Aktif
```

**Note:** Halaman ini bersifat read-only (lihat saja). Untuk mengubah data siswa, hubungi admin/developer.

---

## 📅 5. Manajemen Sesi (Kelas)

Ini adalah fitur inti untuk merekam kehadiran, penilaian, dan generate laporan siswa.

### 5.1 Memilih Sesi dari Daftar Materi

**Menu:** Sidebar kiri → **"Sesi"**

**Tampilan Tabel:**

| Kolom | Keterangan |
|-------|-----------|
| **Materi** | Nama file modul yang digunakan |
| **Status** | Ready / Draft |
| **Tanggal** | Kapan modul diupload |
| **Aksi** | Tombol "Kelola Sesi" |

**Langkah Memilih Sesi:**

1. Di halaman Sesi, lihat list modul
2. Klik tombol **"Kelola Sesi"** pada modul yang ingin Anda gunakan untuk kelas
3. Anda akan masuk ke halaman kelola sesi dengan daftar semua siswa aktif

**Contoh Skenario:**
```
Hari ini saya mau mengajar Fotosintesis untuk 3 siswa (Ahmad, Siti, Bima).
1. Klik menu "Sesi"
2. Lihat tabel, cari "Fotosintesis.docx" 
3. Klik "Kelola Sesi"
4. Halaman kelola sesi terbuka dengan 3 kartu siswa
```

---

### 5.2 Halaman Kelola Sesi - Input Data

Setelah memilih sesi, Anda akan melihat halaman dengan kartu siswa.

**Untuk Setiap Siswa, Ada:**

#### 1️⃣ **Header Siswa**
- Nama siswa (bold)
- Level siswa saat ini

#### 2️⃣ **Dropdown Kehadiran**
```
┌─────────────────┐
│ Hadir           │ ← Default
│ Tidak Hadir     │
│ Terlambat       │
└─────────────────┘
```
- Pilih status kehadiran siswa di kelas ini
- Default: "Hadir"

#### 3️⃣ **3 Input Nilai Rubrik** (Skala 0-100)

**Analisis** | **Komparasi** | **Evaluasi**
--- | --- | ---
Seberapa baik siswa menganalisis topik | Seberapa baik siswa membanding-bandingkan | Seberapa baik siswa mengevaluasi

**Contoh Penilaian:**
- Jika siswa sangat good di analisis: 90
- Jika siswa cukup di komparasi: 75
- Jika siswa kurang di evaluasi: 65

#### 4️⃣ **Text Area Catatan Tutor**
- Tempat menulis observasi/catatan tentang performa siswa
- Contoh: "Ahmad sangat aktif bertanya, memahami konsep dengan baik"
- Opsional (boleh dikosongkan)

---

### 5.3 Contoh Pengisian Lengkap

**Skenario:** Mengajar Fotosintesis untuk 3 siswa

```
═══════════════════════════════════════════════════════════

📘 Fotosintesis - Kelas 5
Kelola kehadiran dan penilaian

───────────────────────────────────────────────────────────

👤 AHMAD RIDHO | Level 5
├─ Kehadiran: Hadir ✓
├─ Analisis: 85
├─ Komparasi: 78  
├─ Evaluasi: 92
└─ Catatan: Sangat aktif, banyak bertanya, memahami konsep

👤 SITI NURHALIZA | Level 4
├─ Kehadiran: Terlambat ✓
├─ Analisis: 75
├─ Komparasi: 80
├─ Evaluasi: 88
└─ Catatan: Agak terlambat 10 menit, tapi fokus dalam belajar

👤 BIMA KUSUMA | Level 3
├─ Kehadiran: Tidak Hadir ✓
├─ Analisis: 0 (tidak ada nilai, siswa tidak hadir)
├─ Komparasi: 0
├─ Evaluasi: 0
└─ Catatan: Izin sakit, akan diulang minggu depan

═══════════════════════════════════════════════════════════
```

---

### 5.4 Menyimpan Data Sesi

**Langkah:**

1. Setelah mengisi semua data kehadiran dan nilai untuk semua siswa
2. Scroll ke bawah halaman
3. Klik tombol **"Simpan Semua"** (biru)
4. Tunggu proses (tombol mungkin loading sebentar)
5. Notifikasi hijau "Data sesi tersimpan" akan muncul
6. Data sudah tersimpan di database

**Important:** Pastikan Anda sudah mengisi semua siswa sebelum klik Simpan. Jangan lupa!

---

### 5.5 Generate Laporan & Cek Level

**Fitur:** Setelah mengisi dan menyimpan data sesi

**Tombol:** **"Generate Laporan & Cek Level"** (ungu/purple)

**Apa yang Terjadi:**

1. Klik tombol
2. Loading spinner muncul dengan teks "Memproses..."
3. Sistem melakukan 2 hal:
   - **Generate Laporan AI:** Membuat laporan untuk orang tua (dalam bahasa Indonesia yang hangat)
   - **Cek Kenaikan Level:** Mengecek apakah siswa memenuhi kriteria naik level

4. Notifikasi akan muncul untuk setiap siswa:
   - Jika naik level: Notifikasi hijau "Ahmad Ridho naik ke Level 6!"
   - Jika tidak naik: Tidak ada notifikasi khusus

5. Notifikasi ringkasan: "Laporan dibuat untuk 3 siswa. 1 siswa naik level!"

---

### 5.6 Syarat Naik Level

Sistem otomatis mengecek kriteria ini. Siswa akan naik level jika **SEMUA** kondisi terpenuhi:

**Kondisi:**
1. **Minimal 4 sesi** dalam riwayat kehadiran terakhir
2. **Kehadiran ≥ 85%** dari 4 sesi terakhir
   - Contoh: Hadir 4 sesi = 100%, Hadir 3 + Terlambat 1 = 100%, Hadir 3 + Tidak Hadir 1 = 75% (TIDAK naik)
3. **Rata-rata nilai ≥ 80** dari 4 sesi terakhir
   - Contoh: (85 + 78 + 92 + 88) / 4 = 85.75 (naik level!)
   - Contoh: (75 + 70 + 72 + 78) / 4 = 73.75 (TIDAK naik)

**Contoh Skenario:**

```
AHMAD RIDHO - Sesi terakhir 4 kali:
├─ Sesi 1: Hadir, Nilai 88
├─ Sesi 2: Hadir, Nilai 92
├─ Sesi 3: Terlambat, Nilai 85
├─ Sesi 4: Hadir, Nilai 90

Analisis:
├─ Kehadiran: 4 Hadir/Terlambat dari 4 = 100% ✅ (≥85%)
├─ Rata-rata nilai: (88+92+85+90)/4 = 88.75 ✅ (≥80%)

Hasil: ✅ NAIK LEVEL dari 5 → 6

Notifikasi: "Ahmad Ridho naik ke Level 6!"
Database: Level Ahmad berubah dari 5 menjadi 6
Riwayat: Entry baru di tabel progression_history
```

```
BIMA KUSUMA - Sesi terakhir 4 kali:
├─ Sesi 1: Hadir, Nilai 70
├─ Sesi 2: Tidak Hadir, Nilai 0
├─ Sesi 3: Hadir, Nilai 65
├─ Sesi 4: Hadir, Nilai 72

Analisis:
├─ Kehadiran: 3 Hadir dari 4 = 75% ❌ (< 85%)
├─ Rata-rata nilai: (70+0+65+72)/4 = 51.75 ❌ (< 80%)

Hasil: ❌ TIDAK NAIK LEVEL

Notifikasi: Tidak ada notifikasi khusus
Level Bima tetap 3
```

---

## 📄 6. Export & Download Laporan

### Cara Download Laporan

**Lokasi:** Dashboard utama → Tombol **"📥 Download Laporan (.md)"**

**Langkah:**

1. Login dan masuk ke Dashboard (halaman utama)
2. Scroll ke bawah setelah melihat 5 metrik
3. Klik tombol **"📥 Download Laporan (.md)"** (hijau)
4. File akan otomatis download ke folder Downloads komputer Anda
5. Nama file: `laporan-bimbel.md`

**Isi File Laporan:**

File markdown yang didownload berisi:
- Judul: "Laporan Bimbel AI"
- Tanggal pembuatan
- List semua laporan siswa yang sudah dibuat, berisi:
  - Nama siswa
  - Materi yang diajarkan
  - Status WA (pending/sent/delivered)
  - Isi laporan detail (generated oleh AI)

**Format Laporan Contoh:**

```markdown
# Laporan Bimbel AI

Dibuat: 26 May 2025

---

## Siswa: Ahmad Ridho
Materi: Fotosintesis-Kelas5.docx
Status WA: pending

Assalamu'alaikum Bapak/Ibu,

Hari ini Ahmad mengikuti pembelajaran tentang Fotosintesis dengan sangat baik. 
Dia hadir tepat waktu dan aktif berpartisipasi dalam diskusi kelas.

**Kehadiran:** Hadir
**Nilai Rata-rata:** 88

Ahmad menunjukkan pemahaman yang excellent tentang proses fotosintesis, 
khususnya dalam menganalisis peran klorofil dan cahaya matahari...

[laporan lengkap...]

---

## Siswa: Siti Nurhaliza
Materi: Fotosintesis-Kelas5.docx
Status WA: pending

[laporan Siti...]

---
```

**Cara Membuka File:**
- Double-click file → Buka di Notepad / Word
- Atau copy-paste isi ke aplikasi lain
- Atau upload ke Google Drive untuk berbagi

---

## 🚪 7. Logout

### Cara Keluar dari Sistem

**Lokasi:** Sidebar kiri → Tombol **"Logout"** (paling bawah)

**Langkah:**

1. Di halaman admin manapun, lihat sidebar kiri
2. Scroll ke bawah
3. Klik tombol **"Logout"** (dengan icon pintu keluar 🚪)
4. Anda akan diarahkan ke halaman login
5. Untuk login lagi, masukkan password: `bimbelai2025`

**Note:** Session akan berakhir otomatis dalam 24 jam jika Anda tidak logout manual.

---

## 💡 Tips & Trik

### Skenario Penggunaan Sehari-hari (Workflow Lengkap)

**Pagi Hari - Persiapan:**
1. Login ke sistem pukul 08:00
2. Cek Dashboard → Lihat metrik siswa dan kehadiran
3. Jika ada modul baru, upload file .docx
4. Review modul dan tandai "Ready"

**Jam Kelas - Recording:**
1. Pergi ke menu "Sesi"
2. Pilih modul yang akan diajarkan (klik "Kelola Sesi")
3. Input kehadiran setiap siswa
4. Input nilai rubrik (0-100) berdasarkan performa siswa
5. Tulis catatan tutor jika ada hal penting
6. Klik "Simpan Semua"
7. Klik "Generate Laporan & Cek Level"
8. Lihat notifikasi naik level (jika ada)
9. Download laporan (.md) dari Dashboard

**Sore Hari - Closure:**
1. Review data di Dashboard
2. Logout dan tutup sistem

---

### Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **Login gagal** | Pastikan password benar: `bimbelai2025` (case-sensitive) |
| **Upload file gagal** | Pastikan file adalah `.docx`, bukan PDF atau format lain |
| **Tombol tidak merespons** | Refresh halaman (F5 atau Ctrl+R) atau restart browser |
| **Halaman error/crash** | Logout dan login ulang, atau bersihkan cache browser |
| **Laporan tidak tergenerate** | Pastikan sudah "Simpan Semua" dulu sebelum "Generate Laporan" |
| **Data siswa hilang** | Data tidak bisa dihapus manual - hubungi admin/developer |

---

### Keyboard Shortcuts

| Shortcut | Fungsi |
|----------|--------|
| `Ctrl + R` atau `F5` | Refresh halaman |
| `Ctrl + L` | Focus di address bar (bisa ke halaman lain) |
| `Escape` | Close modal/dialog jika ada |

---

## 📞 Bantuan

Jika ada pertanyaan atau masalah:

1. **Pertanyaan teknis:** Hubungi team developer
2. **Bug/Error:** Screenshot error dan deskripsi langkah yang dilakukan
3. **Fitur baru:** Bisa diminta ke manager project

---

## 📋 Ringkasan Fitur

✅ **Upload Modul** - Upload file .docx dan AI breakdown otomatis  
✅ **Manajemen Materi** - Lihat detail scene dan tandai Ready  
✅ **Manajemen Siswa** - Tambah siswa baru dan lihat daftar  
✅ **Kelola Sesi** - Input kehadiran, nilai, dan catatan tutor  
✅ **AI Laporan** - Generate laporan untuk orang tua otomatis  
✅ **Auto Promotion** - Sistem otomatis cek naik level siswa  
✅ **Export Laporan** - Download semua laporan dalam format .md  
✅ **Dashboard Analytics** - Lihat 5 metrik penting sistem  
✅ **Security** - Login dengan password protection  

---

**Versi:** 1.0  
**Updated:** 26 May 2025  
**Bahasa:** Indonesian (Bahasa Indonesia)

Selamat menggunakan Bimbel AI Admin! 🚀

---
