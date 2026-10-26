// Daftar digit yang dipakai (indeks 0-15 = nilai digit)
const DIGIT = "0123456789ABCDEF";

// Daftar basis tujuan (array of object)
const daftarBasis = [
    { nama: "Biner", basis: 2 },
    { nama: "Desimal", basis: 10 },
    { nama: "Heksadesimal", basis: 16 }
];

// Mengambil elemen HTML berdasarkan ID
const form = document.querySelector('#form-konversi');
const inputAngka = document.querySelector('#angka');
const pilihBasis = document.querySelector('#basis-asal');
const preview = document.querySelector('#preview');
const pesan = document.querySelector('#pesan');
const daftarHasil = document.querySelector('#hasil');
const daftarLangkah = document.querySelector('#langkah');
const tombolReset = document.querySelector('#btn-reset');

// Mengecek apakah setiap karakter valid untuk basis yang dipilih.
// Mengembalikan teks pesan kesalahan, atau "" jika valid.
function cekInput(teks, basis) {
    if (teks === "") {
        return "Masukkan angka terlebih dahulu.";
    }

    for (let i = 0; i < teks.length; i++) {
        const nilaiDigit = DIGIT.indexOf(teks[i]);

        if (nilaiDigit === -1 || nilaiDigit >= basis) {
            return "Karakter " + teks[i] + " tidak valid untuk basis " + basis + ".";
        }
    }
    return "";
}

// Mengubah teks berbasis tertentu menjadi bilangan desimal
function keDesimal(teks, basis) {
    let total = 0;

    for (let i = 0; i < teks.length; i++) {
        total = total * basis + DIGIT.indexOf(teks[i]);
    }
    return total;
}

// Mengubah bilangan desimal menjadi teks berbasis tertentu
// dengan pembagian berulang (perulangan while)
function dariDesimal(angka, basis) {
    if (angka === 0) {
        return "0";
    }

    let hasil = "";
    while (angka > 0) {
        const sisa = angka % basis;
        hasil = DIGIT[sisa] + hasil;
        angka = Math.floor(angka / basis);
    }
    return hasil;
}

// Mengelompokkan biner per 4 bit agar mudah dibaca
function kelompokBiner(biner) {
    let teks = biner;

    while (teks.length % 4 !== 0) {
        teks = "0" + teks;
    }

    const kelompok = [];
    for (let i = 0; i < teks.length; i += 4) {
        kelompok.push(teks.substring(i, i + 4));
    }
    return kelompok.join(" ");
}

// Membuat daftar langkah pembagian berulang (array of string)
function buatLangkah(angka, basis) {
    const langkah = [];

    if (angka === 0) {
        langkah.push("0 : " + basis + " = 0 sisa 0");
        return langkah;
    }

    while (angka > 0) {
        const sisa = angka % basis;
        const hasilBagi = Math.floor(angka / basis);
        langkah.push(angka + " : " + basis + " = " + hasilBagi + " sisa " + DIGIT[sisa]);
        angka = hasilBagi;
    }
    return langkah;
}

// Mengosongkan isi sebuah daftar (ul)
function kosongkan(daftar) {
    while (daftar.firstChild) {
        daftar.removeChild(daftar.firstChild);
    }
}

// Menambah satu baris (li) ke daftar
function tambahBaris(daftar, teks, kelas) {
    const li = document.createElement('li');
    li.textContent = teks;
    if (kelas) {
        li.classList.add(kelas);
    }
    daftar.appendChild(li);
}

