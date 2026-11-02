import React from "react";

const FOTO = [
  {
    src: '/gambar/pengunjung-ikan-bakar.jpg',
    alt: 'Ikan bakar dengan sambal dan lalapan pesanan pengunjung',
    judul: 'Ikan Bakar Sambal',
    ket: 'Hidangan yang pernah dipesan',
  },
  {
    src: '/gambar/pengunjung-makan-bersama.jpg',
    alt: 'Pengunjung makan bersama di Warung Wong Deso',
    judul: 'Makan Bersama di Warung',
    ket: 'Orang-orang yang pernah berkunjung',
  },
  {
    src: '/gambar/pesanan-ayam-bakar.jpg',
    alt: 'Nasi ayam bakar dengan sate dan sambal pesanan pengunjung',
    judul: 'Nasi Ayam Bakar',
    ket: 'Hidangan yang pernah dipesan',
  },
  {
    src: '/gambar/pesanan-nasi-kotak.jpg',
    alt: 'Nasi kotak dalam jumlah banyak pesanan pengunjung',
    judul: 'Nasi Kotak Pesanan',
    ket: 'Hidangan yang pernah dipesan',
  },
  {
    src: '/gambar/nasi-kotak-siap-antar.jpg',
    alt: 'Deretan nasi kotak yang siap diantar untuk pesanan',
    judul: 'Nasi Kotak Siap Antar',
    ket: 'Hidangan yang pernah dipesan',
  },
  {
    src: '/gambar/suasana-warung.jpg',
    alt: 'Pengunjung sedang makan di meja warung',
    judul: 'Suasana Warung',
    ket: 'Orang-orang yang pernah berkunjung',
  },
];

const Galeri = () => {
  return (
    <main className="container">
      <section className="gallery section-wrap" aria-labelledby="gallery-title">
        <div className="section-heading">
          <h2 id="gallery-title">GALERI</h2>
          <p className="section-intro">
            Foto dari orang-orang yang pernah berkunjung dan hidangan yang pernah dipesan.
          </p>
        </div>

        <div className="gallery-layout">
          <div className="gallery-grid">
            {FOTO.map((f) => (
              <figure key={f.src}>
                <img src={f.src} alt={f.alt} loading="lazy" />
                <figcaption>
                  {f.judul}
                  <small>{f.ket}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Galeri;