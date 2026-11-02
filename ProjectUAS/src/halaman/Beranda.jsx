import React from "react";
import Link from "next/link";

const Beranda = () => {
  return (
    <main className="container">
      <section className="hero section-wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true"></span> Warung makan keluarga • sejak 2012
          </p>
          <h1 id="hero-title">
            Rasa ndeso,<em> hati legowo.</em>
          </h1>
          <p className="hero-text">
            Masakan sederhana, dimasak dari bahan-bahan pilihan.
          </p>
          <div className="hero-actions">
            {/* Ganti 'to' menjadi 'href' */}
            <Link className="button" href="/menu">
              Lihat menu <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <div className="hero-note">
            <strong>★ 4.9 </strong>
            <span>•</span> 2.000+ pelanggan pulang kenyang
          </div>
        </div>

        <div className="hero-visual">
          {/* Menyimpan gambar di folder public/gambar/foto-warung-makan-wonddeso.png */}
          <img
            src="/gambar/foto-warung-makan-wonddeso.png"
            alt="Warung makan Wong Deso"
          />
          <div className="image-stamp">
            <span>Foto warung makan Wong Deso</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Beranda; 