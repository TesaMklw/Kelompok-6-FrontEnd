import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const statistik = [
    { angka: "2012", label: "Tahun Berdiri" },
    { angka: "28+", label: "Menu" },
    { angka: "2.000+", label: "Pelanggan" },
];

const urlPeta =
    "https://www.google.com/maps?q=Warung+Wong+Deso,+Jl.+Raya+Lenteng+Agung+Timur+No.1,+Jagakarsa";

export default function Tentang() {
    useEffect(() => {
        document.title = "Warung Wong Deso - Tentang Kami";
    }, []);

    return (
        <Container className="py-4 text-center">
            <section className="bagian-halaman">
                <p className="eyebrow"><span></span> Profil warung</p>
                <h1 className="judul-halaman">Tentang Kami</h1>
                <p className="teks-pendukung mx-auto">
                    Kenalan lebih dekat dengan Warung Wong Deso — cerita kami, lokasi
                    warung, dan cara menghubungi kami.
                </p>
            </section>

            <section className="bagian-halaman" id="tentang">
                <p className="eyebrow"><span></span> Profil kami</p>
                <h2 className="judul-bagian">Profil Kami</h2>
                <p className="teks-pendukung mx-auto mb-4">
                    Warung Wong Deso adalah warung makan keluarga yang telah berdiri
                    sejak 2012 di Jagakarsa. Kami menyajikan masakan sederhana ala
                    rumahan yang dimasak dari bahan-bahan pilihan, dengan semangat
                    "Rasa ndeso, hati legowo" — sederhana rasanya, lapang hatinya.
                </p>
                <Row className="g-3">
                    {statistik.map((s) => (
                        <Col xs={12} md={4} key={s.label}>
                            <div className="kartu-stat p-4 text-center h-100">
                                <div className="angka-stat">{s.angka}</div>
                                <div className="label-stat">{s.label}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </section>

            <section className="bagian-halaman" id="lokasi">
                <p className="eyebrow"><span></span> Kunjungi kami</p>
                <h2 className="judul-bagian">Lokasi</h2>
                <div className="kotak-lokasi">
                    <iframe
                        src={`${urlPeta}&output=embed`}
                        loading="lazy"
                        title="Peta lokasi Warung Wong Deso"
                    />
                    <p className="teks-alamat mt-3 mb-0">
                        <strong>Alamat:</strong> Jl. Raya Lenteng Agung Timur No. 32,
                        Jagakarsa
                    </p>
                </div>
            </section>

            <section className="bagian-halaman" id="kontak">
                <p className="eyebrow"><span></span> Hubungi kami</p>
                <h2 className="judul-bagian">Kontak</h2>
                <p className="teks-pendukung mx-auto mb-4">
                    Pesan tempat, tanya menu, atau pesan nasi kotak — hubungi kami lewat
                    email atau telepon/WhatsApp di bawah ini.
                </p>
                <Row className="g-3">
                    <Col xs={12} md={4}>
                        <div className="kartu-kontak p-4 text-center h-100">
                            <div className="label-kontak">Email</div>
                            <a className="nilai-kontak" href="mailto:manganlur@gmail.com">
                                manganlur@gmail.com
                            </a>
                            <Button as="a" variant="primary" href="mailto:manganlur@gmail.com">
                                Kirim Email
                            </Button>
                        </div>
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="kartu-kontak p-4 text-center h-100">
                            <div className="label-kontak">Telepon / WhatsApp</div>
                            <a className="nilai-kontak" href="tel:+6282122517112">
                                +6282122517112
                            </a>
                            <Button as="a" variant="primary" href="tel:+6282122517112">
                                Hubungi Kami
                            </Button>
                        </div>
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="kartu-kontak p-4 text-center h-100">
                            <div className="label-kontak">Alamat</div>
                            <p className="nilai-kontak">
                                Jl. Raya Lenteng Agung Timur No. 32, Jagakarsa
                            </p>
                            <Button
                                as="a"
                                variant="primary"
                                href={urlPeta}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Lihat Peta
                            </Button>
                        </div>
                    </Col>
                </Row>
            </section>
        </Container>
    );
}