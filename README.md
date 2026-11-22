# Pengumuman Paroki St. Antonius Padua, Ampenan

Situs pengumuman Paroki St. Antonius Padua, Ampenan, Kota Mataram, Nusa Tenggara Barat. Berisi jadwal Misa Minggu pukul **07.30** dan **18.00 WITA**, hitung mundur ke misa berikutnya, jam WITA langsung, daftar pengumuman yang bisa dibuka, renungan, galeri, dan kontak.

## Menjalankan

Klik dua kali `index.html`, atau buka lewat browser. Semua gambar tersimpan lokal di folder `assets/` (format SVG), jadi situs tetap tampil tanpa internet. Hanya jenis huruf yang diambil dari Google Fonts; bila offline, browser memakai huruf cadangan.

Bila ingin memakai server lokal:

```powershell
cd C:\Users\user1\Documents\pengumuman-paroki
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Mengubah isi

| Bagian | Berkas | Petunjuk |
| --- | --- | --- |
| Beranda | `index.html` | Menu **Beranda** mengarah ke `<section class="hero" id="beranda">`. Bagian ini berisi judul hari raya, ajakan, dan panel **Misa berikutnya** yang dihitung otomatis oleh `script.js`. Kartu jam Misa Minggu sengaja tidak ditampilkan di sini; jadwal lengkap ada di bagian Jadwal misa. |
| Sejarah gereja | `index.html` | Cari `<section class="history" id="sejarah">`, tepat di bawah hero. Berisi narasi dan linimasa. Tanggal serta tokoh bersumber dari catatan sejarah paroki; tautan sumber ada di bagian tersebut. Periksa kembali ke arsip paroki sebelum memakainya sebagai data resmi. |
| Pengumuman | `data/pengumuman.js` dan `admin.html` | **Data pengumuman sekarang dipisah dari HTML.** Buka `admin.html`, ubah lewat formulir, lalu klik **Simpan ke GitHub** agar situs langsung diperbarui. Alternatif manual: salin/unduh hasilnya ke `data/pengumuman.js`, lalu `commit`/`push`. Bisa juga menyunting berkas data itu langsung. Markup di `index.html` hanya cadangan bila berkas data gagal dimuat. |
| Jadwal & hitung mundur | `script.js` | Ubah array `MASSES` di bagian atas. `start` dan `end` dihitung dalam menit sejak pukul 00.00 WITA. `end` hanya dipakai untuk status "sedang berlangsung", bukan ditampilkan sebagai jam selesai. |
| Misa dan ibadat bulanan | `index.html` | Cari `<div class="monthly">`. Berisi Kamis pertama, Senin ketiga, dan setiap Jumat (Jumat pertama dan biasa), semuanya pukul 18.00 WITA. |
| Misa harian | `index.html` | Cari `<div class="daily-card">`. Berlaku Senin–Kamis pukul 06.00 WITA; misa pagi Jumat ditiadakan karena ada misa sore 18.00 WITA. |
| Tanggal di bagian atas | `index.html` | Teks "Hari Raya Kristus Raja · Minggu, 22 November 2026" pada elemen `.hero-feast`. |
| Pelindung paroki | `index.html` | Cari `<section class="patron" id="pelindung">`. Berisi ilustrasi dan profil singkat Santo Antonius Padua. |
| Renungan | `index.html` | Cari `<section class="reflection" id="renungan">`. |
| Alamat, telepon, email | `index.html` | Bagian footer. Alamat memakai Jl. Majapahit No. 10, Taman Sari, Kec. Ampenan, Kota Mataram, NTB 83112. Nomor telepon dan email masih contoh. |
| Gambar | `assets/` | `gereja-ampenan.svg` dipakai di hero dan galeri; `antonius.svg` dipakai di bagian pelindung; `yesus.svg`, `roh-kudus.svg`, dan `salib.svg` dipakai di galeri/renungan. Ganti berkas dengan nama sama, atau ubah `src` dan teks `alt` bila memakai foto. |

## Mengubah pengumuman tanpa menyunting HTML

1. Buka `admin.html` di situs yang sudah terbit (tautan **Kelola pengumuman** ada di footer) atau buka salinan lokalnya.
2. Formulir otomatis memuat pengumuman yang sedang tampil. Ubah pengumuman utama, tambah/hapus/atur urut pengumuman lain, lalu perbarui keterangan "Diperbarui".
3. Isi **Pemilik repository**, **Nama repository**, **Branch** (`main`), dan **Token GitHub** pada bagian *Simpan langsung ke GitHub*. Token bisa berupa *fine-grained token* dengan izin **Contents: read and write** untuk repository ini, atau *classic token* dengan cakupan `repo`.
4. Klik **Simpan ke GitHub**. Jika berhasil, tunggu beberapa menit sampai GitHub Pages selesai membangun situs, lalu muat ulang halaman utama.

Token dikirim hanya ke `api.github.com`. Ia tidak ditulis ke berkas situs dan tidak disimpan, kecuali Anda mencentang **Ingat pengaturan dan token di peramban ini**. Jangan mencentang pilihan itu di komputer bersama. Jika lebih nyaman, abaikan bagian GitHub dan gunakan tombol **Salin** atau **Unduh berkas**, lalu unggah isinya ke `data/pengumuman.js` dan lakukan `commit`/`push` seperti biasa.

Halaman `admin.html` memakai `noindex`, sehingga tidak muncul di hasil pencarian. Halaman ini hanya pembantu pembuatan data; tanpa token, siapa pun tetap bisa membukanya, tetapi tidak dapat mengubah situs tanpa hak akses ke repository.

## Struktur

```
pengumuman-paroki/
├─ index.html
├─ admin.html
├─ styles.css
├─ script.js
├─ README.md
├─ data/
│  └─ pengumuman.js
└─ assets/
   ├─ favicon.svg
   ├─ gereja-ampenan.svg
   ├─ antonius.svg
   ├─ gereja.svg
   ├─ yesus.svg
   ├─ roh-kudus.svg
   └─ salib.svg
```

## Catatan

- Misa Minggu pukul 07.30 dan 18.00 WITA. Durasi internal 75 menit hanya dipakai untuk menampilkan status "Misa sedang berlangsung" dan sisa waktunya; jam selesai tidak ditampilkan di halaman. Hitung mundur bekerja otomatis untuk setiap hari Minggu.
- Ilustrasi dibuat khusus sebagai gambar vektor, bukan foto. Nuansa kaca patri dipakai agar gereja, Santo Antonius, Kristus, Roh Kudus, dan salib terasa satu keluarga visual.
- Alamat, nomor telepon, email, serta sebagian isi pengumuman adalah contoh. Perbarui sebelum situs dipublikasikan.