// Menampilkan hasil konversi ke halaman
function tampilkanHasil(teksAsli, basisAsal, nilaiDesimal) {
    kosongkan(daftarHasil);

    daftarBasis.forEach(function (item) {
        let nilai = dariDesimal(nilaiDesimal, item.basis);

        if (item.basis === 2) {
            nilai = kelompokBiner(nilai);
        }

        const li = document.createElement('li');
        const label = document.createElement('span');
        const isi = document.createElement('span');

        label.textContent = item.nama + " (basis " + item.basis + ")";
        isi.textContent = nilai;

        li.appendChild(label);
        li.appendChild(isi);
        daftarHasil.appendChild(li);
    });

    // Klik pada hasil memindahkan highlight (seperti listgroup.js)
    const itemHasil = daftarHasil.querySelectorAll('li');
    itemHasil.forEach(function (item) {
        item.addEventListener('click', function () {
            itemHasil.forEach(function (i) {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Menampilkan langkah-langkah perhitungan ke halaman
function tampilkanLangkah(teksAsli, basisAsal, nilaiDesimal) {
    kosongkan(daftarLangkah);

    // Langkah 1: ubah input ke desimal (jika bukan desimal)
    if (basisAsal !== 10) {
        tambahBaris(daftarLangkah, "1. Ubah ke desimal", "judul-langkah");
        tambahBaris(daftarLangkah, teksAsli + " (basis " + basisAsal + ") = " + nilaiDesimal + " (basis 10)");
    } else {
        tambahBaris(daftarLangkah, "1. Input sudah berbentuk desimal: " + nilaiDesimal, "judul-langkah");
    }

    // Langkah 2: bagi berulang untuk biner dan heksadesimal
    const tujuan = [2, 16];
    tujuan.forEach(function (basis, index) {
        tambahBaris(daftarLangkah, (index + 2) + ". Bagi " + nilaiDesimal + " dengan " + basis + " (baca sisa dari bawah ke atas)", "judul-langkah");

        const langkah = buatLangkah(nilaiDesimal, basis);
        langkah.forEach(function (baris) {
            tambahBaris(daftarLangkah, baris);
        });
    });
}

// Menampilkan atau menghapus pesan kesalahan
function tampilkanPesan(teks) {
    pesan.textContent = teks;

    if (teks === "") {
        inputAngka.classList.remove('salah');
    } else {
        inputAngka.classList.add('salah');
    }
}

// Mengembalikan tampilan hasil ke kondisi awal
function resetTampilan() {
    kosongkan(daftarHasil);
    tambahBaris(daftarHasil, "Belum ada hasil. Isi angka lalu tekan Konversi.", "kosong");

    kosongkan(daftarLangkah);
    tambahBaris(daftarLangkah, "Langkah perhitungan akan muncul di sini.", "kosong");
}

// Event submit: tombol Konversi ditekan (atau Enter)
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah halaman reload

    const teks = inputAngka.value.trim().toUpperCase();
    const basisAsal = Number(pilihBasis.value);

    const kesalahan = cekInput(teks, basisAsal);
    if (kesalahan !== "") {
        tampilkanPesan(kesalahan);
        resetTampilan();
        return;
    }

    const nilaiDesimal = keDesimal(teks, basisAsal);

    // Batasi sampai 32-bit agar perhitungan tetap akurat
    if (nilaiDesimal > 4294967295) {
        tampilkanPesan("Angka terlalu besar. Maksimal 4294967295 (32-bit).");
        resetTampilan();
        return;
    }

    tampilkanPesan("");
    tampilkanHasil(teks, basisAsal, nilaiDesimal);
    tampilkanLangkah(teks, basisAsal, nilaiDesimal);
    console.log("Konversi berhasil:", teks, "basis", basisAsal, "=", nilaiDesimal);
});

// Event input: pratinjau dan validasi secara real-time
inputAngka.addEventListener('input', function (event) {
    const teks = event.target.value.trim().toUpperCase();
    preview.textContent = teks === "" ? "-" : teks;

    if (teks === "") {
        tampilkanPesan("");
    } else {
        tampilkanPesan(cekInput(teks, Number(pilihBasis.value)));
    }
});

// Event input pada <select>: cek ulang saat basis diganti
pilihBasis.addEventListener('input', function () {
    const teks = inputAngka.value.trim().toUpperCase();

    if (teks === "") {
        tampilkanPesan("");
    } else {
        tampilkanPesan(cekInput(teks, Number(pilihBasis.value)));
    }
});

// Event click: tombol Reset
tombolReset.addEventListener('click', function () {
    form.reset();
    preview.textContent = "-";
    tampilkanPesan("");
    resetTampilan();
});