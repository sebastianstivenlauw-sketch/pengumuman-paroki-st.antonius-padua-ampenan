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
| Pengumuman | `index.html` | Cari `<section ... id="pengumuman">`. Pengumuman utama ada di `<article class="feature">`; pengumuman lain ada di `<article class="notice">`. Duplikat satu artikel untuk menambah pengumuman, lalu buat `id` baru (`n7`, `n8`, ...) dan samakan dengan `aria-controls` pada tombolnya. |
| Jadwal & hitung mundur | `script.js` | Ubah array `MASSES` di bagian atas. `start` dan `end` dihitung dalam menit sejak pukul 00.00 WITA. `end` hanya dipakai untuk status "sedang berlangsung", bukan ditampilkan sebagai jam selesai. |
| Misa dan ibadat bulanan | `index.html` | Cari `<div class="monthly">`. Berisi Kamis pertama, Senin ketiga, dan setiap Jumat (Jumat pertama dan biasa), semuanya pukul 18.00 WITA. |
| Misa harian | `index.html` | Cari `<div class="daily-card">`. Berlaku Senin–Kamis pukul 06.00 WITA; misa pagi Jumat ditiadakan karena ada misa sore 18.00 WITA. |
| Tanggal di bagian atas | `index.html` | Teks "Hari Raya Kristus Raja · Minggu, 22 November 2026" pada elemen `.hero-feast`. |
| Pelindung paroki | `index.html` | Cari `<section class="patron" id="pelindung">`. Berisi ilustrasi dan profil singkat Santo Antonius Padua. |
| Renungan | `index.html` | Cari `<section class="reflection" id="renungan">`. |
| Alamat, telepon, email | `index.html` | Bagian footer. Data saat ini masih contoh. |
| Gambar | `assets/` | `gereja-ampenan.svg` dipakai di hero dan galeri; `antonius.svg` dipakai di bagian pelindung; `yesus.svg`, `roh-kudus.svg`, dan `salib.svg` dipakai di galeri/renungan. Ganti berkas dengan nama sama, atau ubah `src` dan teks `alt` bila memakai foto. |

## Struktur

```
pengumuman-paroki/
├─ index.html
├─ styles.css
├─ script.js
├─ README.md
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
