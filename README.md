# KELAKAR - Panduan Pemasangan

Website (GitHub Pages) + backend (Google Apps Script). Data tersimpan di Google Sheets, foto/PDF di Google Drive, notifikasi dikirim ke email admin.

## Bagian A. Backend (Google Apps Script)

1. Login ke Google dengan akun **sdnegeri12badau12@gmail.com**.
2. Buat folder di Google Drive untuk lampiran (misal "KELAKAR Lampiran"). Buka folder, salin ID dari URL: `drive.google.com/drive/folders/`**`ID_FOLDER`**.
3. Buat Google Sheet baru (nama bebas, misal "KELAKAR Data").
4. Di Sheet: menu **Ekstensi > Apps Script**. Hapus isi default, tempel seluruh isi `Code.gs`.
5. Ganti `ISI_ID_FOLDER_GOOGLE_DRIVE` dengan ID folder dari langkah 2. Klik **Simpan**.
6. Klik **Terapkan (Deploy) > Deployment baru > jenis: Aplikasi web**:
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
7. Klik **Terapkan**, lalu **Otorisasi akses** dan izinkan (Sheets, Drive, Gmail).
8. Salin **URL Aplikasi web** (berakhiran `/exec`).

> Setiap mengubah `Code.gs`, buat **Deployment baru** atau **Kelola deployment > Edit > Versi baru** agar perubahan aktif.

## Bagian B. Hubungkan website

Buka `index.html`, cari baris:

```js
const API="GANTI_DENGAN_URL_WEB_APP";
```

Ganti dengan URL dari langkah A8.

## Bagian C. Deploy ke GitHub Pages

1. Buat akun di github.com, lalu klik **New repository**. Nama: `kelakar`, pilih **Public**, klik **Create repository**.
2. Klik **uploading an existing file**, unggah **hanya 3 file ini**:
   - `index.html`
   - `logo-sekolah.png`
   - `logo-tutwuri.jpg`
3. Klik **Commit changes**.
4. Buka **Settings > Pages**. Pada *Build and deployment*, pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, klik **Save**.
5. Tunggu 1-2 menit. Website aktif di `https://NAMA-AKUN.github.io/kelakar/`.

## Catatan keamanan

- **Jangan unggah `Code.gs` ke GitHub.** File itu berisi email dan kata sandi admin. Cukup ditempel di Apps Script.
- Verifikasi login dilakukan di server (Apps Script), bukan di `index.html`, sehingga kata sandi tidak terlihat oleh pengunjung.
- Nama dan nomor HP pelapor hanya dikirim ke browser setelah admin login. Riwayat publik hanya menampilkan nama yang disamarkan (contoh: `B*** S******`).
- Sebaiknya ganti kata sandi admin secara berkala di `Code.gs` (`ADMIN_PASS`).
- Kuota email Apps Script akun Gmail biasa sekitar 100 email/hari, cukup untuk kebutuhan sekolah.
